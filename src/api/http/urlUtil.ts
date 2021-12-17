
const ipv6Regex = /^(\[)?(((?:[0-9a-f]{1,4}))((?::[0-9a-f]{1,4}))*)?::((?:[0-9a-f]{1,4}))((?::[0-9a-f]{1,4}))*|((?:[0-9a-f]{1,4}))((?::[0-9a-f]{1,4})){7}(])?$/
const bracketsRegex = /^\[.*]$/

export function getHttpsUrl(hostname: string, port: number): URL {
  return generateUrl('https', hostname, port);
}

export function getHttpUrl(hostname: string, port: number): URL {
  return generateUrl('http', hostname, port);
}

export function isIpv6Host(value: string): boolean {
  if (value) {
    const trimmedValue = value.toLowerCase().trim();

    if (ipv6Regex.test(trimmedValue)) {
      return true;
    }
  }
  return false;
}

export function cleanHostname(hostname: string): string {
  if (bracketsRegex.test(hostname)) {
    return hostname.substring(1, hostname.length - 1);
  }
  return hostname;
}

function escapeIPv6Address(address: string): string {
  let result = address.trim();

  if (!bracketsRegex.test(result)) {
    result = `[${address}]`;
  }

  return result;
}

function generateUrl(scheme: string, hostname: string, port: number): URL {
  let escapedHostName = hostname;

  if (isIpv6Host(hostname)) {
    escapedHostName = escapeIPv6Address(hostname);
  }

  return new URL(`${scheme}://${escapedHostName}:${port}`);
}