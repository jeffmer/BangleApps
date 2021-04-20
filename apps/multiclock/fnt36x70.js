var fname="36x70";
if (!require("Storage").read("fnt"+fname+".bin")){ (function(){
  E.kickWatchdog();
  var b=[];
  var push=function(a,s){
  a.push(require("heatshrink").decompress(atob(s)));
  };
  push(b,"/H/AAsH/gIGh/+BA0fA43/n4I+j5qGnwI/BGjF/BA/+BA0f/gIGh/4BA0HA=");
  push(b,"AH0YBA8cBA8eBA8fBDP/AA0/BH3+BA/8BA/4BA7Y/AFY");
  push(b,"jADC/H/AAMHjgIC/gICh8eBAX+BAUfj4ICA4X/n4I/BAU/AYU+BH4I0QQgI/BAX+BARUDj38BAUPBAUO/AICg4ICgwA=");
  push(b,"jADCn4DCg0cBA0OjwIGj0fBA0+BH4I/BHn/AA0/BH3+BA0f/gIGh/4BA0HA=");
  push(b,"/H/AAM/BAf8BA/+BA4HCBH4IEAAYI/BHKGDRQgI+/wIH/gIH/AIH");
  push(b,"/H/AAM/A4UG/gIGh3+BA0eA4QIEnwI+j4ECBH4I9RQgI+jwIC/wICj8cBAX8BAUPjAIC/AICg4A=");
  push(b,"/H/AAsH/gIGh/+BA0fA43/n4I+j5mCn4DCnwI/BHCGIBHUeBAX+BAUfjgIC/gICh8YBAX4BAUHA=");
  push(b,"ABEYBA8cBA8eBA8fBH4I/BHf/AA0/BH3+BA/8BA/4BA4");
  push(b,"/H//9/4ADB/8H/gEC8ADCh/+AgXxAYUfAYQIEn4ID/YIHAAYItj5mCn4DCnwI/BGiz1BBj7E/wEC+IDCj/8AgXgAYUP/ADBv/ABAUHA=");
  push(b,"/H/AAMHA4UG/gICh4ICh3+BAUfBAUeA4X/n4ICnwI+JgYI/BHKGDRQgI+/wIGj/8BA0P/AIGg4A=");
  push(b,"ACc4AYUHBAd8AQOAh4ID/wCB4EfBAf/gMA8E/BBgaIFhA+IAB4A=");
  var fg=Graphics.createArrayBuffer(72,36,1); // one font letter
  fg.setRotation(3,1);
  var dgw=36+4; // 36 + 4 pixel space
  var fnt=Graphics.createArrayBuffer(70,dgw*11,1,{msb:true}); // whole font
  fnt.setRotation(3,1);
  var w=new Uint8Array([dgw,dgw,dgw,dgw,dgw,dgw,dgw,dgw,dgw,dgw,12+2]); // widths, colon is thinner
  E.kickWatchdog();
  for (x=0,i=0;i<11;i++){fg.buffer=b[i];fnt.drawImage(fg.asImage(),x,0);x+=w[i];}
  var s=require("Storage");
  E.kickWatchdog();
  s.write("fnt"+fname+".bin",fnt.buffer);
  s.write("fnt"+fname+".wdt",w.buffer);
})(); // use anonymous function to free all memory inside
}

