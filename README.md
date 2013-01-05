# Node Hue API

An API for NodeJS that interacts with the Philips Hue Bridge to control Philips Hue Light Bulbs and
Philips Living Color Lamps.

## Installation

NPM server client:

```
$ npm install node-hue-api
```

## Examples

### Locating a Philips Hue Bridge
To locate all the Philips Hue Bridges on your network (if you do not know the IP Address already);

```js
var hue = require("node-hue-api").hue;

var displayBridges = function(bridge) {
	console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

hue.locateBridges().then(displayBridges).done();
```

### Connecting to a Philips Hue Bridge
To connect to a Philips Hue Bridge and obtain some basic details about it you can use the connect() function'

```js
var hue = require("node-hue-api").hue;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var hostname = "192.168.2.129";
var username = "083b2f780c78555d532b78544f135798";

var api = new hue.HueApi(hostname, username);
api.connect().then(displayResult).done();
```

Running the above code should give you a result similar to;
```
{
  "name": "Philips hue",
  "version": "01003542",
  "linkButton": false,
  "macAddress": "00:xx:xx:xx:xx:xx",
  "host": "192.168.2.129"
}
```

## License
Copyright 2013. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>.
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
