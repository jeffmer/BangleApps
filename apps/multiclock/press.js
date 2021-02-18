(() => {

    function getFace(){

    function drawPressure(p) {
        g.reset();
        var pstr = p.pressure.toFixed(1)+"hPa";
        var tstr = p.temperature.toFixed(1)+"\xB0C";
        g.clearRect(0,24,175,175);
        g.setColor(7);
        g.setFontAlign(0,-1);
        g.setFont("Vector",32);
        g.drawString(pstr,88,60);
        g.setColor(3);
        g.setFont("Vector",32);
        g.drawString(tstr,88,110);
        g.flip();
      }

    function onSecond(){
       var t = new Date();
       if (t.getSeconds() === 0) Bangle.getPressure().then(drawPressure);
    }

    function startDraw(){
       Bangle.setBarometerPower(1);
       Bangle.getPressure().then(drawPressure);
    }

    function stopDraw(){
        Bangle.setBarometerPower(0);
     }

    return {init:startDraw, tick:onSecond, kill:stopDraw};
    }

  return getFace;

})();