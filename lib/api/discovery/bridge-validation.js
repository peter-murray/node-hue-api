'use strict';


const axios = require('axios/index')
  , ApiError = require('../../ApiError')
;

const FRIENDLY_NAME = /<friendlyName>(.*)<\/friendlyName/sm
  , MODEL_NAME = /<modelName>(.*)<\/modelName/sm
  , MODEL_NUMBER = /<modelNumber>(.*)<\/modelNumber/sm
  , MODEL_DESCRIPTION = /<modelDescription>(.*)<\/modelDescription>/sm
  , MANUFACTURER = /<manufacturer>(.*)<\/manufacturer>/sm
  , SERIAL_NUMBER = /<serialNumber>(.*)<\/serialNumber/sm
  , IP_ADDRESS = /<URLBase>http[s]?:\/\/(.*):.*<\/URLBase/sm
  , SPEC_VERSION = /<specVersion>.*<major>(.*)<\/.*<minor>(.*)<\/.*<\/specVersion/sm
  , ICON_LIST = /<iconList>(.*)<\/iconList>/sm
  , ICON_MIME_TYPE = /<mimetype>(.*)<\/mimetype>/sm
  , ICON_HEIGHT = /<height>(.*)<\/height>/sm
  , ICON_WIDTH = /<width>(.*)<\/width>/sm
  , ICON_DEPTH = /<depth>(.*)<\/depth>/sm
  , ICON_URL = /<url>(.*)<\/url>/sm
;

const DATA_TIMEOUT = 6000;

module.exports.getBridgeConfig = (bridge, timeout) => {
  const ipAddress = bridge.internalipaddress;

  return axios.request({
      method: 'get',
      url: `http://${ipAddress}/api/config`,
      timeout: timeout | DATA_TIMEOUT,
      json: true,
    })
    .catch(err => {
      throw new ApiError(`Problem connecting to bridge '${ipAddress}': ${err.message}`)
    })
    .then(res => {
      if (res.status !== 200) {
        throw new ApiError(`Unexpected status when getting unauthenticated configuration date from bridge at ${ipAddress}`);
      }

      const result = {};
      result.name = res.data.name;
      result.ipaddress=  ipAddress;
      result.modelid = res.data.modelid;
      result.swversion =  res.data.swversion;

      return result;
    })
};

module.exports.getBridgeDescription = (bridge, timeout) => {
  const ipAddress = bridge.internalipaddress;

  return axios.request({
      method: 'GET',
      url: `http://${ipAddress}/description.xml`,
      timeout: timeout | DATA_TIMEOUT,
      headers: {
        accept: 'text/xml'
      }
    })
    .catch(err => {
      throw new ApiError(`Failed to resolve the XML Description for the bridge at ${ipAddress}`);
    })
    .then(response => {
      if (response.status !== 200) {
        throw new ApiError(`Unexpected status when getting XML Description from bridge at ${ipAddress}`);
      }
      return module.exports.parseXmlDescription(response.data);
    });
};

module.exports.parseXmlDescription = (data) => {
  // This is an XML payload, but we will use Regex to parse out the details we want to save pulling in yet another
  // dependency for something so trivial.
  const result = {};

  Object.assign(result, extractValue('name', data, FRIENDLY_NAME));
  Object.assign(result, extractValue('manufacturer', data, MANUFACTURER));
  Object.assign(result, extractValue('ipaddress', data, IP_ADDRESS));

  const model = getModel(data);
  if (model) {
    result.model = model;
  }

  const specVersion = getSpecVersion(data);
  if (specVersion) {
    result.version = specVersion;
  }

  const icons = getIcons(data);
  if (icons) {
    result.icons = icons;
  }

  return result;
};


function extractValue(name, data, regex) {
  const matched = regex.exec(data);

  if (!matched) {
    return null;
  }

  const result = {};
  result[name] = matched[1];
  return result;
}

function getModel(data) {
  const result = {};

  Object.assign(result, extractValue('number', data, MODEL_NUMBER));
  Object.assign(result, extractValue('description', data, MODEL_DESCRIPTION));
  Object.assign(result, extractValue('name', data, MODEL_NAME));
  Object.assign(result, extractValue('serial', data, SERIAL_NUMBER));

  return result;
}

function getIcons(data) {
  const iconListMatch = ICON_LIST.exec(data);

  if (iconListMatch) {
    const iconList = iconListMatch[1]
      , unparsedIcons = iconList.split('</icon>')
      , results = []
    ;

    unparsedIcons.forEach(unparsedIcon => {
      const icon = getIcon(unparsedIcon);
      if (icon) {
        results.push(icon);
      }
    });

    return results;
  }

  return null;
}

function getIcon(data) {
  const result = {};

  Object.assign(result, extractValue('mimetype', data, ICON_MIME_TYPE));
  Object.assign(result, extractValue('height', data, ICON_HEIGHT));
  Object.assign(result, extractValue('width', data, ICON_WIDTH));
  Object.assign(result, extractValue('depth', data, ICON_DEPTH));
  Object.assign(result, extractValue('url', data, ICON_URL));

  if (Object.keys(result).length > 0) {
    return result;
  }
  return null;
}

function getSpecVersion(data) {
  const matched = SPEC_VERSION.exec(data);
  if (matched) {
    return {
      major: matched[1],
      minor: matched[2]
    };
  }
  return null;
}