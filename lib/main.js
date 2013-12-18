var hsts = require("./hsts");
var activeBrowserWindow = require("sdk/window/utils").getMostRecentBrowserWindow();
var widget = require("sdk/widget").Widget({
  id: "hsts",
  label: "HSTS Everyhere",
  contentURL: "https://www.mozilla.org/favicon.ico",
  onClick: function () {
    hsts.add('eff.org');
    hsts.add('apple.com');
  }
})
