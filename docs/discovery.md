# Discovery

There are two ways to discover a Hue bridge on the network using N-UPnP and UPnP methods. Both of these methods are 
useful if you do not know the IP Address of the bridge already.

The official Hue documentation recommends an approach to finding bridges by using both UPnP and N-UPnP in parallel
to find your bridges on the network. This API library provided you with both options, but leaves it
to the developer to decide on the approach to be used, i.e. fallback, parallel, or just one type.


- [N-UPnP Search](#n-upnpsearch)
- [UPnP Search](#upnp-search)


## N-UPnP Search
This API function makes use of the official API endpoint that reveals the bridges on a network. It is a call through to
`https://discovery.meethue.com` which may not work in all circumstances (your bridge must have signed into the meethue portal),
in which case you can fall back to the slower ``upnpSearch()`` function.

_Note: This function is considerably faster to resolve the bridges < 500ms compared to 5 seconds to perform a full 
search via UPnP on my own network._

```js
const v3 = require('node-hue-api').v3;

async function getBridge() {
  const results = await v3.discovery.nupnpSearch();

  // Results will be an array of bridges that were found
  console.log(JSON.stringify(results, null, 2));
}

getBridge();
```

The results will be an array of discovered bridges with the following structure:

```json
[
  {
      "name": "Philips hue",
      "ipaddress": "192.xxx.xxx.xxx",
      "modelid": "BSB002",
      "swversion": "1935074050"
  }
]
```



## UPnP Search

This API function utilizes a network scan for the SSDP responses of devices on a network. This ius a significantly slower
way to find the Bridge, but can be useful if you have not set it up yet and it has not registered with the meethue portal.

Note that you must be on the same network as the bridge for this to work.

```js
const v3 = require('node-hue-api').v3;

async function getBridge(timeout) {
  const results = await v3.discovery.upnpSearch(timeout);

  // Results will be an array of bridges that were found
  console.log(JSON.stringify(results, null, 2));
}

// You can pass a timeout value to set the maximum time to search for Hue Bridges, there is a default of 5 seconds if not set
getBridge(10000); // 10 second timeout
```


A timeout can be provided to the function to increase/decrease the amount of time that it waits for responses from the
search request, by default this is set to 5 seconds (the above example sets this to 10 seconds).

The results from this function call will be of the form;

```json
[
  {
    "name": "Philips hue (192.xxx.xxx.xxx)",
    "manufacturer": "Royal Philips Electronics",
    "ipaddress": "192.xxx.xxx.xxx",
    "model": {
      "number": "BSB002",
      "description": "Philips hue Personal Wireless Lighting",
      "name": "Philips hue bridge 2015",
      "serial": "0017xxxxxxxx"
    },
    "version": {
      "major": "1",
      "minor": "0"
    },
    "icons": [
      {
        "mimetype": "image/png",
        "height": "48",
        "width": "48",
        "depth": "24",
        "url": "hue_logo_0.png"
      }
    ]
  }
]
```