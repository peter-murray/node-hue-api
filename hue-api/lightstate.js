"use strict";

var util = require("util")
    , utils = require("./utils")
    , rgb = require("./rgb")
    , lightStateTrait = require("./commands/traits/tLightStateBody")
    ;

var stateDefinitions = lightStateTrait(true).bodyArguments.value
    , State = function () {
        this.reset();
    };

/**
 * Creates a new state object to pass to a Philips Hue Light.
 *
 * @param values An optional object that contains state properties and values that are to be loaded into the created
 * state object. Any properties that are not 'valid' properties of the Light State are not loaded.
 *
 * @return {State}
 */
module.exports.create = function (values) {
    var state = new State();

    // If values are provided then load the ones that have values to match our functions
    if (values) {
        Object.keys(values).forEach(function (value) {
            var fn;

            if (values.hasOwnProperty(value)) {
                fn = state[value];

                if (utils.isFunction(fn)) {
                    fn.apply(state, [values[value]]);
                }
            }
        });
    }

    return state;
};

module.exports.isLightState = function (obj) {
    return obj && obj instanceof State;
};

State.prototype.payload = function () {
    return JSON.parse(JSON.stringify(this._values));
};

/**
 * Resets/Clears the properties that have been set in the light state object.
 * @returns {State}
 */
State.prototype.reset = function () {
    this._values = {};
    return this;
};
State.prototype.clear = State.prototype.reset;

/**
 * Creates a copy of the state object
 * @returns {State}
 */
State.prototype.copy = function () {
    var copy = new State();
    copy._addValues(this._values);
    return copy;
};

/**
 * Sets the strict state for setting parameters for the light state.
 * @param strict
 * @returns {State}
 */
State.prototype.strict = function (strict) {
    this._strict = Boolean(strict);
    return this;
};

State.prototype.isStrict = function () {
    return this._strict;
};

/**
 * Sets the on state
 * @param on The state (true for on, false for off). If this parameter is not specified, it is assumed to be true.
 * @returns {State}
 */
State.prototype.on = function (on) {
    this._addValues(_getOnState(on));
    return this;
};

/**
 * Adds the bri state
 * @param value The hue bri value, 0 to 254.
 * @return {State}
 */
State.prototype.bri = function (value) {
    this._addValues(_getBriState(value));
    return this;
};

/**
 * Adds the hue for the color desired.
 * @param hue The hue value is a wrapping value between 0 and 65535. Both 0 and 65535 are red, 25500 is green and 46920 is blue.
 * @returns {State}
 */
State.prototype.hue = function (hue) {
    this._addValues(_getHueState(hue));
    return this;
};

/**
 * The saturation of the color for the bulb, 0 being the least saturated i.e. white.
 * @param saturation The saturation value 0 to 255
 * @returns {State}
 */
State.prototype.sat = function (saturation) {
    this._addValues(_getSatState(saturation));
    return this;
};

/**
 * Adds the xy values
 * @param x The x value ranged from 0 to 1, or an Array of [x, y] values
 * @param y The y value ranged from 0 to 1
 * @return {State}
 */
State.prototype.xy = function (x, y) {
    // Cater for the first argument being an array
    if (Array.isArray(arguments[0])) {
        x = arguments[0][0];
        y = arguments[0][1];
    }

    this._addValues(_getXYState(x, y));
    return this;
};

/**
 * Adds the Mired Color Temperature
 * @param colorTemp The Color Temperature between 153 to 500 inclusive.
 * @returns {State}
 */
State.prototype.ct = function (colorTemp) {
    this._addValues(_getCtState(colorTemp));
    return this;
};

/**
 * Adds the alert state
 * @param value A String value representing the alert state, "none", "select", "lselect".
 * @return {State}
 */
State.prototype.alert = function (value) {
    this._addValues(_getAlertState(value));
    return this;
};

/**
 * Adds an effect for the bulb.
 * @param value The type of effect, currently supports "none" and "colorloop".
 * @returns {State}
 */
State.prototype.effect = function (value) {
    this._addValues(_getEffectState(value));
    return this;
};

/**
 * Adds a transition to the desired state.
 * @param value This is given as a multiple of 100ms and defaults to 4 (400ms).
 * @return {State}
 */
State.prototype.transitiontime = function (value) {
    this._addValues(_getTransitionState(value));
    return this;
};

/**
 * Increments/Decrements the brightness value for the lights.
 * @param value An amount to change the current brightness by, -254 to 254.
 * @returns {State}
 */
