import { LocalBootstrap } from './http/LocalBootstrap';
import { LocalInsecureBootstrap } from './http/LocalInsecureBootstrap';
import { RemoteBootstrap } from './http/RemoteBootstrap';

/**
 * Creates a remote bootstrap to connect with a Hue bridge remotely
 * @param clientId The OAuth client id for your application.
 * @param clientSecret The OAuth client secret for your application.
 */
export function createRemote(clientId: string, clientSecret: string): RemoteBootstrap {
  return new RemoteBootstrap(clientId, clientSecret);
}

/**
 * Creates a local network bootstrap to connect with Hue bridge on a local network.
 * @param host The IP Address or FQDN of the he bridge you are connecting to.
 * @param port The port number to connect to, optional.
 */
export function createLocal(host: string, port?: number): LocalBootstrap {
  return new LocalBootstrap(host, port);
}

/**
 * Creates a local network bootstrap over an insecure HTTP connection.
 * @param host The IP Address or FQDN of the he bridge you are connecting to.
 * @param port The port number to connect to, optional.
 */
export function createInsecureLocal(host: string, port?: number): LocalInsecureBootstrap {
  return new LocalInsecureBootstrap(host, port);
}