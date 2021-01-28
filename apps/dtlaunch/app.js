/* Desktop launcher
*
*/

var s = require("Storage");
var apps = s.list(/\.info$/).map(app=>{var a=s.readJSON(app,1);return a&&{name:a.name,type:a.type,icon:a.icon,sortorder:a.sortorder,src:a.src};}).filter(app=>app && (app.type=="app" || app.type=="clock" || !app.type));
apps.sort((a,b)=>{
  var n=(0|a.sortorder)-(0|b.sortorder);
  if (n) return n; // do sortorder first
  if (a.name<b.name) return -1;
  if (a.name>b.name) return 1;
  return 0;
});

var Napps = apps.length;
var Npages = Math.ceil(Napps/4);
var maxPage = Npages-1;
var selected = -1;
var oldselected = -1;
var page = 0;

function draw_icon(p,n,selected) {
    var x = 8+(n%2)*80; 
    var y = n>1?93:10;
    (selected?g.setColor(1):g.setColor(0)).fillRect(x,y,x+79,y+82);
    g.drawImage(s.read(apps[p*6+n].icon),x+10,y+5,{scale:1.25});
    g.setColor(-1).setFontAlign(0,-1,0).setFont("6x8",1);
    var txt =  apps[p*6+n].name.split(" ");
    for (var i = 0; i < txt.length; i++) {
        txt[i] = txt[i].trim();
        g.drawString(txt[i],x+40,y+63+i*8);
    }
}

function drawPage(p){
    g.clearRect(0,0,175,175);
    g.setFont("6x8",1).setFontAlign(0,-1,0).setColor(7).drawString("SAMQ3 ("+(p+1)+"/"+Npages+")",88,1);
    for (var i=0;i<4;i++) {
        if (!apps[p*4+i]) return i;
        draw_icon(p,i,selected==i);
    }
    g.flip();
}

Bangle.on("swipe",(dir)=>{
    selected = 0;
    oldselected=-1;
    if (dir<0){
        ++page; if (page>maxPage) page=0;
        drawPage(page);
    } else {
        --page; if (page<0) page=maxPage;
        drawPage(page);
    }  
});

function isTouched(p,n){
    if (n<0 || n>3) return false;
    var x1 = 8+(n%2)*80; var y1 = n>1?93:10;
    var x2 = x1+79; var y2 = y1+82;
    return (p.x>x1 && p.y>y1 && p.x<x2 && p.y<y2);
}

E.on("touch",(p)=>{
    var i;
    for (i=0;i<4;i++){
        if((page*4+i)<Napps){
            if (isTouched(p,i)) {
                draw_icon(page,i,true);
                if (selected>=0) {
                    if (selected!=i){
                        draw_icon(page,selected,false);
                    } else {
                      if (D17.read()) reset(); else load(apps[page*6+i].src);
                    }
                }
                selected=i;
                break;
            }
        }
    }
    if ((i==6 || (page*4+i)>Napps) && selected>=0) {
        draw_icon(page,selected,false);
        selected=-1;
    }
});

drawPage(0);
