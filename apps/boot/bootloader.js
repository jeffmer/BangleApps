// This runs after a 'fresh' boot
var clockApp="dtlaunch.app.js"
if (clockApp) clockApp = require("Storage").read(clockApp);
// check to see if our clock is wrong - if it is use GPS time
if ((new Date()).getFullYear()<2000) {
  E.showMessage("Searching for\nGPS time");
  Bangle.on("GPS",function cb(g) {
    Bangle.setGPSPower(0);
    Bangle.removeListener("GPS",cb);
    if (!g.time || (g.time.getFullYear()<2000) ||
       (g.time.getFullYear()>2200)) {
      // GPS receiver's time not set - just boot clock anyway
      eval(clockApp);
      delete clockApp;
      return;
    }
    // We have a GPS time. Set time and reboot (to load alarms properly)
    setTime(g.time.getTime()/1000);
    load();
  });
  Bangle.setGPSPower(1);
} else {
  eval(clockApp);
  delete clockApp;
}