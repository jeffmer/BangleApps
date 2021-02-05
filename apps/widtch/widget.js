(function(){
    var locked = false;
    var TO = null;
    var lockimage = E.toArrayBuffer(atob("GBgBAAAAAAAAADwAAP8AAMMAAYGAAYGAAYGAAYGAB//gD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wB//gAAAAAAAA"));

    function disable(){
        var i2c = new I2C();
        i2c.setup({sda:33,scl:34});
        i2c.writeTo(0x15,[0xE5,3]);
    }

    function enable(){
        digitalPulse(D35,0,5);
    }

    function draw(){
        g.reset();
        g.setColor(locked?4:0);
        g.drawImage(lockimage,this.x,this.y);
    }

    function lockAfter(){
        if (TO) clearTimeout(TO);
        TO=setTimeout(function(){
            disable();
            locked= true;
            WIDGETS["tch"].draw();
            g.flip();
        },30000)
    }

    Bangle.on("twist",function(){
        enable();
        locked=false;
        WIDGETS["tch"].draw();
        g.flip();
        lockAfter();
    })

  WIDGETS["tch"]={area:"tl",width:24,draw:draw};
  lockAfter();
})()