var FACES = [];
var iface = 0;
var STOR = require("Storage");
STOR.list(/\.face\.js$/).forEach(face=>FACES.push(eval(require("Storage").read(face))));
var face = FACES[iface]();
var intervalRefSec;
var ticks = 0;

function stopdraw() {
  if(intervalRefSec) {intervalRefSec=clearInterval(intervalRefSec);}
  g.clear();
}

function startdraw() {
  g.reset();
  face.init();
  Bangle.drawWidgets();
  intervalRefSec = setInterval(()=>{
    face.tick();
    ++ticks;
    if (ticks==0){
        Bangle.drawWidgets();
        ticks=0;
    }
  },1000);
}

var SCREENACCESS = {
  withApp:true,
  request:function(){
    this.withApp=false;
    stopdraw();
  },
  release:function(){
    this.withApp=true;
    startdraw(); 
  }
}; 

function setControl(){
  function newFace(inc){
    var n = FACES.length-1;
    iface+=inc;
    iface = iface>n?0:iface<0?n:iface;
    stopdraw();
    face = FACES[iface]();
    startdraw();
  }
  Bangle.on('swipe',(dir)=>{
    if (SCREENACCESS.withApp)
      newFace(dir);
  });
}

Bangle.loadWidgets();
g.clear();
startdraw();
setControl();
setWatch(function(){load("magnav.app.js");},BTN1,{edge:"falling"});



