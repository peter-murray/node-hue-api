# RemoteBootstrap

The `RemoteBootstrap` object provides the necessary functions to be able to configure and connect to the `Hue Remote API`.

* [Creating a RemoteBootstrap](#create-a-remotebootstrap)
* [getAuthCodeUrl()](#getauthcodeurl)
* [connectWithCode()](#connectwithcode)
* [connectWithTokens](#connectwithtokens)


## Create a RemoteBootstrap
To help with connecting and configuring access to the `Hue Remote API` a `RemoteBootstrap` object needs to be created 
that maps to your `Hue Remote API Application` that you created in the development portal.

When you create a `Hue Remote API Application` under your developer account, it will be assigned a `ClientId` and 
`ClientSecret`. These can be obtained by opening the application that you created in the development portal following
the details in the [Remote Setup](remoteSetup.md) docs.


The `api.createRemote()` function requires two parameters:

* `clientId`: The `ClientId` value from the `Hue Remote API application` that you create in the Hue Development Portal
* `clientSecret`: The `ClientSecret` value from the `Hue Remote API application` that you created in the Hue Development Portal

```js
const v3 = require('node-hue-api').v3;

const remoteBootstrap = v3.api.createRemote(clientId, clientSecret);
```


## getAuthCodeUrl
The `getAuthCodeUrl(deviceId, appId, state)` function will generate the URL that you need to initiate the OAuth flow to
get the OAuth tokens to access the `Hue Remote API`.

* `deviceId`: `String` which is a unique identifier for the application or device using the API
* `appId`: `String` which is the `AppId` of the `Hue Remote API Application` in the developer portal, you can get this 
    from the details of the application you create
* `state`: A `String` value that will be present in the response from the authentication challenge. The Hue 
    Authorization Server roundtrips this parameter, so your application receives the same value it sent.
    To mitigate against cross-site request forgery (CSRF), it is strongly recommended to include an anti-forgery
    token in the state, and confirm it in the response. One good choice for a state token is a string of 30 or so
    characters constructed using a high-quality random-number generator.
    
```js
const v3 = require('node-hue-api').v3;

const remoteBootstrap = v3.api.createRemote(clientId, clientSecret);
console.log(remoteBootstrap.getAuthCodeUrl());
```

The call will return a `String` which is the URL that your end user needs to follow in the browser to perform the 
redirection flow that will allow them to grant your application access to their bridge over the internet.

Upon a successful flow the `Callback URL` that you registered with your `Hue Remote API Application` in the developer 
portal. This Callback URL target will get the `state` value you passed in to the function and an authorization `code`.

You should validate the `state` value before continuing, so that you can confirm that the response is from the Hue 
Authorization servers.

*Note: The `code` that is returned in the Callback URL call is only valid for a finite time, there is nothing detailed 
as to the extent of the time it is valid from the Hue documentation, but it definitely longer than 25 seconds at the 
time of writing.*


## connectWithCode
The `connectWithCode(code, useername, timeout, deviceType, remoteBirdgeId)` function will perform the second step in the 
OAuth authentication process following a user granting your application access to their Hue Bridge.  

* `code`: The `authentication` code that you get from the Callback URL for your `Hue Remote Api Application`.
* `username`: An optional `username` that has been previously created/whitelisted in the remote API.
* `timeout`: An optional timeout in milliseconds for API requests.
* `deviceType`: An optional `deviceType` identifier for the user that will be created _IF_ no `username` value is passed 
    in.
* `remoteBridgeId`: An optional `id` value for the remote bridge being connected to, _IF_ no value is passed will 
    default to an id of `0` which is correct for the majority of users, as you would need to have multiple hue bridges 
    assigned to an account before you need to specify this value. 

This function call will exchange the provided authorization code for new OAuth Access and Refresh tokens. These will be 
stored within the library as par of the call and can be retrieved later using the [`remote.getRemoteAccessCredentials()`](remote.md#getremoteaccesscredentials)
call.

_Note: You need to store the OAuth tokens yourself in whatever system/location you deem necessary so that you can use 
them again in the future, otherwise you will have to get a new authorization code using the Callback URL. **These are 
highly sensitive pieces of information, with them someone can fully control your bridge outside of your network!**_ 

If you do not pass in a `username` for the connection, one will be created for you automatically due to the majority of
the remote API being useless without a user. If you leave it to the library to create the user for you, you can get the 
`username` value from the library via the library function [`remote.getRemoteAccessCredentials()`](remote.md#getremoteaccesscredentials)

```js
const v3 = require('node-hue-api').v3;

const remoteBootstrap = v3.api.createRemote(clientId, clientSecret);
remoteBootstrap.connectWithCode(code)
  .then(api => {
    // Do something with the api like getting lights etc... 
  })
```

The call will return a `Promise` that will resolve to `v3 API` object that you can use to access the bridge.


## connectWithTokens
The `connectWithTokens(accessToken, refreshToken, username, timeout, deviceType)` function will perform the 
authentication to the `Remote Hue API` using previously obtained OAuth tokens.

You do not need to perform the user Callback URL process when providing existing tokens, provided that they are 
still valid (that is within the expiry time of their creation). Note using the refresh token you can obtain new tokens 
and the refresh token is valid longer than the access token, so you could wait until it expires before renewing, but 
there is also a time limit on the refresh token.

* `accessToken`: The OAuth access token that you previously obtained (and is still valid)
* `refreshToken`: The Oauth refresh token that you previously obtained (and is still valid)
* `username`: An optional `username` that has been previously created/whitelisted in the remote API.
* `timeout`: An optional timeout in milliseconds for API requests.
* `deviceType`: An optional `deviceType` identifier for the user that will be created _IF_ no `username` value is passed 
    in.
    
```js
const v3 = require('node-hue-api').v3;

const remoteBootstrap = v3.api.createRemote(clientId, clientSecret);
remoteBootstrap.connectWithCode(code)
  .then(api => {
    // Do something with the api like getting lights etc... 
  })
```

The call will return a `Promise` that will resolve to `v3 API` object that you can use to access the bridge.

_Note: If you use this function to connect to the bridge, then the expiry times for the tokens will not be available 
within the library. If you do refresh the tokens using `api.remote.refreshTokens()` then the expiry values will be know 
to the library, but the tokens will be rotated adn the old ones made invalid_.