State.prototype.bri_inc = function (value) {
    this._addValues(_getBrightnessIncrementState(value));
    return this;
};

/**
 * Increments/Decrements the saturation value for the lights.
 * @param value An amount to change the current saturation by, -254 to 254.
 * @returns {State}
 */
State.prototype.sat_inc = function (value) {
    this._addValues(_getSaturationIncrementState(value));
    return this;
};

/**
 * Increments/Decrements the Hue value for the lights.
 * @param value An amount to change the current hue by, -65534 to 65534.
 * @returns {State}
 */
State.prototype.hue_inc = function (value) {
    this._addValues(_getHueIncrementState(value));
    return this;
};

/**
 * Increments/Decrements the color temperature value for the lights.
 * @param value An amount to change the current color temperature by, -65534 to 65534.
 * @returns {State}
 */
State.prototype.ct_inc = function (value) {
    this._addValues(_getCtIncrementState(value));
    return this;
};

/**
 * Increments/Decrements the XY value for the lights.
 * @param value An amount to change the current XY by, -0.5 to 0.5.
 * @returns {State}
 */
State.prototype.xy_inc = function (value) {
    this._addValues(_getXYIncrementState(value));
    return this;
};

State.prototype.scene = function (value) {
    this._addValues(_getSceneId(value));
    return this;
};


///////////////////////////////////////////////////////////////////////
// Convenience functions

State.prototype.turnOn = State.prototype.on;

State.prototype.off = function () {
    this._addValues(_getOnState(false));
    return this;
};
State.prototype.turnOff = State.prototype.off;

/**
 * Set the brightness as a percent value
 * @param percentage The brightness percentage value between 0 and 100.
 * @returns {State}
 */
State.prototype.brightness = function (percentage) {
    return this.bri(_convertBrightPercentToHueValue(percentage));
};

State.prototype.incrementBrightness = State.prototype.bri_inc;

State.prototype.colorTemperature = State.prototype.ct;
State.prototype.colourTemperature = State.prototype.ct;
State.prototype.colorTemp = State.prototype.ct;
State.prototype.colourTemp = State.prototype.ct;

State.prototype.incrementColorTemp = State.prototype.ct_inc;
State.prototype.incrementColorTemperature = State.prototype.ct_inc;
State.prototype.incrementColourTemp = State.prototype.ct_inc;
State.prototype.incrementColourTemperature = State.prototype.ct_inc;

State.prototype.incrementHue = State.prototype.hue_inc;

State.prototype.incrementXY = State.prototype.xy_inc;

State.prototype.saturation = function (percentage) {
    return this.sat(_convertSaturationPercentToHueValue(percentage));
};

State.prototype.incrementSaturation = State.prototype.sat_inc;

State.prototype.shortAlert = function () {
    return this.alert("select");
};
State.prototype.alertShort = State.prototype.shortAlert;

State.prototype.longAlert = function () {
    return this.alert("lselect");
};
State.prototype.alertLong = State.prototype.longAlert;

State.prototype.transitionTime = State.prototype.transitiontime;
/**
 * Sets the transition time in milliseconds.
 * @param milliseconds The number of milliseconds for the transition
 * @returns {State}
 */
State.prototype.transition = function (milliseconds) {
    return this.transitionTime(_convertMilliSecondsToTransitionTime(milliseconds));
};
State.prototype.transitiontime_milliseconds = State.prototype.transition;
State.prototype.transitionTime_milliseconds = State.prototype.transition;

State.prototype.transitionSlow = function () {
    return this.transitionTime(8);
};

State.prototype.transitionFast = function () {
    return this.transitionTime(2);
};

State.prototype.transitionInstant = function () {
    return this.transitionTime(0);
};

State.prototype.transitionDefault = function () {
    return this.transitionTime(4);//TODO should load this from the definition
};

/**
 * Builds the White state for a lamp
 * @param colorTemp The temperature, a value of 153-500
 * @param brightPercentage The percentage of brightness 0-100
 * @return {State}
 */
State.prototype.white = function (colorTemp, brightPercentage) {
    this._addValues(_getWhiteState(colorTemp, brightPercentage));
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
    var temp = saturation * (luminosity < 50 ? luminosity : 100 - luminosity) / 100
        , satValue = Math.round(200 * temp / (luminosity + temp)) | 0
        , luminosityValue = Math.round(temp + luminosity)
        ;

    return this
        .brightness(luminosityValue)
        .hue(_convertHueToHueValue(hue))
        .sat(_convertSaturationPercentToHueValue(satValue))
        ;
};

