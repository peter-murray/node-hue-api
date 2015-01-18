var HueApi = require("../").HueApi
    , testValues = require("./support/testValues.js")
    , expect = require("chai").expect
    ;


describe("Hue API", function () {


    describe("#registeredUsers", function () {

        var hue = new HueApi(testValues.host, testValues.username);

        function validateUsers(results) {
            var testUser = null;

            expect(results).to.have.property("devices");
            expect(results.devices).to.be.instanceOf(Array);

            results.devices.forEach(function (user) {
                expect(user).to.have.property("username");
                expect(user).to.have.property("name");
                expect(user).to.have.property("created");
                expect(user).to.have.property("accessed");

                if (user.username === testValues.username) {
                    testUser = user;
                }
            });

            expect(testUser).to.not.be.null;
        }

        it("using #promise", function (finished) {

            hue.registeredUsers()
                .then(validateUsers)
                .then(function () {
                          finished();
                      })
                .done();
        });


        it("using #callback", function (finished) {
            hue.registeredUsers(function (err, results) {
                expect(err).to.be.null;
                validateUsers(results);
                finished();
            });
        });
    });

});