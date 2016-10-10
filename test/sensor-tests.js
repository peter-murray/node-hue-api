var expect = require("chai").expect
  , HueApi = require("../").api
  , testValues = require("./support/testValues.js")
  ;

describe("Hue API", function () {

  var hue = new HueApi(testValues.host, testValues.username);

  describe("#sensors()", function() {

    it("should obtain all the sensors in the bridge", function() {
      return hue.sensors()
        .then(function(results) {
          expect(results.sensors).to.be.instanceOf(Array);

          expect(results.sensors[0]).to.have.property("id", "1");
          expect(results.sensors[0]).to.have.property("name", "Daylight");
          expect(results.sensors[0]).to.have.property("type", "Daylight");
          expect(results.sensors[0]).to.have.property("manufacturername", "Philips");
        });
    });
  });
});