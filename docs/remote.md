# Remote API

The Hue bridge can be accessed locally or remotely. The same API calls are valid for both (mostly) and this library can
operate both against local and remote versions of the Hue Bridge API.

For details on setting up and connecting to the `Remote Hue API` consult the [remote setup](./remoteSetup.md) docs.

* [OAuthTokens Object](#oauthtokens)
* [getToken()](#gettoken)
* [refreshTokens()](#refreshtokens)
* [createRemoteUser()](#createremoteuser)
* [getRemoteAccessCredentials](#getremoteaccesscredentials)


## OAuthTokens
`OAuthTokens` is an Object that stores the tokens and expiry times of the related tokens. Various functions will return
an instance of this Object, like `getTokens()` and `refreshTokens()`.

The object has the following properties and functons:

* `refreshToken`: `get` property that is the value of the refresh token
* `refreshTokenExpiresAt`: `get` property that is the Unix Epoc time that the refresh token will expire
* `accessToken`: `get` property that is the value of the access token
* `accessTokenExpiresAt`: `get` property that is the Unix Epoc time that the access token will expire
* `toString()`: `function` that will return the `String` representation of the `OAuthTokens`


## getToken()
The `getToken()` function allows you to exchange a `code` for a set of OAuth tokens for `access` and `refresh` activities
on the `Hue Remote API`.

* `code` is the authentication code that you received via the `Callback URL` from your `Hue Remote Application`.

```js
api.remote.getToken('magic code value')
  .then(tokens => {
    // Display the tokens
    console.log(JSON.stringify(tokens, null, 2));
  });
```

The function will resolve to an [`OAuthTokens` object](#oauthtokens) containing the details of the new tokens.

```js
{
  "accessToken": "AYZXfqbJXzSXetwcg9HS7V3ZmyAA",
  "access_expires_at": 1568298222137,
  "refreshToken": "NeeoF9HkPS50xAUJX8R8q2kMxUOGBGsb",
  "refresh_expires_at": 1577370222137
}
```

* `access` is the OAuth Access Token that can be used to access the `Remote Hue API`
* `access_expires_at` is the Unix Epoch time that the token will expire on, attempting to use the token after this time will result in failure
* `refresh` is the OAuth Refresh Token that can be exchanged for new Access and Refresh tokens
* `refresh_expires_at` is the Unix Epoch time that the refesh token will expire on, attempting to use the token after this time will result in failure


## refreshTokens()
The `refreshTokens(refreshToken)` function will exchange the `refreshToken` for a new set of OAuth tokens.

```js
api.remote.refreshTokens()
  .then(tokens => {
    // Display the refreshed tokens
    console.log(JSON.stringify(tokens, null, 2));
  });
```

The function will resolve to an [`OAuthTokens` object](#oauthtokens) containing the details of the refreshed tokens.

*Note: calling this function with a valid refresh token will _expire_ the old tokens, so make sure you store the new 
tokens for future use. The new tokens are used immediately for all future remote API calls.*


## createRemoteUser()
The `createRemoteUser(remoteBridgeId, deviceType)` function will create a new remote user in the `Hue Remote API`.

* `remoteBridgeId`: the integer id of the remote bridge. Unless you have multiple Hue Bridges registered in the 
    portal, then this should be `0`. THis is an optional parameter, it will default to `0` id not specified.
* `deviceType`: the name of the application/device that the user represents. This is used to visualize the user access
    to the end user in the portal. This is an optional parameter.

```js
api.remote.createRemoteUser()
  .then(username => {
    console.log(`Created a remote user: ${username}`);
  });
```

The call will resolve to the remote `username` for the user that was created.

*Note: remote users are not the same as the local users that are stored inside the Hue bridge.*


## getRemoteAccessCredentials()
The `getRemoteAccessCredentials()` function allows you to retrieve all the remote related authentication data that
the API knows about in an `Object`.

```js
const credentials = api.remote.getRemoteAccessCredentials();
// Display the credentials
console.log(JSON.stringify(credentials, null, 2));
```

The function will return an `Object` with the following properties:

* `clientId`
* `clientSecret`
* `username`
* `tokens`: `access` and `refresh` Objects with properties `value` and `expiresAt`

The token `expiresAt` properties are the Unix epoch time values, that is millseconds since the Unix epoch and an be 
trivially converted into a Date object using `new Date(value)`.

An example credentials object:
```js
{
  clientId: 'FSzJeGkrC6hJzPlDjC9bfxEMAQxXOvAY',
  clientSecret: 'YPI9z67Qh9Fjjh59',
  username: 'WkdWmGYI5tYVoy36ImLuLwXBwPoqxgakRnj5S0jL',
  tokens: {
    access: {
      value: 'AYZXfqbJXzSXetwcg9HS7V3ZmyAA',
      expiresAt: '1568298222137'
    },
    refresh: {
      value: 'NeeoF9HkPS50xAUJX8R8q2kMxUOGBGsb',
      expiresAt: '1577370222137'
    } 
  }
}
```


 
    
