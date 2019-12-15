module.exports = {
  "id": 2,
  "type": "ZLLSwitch",
  "state": {"lastupdated": "2019-12-14T21:34:45", "buttonevent": 1002},
  "swupdate": {"state": "batterylow"},
  "config": {"on": true, "reachable": true, "battery": 79, "alert": "none", "pending": []},
  "name": "Hue dimmer switch 1",
  "modelid": "RWL021",
  "manufacturername": "Philips",
  "productname": "Hue dimmer switch",
  "diversityid": "73bbabea-3420-xxxx-xxxx-46bf437e119b",
  "swversion": "5.45.1.17846",
  "uniqueid": "00:17:88:01:02:xx:xx:xx-xx-fc00",
  "capabilities": {
    "certified": true,
    "primary": true,
    "inputs": [{
      "repeatintervals": [800],
      "events": [{"buttonevent": 1000, "eventtype": "initial_press"}, {
        "buttonevent": 1001,
        "eventtype": "repeat"
      }, {"buttonevent": 1002, "eventtype": "short_release"}, {"buttonevent": 1003, "eventtype": "long_release"}]
    }, {
      "repeatintervals": [800],
      "events": [{"buttonevent": 2000, "eventtype": "initial_press"}, {
        "buttonevent": 2001,
        "eventtype": "repeat"
      }, {"buttonevent": 2002, "eventtype": "short_release"}, {"buttonevent": 2003, "eventtype": "long_release"}]
    }, {
      "repeatintervals": [800],
      "events": [{"buttonevent": 3000, "eventtype": "initial_press"}, {
        "buttonevent": 3001,
        "eventtype": "repeat"
      }, {"buttonevent": 3002, "eventtype": "short_release"}, {"buttonevent": 3003, "eventtype": "long_release"}]
    }, {
      "repeatintervals": [800],
      "events": [{"buttonevent": 4000, "eventtype": "initial_press"}, {
        "buttonevent": 4001,
        "eventtype": "repeat"
      }, {"buttonevent": 4002, "eventtype": "short_release"}, {"buttonevent": 4003, "eventtype": "long_release"}]
    }]
  },
  "node_hue_api": {"type": "zllswitch", "version": 1}
}