/**
 * Adds the HSB values
 * @param hue The hue value in degrees 0-360
 * @param saturation The saturation percentage 0-100
 * @param brightness The brightness percentage 0-100
 * @return {State}
 */
State.prototype.hsb = function (hue, saturation, brightness) {
    return this
        .brightness(brightness)
        .hue(_convertHueToHueValue(hue))
        .sat(_convertSaturationPercentToHueValue(saturation))
        ;
};

/**
 * Adds the rgb color to the state. This requires knowledge of the light type to be able to convert it into
 * an actual color that the map can display.
 *
 * @param r The amount of Red 0-255, or an {Array} or r, g, b values.
 * @param g The amount of Green 0-255
 * @param b The amount of Blue 0-255
 * @return {State}
 */
State.prototype.rgb = function (r, g, b) {
    // The conversion to rgb is now done in the xy space, but to do so requires knowledge of the limits of the light's
    // color gamut.
    // To cater for this, we store the rgb value requested, and convert it to xy when the user applies it.

    // We may have an array passed in, cater for that
    if (Array.isArray(arguments[0])) {
        r = arguments[0][0];
        g = arguments[0][1];
        b = arguments[0][2];
    }

    this._addValues({
        rgb: [
            _getBoundedValue(r, 0, 255),
            _getBoundedValue(g, 0, 255),
            _getBoundedValue(b, 0, 255)
        ]
    });
    return this;
};

State.prototype.hasRGB = function () {
    return !!this._values.rgb;
};

State.prototype.colorLoop = function () {
    return this.effect("colorloop");
};
State.prototype.colourLoop = State.prototype.colorLoop;
State.prototype.effectColorLoop = State.prototype.colorLoop;
State.prototype.effectColourLoop = State.prototype.colorLoop;

/**
 * Creates a copy of the State if there is an RGB value set.
 *
 * @param modelid The model ID of the light(s) to convert the rgb value for.
 *
 * @returns {State} If there is an RGB value set, then a copy of the state, with the rgb value applied based on the
 * lamp model provided. If there is no RGB value set, then {null} will be returned.
 */
State.prototype.applyRGB = function (modelid) {
    var result = null;

    if (this.hasRGB()) {
        result = this.copy();
        result.xy(rgb.convertRGBtoXY(this._values.rgb, modelid));
    }

    return result;
};

///////////////////////////////////////////////////////////////////////

State.prototype._addValues = function () {
    var state = this._values;

    Array.prototype.slice.apply(arguments).forEach(function (stateValue) {
        utils.combine(state, stateValue);
    });
};

State.prototype._removeValues = function () {
    var state = this._values;

    Array.prototype.slice.apply(arguments).forEach(function (key) {
        delete state[key];
    });
};


/////////////////////////////////
// State objects

function _getOnState(value) {
    if (value == null || value === undefined) {
        value = true;
    }

    return {
        on: _getOnValue(value)
    };
}

function _getBriState(value) {
    return {
        bri: _getBrightnessValue(value)
    };
}

function _getHueState(value) {
    return {
        hue: _getHueValue(value)
    };
}

function _getSatState(value) {
    return {
        sat: _getSaturationValue(value)
    };
}

function _getXYState(x, y) {
    return {
        xy: _getXYValue(x, y)
    };
}

function _getCtState(value) {
    return {
        ct: _getCtValue(value)
    };
}

function _getAlertState(value) {
    return {
        alert: _getAlertValue(value)
    };
}

function _getEffectState(value) {
    return {
        effect: _getEffectValue(value)
    };
}

function _getTransitionState(value) {
    return {
        transitiontime: _getTransitionTimeValue(value)
    };
}

function _getBrightnessIncrementState(value) {
    return {
        bri_inc: _getBrightnessIncrementValue(value)
    }
}

function _getSaturationIncrementState(value) {
    return {
        sat_inc: _getSaturationIncrementValue(value)
    }
}

function _getHueIncrementState(value) {
    return {
        hue_inc: _getHueIncrementValue(value)
    }
}

function _getCtIncrementState(value) {
    return {
        ct_inc: _getCtIncrementValue(value)
    }
}

function _getXYIncrementState(value) {
    return {
        xy_inc: _getXYIncrementValue(value)
    }
}

function _getSceneId(value) {
    var result = {};

    if (value) {
        result.scene = value;
    }
    return result;
}

function _getWhiteState(colorTemp, brightness) {
    return utils.combine(
        _getCtState(colorTemp),
        _getBriState(_convertBrightPercentToHueValue(brightness))
    );
}

