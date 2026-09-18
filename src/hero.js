(function(){
"use strict";
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
const lerp=(a,b,t)=>a+(b-a)*t, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* =====================================================================
   Two plates of one scene, pixel aligned. Outside the lens: the subject
   as the deck presents it. Inside: the same frame with the light on,
   drained to black and white. The lens is doing the actual job.
   ===================================================================== */
const PLATE_SIL="/img/plate-surface.jpg";      // surface, in colour
const PLATE_REV="/img/plate-revealed.jpg";      // revealed, baked to forensic monochrome
const PW=1672, PH=941;
const SUBJ=[906,287,432,462];   // the animal, measured from the difference of the two plates
const HEAD=[952,352];           // horn base and harness, which is the finding
const SUN =[642, 77];           // brightest point of the plate, measured

const cv=$("#hcv"), hero=$("#hero");
let ctx,W=0,H=0,DPR=1,P=null,Q=null,S=null,D=null,narrow=false;
let imgS=null,imgR=null,imgC=null,loaded=0;
let maskC=null, canopy=null, SHAFT=null, motes=[], Qs=null;
/* Tuned by hand on the live page: motes only, at speed. */
const LQ = window.LQ_LIGHT = {on:1, shimmer:0, shafts:0, motes:3, speed:4};
let pan={x:0,y:0,w:0,h:0}, fit={s:1,ox:0,oy:0,bottom:0};
let lens={x:-999,y:-999,tx:-999,ty:-999,r:120,tr:120}, idle=true, idleT=0;

function mk(w,h){const c=document.createElement("canvas");c.width=w;c.height=h;return c;}
function pp(x,y){return [pan.x+fit.ox+x*fit.s, pan.y+fit.oy+y*fit.s];}

function build(){
  if(loaded<(NEEDC?3:2)) return;
  const R=hero.getBoundingClientRect();
  W=Math.max(320,R.width|0); H=Math.max(420,R.height|0);
  narrow=W<900;
  DPR=Math.min(window.devicePixelRatio||1,1.6);
  cv.width=W*DPR; cv.height=H*DPR; cv.style.width=W+"px"; cv.style.height=H+"px";
  ctx=cv.getContext("2d"); ctx.setTransform(DPR,0,0,DPR,0,0);

  pan = narrow ? {x:0,y:0,w:W,h:Math.round(H*0.30)} : {x:0,y:0,w:W,h:H};
  const zoom = narrow ? 2.40 : 1.02;
  const s = Math.max(pan.w/PW, pan.h/PH)*zoom;
  let ox = pan.w*(narrow?0.50:0.64) - HEAD[0]*s;
  let oy = pan.h*(narrow?0.45:0.38) - HEAD[1]*s;
  ox = Math.min(0, Math.max(ox, pan.w-PW*s));
  oy = Math.min(0, Math.max(oy, pan.h-PH*s));
  fit={s,ox,oy,bottom:oy+PH*s};

  P=mk(W*DPR,H*DPR); Q=mk(W*DPR,H*DPR); S=mk(W*DPR,H*DPR); D=mk(W*DPR,H*DPR);
  [P,Q,S,D].forEach(c=>c.getContext("2d").setTransform(DPR,0,0,DPR,0,0));
  photo(P.getContext("2d"));
  scrim(Q.getContext("2d"));
  P.getContext("2d").drawImage(Q,0,0,W,H);
  revealed(S.getContext("2d"));
  findings(D.getContext("2d"));
  if(!RM){ if(LQ.shimmer>0) buildCanopy(); if(LQ.shafts>0 && !SHAFT) buildShaft();
           if(!motes.length) initMotes();
           AMB=mk(Math.max(2,W>>1),Math.max(2,H>>1)); ambT=-1e9;
           /* the mask is only ever used at half size, so resample it once here
              rather than on every regeneration */
           Qs=mk(AMB.width,AMB.height); buildAmbMask(); }
  if(lens.tx<0){const h0=pp(HEAD[0],HEAD[1]);lens.tx=lens.x=h0[0];lens.ty=lens.y=h0[1];}
  lens.tr=lens.r=Math.min(W,H)*(narrow?0.155:0.15);
  window.__head=pp(HEAD[0],HEAD[1]);
}

function plate(x,im){
  x.save();
  x.beginPath(); x.rect(pan.x,pan.y,pan.w,pan.h); x.clip();
  x.drawImage(im, pan.x+fit.ox, pan.y+fit.oy, PW*fit.s, PH*fit.s);
  x.restore();
}


/* =====================================================================
   The air in the photograph. None of this touches the plates, so the
   two-plate registration the lens depends on is untouched. It also sits
   under the lens on purpose: the instrument strips the atmosphere out.
   ===================================================================== */
function buildMask(){
  if(maskC||!imgC||!imgC.width) return;
  const w=imgC.width, h=imgC.height, c=mk(w,h), x=c.getContext("2d");
  x.drawImage(imgC,0,0);
  let d; try{ d=x.getImageData(0,0,w,h); }catch(e){ return; }
  const p=d.data;
  for(let i=0;i<p.length;i+=4){
    const v=p[i];                 /* the file carries the mask as luminance */
    p[i]=255; p[i+1]=228; p[i+2]=176; p[i+3]=v;
  }
  x.putImageData(d,0,0); maskC=c;
}

function buildCanopy(){
  buildMask(); if(!maskC) return;
  /* half resolution: it is a soft additive wash, the detail is not readable */
  const w=Math.max(2,W>>1), h=Math.max(2,H>>1);
  canopy=mk(w,h);
  const x=canopy.getContext("2d");
  x.scale(0.5,0.5);
  x.drawImage(maskC, pan.x+fit.ox, pan.y+fit.oy, PW*fit.s, PH*fit.s);
  x.globalCompositeOperation="destination-in";
  if(narrow){
    const v=x.createLinearGradient(0,pan.y,0,pan.y+pan.h);
    v.addColorStop(0,"rgba(0,0,0,.6)"); v.addColorStop(.40,"rgba(0,0,0,1)");
    v.addColorStop(1,"rgba(0,0,0,0)");
    x.fillStyle=v; x.fillRect(0,0,W,H);
  } else {
    const v=x.createLinearGradient(0,0,0,H);
    v.addColorStop(0,"rgba(0,0,0,1)"); v.addColorStop(.55,"rgba(0,0,0,1)");
    v.addColorStop(.80,"rgba(0,0,0,.72)"); v.addColorStop(1,"rgba(0,0,0,.2)");
    x.fillStyle=v; x.fillRect(0,0,W,H);
  }
  x.globalCompositeOperation="source-over";
}

function buildAmbMask(){
  /* Only the headline needs holding back. The nav band and the floor band in the
     visual scrim were cancelling the light in the two places it actually lives. */
  const x=Qs.getContext("2d");
  x.setTransform(1,0,0,1,0,0);
  x.clearRect(0,0,Qs.width,Qs.height);
  x.scale(Qs.width/W, Qs.height/H);
  if(narrow){
    const v=x.createLinearGradient(0,pan.y+pan.h*0.52,0,pan.y+pan.h);
    v.addColorStop(0,"rgba(0,0,0,0)"); v.addColorStop(1,"rgba(0,0,0,1)");
    x.fillStyle=v; x.fillRect(0,pan.y+pan.h*0.52,W,H-(pan.y+pan.h*0.52));
  } else {
    const g=x.createLinearGradient(0,0,W*0.70,0);
    g.addColorStop(0,"rgba(0,0,0,.92)"); g.addColorStop(.34,"rgba(0,0,0,.72)");
    g.addColorStop(.64,"rgba(0,0,0,.30)"); g.addColorStop(1,"rgba(0,0,0,0)");
    x.fillStyle=g; x.fillRect(0,0,W*0.70,H);
    const b=x.createLinearGradient(0,H*0.84,0,H);
    b.addColorStop(0,"rgba(0,0,0,0)"); b.addColorStop(1,"rgba(0,0,0,.85)");
    x.fillStyle=b; x.fillRect(0,H*0.84,W,H*0.16);
    const n=x.createLinearGradient(0,0,0,86);
    n.addColorStop(0,"rgba(0,0,0,.55)"); n.addColorStop(1,"rgba(0,0,0,0)");
    x.fillStyle=n; x.fillRect(0,0,W,86);
  }
}

function buildShaft(){
  const w=192,h=768,c=mk(w,h),x=c.getContext("2d");
  const g=x.createLinearGradient(0,0,w,0);
  g.addColorStop(0,"rgba(255,226,178,0)");
  g.addColorStop(.40,"rgba(255,231,192,.48)");
  g.addColorStop(.50,"rgba(255,241,214,1)");
  g.addColorStop(.60,"rgba(255,231,192,.48)");
  g.addColorStop(1,"rgba(255,226,178,0)");
  x.fillStyle=g; x.fillRect(0,0,w,h);
  x.globalCompositeOperation="destination-in";
  const v=x.createLinearGradient(0,0,0,h);
  v.addColorStop(0,"rgba(0,0,0,0)"); v.addColorStop(.09,"rgba(0,0,0,1)");
  v.addColorStop(.46,"rgba(0,0,0,.44)"); v.addColorStop(1,"rgba(0,0,0,0)");
  x.fillStyle=v; x.fillRect(0,0,w,h);
  SHAFT=c;
}

/* angle in radians off vertical, offsets as a fraction of the canvas */
const SHAFTS=[
  {dx:-.055,dy:-.10,a: .13,w:.085,len:1.05,al:.085,f1:.000061,p1:0.4,f2:.000109,p2:1.1},
  {dx: .028,dy:-.13,a: .20,w:.055,len:0.92,al:.070,f1:.000047,p1:2.2,f2:.000083,p2:3.4},
  {dx: .108,dy:-.08,a: .27,w:.120,len:1.12,al:.055,f1:.000039,p1:4.1,f2:.000067,p2:0.3},
  {dx:-.128,dy:-.12,a: .07,w:.048,len:0.86,al:.062,f1:.000073,p1:5.3,f2:.000127,p2:2.7},
  {dx: .196,dy:-.05,a: .33,w:.070,len:0.98,al:.044,f1:.000055,p1:1.6,f2:.000095,p2:4.8}
];

function initMotes(){
  const n = narrow?22:58;
  motes=[];
  for(let i=0;i<n;i++) motes.push({
    x:.06+Math.random()*.92,
    y:Math.random(), r:.45+Math.random()*1.25,
    vy:-(0.0000042+Math.random()*0.0000118),
    wob:.004+Math.random()*.013, f:.00011+Math.random()*.00026,
    p:Math.random()*6.283, a:.16+Math.random()*.40
  });
}

let AMB=null, ambT=-1e9;

function ambient(t){
  if(RM||!AMB||!LQ.on) return;
  const ax=AMB.getContext("2d");
  /* the slowest period here is about a minute, so a third of the frames
     is far more than this needs, and it keeps the cost off the main loop */
  const tt=t*LQ.speed;
  if(t-ambT>44 || LQ.dirty){ LQ.dirty=0;
    ambT=t;
    ax.setTransform(1,0,0,1,0,0);
    ax.clearRect(0,0,AMB.width,AMB.height);
    ax.save(); ax.scale(.5,.5);
    ax.globalCompositeOperation="lighter";

    if(canopy && LQ.shimmer>0){
      const sh=LQ.shimmer;
      ax.globalAlpha=(.150+.105*Math.sin(tt*.00040))*sh;
      ax.drawImage(canopy, Math.sin(tt*.00031)*3.4, Math.cos(tt*.00023)*2.4, W, H);
      ax.globalAlpha=(.105+.088*Math.sin(tt*.00026+2.3))*sh;
      ax.drawImage(canopy, Math.sin(tt*.00018+1.7)*-4.6, Math.cos(tt*.00036+0.9)*3.2, W, H);
    }

    if(SHAFT && LQ.shafts>0){
      const p=pp(SUN[0],SUN[1]), L=Math.max(W,H)*1.5;
      for(let i=0;i<SHAFTS.length;i++){
        const s=SHAFTS[i];
        ax.save();
        ax.translate(p[0]+s.dx*W, p[1]+s.dy*H);
        ax.rotate(s.a+Math.sin(tt*s.f1+s.p1)*0.026);
        ax.globalAlpha=s.al*(.34+.66*(.5+.5*Math.sin(tt*s.f2+s.p2)))*2.9*LQ.shafts;
        const w=s.w*W; ax.drawImage(SHAFT,-w/2,-L*.05,w,L*s.len);
        ax.restore();
      }
    }

    ax.fillStyle="rgb(255,238,206)";
    for(let i=0;i<motes.length;i++){
      const m=motes[i];
      let y=(m.y+tt*m.vy)%1; if(y<0)y+=1;
      const x=m.x+Math.sin(tt*m.f+m.p)*m.wob;
      const side=clamp((x-.06)/.16,0,1);
      const depth=clamp((.80-y)/.22,0,1)*clamp(y/.06,0,1);
      const al=m.a*(.30+.70*(.5+.5*Math.sin(tt*m.f*3.1+m.p*2)))*side*depth*1.5*LQ.motes;
      if(al<=.005) continue;
      ax.globalAlpha=al;
      ax.beginPath();
      ax.arc(pan.x+x*pan.w, pan.y+y*pan.h, m.r*1.4, 0, 6.283);
      ax.fill();
    }
    /* the type protection doubles as the light's own mask: wherever the scrim
       darkens the photograph, it darkens the air in it by the same amount */
    ax.globalCompositeOperation="destination-out";
    ax.globalAlpha=1;
    if(Qs) ax.drawImage(Qs,0,0,W,H);
    ax.restore();
  }

  /* one blend, and only over the part of the frame the light can reach */
  const x0 = pan.x;
  const y0 = pan.y, w1 = (pan.x+pan.w)-x0, h1 = pan.h;
  if(w1<=0||h1<=0) return;
  ctx.save();
  ctx.globalCompositeOperation="lighter";
  ctx.globalAlpha=1;
  ctx.drawImage(AMB, x0*.5, y0*.5, w1*.5, h1*.5, x0, y0, w1, h1);
  ctx.restore();
}

function photo(x){
  x.fillStyle="#000"; x.fillRect(0,0,W,H);
  plate(x,imgS);
}

/* Everything that protects the type. It is a separate layer so the ambient
   light can live in the photograph and still be held off the headline. */
function scrim(x){
  x.clearRect(0,0,W,H);
  if(narrow){
    const bt=Math.min(pan.h*0.66, fit.bottom-pan.h*0.22);
    const tt=x.createLinearGradient(0,0,0,H*0.11);
    tt.addColorStop(0,"rgba(0,0,0,.72)"); tt.addColorStop(1,"rgba(0,0,0,0)");
    x.fillStyle=tt; x.fillRect(0,0,W,H*0.11);
    const g=x.createLinearGradient(0,bt,0,fit.bottom);
    g.addColorStop(0,"rgba(0,0,0,0)"); g.addColorStop(.5,"rgba(0,0,0,.62)"); g.addColorStop(1,"rgba(0,0,0,1)");
    x.fillStyle=g; x.fillRect(0,bt,W,H-bt);
    x.fillStyle="#000"; x.fillRect(0,fit.bottom-1,W,H-fit.bottom+2);
  } else {
    const g=x.createLinearGradient(0,0,W*0.66,0);
    g.addColorStop(0,"rgba(0,0,0,.95)"); g.addColorStop(.30,"rgba(0,0,0,.84)");
    g.addColorStop(.62,"rgba(0,0,0,.42)"); g.addColorStop(1,"rgba(0,0,0,0)");
    x.fillStyle=g; x.fillRect(0,0,W*0.66,H);
    const t=x.createLinearGradient(0,0,0,H*0.16);
    t.addColorStop(0,"rgba(0,0,0,.66)"); t.addColorStop(1,"rgba(0,0,0,0)");
    x.fillStyle=t; x.fillRect(0,0,W,H*0.16);
    const b=x.createLinearGradient(0,H*0.80,0,H);
    b.addColorStop(0,"rgba(0,0,0,0)"); b.addColorStop(.55,"rgba(0,0,0,.58)"); b.addColorStop(1,"rgba(0,0,0,1)");
    x.fillStyle=b; x.fillRect(0,H*0.80,W,H*0.20+2);
    const v=x.createRadialGradient(W*0.60,H*0.48,Math.min(W,H)*0.30,W*0.60,H*0.48,Math.max(W,H)*0.78);
    v.addColorStop(0,"rgba(0,0,0,0)"); v.addColorStop(1,"rgba(0,0,0,.60)");
    x.fillStyle=v; x.fillRect(0,0,W,H);
    x.save();
    x.font="400 9.5px 'JetBrains Mono',monospace";
    x.fillStyle="rgba(255,255,255,.40)"; x.textAlign="right";
    x.fillText("PLATE 01  /  SUBJECT IN SITU  /  UNVERIFIED", W-30, H-34);
    x.textAlign="left"; x.restore();
  }
}

function revealed(x){
  x.fillStyle="#000"; x.fillRect(0,0,W,H);
  plate(x,imgR);
  x.save();
  x.beginPath(); x.rect(pan.x,pan.y,pan.w,pan.h); x.clip();
  x.strokeStyle="rgba(255,255,255,.10)"; x.lineWidth=.7;
  const st=Math.max(30,pan.w/20);
  x.beginPath();
  for(let gx=pan.x;gx<pan.x+pan.w;gx+=st){x.moveTo(gx,pan.y);x.lineTo(gx,pan.y+pan.h);}
  for(let gy=pan.y;gy<pan.y+pan.h;gy+=st){x.moveTo(pan.x,gy);x.lineTo(pan.x+pan.w,gy);}
  x.stroke();
  x.restore();
}

/* Annotations, held back until the lens is actually on the head. */
function findings(x){
  x.clearRect(0,0,W,H);
  const h0=pp(HEAD[0],HEAD[1]), hx=h0[0], hy=h0[1];
  const k=narrow?0.78:1;

  // bracket the attachment, not the animal
  const a=pp(898,272), b=pp(1042,404);
  x.save();
  x.strokeStyle="rgba(255,255,255,.92)"; x.lineWidth=1.2;
  const L=16*k;
  [[a[0],a[1],1,1],[b[0],a[1],-1,1],[a[0],b[1],1,-1],[b[0],b[1],-1,-1]].forEach(c=>{
    x.beginPath(); x.moveTo(c[0]+c[2]*L,c[1]); x.lineTo(c[0],c[1]); x.lineTo(c[0],c[1]+c[3]*L); x.stroke();
  });

  // on a phone the glass is too small to carry a label; the strap speaks for itself
  if(narrow){ x.restore(); return; }

  x.restore();
}

function draw(t){
  if(!ctx){requestAnimationFrame(draw);return;}
  if(idle && !RM){
    const k=t*0.00026;
    /* the finding is at the head, so the unattended lens never wanders off it */
    const cx = HEAD[0] + 14 + Math.sin(k)*SUBJ[2]*(narrow?0.20:0.14);
    const cy = HEAD[1] + 10 + Math.cos(k*0.8)*SUBJ[3]*(narrow?0.09:0.085);
    const p=pp(cx,cy); lens.tx=p[0]; lens.ty=p[1];
  }
  lens.x=lerp(lens.x,lens.tx,.14); lens.y=lerp(lens.y,lens.ty,.14); lens.r=lerp(lens.r,lens.tr,.10);
  const R=lens.r, Z=1.20;

  ctx.globalCompositeOperation="source-over";
  ctx.clearRect(0,0,W,H);
  ctx.drawImage(P,0,0,W,H);
  ambient(t);

  ctx.save();
  ctx.beginPath(); ctx.arc(lens.x,lens.y,R,0,6.2832); ctx.clip();
  ctx.fillStyle="#000"; ctx.fillRect(lens.x-R,lens.y-R,R*2,R*2);
  ctx.translate(lens.x,lens.y); ctx.scale(Z,Z); ctx.translate(-lens.x,-lens.y);
  ctx.drawImage(S,0,0,W,H);
  ctx.restore();

  const hq=pp(HEAD[0],HEAD[1]);
  const dist=Math.hypot(lens.x-hq[0], lens.y-hq[1]);
  const det=clamp(1-(dist-R*0.28)/(R*0.85),0,1);
  if(det>0){
    ctx.save();
    ctx.beginPath(); ctx.arc(lens.x,lens.y,R,0,6.2832); ctx.clip();
    ctx.translate(lens.x,lens.y); ctx.scale(Z,Z); ctx.translate(-lens.x,-lens.y);
    ctx.globalAlpha=det; ctx.drawImage(D,0,0,W,H);
    ctx.restore();

    /* The callout belongs to the instrument, not to the animal, so it is
       placed against the glass and stays whole however the lens sits. */
    if(!narrow && det>0.35){
      ctx.save();
      ctx.beginPath(); ctx.arc(lens.x,lens.y,R,0,6.2832); ctx.clip();
      ctx.globalAlpha=clamp((det-0.35)/0.35,0,1);
      const ly=lens.y-R*0.60, txt="APPLIED, NOT GROWN";
      ctx.font="500 10.5px 'JetBrains Mono',monospace";
      const tw=ctx.measureText(txt).width;
      ctx.strokeStyle="rgba(255,255,255,.75)"; ctx.lineWidth=1.1;
      ctx.beginPath(); ctx.moveTo(lens.x,ly+12); ctx.lineTo(hq[0],hq[1]-16); ctx.stroke();
      ctx.fillStyle="#fff"; ctx.fillRect(lens.x-tw/2-11, ly-13, tw+22, 24);
      ctx.fillStyle="#000"; ctx.textAlign="center";
      ctx.fillText(txt, lens.x, ly+4);
      ctx.textAlign="left";
      ctx.restore();
    }
  }

  ctx.save();
  ctx.strokeStyle="rgba(255,255,255,.9)"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.arc(lens.x,lens.y,R,0,6.2832); ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,.24)";
  ctx.beginPath(); ctx.arc(lens.x,lens.y,R+5,0,6.2832); ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,.55)";
  const tk=R*0.07;
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){
    ctx.beginPath();
    ctx.moveTo(lens.x+d[0]*(R-tk),lens.y+d[1]*(R-tk));
    ctx.lineTo(lens.x+d[0]*(R+tk*0.5),lens.y+d[1]*(R+tk*0.5)); ctx.stroke();
  });
  ctx.font="400 9px 'JetBrains Mono',monospace";
  ctx.shadowColor="rgba(0,0,0,.9)"; ctx.shadowBlur=7;
  ctx.fillStyle="rgba(255,255,255,.82)";
  ctx.fillText(det>0.5?"DETAIL 01 / ATTACHMENT":"PLATE 02 / REVEALED", lens.x-R+2, lens.y-R-9);
  ctx.shadowBlur=0;
  ctx.restore();
  requestAnimationFrame(draw);
}

function onMove(e){
  const R=hero.getBoundingClientRect();
  if(e.clientY>R.bottom||e.clientY<R.top){idle=true;return;}
  idle=false; clearTimeout(idleT); idleT=setTimeout(function(){idle=true;},2800);
  lens.tx=e.clientX-R.left; lens.ty=e.clientY-R.top;
  const h=$("#hint"); if(h)h.classList.add("gone");
}

const NEEDC = LQ.shimmer>0;
function ready(){ loaded++; if(loaded>=(NEEDC?3:2)) build(); }
imgS=new Image(); imgS.onload=ready; imgS.onerror=ready; imgS.src=PLATE_SIL;
imgR=new Image(); imgR.onload=ready; imgR.onerror=ready; imgR.src=PLATE_REV;
if(NEEDC){ imgC=new Image(); imgC.onload=ready; imgC.onerror=ready; imgC.src=CANOPY; }
requestAnimationFrame(draw);
addEventListener("pointermove",onMove,{passive:true});
let rt; addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(build,220);},{passive:true});
})();
