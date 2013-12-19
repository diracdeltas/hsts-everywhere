// see http://mxr.mozilla.org/mozilla-central/source/security/manager/ssl/tests/unit/test_sts_preloadlist_perwindowpb.js
// and http://mxr.mozilla.org/mozilla-central/source/security/manager/tools/getHSTSPreloadList.js

var {Cc, Ci, Cu} = require("chrome");

var activeBrowserWindow = require("sdk/window/utils").getMostRecentBrowserWindow();

Cu.import("resource://gre/modules/Services.jsm");

var gSSService = Cc["@mozilla.org/ssservice;1"]
                   .getService(Ci.nsISiteSecurityService);

// For now, STS data gets stored in permissions.sqlite.
// See https://bugzilla.mozilla.org/show_bug.cgi?id=775370.

var permissionManager = Cc["@mozilla.org/permissionmanager;1"]
                          .getService(Ci.nsIPermissionManager);

// We should not store anything permanent in permissions.sqlite in private
// browsing mode.

var FLAGS = require("sdk/private-browsing").isPrivate(activeBrowserWindow) ?
              Ci.nsISocketProvider.NO_PERMANENT_STORAGE : 0;

var EXPIRE = require("sdk/private-browsing").isPrivate(activeBrowserWindow) ? 1 : 0;

var STS_KNOCKOUT = permissionManager.DENY_ACTION;
var STS_SET = permissionManager.ALLOW_ACTION;
var STS_UNSET = permissionManager.UNKNOWN_ACTION;
var STS_TYPE = Ci.nsISiteSecurityService.HEADER_HSTS;

function clearStsState(host, includeSubdomains=true) {
  // this removes an entry entirely so that we fall back to the preload list.
  // note: this is NOT aware of private browising mode!
  permissionManager.remove(host, "sts/use");
  if (includeSubdomains) {
    permissionManager.remove(host, "sts/subd");
  }
}

function knockoutStsState(hostname) {
  var uri = Services.io.newURI("https://"+hostname, null, null);
  gSSService.removeState(STS_TYPE, uri, FLAGS);
}

function knockoutSts(hostname) {
  var uri = Services.io.newURI("https://"+hostname, null, null);
  permissionManager.add(uri, "sts/use", STS_KNOCKOUT, EXPIRE);
  permissionManager.add(uri, "sts/subd", STS_KNOCKOUT, EXPIRE);
}

// Trigger HSTS header processing. Ex: hostname = mozilla.org
function spoofHeader(hostname, includeSubdomains=true) {
  var maxAge = { value: 18*7*24*3600 };
  var includeSubdomains = { value: false };
  var uri = Services.io.newURI("https://"+hostname, null, null);
  gSSService.processHeader(STS_TYPE, uri, "", FLAGS, maxAge, includeSubdomains);
}

function addSts(hostname, includeSubdomains=true) {
  var uri = Services.io.newURI("https://"+hostname, null, null);
  permissionManager.add(uri, "sts/use", STS_SET, EXPIRE);
  if (includeSubdomains) {
    permissionManager.add(uri, "sts/subd", STS_SET, EXPIRE);
  }
}

exports.clear = clearStsState;
exports.knockout = knockoutSts;
exports.add = addSts;
