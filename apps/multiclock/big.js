(() => {

    function getFace(){

    function setClockFont(g,name){
        var s=require("Storage");
        g.setFontCustom(s.read("fnt"+name+".bin"),0x30,s.read("fnt"+name+".wdt"),70);
    }

    function drawTime(d) {
        g.reset();
        var da = d.toString().split(" ");
        var time = da[4].substr(0, 5).split(":");
        var hours = time[0],
          minutes = time[1];
        g.clearRect(0,24,175,175);
        g.setColor(7);
        g.setFontAlign(0,-1);
        //g.setFont("Vector",90);
        setClockFont(g,"36x70");
        g.drawString(hours,88,24,true);
        g.drawString(minutes,88,100,true);
        g.flip();
      }

    function onSecond(){
       var t = new Date();
       if (t.getSeconds() === 0) drawTime(t);
    }

    function drawAll(){
       drawTime(new Date());
    }

    return {init:drawAll, tick:onSecond};
    }

  return getFace;

})();