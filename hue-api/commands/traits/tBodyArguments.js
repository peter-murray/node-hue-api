"use strict";

var Trait = require("traits").Trait;

function createBodyArgumentTrait(options) {
    var traitProperties = {
        name: options.name,
        type: options.type,
        optional: options.optional
    };

    //TODO add more validation

    if (options.type === "string") {
        if (options.validValues) {
            traitProperties.validValues = options.validValues;
        }

        if (options.maxLength) {
            traitProperties.maxLength = options.maxLength;
        }

        if (options.minLength) {
            traitProperties.minLength = options.minLength;
        }
    }

    if (options.type === "list") {
        if (options.listType) {
            traitProperties.valueType = Trait.create(Object.prototype, createBodyArgumentTrait(options.listType));
        }
    }

    if (options.defaultValue) {
        traitProperties.defaultValue = options.defaultValue;
    }

    if (options.minValue !== undefined && options.maxValue !== undefined) {
        traitProperties.range = {"min": options.minValue, "max": options.maxValue};
    }

    return Trait(traitProperties);
}

/**
 *
 * @param type the encoding type of the options, i.e. application/json
 * @param optionsArray The array of body options.
 * @returns {*}
 */
module.exports = function (type, optionsArray) {
    var options = {};

    optionsArray.forEach(function (opt) {
        options[opt.name] = Trait.create(Object.prototype, createBodyArgumentTrait(opt));
    });

    return Trait(
        {
            bodyType: type,
            bodyArguments: options,

            buildRequestBody: function (values) {
                var body = {},
                    self = this;

                Object.keys(self.bodyArguments).forEach(function (argName) {
                    var value = values ? values[argName] : undefined, // default to undefined if not set
                        arg = self.bodyArguments[argName];

                    if (self.bodyArguments.hasOwnProperty(argName)) {
                        if (arg.optional) {
                            body[argName] = value;
                        } else {
                            // We must have a value provided
                            if (!value) {
                                throw new Error("The required argument '" + argName + "' is missing a value");
                            }
                            body[argName] = value;
                        }
                        //TODO add checking on the ranges/limits etc...
                    }
                });

                return body;
            }
        }
    );
};