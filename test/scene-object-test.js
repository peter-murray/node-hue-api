var expect = require("chai").expect
  , Scene = require("..").scene
  , testValues = require("./support/testValues")
  ;

describe("Scene", function () {
  var scene;

  beforeEach(function () {
    scene = Scene.create();
  });

  describe("creation", function () {

    it("should create an object", function () {
      expect(scene).to.exist;
      expect(scene).to.be.empty;
    });

    it("should instantiate from an object", function () {
      var data = {
          name: "my scene",
          lights: [1, 2]
        }
        , scene = Scene.create(data)
        ;

      expect(scene).to.have.property("name", data.name);
      expect(scene).to.have.property("lights").with.members(["1", "2"]);
    });
  });

  describe("#withName()", function () {

    it("should set a name of 'node-scene'", function () {
      scene.withName("node-scene");

      expect(scene).to.have.property("name", "node-scene");
    });
  });

  describe("#withLights", function () {

    it("should set light IDs from an array", function () {
      var ids = [1, 2, 3];
      scene.withLights(ids);

      expect(scene).to.have.property("lights").with.members(["1", "2", "3"]);
    });

    it("should set light IDs from an integer", function () {
      scene.withLights(1);
      expect(scene).to.have.property("lights").with.members(["1"]);
    });

    it("should set the light IDs from multiple integers", function () {
      scene.withLights(1, 2, 3);
      expect(scene).to.have.property("lights").with.members(["1", "2", "3"]);
    });
  });

  describe("#withTransitionTime", function () {

    it("should set a transition time value of 5000", function () {
      scene.withTransitionTime(5000);

      expect(scene).to.have.property("transitiontime", 5000);
    });
  });

  describe("#withPicture()", function () {

    it("should set a picture", function () {
      var pictureData = "ABC123DEF456";
      scene.withPicture(pictureData);

      expect(scene).to.have.property("picture", pictureData);
    });
  });

  describe("#withAppData()", function () {

    it("should set data", function () {
      var data = "My App Data";
      scene.withAppData(data);

      expect(scene).to.have.property("appdata");
      expect(scene.appdata).to.have.property("data", data);
      expect(scene.appdata).to.have.property("version", 1);
    });
  });

  describe("#withRecycle()", function() {

    it ("should set the recycle flag", function() {
      scene.withRecycle(false);

      expect(scene).to.have.property("recycle");
      expect(scene).to.have.property("recycle").to.be.false;
    });
  });

  describe("with chained functions", function() {

    it("should create a complex scene", function() {
      var name = "a new scene"
        , pictureData = "1234556677A"
        ;

      scene.withName(name)
        .withLights(1)
        .withPicture(pictureData);

      expect(scene).to.have.property("name", name);
      expect(scene).to.have.property("lights").with.members(["1"]);
      expect(scene).to.have.property("picture", pictureData)
    });
  });
});