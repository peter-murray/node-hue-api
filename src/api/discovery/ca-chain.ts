// Obtains an HTTPS Agent that will accept the discovery.meethue.com TLS certificate
import { Agent } from 'https';

export function getDiscoveryMeetHueHttpsAgent(): Agent {
  const discoveryAgent = new Agent();

  if (!discoveryAgent.options) {
    discoveryAgent.options = {};
  }

  discoveryAgent.options.ca = '-----BEGIN CERTIFICATE-----\n' +
    'MIIFyzCCBLOgAwIBAgIRAKIaor1LSXZfCQAAAADzNHQwDQYJKoZIhvcNAQELBQAw\n' +
    'RjELMAkGA1UEBhMCVVMxIjAgBgNVBAoTGUdvb2dsZSBUcnVzdCBTZXJ2aWNlcyBM\n' +
    'TEMxEzARBgNVBAMTCkdUUyBDQSAxRDQwHhcNMjIwMTA0MTIxMzM1WhcNMjIwNDA0\n' +
    'MTIxMzM0WjAeMRwwGgYDVQQDExNhY2NvdW50Lm1lZXRodWUuY29tMIIBIjANBgkq\n' +
    'hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyVB+xbzLSs1A362y0lP1dT3XnQ2VrtuR\n' +
    '8yiYzksqDBnCm36CY/ljdnXmdl7iosWNHox0BUAL/Q9QXQQLUmhApM9KHr8J26SJ\n' +
    'ytJg703sghBn7DQDlJ7YkT5apFNJiuFvlCS4vNSgPe2YIzFM1b497J8CvOPGbcis\n' +
    '6DSJ9AtY8qQ6ABftIHFLzLiGz97SpXWz10ksZQ50oGvpIqtzKL3rBchDRaPvNR2g\n' +
    'gR0q9adfM4F4J9rT75em+BmTzrZmaPGdAkjtR2NWq+cWDOGxkRiuhXCc4yW0qVzg\n' +
    'PEfWXnkRT83eZtsct/KKN4gH1XGo+cN94QIQebYiFYGE2VsoQvPuGQIDAQABo4IC\n' +
    '2jCCAtYwDgYDVR0PAQH/BAQDAgWgMBMGA1UdJQQMMAoGCCsGAQUFBwMBMAwGA1Ud\n' +
    'EwEB/wQCMAAwHQYDVR0OBBYEFBSaeVo6StHROyx09RTSzW5M8xZxMB8GA1UdIwQY\n' +
    'MBaAFCXiGA6yV5GUKuXUXYaQg95Ts7iSMGoGCCsGAQUFBwEBBF4wXDAnBggrBgEF\n' +
    'BQcwAYYbaHR0cDovL29jc3AucGtpLmdvb2cvZ3RzMWQ0MDEGCCsGAQUFBzAChiVo\n' +
    'dHRwOi8vcGtpLmdvb2cvcmVwby9jZXJ0cy9ndHMxZDQuZGVyMIGLBgNVHREEgYMw\n' +
    'gYCCE2FjY291bnQubWVldGh1ZS5jb22CFWRpc2NvdmVyeS5tZWV0aHVlLmNvbYIS\n' +
    'Y2xpZW50Lm1lZXRodWUuY29tgg93d3cubWVldGh1ZS5jb22CFHNlcnZpY2VzLm1l\n' +
    'ZXRodWUuY29tghdhcGkuYWNjb3VudC5tZWV0aHVlLmNvbTAhBgNVHSAEGjAYMAgG\n' +
    'BmeBDAECATAMBgorBgEEAdZ5AgUDMDwGA1UdHwQ1MDMwMaAvoC2GK2h0dHA6Ly9j\n' +
    'cmxzLnBraS5nb29nL2d0czFkNC94S2ZiaFlSWm4zWS5jcmwwggEEBgorBgEEAdZ5\n' +
    'AgQCBIH1BIHyAPAAdgBRo7D1/QF5nFZtuDd4jwykeswbJ8v3nohCmg3+1IsF5QAA\n' +
    'AX4lP8HaAAAEAwBHMEUCIFlDbK+is1bBfFAJnqLKjvLJ3UgTGZu/mLRoc0fHt6v0\n' +
    'AiEAtNdnibpdVKYwCy0oSeDvxt0zxh8/gEr28FoRu9aQ3/UAdgApeb7wnjk5IfBW\n' +
    'c59jpXflvld9nGAK+PlNXSZcJV3HhAAAAX4lP8G4AAAEAwBHMEUCIQD4RTJEvy4Q\n' +
    'T7RgYFGjSvAiRzGsiqrc8kjDkaYqJyxsJgIgVTvTBZEg8V/MqewdFg9oRgj6TUVu\n' +
    'odmazQBsxKtRfvEwDQYJKoZIhvcNAQELBQADggEBADXMD5nPMQR5FYodNCughSeJ\n' +
    'xGx4f5meJiijGtJhm9//UzI8PX4icgcVSxdwv37WTYX1tCL+VJTG71W1Goi/rCwN\n' +
    'Zg3WglVRTbEkxgIXfy64ew+lI+Jf1SOOLt27j94KmVe8X82NZkDSrhYBa1veaP41\n' +
    'Sep/ItAx3Mv5FMmyfi3eYEsWLYni5i1eXhw//K4/NAdzxIhjKwDq16oJKeenNQlH\n' +
    'xDGRGDz7DGv2dHEFY00sOBpo5PcT+Q4kxNxoOwfAWex0tx42PYHmvQ4abtOlzYC5\n' +
    'PFEhEJ+YTd0IWk6SOAShP2oQd6NvpPOoKOsrJWtYChAq5yK5mKp0mDgY8SMqmEU=\n' +
    '-----END CERTIFICATE-----\n' +
    '\n' +
    '-----BEGIN CERTIFICATE-----\n' +
    'MIIFjDCCA3SgAwIBAgINAgCOsgIzNmWLZM3bmzANBgkqhkiG9w0BAQsFADBHMQsw\n' +
    'CQYDVQQGEwJVUzEiMCAGA1UEChMZR29vZ2xlIFRydXN0IFNlcnZpY2VzIExMQzEU\n' +
    'MBIGA1UEAxMLR1RTIFJvb3QgUjEwHhcNMjAwODEzMDAwMDQyWhcNMjcwOTMwMDAw\n' +
    'MDQyWjBGMQswCQYDVQQGEwJVUzEiMCAGA1UEChMZR29vZ2xlIFRydXN0IFNlcnZp\n' +
    'Y2VzIExMQzETMBEGA1UEAxMKR1RTIENBIDFENDCCASIwDQYJKoZIhvcNAQEBBQAD\n' +
    'ggEPADCCAQoCggEBAKvAqqPCE27l0w9zC8dTPIE89bA+xTmDaG7y7VfQ4c+mOWhl\n' +
    'UebUQpK0yv2r678RJExK0HWDjeq+nLIHN1Em5j6rARZixmyRSjhIR0KOQPGBMUld\n' +
    'saztIIJ7O0g/82qj/vGDl//3t4tTqxiRhLQnTLXJdeB+2DhkdU6IIgx6wN7E5NcU\n' +
    'H3Rcsejcqj8p5Sj19vBm6i1FhqLGymhMFroWVUGO3xtIH91dsgy4eFKcfKVLWK3o\n' +
    '2190Q0Lm/SiKmLbRJ5Au4y1euFJm2JM9eB84Fkqa3ivrXWUeVtye0CQdKvsY2Fka\n' +
    'zvxtxvusLJzLWYHk55zcRAacDA2SeEtBbQfD1qsCAwEAAaOCAXYwggFyMA4GA1Ud\n' +
    'DwEB/wQEAwIBhjAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwEgYDVR0T\n' +
    'AQH/BAgwBgEB/wIBADAdBgNVHQ4EFgQUJeIYDrJXkZQq5dRdhpCD3lOzuJIwHwYD\n' +
    'VR0jBBgwFoAU5K8rJnEaK0gnhS9SZizv8IkTcT4waAYIKwYBBQUHAQEEXDBaMCYG\n' +
    'CCsGAQUFBzABhhpodHRwOi8vb2NzcC5wa2kuZ29vZy9ndHNyMTAwBggrBgEFBQcw\n' +
    'AoYkaHR0cDovL3BraS5nb29nL3JlcG8vY2VydHMvZ3RzcjEuZGVyMDQGA1UdHwQt\n' +
    'MCswKaAnoCWGI2h0dHA6Ly9jcmwucGtpLmdvb2cvZ3RzcjEvZ3RzcjEuY3JsME0G\n' +
    'A1UdIARGMEQwCAYGZ4EMAQIBMDgGCisGAQQB1nkCBQMwKjAoBggrBgEFBQcCARYc\n' +
    'aHR0cHM6Ly9wa2kuZ29vZy9yZXBvc2l0b3J5LzANBgkqhkiG9w0BAQsFAAOCAgEA\n' +
    'IVToy24jwXUr0rAPc924vuSVbKQuYw3nLflLfLh5AYWEeVl/Du18QAWUMdcJ6o/q\n' +
    'FZbhXkBH0PNcw97thaf2BeoDYY9Ck/b+UGluhx06zd4EBf7H9P84nnrwpR+4GBDZ\n' +
    'K+Xh3I0tqJy2rgOqNDflr5IMQ8ZTWA3yltakzSBKZ6XpF0PpqyCRvp/NCGv2KX2T\n' +
    'uPCJvscp1/m2pVTtyBjYPRQ+QuCQGAJKjtN7R5DFrfTqMWvYgVlpCJBkwlu7+7KY\n' +
    '3cTIfzE7cmALskMKNLuDz+RzCcsYTsVaU7Vp3xL60OYhqFkuAOOxDZ6pHOj9+OJm\n' +
    'YgPmOT4X3+7L51fXJyRH9KfLRP6nT31D5nmsGAOgZ26/8T9hsBW1uo9ju5fZLZXV\n' +
    'VS5H0HyIBMEKyGMIPhFWrlt/hFS28N1zaKI0ZBGD3gYgDLbiDT9fGXstpk+Fmc4o\n' +
    'lVlWPzXe81vdoEnFbr5M272HdgJWo+WhT9BYM0Ji+wdVmnRffXgloEoluTNcWzc4\n' +
    '1dFpgJu8fF3LG0gl2ibSYiCi9a6hvU0TppjJyIWXhkJTcMJlPrWx1VytEUGrX2l0\n' +
    'JDwRjW/656r0KVB02xHRKvm2ZKI03TglLIpmVCK3kBKkKNpBNkFt8rhafcCKOb9J\n' +
    'x/9tpNFlQTl7B39rJlJWkR17QnZqVptFePFORoZmFzM=\n' +
    '-----END CERTIFICATE-----\n' +
    '\n' +
    '-----BEGIN CERTIFICATE-----\n' +
    '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\n' +
    '-----END CERTIFICATE-----' +
    '\n';

  return discoveryAgent;
}