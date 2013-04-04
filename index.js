module.exports.hue = require("./hue-api/api.js");

module.exports.lightState = require("./hue-api/lightstate.js");
module.exports.scheduledEvent = require("./hue-api/scheduledEvent.js");
module.exports.ApiError = require("./hue-api/errors.js").ApiError;