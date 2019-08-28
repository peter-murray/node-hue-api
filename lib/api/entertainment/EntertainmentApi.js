'use strict';

const ApiError = require('../../ApiError')
  , EntertainmentStream = require('./EntertainmentStream')
  , HueStreamMessage = require('./HueStreamMessage')
;

module.exports = class EntertainmentApi {

  constructor(hueApi) {
    this._hueApi = hueApi;
    this._stream = null;
    this._id = -1;

    this.streamMessage = new HueStreamMessage();

    //TODO validate that we have a valid Hue API configuration, i.e. the clientkey is present in the config.
  }

  start(id) {
    const self = this
      , hueApi = self._getHueApi()
      , config = hueApi._getConfig()
    ;

    return getEntertainmentGroup(hueApi, id)
      .then(group => {
        return hueApi.groups.enableStreaming(group.id);
      })
      .then(enabled => {
        if (!enabled) {
          throw new ApiError(`Failed to enable streaming for entertainment group: ${id}`);
        }

        const stream = new EntertainmentStream(config.hostname, config.username, config.clientkey);
        self._setEntertainmentGroupId(id);
        self._setStream(stream);

        return stream.connect()
          .then(() => {
            return self; //TODO should be the message sending class instead
          });
      });
  }

  stop() {
    const self = this
      , stream = self._stream
    ;

    if (stream) {
      return self._closeStream()
        .then(self._stopStreamOnGroup());
    } else {
      return self._stopStreamOnGroup();
    }
  }


  sendRGB(lightsToRGB) {
    const self = this
      , stream = self._stream
      , streamMessage = self.streamMessage
    ;

    if (! stream) {
      throw new ApiError('There is no current stream active, make sure you have started the streaming before calling this.');
    }

    return stream.send(streamMessage.rgbMessage(lightsToRGB));
  }


  _stopStreamOnGroup() {
    const self = this
      , id = self._id
      , hueApi = self._hueApi
    ;

    if (id > -1) {
      return hueApi.groups.disableStreaming(id)
        .finally(() => {
          self._setEntertainmentGroupId(-1);
        });
    } else {
      return Promise.resolve(true);
    }
  }

  _closeStream() {
    const self = this;

    return this._stream.close()
      .finally(() => {
        self._setStream(null);
      });
  }

  _setStream(stream) {
    this._stream = stream;
  }

  _setEntertainmentGroupId(id) {
    this._id = id;
  }

  _getHueApi() {
    return this._hueApi;
  }
};


function getEntertainmentGroup(api, id) {
  return api.groups.get(id)
    .then(group => {
      if (group.type !== 'Entertainment') {
        throw new ApiError(`The group with id ${id} is not a Entertainment Group it has a type of '${group.type}'`);
      }
      return group;
    });
}
