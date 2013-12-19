var hsts = require("./hsts");
var activeBrowserWindow = require("sdk/window/utils").getMostRecentBrowserWindow();
var widget1 = require("sdk/widget").Widget({
  id: "hsts-start",
  label: "HSTS Everyhere Start",
  contentURL: "https://www.mozilla.org/favicon.ico",
  onClick: function() {
    hsts.add('eff.org');
    hsts.add('apple.com');
  },
});

var widget2 = require("sdk/widget").Widget({
  id: "hsts-clear",
  label: "HSTS Everyhere Clear",
  contentURL: "https://www.mozilla.org/favicon.ico",
  onClick: function() {
    hsts.clear('eff.org');
    hsts.clear('apple.com');
  },
});
