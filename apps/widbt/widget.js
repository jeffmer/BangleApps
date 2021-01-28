(function(){
  var img_bt = E.toArrayBuffer(atob("CxQBBgDgFgJgR4jZMawfAcA4D4NYybEYIwTAsBwDAA=="));

  function draw() {
    g.reset();
    if (NRF.getSecurityStatus().connected)
      g.setColor(3);
    else
      g.setColor(4);
    g.drawImage(img_bt,10+this.x,2+this.y);
  }
  function changed() {
    WIDGETS["bluetooth"].draw();
    g.flip();// turns screen on
  }
  NRF.on('connect',changed);
  NRF.on('disconnect',changed);
  WIDGETS["bluetooth"]={area:"tr",width:24,draw:draw};
})()
