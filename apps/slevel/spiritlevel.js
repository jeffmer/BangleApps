g.clear();
var old = {x:0,y:0};
Bangle.on('accel',function(v) {
  var max = Math.max(Math.abs(v.x),Math.abs(v.y),Math.abs(v.z));
  if (Math.abs(v.y)==max) {
    v = {x:v.x,y:v.z,z:v.y};
  } else if (Math.abs(v.x)==max) {
    v = {x:v.z,y:v.y,z:v.x};
  }

  var d = Math.sqrt(v.x*v.x+v.y*v.y);
  var ang = Math.atan2(d,Math.abs(v.z))*180/Math.PI;
  
  g.setColor(7);
  g.setFont("6x8",2);
  g.setFontAlign(0,-1);
  g.clearRect(45,0,135,16);
  g.drawString(ang.toFixed(1),88,0);
  var n = {
    x:E.clip(88+v.x*256,4,172),
    y:E.clip(88+v.y*256,4,172)};
  g.clearRect(old.x-3,old.y-3,old.x+6,old.y+6);
  g.setColor(7);
  g.fillRect(n.x-3,n.y-3,n.x+6,n.y+6);
  g.setColor(3);
  g.drawCircle(88,88,15);
  g.drawCircle(88,88,45);
  g.drawCircle(88,88,75);
  old = n;
});
