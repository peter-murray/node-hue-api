'use strict';

const UpnpSearch = require('./UPnP')
;


module.exports.upnp = (timeout) => {
  const search = new UpnpSearch();
  return search.search(timeout);
};

//TODO add support for mDNS



