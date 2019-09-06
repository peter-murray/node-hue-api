# Remote API

The Hue bridge can be accessed locally or remotely. The same API calls are valid for both (mostly) and this library can
operate both against local and remote versions of the Hue Bridge API.


## Prerequisites
There are some prerequisites that must be met before you can attempt to utilize the Remote version of the Hue Bridge API.

* [Developer Account on the https://developers.meethue.com portal](#registering-a-developer-account)
* [Remote Hue API Application registered for your application](#creating-a-remote-hue-api-application)


### Registering a Developer Account
You can register for a developers account by filling in the details on the registration page, https://developers.meethue.com/register/.

Once you have this account, you can sign in to the https://developer.meethue.com portal and then register your remote 
application with them.


### Creating a Remote Hue API Application
Once you have signed into the https://developers.meethue.com portal using you developers account, you can register a
`Hue API Remote Application` by selecting your username in the masthead and then clicking on the `Remote Hue API appids`
link.

This will display your existing remote applications that you have registered as well as giving you a link to create a 
new application.

When you click a new application, you are required to fill a number of details about your application which consist of:

* `App name`: An Application name for your application, this will be what is presented to users when they authorize your
    application via the Remote API initial token generation 
* `Callback URL`: A URL that will be used in the callback when generating the necessary code for getting the Remote API 
    OAuth tokens. This is really expected to be a URL that is valid
* `Application Description`: A description of the application
* `Company Details`: These appear to be optional at this time

You will need to read and accept the terms and conditions for the API. It is up to you to adhere to these the library 
will not do anything specific to ensure you are complaint with these terms and conditions.


#### Callback URL
The `Callback URL` is going to be redirected to from an initial authentication grant by the user when granting access to
the `Hue Remote API` by a user.

This process flow ideally needs to occur in the browser and for cloud/internet hosted applications, it will not be 
difficult to have an endpoint exposed that will collect the information from this callback redirect and make it 
available to your application. It is an OAuth flow after all.   

If you are not hosting your application exposed to the internet, then you can still obtain the `code` that you need to 
exchange for tokens by registering any URL for the `Callback URL`, say `http://localhost:8080`, then the browser will
still redirect to that URL along with the query parameters containing the `code` and `state`. You can then extract those 
values from the URL in the browser after it fails.

Alternatively you can run a simple server on the `localhost` or internal network address that can be used for the 
`Callback URL` (currently the callback URL does support the use of `localhost`, but this may change in the future).
You can then run something as simple as the following code to capture the values from the `Callback URL`:

```js
// Using Hapi as the server, could use express as well...
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: 9090,
    host: 'localhost',
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request) => {
      const code = request.query.code
        , state = request.query.state 
        ;
      return {
        code: code,
        state: state
      }
    }
  })

  await server.start();
  console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
``` 


## Connecting with the Remote API

Once you have set up the `Remote API Application` with the https://developers.meethue.com portal, you can then use the
application data along with the library to generate your OAuth tokens needed for remote access.

Navigate to your `Remote Hue API Application` and collect the `ClientId` and `ClientSecret` along with the `AppId` for 
the remote application, these are needed so that we can talk with the Hue Remote API endpoints.

There are two possible paths that you have for accessing the Hue Remote API;

* [New Connection to the Remote Hue API Application](#new-remote-application-connection)
* [Reusing an existing Access Token to connect to the Remote Hue API](#)


### New Remote Application Connection

In this scenario you have never generated (or lost your previous) OAuth Access Token to the Remote Hue API. The flow that
the Hue Remote API requires in this case is:

1. An access URL is generated that the user can issue an HTTP GET on (this includes a `state`) code which you can use 
    to detect forgeries from your application code.
1. User navigates to the provided URL, which will redirect them to sign in to the https://account.meethue.com website
1. After the user is signed in, they will prompted with a `Grant permission` page that will show the name of your 
    application (the `AppId`), that they must accept to grant you access to their account and bridges.
1. Once the user accepts the grant request, they will be redirected to the `Callback URL` of the Hue Remote Application
    that you set up above. There will be two query parameters in the callback URL that the user is redirected to, 
    `code` and `state`.
1. The `code` and `state` parameters that are received in the callback need to be collected. The `state` is the same 
    `state` value that was passed in via the initial access URL, you can validate this to ensure that the response is
    associated with the one you sent. The `code` is the value you need to exchange with the Remote Hue API to obtain 
    your OAuth Access Token.
1. Call the `connectWithCode(code, username)` function to exchange your code for OAuth Access and Refresh Tokens
1. Interact with the remote bridge (after you have stored the tokens for future use) using this library API.


### Reusing Existing OAuth Tokens

In this scenario, you have already gone through the [New Remote Application Connection](#new-remote-application-connection) 
process and stored the `Access Token` and `Refresh Token` so that you can reuse them. 

1. Instantiate a remote api via the library
1. Call `connectWithTokens()` function to attach to the `Hue Remote API` using the provided tokens
1. Interact with the remote bridge using this library API

*Note: You are responsible for passing a valid unexpired access and/or refresh token. The tokens will expire after a 
period of time, the times of which are availble via the API when they are first obtained.*


## Remote Users / Whitelist
The remote API is fairly useless unless you have a remote user created. The library will create a new user for you in the 
`Hue Remote API` whitelist if you do not pass in an existing username. *Note, this is different to the approach that is taken
with the local API connections of this library.*

When you call either `connectWithCode()` or `connectWithTokens()` and do not provide a `username` parameter a new remote
user will be created as part of the connection to the remote API. The reason for doing this is to make the remote API
more usable as unlike the local API, where you now need to press the link button on the bridge, this can be automated 
via the `Hue Remote API`.

If you are not passing an existing `username` when connecting, you can collect the username that was created at 
connection time using the [`api.remote.getRemoteAccessCredentials()`]() function.

 
    
