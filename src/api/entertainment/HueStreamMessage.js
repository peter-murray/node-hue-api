'use strict';

const ApiError = require('../../ApiError')
;

const HEADER_BYTE_LENGTH = 16
  , LIGHT_SLOT_DATA_BYTE_LENGTH = 9
;

const PROTOCOL = Buffer.from('HueStream', 'ascii');

module.exports = class HueStreamMessage {

  constructor() {
  }

  rgbMessage(lightToRGB) {
    const data = [getRGBHeader()];

    let lightCount = 0;

    Object.keys(lightToRGB).forEach(id => {
      data.push(mapLightsToRGB(id, lightToRGB[id]));
      lightCount++;
    });


    const length = HEADER_BYTE_LENGTH + (LIGHT_SLOT_DATA_BYTE_LENGTH * lightCount)
      , result = Buffer.concat(data, length)
    ;

    console.log(result);

    return result;
  }

  //TODO
  // xyMessage(lightToXY) {
  //
  // }
};

function convert(num) {
  const arr = new ArrayBuffer(9)
    , view = new DataView(arr);

  view.setUint16(0, num, false);
  return arr;
}


function mapLightsToRGB(id, rgb) {
  const arr = new ArrayBuffer(9)
    , view = new DataView(arr)
  ;

  let offset = 0;

  // 0 byte is 0x00 = Light
  view.setUint8(offset, 0);
  offset += 1;

  // 2 byte is the light id
  view.setUint16(offset, id);
  offset += 2;

  // 3x 2 byte representation of rgb
  view.setUint16(offset, convertRGBValue(rgb[0]));
  offset += 2;

  view.setUint16(offset, convertRGBValue(rgb[1]));
  offset += 2;

  view.setUint16(offset, convertRGBValue(rgb[2]));

  return Buffer.from(arr);
}


function convertRGBValue(val) {
  if (val < 0 || val > 255) {
    throw new ApiError(`Invalid RGB value: ${val}`);
  }

  if (val === 0) {
    return 0;
  } else {
    return parseInt((val / 255) * 65535);
  }
}

function convertXYValue(val) {
  if (val < 0 || val > 1) {
    throw new ApiError(`Invalid XY value: ${val}`);
  }

  if (val === 0) {
    return 0;
  } else if (val === 1) {
    return 65535;
  } else {
    return parseInt(65535 * val);
  }
}

function convertBrightness(val) {
  if (val < 1 || val > 254) {
    throw new ApiError(`Invalid Brightness value: ${val}`);
  }

  return parseInt((val / 254) * 65535);
}

function getRGBHeader() {
  return getHeader(0x00);
}

function getXYHeader() {
  return getHeader(0x01);
}

function getHeader(colorSpaceByte) {
  const headerPayload = Buffer.from([
    // Version
    0x01,
    0x00,
    // Sequence ID (ignored)
    0x07,
    // Reserved
    0x00,
    0x00,
    // Color Space
    colorSpaceByte,
    // Reserved
    0x00,
  ]);

  return Buffer.concat([PROTOCOL, headerPayload], HEADER_BYTE_LENGTH);
}


function getColorSpaceByte(colorSpace) {
  if (colorSpace === 'RGB' || colorSpace === 'rgb') {
    return 0x00;
  } else if (colorSpace === 'xy' || 'XY') {
    return 0x01;
  } else {
    throw new ApiError(`Invalid colorSpace type provided: ${colorSpace}`);
  }
}