/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

function AboutModule() {
}
AboutModule.prototype = {
  uri: Services.io.newURI("chrome://about-addons-memory-pm/content/about.xhtml", null, null),
  classDescription: "about:addons-memory about module",
  classID: Components.ID("fda5ee40-a5d6-11e1-b3dd-0800200c9a66"),
  contractID: '@mozilla.org/network/protocol/about;1?what=addons-memory',

  QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),

  newChannel : function(aURI) {
    try {
		let chan = Services.io.newChannelFromURI(this.uri);
		chan.originalURI = aURI;
		return chan;
    }
    catch (ex) {
		let channew = Services.io.newChannelFromURI2(
        this.uri,
        null,
        Services.scriptSecurityManager.getSystemPrincipal(),
        null,
        Ci.nsILoadInfo.SEC_ALLOW_CROSS_ORIGIN_DATA_IS_NULL,
        Ci.nsIContentPolicy.TYPE_OTHER);
		channew.originalURI = aURI;
		return channew;
    }
  },
  getURIFlags: function(aURI) 0
};

(function registerComponents() {
  for (let [,cls] in Iterator([AboutModule])) {
    try {
      const factory = {
        _cls: cls,
        createInstance: function(outer, iid) {
          if (outer) {
            throw Cr.NS_ERROR_NO_AGGREGATION;
          }
          return new cls();
        }
      };
      Cm.registerFactory(cls.prototype.classID, cls.prototype.classDescription, cls.prototype.contractID, factory);
      unload(function() {
        Cm.unregisterFactory(factory._cls.prototype.classID, factory);
      });
    }
    catch (ex) {
      log(LOG_ERROR, "failed to register module: " + cls.name, ex);
    }
  }
})();

log(LOG_INFO, "ready");

/* vim: set et ts=2 sw=2 : */
