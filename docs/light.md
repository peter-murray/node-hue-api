# Light

All objects representing lights that are returned from the API are instances or `Light` objects.

The Light object has a number of specializations which are:

* `OnOffLight`
* `DimmableLight`
* `ColorLight` 
* `ColorTemperatureLight` 
* `ExtendedColorLight`  

Each instance of a `Light` will have different properties depending upon their capabilities. The API will return the 
correct mapped instance of `Light` base on the payload it receives from the Hue Bridge.

*TODO document the properties of the object*


