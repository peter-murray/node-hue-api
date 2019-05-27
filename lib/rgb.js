'use strict';

const ApiError = require('./ApiError');

module.exports.rgbToXY = (rgb, colorGamut) => {
  if (!colorGamut) {
    throw new ApiError('No color gamut provided, cannot perform conversion of RGB');
  }
  return _getXYStateFromRGB(rgb[0], rgb[1], rgb[2], colorGamut);
};

//TODO could re-expose the conversion back to RGB from the XY co-ordinates, but that should not be necessary anymore and it was
// a gross approximation, code is still present below.

class XY {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  crossProduct(xy) {
    return (this.x * xy.y) - (this.y * xy.x);
  }
}

function _isInColorGamut(p, gamut) {
  const v1 = new XY((gamut.green.x - gamut.red.x), (gamut.green.y - gamut.red.y))
    , v2 = new XY((gamut.blue.x - gamut.red.x) , (gamut.blue.y - gamut.red.y))
    , q = new XY(p.x - gamut.red.x, p.y - gamut.red.y)
  ;

  const s = q.crossProduct(v2) / v1.crossProduct(v2)
    , t = v1.crossProduct(q) / v1.crossProduct(v2)
  ;

  return (s >= 0.0) && (t >= 0.0) && (s + t <= 1.0);
}

/**
 * Find the closest point on a line. This point will be reproducible by the limits.
 *
 * @param start {XY} The point where the line starts.
 * @param stop {XY} The point where the line ends.
 * @param point {XY} The point which is close to the line.
 * @return {XY} A point that is on the line specified, and closest to the XY provided.
 */
function _getClosestPoint(start, stop, point) {
  const AP = new XY(point.x - start.x, point.y - start.y)
    , AB = new XY(stop.x - start.x, stop.y - start.y)
    , ab2 = AB.x * AB.x + AB.y * AB.y
    , ap_ab = AP.x * AB.x + AP.y * AB.y
  ;

  let t = ap_ab / ab2;
  if (t < 0.0) {
    t = 0.0;
  } else if (t > 1.0) {
    t = 1.0;
  }

  return new XY((start.x + AB.x * t), (start.y + AB.y * t));
}

function _getDistanceBetweenPoints(pOne, pTwo) {
  const dx = pOne.x - pTwo.x
    , dy = pOne.y - pTwo.y
  ;
  return Math.sqrt(dx * dx + dy * dy);
}

function _getXYStateFromRGB(red, green, blue, gamut) {
  const r = _gammaCorrection(red)
    , g = _gammaCorrection(green)
    , b = _gammaCorrection(blue)
    , X = r * 0.4360747 + g * 0.3850649 + b * 0.0930804
    , Y = r * 0.2225045 + g * 0.7168786 + b * 0.0406169
    , Z = r * 0.0139322 + g * 0.0971045 + b * 0.7141733
  ;

  let cx = X / (X + Y + Z)
    , cy = Y / (X + Y + Z)
  ;
  cx = isNaN(cx) ? 0.0 : cx;
  cy = isNaN(cy) ? 0.0 : cy;

  let xyPoint = new XY(cx, cy);

  if (!_isInColorGamut(xyPoint, gamut)) {
    xyPoint = _resolveXYPointForLamp(xyPoint, gamut);
  }

  return [xyPoint.x, xyPoint.y];
}

/**
 * This function is a rough approximation of the reversal of RGB to xy transform. It is a gross approximation and does
 * get close, but is not exact.
 * @param x
 * @param y
 * @param brightness
 * @returns {Array} RGB values
 * @private
 *
 * This function is a modification of the one found at https://github.com/bjohnso5/hue-hacking/blob/master/src/colors.js#L251
 */
function _getRGBFromXYState(x, y, brightness) {
  const Y = brightness
    , X = (Y / y) * x
    , Z = (Y / y) * (1 - x - y)
  ;

  let rgb = [
    X * 1.612 - Y * 0.203 - Z * 0.302,
    -X * 0.509 + Y * 1.412 + Z * 0.066,
    X * 0.026 - Y * 0.072 + Z * 0.962
  ];

  // Apply reverse gamma correction.
  rgb = rgb.map(function (x) {
    return (x <= 0.0031308) ? (12.92 * x) : ((1.0 + 0.055) * Math.pow(x, (1.0 / 2.4)) - 0.055);
  });

  // Bring all negative components to zero.
  rgb = rgb.map(function (x) {
    return Math.max(0, x);
  });

  // If one component is greater than 1, weight components by that value.
  const max = Math.max(rgb[0], rgb[1], rgb[2]);
  if (max > 1) {
    rgb = rgb.map(function (x) {
      return x / max;
    });
  }

  rgb = rgb.map(function (x) {
    return Math.floor(x * 255);
  });

  return rgb;
}

/**
 * When a color is outside the limits, find the closest point on each line in the CIE 1931 'triangle'.
 * @param point {XY} The point that is outside the limits
 * @param gamut The limits of the bulb (red, green and blue XY points).
 * @returns {XY}
 */
function _resolveXYPointForLamp(point, gamut) {

  const pAB = _getClosestPoint(gamut.red, gamut.green, point)
    , pAC = _getClosestPoint(gamut.blue, gamut.red, point)
    , pBC = _getClosestPoint(gamut.green, gamut.blue, point)
    , dAB = _getDistanceBetweenPoints(point, pAB)
    , dAC = _getDistanceBetweenPoints(point, pAC)
    , dBC = _getDistanceBetweenPoints(point, pBC)
    ;

  let lowest = dAB
    , closestPoint = pAB
  ;

  if (dAC < lowest) {
    lowest = dAC;
    closestPoint = pAC;
  }

  if (dBC < lowest) {
    closestPoint = pBC;
  }

  return closestPoint;
}

function _gammaCorrection(value) {
  if (value > 0.04045) {
    return Math.pow((value + 0.055) / (1.0 + 0.055), 2.4);
  } else {
    return value / 12.92;
  }
}