Bangle.on('twist',function(){
    LED1.set();
    setTimeout(()=>{LED1.reset();},5000);
  });