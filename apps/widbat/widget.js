(function(){
  var CHARGING = 2;

  function setWidth() {
    WIDGETS["bat"].width = 30 + (Bangle.isCharging()?16:0);
  }

  function draw() {
    var s = 29;
    var x = this.x, y = this.y;
    if (Bangle.isCharging()) {
      g.setColor(CHARGING).drawImage(atob("DhgBHOBzgc4HOP////////////////////3/4HgB4AeAHgB4AeAHgB4AeAHg"),x,y,{scale:0.8});
      x+=16;
    }
    g.setColor(7);
    g.fillRect(x,y+2,x+s-4,y+17);
    g.clearRect(x+2,y+4,x+s-6,y+15);
    g.fillRect(x+s-3,y+9,x+s,y+11);
    g.setColor(CHARGING).fillRect(x+2,y+4,x+2+E.getBattery()*(s-6)/100,y+15);
    g.setColor(3);
  }

  Bangle.on('charging',function(charging) {
    setWidth();
    Bangle.drawWidgets(); // relayout widgets
    g.flip();
  });

  WIDGETS["bat"]={area:"tr",width:40,draw:draw};
  setInterval(()=>WIDGETS["bat"].draw(), 60000);
  setWidth();
})()

