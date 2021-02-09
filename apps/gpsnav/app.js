var loc = require("locale");
loc.speed = function(){ 
  var s = (speed/1.60934);
  return s.toFixed(s<10?1:0)+"mph";
}
const Ypos = 30;

const labels = ["N","NE","E","SE","S","SW","W","NW"];
var brg=0;
var wpindex=0;

function drawCompass(course) {
  g.clearRect(0,Ypos,175,Ypos+50);
  g.setColor(7);
  g.setFont("Vector",18);
  var start = course-90;
  if (start<0) start+=360;
  g.fillRect(16,Ypos+45,160,Ypos+49);
  var xpos = 16;
  var frag = 15 - start%15;
  if (frag<15) xpos+=Math.floor((frag*4)/5); else frag = 0;
  for (var i=frag;i<=180-frag;i+=15){
    var res = start + i;
    if (res%90==0) {
      g.drawString(labels[Math.floor(res/45)%8],xpos-6,Ypos+6);
      g.fillRect(xpos-2,Ypos+25,xpos+2,Ypos+45);
    } else if (res%45==0) {
      g.drawString(labels[Math.floor(res/45)%8],xpos-9,Ypos+6);
      g.fillRect(xpos-2,Ypos+30,xpos+2,Ypos+45);
    } else if (res%15==0) {
      g.fillRect(xpos,Ypos+35,xpos+1,Ypos+45);
    }
    xpos+=12;
  }
  if (brg) {
    var bpos = brg - course;
    if (bpos>180) bpos -=360;
    if (bpos<-180) bpos +=360;
    bpos= Math.floor((bpos*4)/5)+88;
    if (bpos<16) bpos = 8;
    if (bpos>160) bpos = 170;
    g.setColor(3);
    g.fillCircle(bpos,Ypos+45,6);
    }
    g.flip();
}

//displayed heading
var heading = 0;
function newHeading(m,h){ 
    var s = Math.abs(m - h);
    var delta = (m>h)?1:-1;
    if (s>=180){s=360-s; delta = -delta;} 
    if (s<2) return h;
    var hd = h + delta*(1 + Math.round(s/5));
    if (hd<0) hd+=360;
    if (hd>360)hd-= 360;
    return hd;
}

var course =0;
var speed = 0;
var satellites = 0;
var wp;
var dist=0;

function radians(a) {
  return a*Math.PI/180;
}

function degrees(a) {
  var d = a*180/Math.PI;
  return (d+360)%360;
}

function bearing(a,b){
  var delta = radians(b.lon-a.lon);
  var alat = radians(a.lat);
  var blat = radians(b.lat);
  var y = Math.sin(delta) * Math.cos(blat);
  var x = Math.cos(alat)*Math.sin(blat) -
        Math.sin(alat)*Math.cos(blat)*Math.cos(delta);
  return Math.round(degrees(Math.atan2(y, x)));
}

function distance(a,b){
  var x = radians(a.lon-b.lon) * Math.cos(radians((a.lat+b.lat)/2));
  var y = radians(b.lat-a.lat);
  return Math.round(Math.sqrt(x*x + y*y) * 6371000);
}

var selected = false;

function drawN(){
  g.clearRect(0,Ypos+50,175,175);
  g.setColor(4);
  g.fillPoly([88,Ypos+50,78,Ypos+70,98,Ypos+70]);
  var txt = loc.speed(speed);
  g.setColor(7);
  g.setFont("6x8",1);
  g.drawString(txt.substring(txt.length-3),155,Ypos+80);
  g.setFont("Vector",32);
  var cs = course.toString();
  cs = course<10?"00"+cs : course<100 ?"0"+cs : cs;
  g.drawString(cs+"\xB0",6,Ypos+60);
  g.drawString(txt.substring(0,txt.length-3),105,Ypos+60);
  g.setFont("Vector",18);
  var bs = brg.toString();
  bs = brg<10?"00"+bs : brg<100 ?"0"+bs : bs;
  g.setColor(3);
  g.drawString("Brg: "+bs+"\xB0",6,Ypos+90);
  g.drawString("Dist: "+loc.distance(dist),6,Ypos+115);
  g.setColor(selected?3:7);
  g.drawString(wp.name,105,Ypos+110);
  g.setColor(7);
  g.setFont("6x8",1);
  g.drawString("Sats " + satellites.toString(),10,166,true); 
  g.flip();    
}

var savedfix;

function onGPS(fix) {
  savedfix = fix;
  if (fix!==undefined){
    course = isNaN(fix.course) ? course : Math.round(fix.course);
    speed  = isNaN(fix.speed) ? speed : fix.speed;
    satellites = fix.satellites;
  }
  if (candraw) {
    if (fix!==undefined && fix.fix==1){
      dist = distance(fix,wp);
      if (isNaN(dist)) dist = 0;
      brg = bearing(fix,wp);
      if (isNaN(brg)) brg = 0;
    }
    drawN();
  }
}

var intervalRef;

function stopdraw() {
  candraw=false;
  if(intervalRef) {clearInterval(intervalRef);}
}

function startTimers() {
  candraw=true;
  intervalRefSec = setInterval(function() {
    heading = newHeading(course,heading);
    if (course!=heading) drawCompass(heading);
  },200);
}

function drawAll(){
  drawN();
  drawCompass(heading);
}

function startdraw(){
  g.clear();
  Bangle.drawWidgets();
  startTimers();
  drawAll();
}

function setButtons(){
  setWatch(doselect, BTN1, {repeat:true,edge:"falling"});
}

var SCREENACCESS = {
      withApp:true,
      request:function(){
        this.withApp=false;
        stopdraw();
        clearWatch();
      },
      release:function(){
        this.withApp=true;
        startdraw(); 
        setButtons();
      }
} 
 
var waypoints = require("Storage").readJSON("waypoints.json")||[{name:"NONE"}];
wp=waypoints[0];
if (wp.select) wp = waypoints[wp.select];

function nextwp(inc){
  if (!selected) return;
  wpindex+=inc;
  if (wpindex>=waypoints.length) wpindex=0;
  if (wpindex<0) wpindex = waypoints.length-1;
  wp = waypoints[wpindex];
  drawN();
}

Bangle.on('swipe',(dir)=>{
  if (SCREENACCESS.withApp)
    nextwp(dir);
});

function doselect(){
  if (selected && wpindex!=0 && waypoints[wpindex].lat===undefined && savedfix.fix) {
     waypoints[wpindex] ={name:"@"+wp.name, lat:savedfix.lat, lon:savedfix.lon};
     wp = waypoints[wpindex];
     require("Storage").writeJSON("waypoints.json", waypoints);
  }
  waypoints[0].select=wpindex;
  require("Storage").writeJSON("waypoints.json", waypoints);
  selected=!selected;
  drawN();
}

Bangle.on("kill",function(){Bangle.setGPSPower(0);})

g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();
// load widgets can turn off GPS
Bangle.setGPSPower(1);
drawAll();
startTimers();
Bangle.on('GPS', onGPS);
// Toggle selected
setButtons();
