module.exports = {
  "id": 2,
  "name": "Wake up",
  "description": "L_04_y0GY0_start wake up",
  "command": {
    "address": "/api/xxxxxxxxxxxxxxxxxxxxxxxxxxxxx/sensors/12/state",
    "method": "PUT",
    "body": {"flag": true}
  },
  "localtime": "W124/T06:00:00",
  "time": "W124/T06:00:00",
  "created": "2018-03-08T22:07:37",
  "status": "disabled",
  "recycle": true,
  "node_hue_api": {"type": "schedule", "version": 1}
}