/////////////////////////////////
// Value Functions

function _convertHueToHueValue(hue) {
    return _getBoundedValue(hue, 0, 360) * 182.5487
}

function _convertMilliSecondsToTransitionTime(value) {
    var result = 0;

    // The transition time is in multiples of 100ms, e.g. 100ms = 1
    if (value > 0) {
        result = Math.round(value / 100);
    }

    return result;
}

function _getTransitionTimeValue(value) {
    var transition = stateDefinitions.transitiontime;
    return valueForType(transition, _getRangeValue(transition, value));
}

function _getBrightnessIncrementValue(value) {
    var bri_inc = stateDefinitions.bri_inc;
    return valueForType(bri_inc, _getRangeValue(bri_inc, value));
}

function _getSaturationIncrementValue(value) {
    var sat_inc = stateDefinitions.sat_inc;
    return valueForType(sat_inc, _getRangeValue(sat_inc, value));
}

function _getHueIncrementValue(value) {
    var hue_inc = stateDefinitions.hue_inc;
    return valueForType(hue_inc, _getRangeValue(hue_inc, value));
}

function _getCtIncrementValue(value) {
    var ct_inc = stateDefinitions.ct_inc;
    return valueForType(ct_inc, _getRangeValue(ct_inc, value));
}

function _getXYIncrementValue(value) {
    var xy_inc = stateDefinitions.xy_inc;
    return valueForType(xy_inc, _getRangeValue(xy_inc, value));
}

function convertPercentToValue(definition, percent) {
    var range = definition.range
        , min = range.min
        , max = range.max
        , normalizedValue = _getBoundedValue(percent, 0, 100)
        ;

    if (normalizedValue === 0) {
        return min;
    } else if (normalizedValue === 100) {
        return max;
    } else {
        return normalizedValue * (max / 100);
    }
}

function _convertSaturationPercentToHueValue(value) {
    return _getSaturationValue(convertPercentToValue(stateDefinitions.sat, value));
}

function _convertBrightPercentToHueValue(value) {
    return _getBrightnessValue(convertPercentToValue(stateDefinitions.bri, value));
}

/**
 * Obtains the XY color values that the Hue Lights can understand
 * @param x The X value
 * @param y The Y value
 * @return {Array} The converted xy values.
 */
function _getXYValue(x, y) {
    var xy = stateDefinitions.xy
        , validateValueFn = function (value) {
            var valueType = xy.valueType
                , normalized = _getRangeValue(valueType, value)
                ;
            return valueForType(valueType, normalized);
        }
        ;

    return valueForType(xy, [validateValueFn(x), validateValueFn(y)]);
}

function _getSaturationValue(value) {
    var sat = stateDefinitions.sat;
    return valueForType(sat, _getRangeValue(sat, value));
}

function _getHueValue(value) {
    var hue = stateDefinitions.hue;
    return valueForType(hue, _getRangeValue(hue, value));
}

/**
 * Color Temperature values are limited to the range of 153 - 500, cold to warm.
 * @param value The value to set as a {String} or {Integer}
 * @return {Number} The color temperature to use.
 */
function _getCtValue(value) {
    var ct = stateDefinitions.ct;
    return valueForType(ct, _getRangeValue(ct, value));
}

/**
 * Brightness values are limited to the range of 0 - 254.
 * @param value The value to set as a {String} or {Integer}
 * @return {Number} The brightness value to use.
 */
function _getBrightnessValue(value) {
    var bri = stateDefinitions.bri;
    return valueForType(bri, _getRangeValue(bri, value));
}

function _getAlertValue(value) {
    var alert = stateDefinitions.alert;
    return valueForType(alert, _getOptionValue(alert, value));
}

function _getOnValue(value) {
    var on = stateDefinitions.on;
    return valueForType(on, value);
}

function _getEffectValue(value) {
    var effect = stateDefinitions.effect;
    return valueForType(effect, _getOptionValue(effect, value));
}

function _getOptionValue(definition, value) {
    var validValues = definition.validValues
        , resolved
        ;

    validValues.forEach(function (validValue) {
        if (!resolved && validValue === value) {
            resolved = value;
        }
    });

    return resolved || definition.defaultValue || validValues[0];
}

function _getRangeValue(definition, value) {
    var range = definition.range;

    if (value === undefined || value === null && definition.defaultValue) {
        value = definition.defaultValue;
    }

    return _getBoundedValue(value, range.min, range.max)
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

function valueForType(definition, value) {
    return utils.valueForType(definition.type, value);
}