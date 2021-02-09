    
  (function(){

    function getFace(){  
    
    const Ypos = 40;

    const labels = ["N","NE","E","SE","S","SW","W","NW"];
    var brg=null;

    function drawCompass(course) {
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
     }

    var heading;
    function newHeading(m,h){ 
        "ram"
        var s = Math.abs(m - h);
        var delta = (m>h)?1:-1;
        if (s>=180){s=360-s; delta = -delta;} 
        if (s<2) return h;
        var hd = h + delta*(1 + Math.round(s/5));
        if (hd<0) hd+=360;
        if (hd>360)hd-= 360;
        return hd;
    }

    var CALIBDATA;

    function tiltfixread(O,S){
        "ram"
        var m = Bangle.getCompass();
        var g = Bangle.getAccel();
        m.dx =(m.x-O.x)*S.x; m.dy=(m.y-O.y)*S.y; m.dz=(m.z-O.z)*S.z;
        var d = Math.atan2(-m.dx,m.dy)*180/Math.PI;
        if (d<0) d+=360;
        var phi = Math.atan(-g.x/-g.z);
        var cosphi = Math.cos(phi), sinphi = Math.sin(phi);
        var theta = Math.atan(-g.y/(-g.x*sinphi-g.z*cosphi));
        var costheta = Math.cos(theta), sintheta = Math.sin(theta);
        var xh = m.dy*costheta + m.dx*sinphi*sintheta + m.dz*cosphi*sintheta;
        var yh = m.dz*sinphi - m.dx*cosphi;
        var psi = Math.atan2(yh,xh)*180/Math.PI;
        if (psi<0) psi+=360;
        return psi;
    }

    // Note actual mag is 360-m, error in firmware
    function reading() {
        g.clearRect(0,24,175,175);
        var d = tiltfixread(CALIBDATA.offset,CALIBDATA.scale);
        heading = newHeading(d,heading);
        drawCompass(heading);
        g.setColor(7);
        g.setFont("6x8",2);
        g.setFontAlign(-1,-1);
        g.drawString("o",120,Ypos+80);
        g.setFont("Vector",40);
        var course = Math.round(heading);
        var cs = course.toString();
        cs = course<10?"00"+cs : course<100 ?"0"+cs : cs;
        g.drawString(cs,50,Ypos+90);
        g.setColor(4);
        g.fillPoly([88,Ypos+60,78,Ypos+80,98,Ypos+80]);
        g.setColor(7);
        g.flip();
    }   
    
    var intervalRef;

    function startdraw(){
        Bangle.setCompassPower(1);
        heading=0;
        CALIBDATA = require("Storage").readJSON("magnav.json",1)||null;
        intervalRef = setInterval(reading,200);
    }

    function stopdraw() {
        Bangle.setCompassPower(0);
        if(intervalRef) {intervalRef=clearInterval(intervalRef);}
    }

    return {init:startdraw, kill:stopdraw};
    }

  return getFace;

})();
