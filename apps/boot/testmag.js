/*
var i = new I2C();
i.setup({scl:45,sda:44});

setInterval(function() {
  i.writeTo(0xC,0x4E);var d = new DataView(i.readFrom(0xC, 7).buffer);
  print(d.getInt16(1),d.getInt16(3),d.getInt16(5));
  // reading this register seems to kick off a new reading
  i.writeTo(0xC,0x3E);i.readFrom(0xC, 1); 
}, 1000);
*/

Bangle.setCompassPower(1);
setInterval(()=>{print(Bangle.getCompass());},1000);
