const fetch = require('node-fetch')
;

class HttpClientFetch {

  constructor(config) {
    this._config = config || {};

    /* sample config, need to be injecting these details
    {
        baseURL: baseUrl,
        headers: {
          Authorization: `Bearer ${self.remoteApi.accessToken}`
        },
        timeout: getTimeout(timeout)
      }
     */
  }

  get headers() {
    return this._config.headers || {};
  }

  get baseURL() {
    return this._config.baseURL;
  }

  get hasBaseUrl() {
    return !!this.baseURL;
  }

  refreshAuthorizationHeader(token) {
    if (!this._config.headers) {
      this._config.headers = {};
    }

    this._config.headers['Authorization'] = `Bearer ${token}`;
  }

  getAgent(url, config) {
    const specifiedAgent = config.agent || config.httpsAgent || config.httpAgent || null;

    if (specifiedAgent) {
      return specifiedAgent;
    }

    if (this._config.httpsAgent) {
      return this._config.httpsAgent;
    } else if (this._config.httpAgent) {
      return this._config.httpAgent;
    }

    return null;
  }

  getUrl(url) {
    if (!this.hasBaseUrl) {
      return url;
    } else if (/^http/.test(url)) {
      return url;
    }

    let path;
    if (url && url[0] === '/') {
      path = url;
    } else {
      path = `/${url}`;
    }
    return `${this.baseURL}${path}`;
  }

  request(req) {
    const isJson = req.json === true
      , hasData = !!req.data
      , url = this.getUrl(req.url)
      , headers = this.headers
      , config = {
          method: req.method,
          headers: headers,
          timeout: req.timeout || 0,
      }
    ;

    if (isJson) {
      headers['Content-Type'] = 'application/json';
      headers['Accept'] = 'application/json';

      if (hasData) {
        config.body = JSON.stringify(req.data);
      }
    } else {
      if (hasData) {
        config.body = req.data;
      }
    }

    if (req.headers) {
      Object.keys(req.headers).forEach(header => {
        headers[header] = req.headers[header];
      });
    }

    config.agent = this.getAgent(url, req)

    return fetch(url, config)
      .then(res => {
        if (res.ok) {
          return res;
        }
        throw new ApiError();
      })
      .then(res => {
        const result = {
          status: res.status
        }

        let promise;

        if (isJson) {
          promise = res.json();
        } else {
          promise = res.text();
        }

        return promise.then(data => {
          result.data = data;
          return result;
        });
      })
  }
}

module.exports.create = (config) => {
  return new HttpClientFetch(config);
}

module.exports.request = (req) => {
  return new HttpClientFetch().request(req);
}