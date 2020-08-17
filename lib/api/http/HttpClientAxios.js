// const axios = require('axios');
//TODO remove this as it is just a plugin for the old functionality

const DEBUG = /node-hue-api/.test(process.env.NODE_DEBUG);

class HttpClientAxios {

  constructor(config) {
    if (DEBUG) {
      //TODO need an alternative to this
      // this._axios.interceptors.request.use(config => {
      //   const data = {};
      //
      //   ['method', 'baseURL', 'url', 'data'].forEach(key => {
      //     if (config[key]) {
      //       data[key] = config[key];
      //     }
      //   });
      //   console.log(JSON.stringify(data, null, 2));
      //
      //   return config;
      // });
    }
    // this._axios = axios.create(config);
  }

  request(req) {
    return this._axios.request(req);
  }

  refreshAuthorizationHeader(token) {
    this._axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

module.exports.create = (config) => {
  return new HttpClientAxios(config);
};

module.exports.request = (req) => {
  return new HttpClientAxios().request(req);
};