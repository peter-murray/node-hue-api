var expect = require("chai").expect
  , hueTimer = require("..").timer
  ;

describe("Timer", function () {
  var timer;

  beforeEach(function () {
    timer = hueTimer.create();
  });

  describe("creation", function () {

    it("should create an object", function () {
      expect(timer).to.exist;
      expect(timer).to.be.empty;
    });
  });

  describe("hour", function() {

    function validateHour(expected) {
      expect(timer).to.have.property("hh", expected);
    }

    it("should set 0", function() {
      timer.hour(0);
      validateHour(0);
    });

    it("should set 23", function() {
      timer.hour(23);
      validateHour(23);
    });

    it("should correct -1 to 0", function() {
      timer.hour(-1);
      validateHour(0);
    });

    it("should correct 24 to 0", function() {
      timer.hour(24);
      validateHour(0);
    });

    it("should correct 25 to 0", function() {
      timer.hour(0);
      validateHour(0);
    });
  });


  describe("minute", function() {

    function validateMinute(expected) {
      expect(timer).to.have.property("mm", expected);
    }

    it("should set 0", function() {
      timer.minute(0);
      validateMinute(0);
    });

    it("should set 59", function() {
      timer.minute(59);
      validateMinute(59);
    });

    it("should set 31", function() {
      timer.minute(31);
      validateMinute(31);
    });

    it("should correct -1 to 0", function() {
      timer.minute(-1);
      validateMinute(0);
    });

    it("should correct 60 to 59", function() {
      timer.minute(-1);
      validateMinute(0);
    });

    it("should correct 90 to 59", function() {
      timer.minute(90);
      validateMinute(59);
    });
  });


  describe("second", function() {

    function validateSecond(expected) {
      expect(timer).to.have.property("ss", expected);
    }

    it("should set 0", function() {
      timer.second(0);
      validateSecond(0);
    });

    it("should set 59", function() {
      timer.second(59);
      validateSecond(59);
    });

    it("should set 31", function() {
      timer.second(31);
      validateSecond(31);
    });

    it("should correct -1 to 0", function() {
      timer.second(-1);
      validateSecond(0);
    });

    it("should correct 60 to 59", function() {
      timer.second(-1);
      validateSecond(0);
    });

    it("should correct 90 to 59", function() {
      timer.second(90);
      validateSecond(59);
    });
  });

  describe("recurring", function() {

    function validateRecurring(expected) {
      expect(timer).to.have.property("recurring", expected);
    }

    it("occur once", function() {
      timer.recurring(1);
      validateRecurring(1)
    });


    it("occur 99 times", function() {
      timer.recurring(99);
      validateRecurring(99)
    });


    it("occur always", function() {
      timer.recurring();
      validateRecurring("forever")
    });


    it("should correct 100 to 99", function() {
      timer.recurring(100);
      validateRecurring(99)
    });
  });

  describe("randomize", function() {

    function validateRandomization(hh, mm, ss) {
      expect(timer).to.have.property("random");

      expect(timer.random).to.have.property("hh", hh);
      expect(timer.random).to.have.property("mm", mm);
      expect(timer.random).to.have.property("ss", ss);
    }

    it("should randomize 00:00:05", function() {
      timer.randomize(0, 0, 5);
      validateRandomization(0, 0, 5);
    });

    it("should randomize 01:00:01", function() {
      timer.randomize(1, 0, 1);
      validateRandomization(1, 0, 1);
    });

    it("should randomize 23:00:00", function() {
      timer.randomize(23, 0, 0);
      validateRandomization(23, 0, 0);
    });

    //TODO need more that check the boundaries on the values
    //TODO validate undefined values
  });

  //TODO validate the output strings
});