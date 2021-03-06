(() => {
  var settings = {};
  var hasFix = false;
  var lastFix = false; // toggles once for each reading
  var gpsTrack; // file for GPS track
  var periodCtr = 0;
  var gpsOn = false;

  // draw your widget
  function draw() {
    if (!settings.recording) return;
    g.reset();
    g.setColor(hasFix?2:4);
    g.drawImage(atob("GBiBAAAgAABwAAD4AAB8AAA9gAAZwAAD4AAH8AAH8AB5wAA9mAAePAAOPgAGHwACDgAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="),this.x,this.y);
  }

  function onGPS(fix) {
    hasFix = fix.fix;
    if (lastFix!=hasFix) {WIDGETS["gpsrec"].draw(); lastFix=hasFix; g.flip();}
    if (hasFix) {
      periodCtr--;
      if (periodCtr<=0) {
        periodCtr = settings.period;
        if (gpsTrack) gpsTrack.write([
          fix.time.getTime(),
          fix.lat.toFixed(6),
          fix.lon.toFixed(6),
          fix.alt
        ].join(",")+"\n");
      }
    }
  }

  // Called by the GPS app to reload settings and decide what to do
  function reload() {
    settings = require("Storage").readJSON("gpsrec.json",1)||{};
    settings.period = settings.period||10;
    settings.file |= 0;

    Bangle.removeListener('GPS',onGPS);
    var gOn = false;
    if (settings.recording) {
      WIDGETS["gpsrec"].width = 24;
      Bangle.on('GPS', onGPS);
      var n = settings.file.toString(36);
      gpsTrack = require("Storage").open(".gpsrc"+n,"a");
      gOn = true;
    } else {
      WIDGETS["gpsrec"].width = 0;
      gpsTrack = undefined;
    }
    if (gOn != gpsOn) {
      Bangle.setGPSPower(gOn);
      gpsOn = gOn;
    }
  }
  // add the widget
  WIDGETS["gpsrec"]={area:"tl",width:24,draw:draw,reload:function() {
    reload();
    Bangle.drawWidgets(); // relayout all widgets
  },plotTrack:function(m) { // m=instance of openstmap module
    settings = require("Storage").readJSON("gpsrec.json",1)||{};
    settings.file |= 0;
    var n = settings.file.toString(36);
    var f = require("Storage").open(".gpsrc"+n,"r");
    var l = f.readLine(f);
    if (l===undefined) return;
    var c = l.split(",");
    var mp = m.latLonToXY(+c[1], +c[2]);
    g.moveTo(mp.x,mp.y);
    l = f.readLine(f);
    while(l!==undefined) {
      c = l.split(",");
      mp = m.latLonToXY(+c[1], +c[2]);
      g.lineTo(mp.x,mp.y);
      g.fillCircle(mp.x,mp.y,2); // make the track more visible
      l = f.readLine(f);
    }
  }};
  // load settings, set correct widget width
  reload();
})()
