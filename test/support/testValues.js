'use strict';

const path = require('path')
  , fs = require('fs')
  , os = require('os')
;

const TEST_DATA = loadData();

module.exports = {
  username: getTestDataValue('username'),
  clientkey: getTestDataValue('clientkey'),

  testLightId: getTestDataValue('lightid'),
};


function loadData() {
  const platform = os.platform();

  let testDataFile;
  if (platform === 'win32') {
    testDataFile = path.join(process.env.LOCALAPPDATA, '.node-hue-api');
  }

  //TODO add support for MacOS

  let data = null;
  if (fs.existsSync(testDataFile)) {
    try {
      data = JSON.parse(fs.readFileSync(testDataFile));
    } catch(err) {
      console.error(`Failed to parse data file ${testDataFile}: ${err.message}`);
      data = null;
    }
  }

  return data;
}


function getTestDataValue(key) {
  if (TEST_DATA) {
    return TEST_DATA[key];
  }
  return null;
}