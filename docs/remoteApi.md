# Remote Hue API Support

There is a remote access version of the Hue API that is available to users that have registered their bridges with the
Philips Hue Portal.

From a software perspective and this library, it does support the `Remote Hue API`, but this requires a number of things
to be in place for you to be able to authenticate with the `Remote Hue API`.

This library does most of the heavy lifting for you with respect to handling the various challenges that are necessary 
for setting up the remote OAuth tokens and users.

That said it is still beneficial to understand the overall authentication flow which is detailed at:
https://developers.meethue.com/develop/hue-api/remote-authentication/

The steps in configuring and getting up and running with the remote API are detailed in the steps below:

1. [Setup](remoteSetup.md)
1. [Remote Bootstrap](remoteBootstrap.md)
1. Use the `api` from the `connectXXX()` call to interact with the bridge as you would locally.


## OAuth Tokens Security and Expiry
Once you have successfully established a connection via the `Hue Remote API`, there will be two OAuth tokens 
(for access and refresh) that you need to keep hold of for future (re)connections.

It is up to you as a developer/user of the library to store these securely where ever you deem appropriate, considering
that these tokens provide complete remote access to your Hue Bridge via the internet!

These token also have a limited window of validity, so if they are compromised at least they will expire out, eventually...

Due to the tokens having an expiry, it is up to you to ensure you renew them using the `api.remote.refreshTokens()` 
function call, whilst the refresh token is still valid.

If you let the tokens expire then you will need to perform the re-authorization against the `Hue Remote API` utilizing 
the `Callback URL` of your `Hue Remote API Application` and granting access, then exchanging that authorization code for
the new tokens. 


## Examples
There are working examples of establishing remote access:

* [Getting remote access from scratch](../examples/v3/remote/accessFromScratch.js)
* [Getting remote access using existing tokens](../examples/v3/remote/accessWithTokens.js)