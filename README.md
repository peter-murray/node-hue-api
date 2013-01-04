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

```js
var hue = require("node-hue-api").hue;

var displayBridges = function(bridge) {
	console.log("Hue Bridge: " + JSON.stringify(bridge));
};

hue.locateBridges().then(displayBridges).done();
```

## License
Copyright 2013. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
the License. You may obtain a copy of the License at
<http://www.apache.org/licenses/LICENSE-2.0>
Unless required by applicable law or agreed to in writing, software distributed under the License is
distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
