"use strict";

var Trait = require("traits").Trait,
    tBodyArguments = require("./tBodyArguments");

module.exports = function (withAlert, withScene) {
    var values = [
        {
            name: "on",
            type: "bool",
            optional: true
        },

        {
            name: "bri",
            type: "uint8",
            minValue: 0,
            maxValue: 254,
            optional: true
        },

        {
            name: "hue",
            type: "uint16",
            minValue: 0,
            maxValue: 65535,
            optional: true
        },

        {
            name: "sat",
            type: "uint8",
            minValue: 0,
            maxValue: 255,
            optional: true
        },

        {
            name: "xy",
            type: "list",
            listType: {
                name: "xyValue",
                type: "float",
                minValue: 0,
                maxValue: 1,
                optional: false
            },
            optional: true
        },

        {
            name: "ct",
            type: "uint8",
            minValue: 153,
            maxValue: 500,
            optional: true
        },

        {
            name: "effect",
            type: "string",
            defaultValue: "none",
            validValues: ["none", "colorloop"],
            optional: true
        },

        {
            name: "transitiontime",
            type: "uint16",
            defaultValue: 4,
            minValue: 0,
            maxValue: 65535,
            optional: true
        },

        {
            name: "bri_inc",
            type: "int8",
            minValue: -254,
            maxValue: 254,
            optional: true
        },

        {
            name: "sat_inc",
            type: "int8",
            minValue: -254,
            maxValue: 254,
            optional: true
        },

        {
            name: "hue_inc",
            type: "int16",
            minValue: -65534,
            maxValue: 65534,
            optional: true
        },

        {
            name: "ct_inc",
            type: "int16",
            minValue: -65534,
            maxValue: 65534,
            optional: true
        },

        {
            name: "xy_inc",
            type: "float",
            minValue: -0.5,
            maxValue: 0.5,
            optional: true
        }
    ];

    if (withAlert) {
        values.push({
            name: "alert",
            type: "string",
            defaultValue: "none",
            validValues: ["none", "select", "lselect"],
            optional: true
        });
    }

    if (withScene) {
        values.push({
            name: "scene",
            type: "string",
            optional: true
        });
    }

    return tBodyArguments("application/json", values);
};
