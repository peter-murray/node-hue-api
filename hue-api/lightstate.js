"use strict";

var utils = require("./utils"),
    State = function () {
    };

/**
 * Creates a new state object to pass to a Philips Hue Light
 * @return {State}
 */
module.exports.create = function () {
    return new State();
};

/**
 * Builds the White state for a lamp
 * @param colorTemp The temperature, a value of 154-500
 * @param brightPercentage The percentage of brightness 0-100
 * @return {State}
 */
State.prototype.white = function (colorTemp, brightPercentage) {
    utils.combine(this, _getWhiteState(colorTemp, brightPercentage));
    return this;
};

/**
 * Adds the alert state
 * @param isLong if a Long alert sequence is desired
 * @return {State}
 */
State.prototype.alert = function (isLong) {
    utils.combine(this, _getAlertState(isLong));
    return this;
};

/**
 * Adds the on state
 * @return {State}
 */
State.prototype.on = function () {
    utils.combine(this, _getOnState());
    return this;
};

/**
 * Adds the off state
 * @return {State}
 */
State.prototype.off = function () {
    utils.combine(this, _getOffState());
    return this;
};

/**
 * Adds the brightness state
 * @param value The percentage of brightness 0-100
 * @return {State}
 */
State.prototype.brightness = function (value) {
    utils.combine(this, _getBrightState(value));
    return this;
};

/**
 * Adds the HSL values
 * @param hue The hue value in degrees 0-360
 * @param saturation The saturation percentage 0-100
 * @param luminosity The luminosity percentage 0-100
 * @return {State}
 */
State.prototype.hsl = function (hue, saturation, luminosity) {
    utils.combine(this, _getHSLState(hue, saturation, luminosity));
    return this;
};

/**
 * Adds the xy values
 * @param x The x value ranged from 0 to 1
 * @param y The y value ranged from 0 to 1
 * @return {State}
 */
State.prototype.xy = function (x, y) {
    utils.combine(this, _getXYState(x, y));
    return this;
};

/**
 * Adds a transition to the state
 * @param seconds The number of seconds for the transition to run
 * @return {State}
 */
State.prototype.transition = function (seconds) {
    utils.combine(this, _getTransitionState(seconds));
    return this;
};

/**
 * Adds the colors to the state
 * @param r The amount of Red 0-255
 * @param g The amount of Green 0-255
 * @param b The amount of Blue 0-255
 * @return {State}
 */
State.prototype.rgb = function (r, g, b) {
    utils.combine(this, _getHSLStateFromRGB(r, g, b));
    return this;
};

/**
 * Adds the effect to the state
 * @param value The effect value (either 'colorloop' or 'none'
 * @return {State}
 */
State.prototype.effect = function (value) {
    utils.combine(this, _getEffectState(value));
    return this;
};

function _getXYState(x, y) {
    return {
        "xy": _getXYValue(x, y)
    };
}

function _getWhiteState(colorTemp, brightness) {
    return utils.combine(
        {"ct": _getColorTemperature(colorTemp)},
        _getBrightState(brightness)
    );
}

function _getAlertState(isLong) {
    return {
        "alert": isLong ? "lselect" : "select"
    };
}

function _getTransitionState(seconds) {
    var value = (seconds || 0) * 10;
    return {
        "transitiontime": value
    };
}

function _getBrightState(value) {
    var luminosity = _convertBrightPercentToHueValue(value);
    return {
        "bri": _getBrightnessValue(luminosity)
    };
}

function _getOnState() {
    return {
        "on": true
    };
}

function _getOffState() {
    return {
        "on": false
    };
}

function _getEffectState(value) {
    return {
        "effect": value
    };
}

/**
 * Gets the HSL/HSB value from the RGB values provided
 * @param red
 * @param green
 * @param blue
 * @return {*} The HSL settings that correspond to the RGB values provided.
 */
function _getHSLStateFromRGB(red, green, blue) {
    var h = 0
        , s = 0
        , l = 0
        , r = parseFloat(red) / 255
        , g = parseFloat(green) / 255
        , b = parseFloat(blue) / 255;

    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var add = min + max;

    if (min === max) {
        h = 0;
    }
    else if (r === max) {
        h = ((60 * (g - b) / delta) + 360) % 360;
    }
    else if (g === max) {
        h = (60 * (b - r) / delta) + 120;
    }
    else {
        h = (60 * (r - g) / delta) + 240;
    }

    l = 0.5 * add;
    if (l === 0) {
        s = 0;
    }
    else if (l === 1) {
        s = 1;
    }
    else if (l <= 0.5) {
        s = delta / add;
    }
    else {
        s = delta / (2 - add);
    }

    h = Math.round(h);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
//    l = 50;

    return _getHSLState(h, s, l);
}

function _convertBrightPercentToHueValue(percentage) {
    // percentage converted to 0-255 range
    return Math.floor(_getBoundedValue(percentage, 0, 100) * (255 / 100));
}

function _getHSLState(hue, saturation, luminosity) {
    hue = Math.floor(_getBoundedValue(hue, 0, 359) * 182.5487); // degrees upscaled to 0-65535 range
    saturation = Math.floor(_getBoundedValue(saturation, 0, 100) * (255 / 100)); // percentage converted to 0-255 range

    return utils.combine(
        {
            "hue": _getHueValue(hue),
            "sat": _getSaturationValue(saturation)
        },
        _getBrightState(luminosity)
    );
}

/**
 * Obtains the XY color values that the Hue Lights can understand
 * @param x The X value
 * @param y The Y value
 * @return {Array} The converted xy values.
 */
function _getXYValue(x, y) {
    return [
        _getBoundedValue(x, 0, 1),
        _getBoundedValue(y, 0, 1)
    ];
}

function _getSaturationValue(value) {
    // Saturation is provided in the range of 0 to 254
    return _getBoundedValue(value, 0, 254);
}

function _getHueValue(value) {
    // Hue is provided in the tange of 0 to 65535
    return _getBoundedValue(value, 0, 65535);
}

/**
 * Color Temperature values are limited to the range of 154 - 500, cold to warm.
 * @param value The value to set as a {String} or {Integer}
 * @return {Number} The color temperature to use.
 */
function _getColorTemperature(value) {
    return Math.floor(_getBoundedValue(value, 154, 500));
}

/**
 * Brightness values are limited to the range of 1 - 255.
 * @param value The value to set as a {String} or {Integer}
 * @return {Number} The brightness value to use.
 */
function _getBrightnessValue(value) {
    return Math.floor(_getBoundedValue(value, 1, 255));
}

/**
 * Obtains a value that falls within the specified range
 * @param value The value to check
 * @param min The minimum allowed value
 * @param max The maximum allowed value
 * @return {*} The value that sits within the specified range
 */
function _getBoundedValue(value, min, max) {
    if (isNaN(value)) {
        value = min;
    }

    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else {
        return value;
    }
}
