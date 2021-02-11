(function(){
    var TO = null;
    var lockimage = E.toArrayBuffer(atob("GBgBAAAAAAAAADwAAP8AAMMAAYGAAYGAAYGAAYGAB//gD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wB//gAAAAAAAA"));


    function draw(){
        g.reset();
        var locked = !Bangle.isLCDOn();
        g.setColor(locked?4:0);
        g.drawImage(lockimage,this.x,this.y);
    }

    Bangle.on("lcdPower",function(){
        WIDGETS["tch"].draw();
        g.flip();
    })

  WIDGETS["tch"]={area:"tl",width:24,draw:draw};
})()