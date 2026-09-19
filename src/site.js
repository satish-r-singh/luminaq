/* ===================== cursor ===================== */
/* Shared helpers. hero.js has its own copy; each file is a closed module so
   they never collide and either can be loaded without the other. */
const $  = (s,r)=>(r||document).querySelector(s);
const $$ = (s,r)=>[...(r||document).querySelectorAll(s)];
const lerp  = (a,b,t)=>a+(b-a)*t;
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));

(function(){
  if(matchMedia("(hover:none)").matches||innerWidth<=860) return;
  const c=$("#cur"); let x=innerWidth/2,y=innerHeight/2,tx=x,ty=y,on=false;
  addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY;if(!on){on=true;c.classList.add("on");}
    const el=document.elementFromPoint(e.clientX,e.clientY);
    const link=el&&el.closest("a,button,input[type=range],.vrow,.dchip,.pg,.dgopt");
    const inHero=el&&el.closest("#hero");
    c.classList.toggle("lens",!!inHero&&!link);
    c.classList.toggle("link",!!link&&!inHero);
  },{passive:true});
  (function loop(){x=lerp(x,tx,.2);y=lerp(y,ty,.2);c.style.transform=`translate3d(${x}px,${y}px,0)`;requestAnimationFrame(loop);})();
})();

/* ===================== reveals ===================== */
const revealMap=new Map();
function regReveal(el,host){ if(!revealMap.has(host)) revealMap.set(host,[]); revealMap.get(host).push(el); }
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return; io.unobserve(e.target);
  (revealMap.get(e.target)||[e.target]).forEach(t=>t.classList.add("in"));
}),{threshold:.12,rootMargin:"0px 0px -6% 0px"});
/* clip-path zeroes an element's own intersection rect, so .rv items are measured
   through a plain wrapper that shares their geometry. */
$$(".rv").forEach(el=>{
  const w=document.createElement("div"); w.className="rvhost";
  el.parentNode.insertBefore(w,el); w.appendChild(el); regReveal(el,w);
});
$$(".rvu,.rvf").forEach(el=>regReveal(el,el));
let ri=0; revealMap.forEach((els,host)=>{
  els.forEach(el=>el.style.transitionDelay=(Math.min(ri%5,4)*70)+"ms"); ri++; io.observe(host);
});
/* safety net: motion must never be the reason content is unreadable */
setTimeout(()=>$$(".rv,.rvu,.rvf").forEach(el=>el.classList.add("in")),2600);
addEventListener("beforeprint",()=>$$(".rv,.rvu,.rvf").forEach(el=>el.classList.add("in")));

/* ===================== nav + progress spine ===================== */
const nav=$("#nav");
addEventListener("scroll",()=>{nav.classList.toggle("stuck",scrollY>60);},{passive:true});

(function(){
  const rail=$("#rail"); if(!rail) return;
  const tks=$$("#rail .tk"), fill=$("#rail .fill"), spine=$("#rail .spine");
  const secs=$$("[data-rail]").filter(s=>+s.dataset.rail>=0)
              .sort((a,b)=>a.dataset.rail-b.dataset.rail);
  let H=1, SH=1, pos=[], raf=0;

  function measure(){
    H=Math.max(1,document.documentElement.scrollHeight);
    SH=spine.clientHeight||1;
    pos=secs.map(s=>Math.max(0,Math.min(1,s.offsetTop/H)));
    tks.forEach((t,i)=>{ if(pos[i]!=null) t.style.top=(pos[i]*SH).toFixed(1)+"px"; });
  }
  function paint(){
    raf=0;
    /* the fill head sits where the eye is, so it crosses a tick exactly
       when that section reaches the middle of the screen */
    const head=Math.max(0,Math.min(1,(scrollY+innerHeight*0.5)/H));
    fill.style.height=(head*SH).toFixed(1)+"px";
    let k=-1; for(let i=0;i<pos.length;i++){ if(head>=pos[i]) k=i; }
    tks.forEach((t,i)=>t.classList.toggle("on",i===k));
  }
  function refresh(){ measure(); paint(); }
  addEventListener("scroll",()=>{ if(!raf) raf=requestAnimationFrame(paint); },{passive:true});
  addEventListener("resize",refresh,{passive:true});
  addEventListener("load",refresh);
  if(window.ResizeObserver) new ResizeObserver(refresh).observe(document.body);
  refresh();
  setTimeout(refresh,700); setTimeout(refresh,2800);
})();

/* ===================== commit bars ===================== */
(function(){
  const g=$("#f0 .bars"); if(!g)return;
  const h=[6,4,9,5,3,7,4,6,3,8,5,4,7,3,5,6,4,3,5,8,96,132,118,88];
  const NS="http://www.w3.org/2000/svg";
  h.forEach((v,i)=>{
    const r=document.createElementNS(NS,"rect");
    r.setAttribute("x",24+i*22); r.setAttribute("width",12);
    r.setAttribute("y",212-v); r.setAttribute("height",v);
    r.setAttribute("class","bar"+(i>=20?" hot":""));
    r.style.transitionDelay=(i*26)+"ms"; g.appendChild(r);
  });
})();

/* ===================== vectors ===================== */
$$(".vrow").forEach(b=>b.addEventListener("click",()=>{
  const v=b.dataset.v;
  $$(".vrow").forEach(r=>r.classList.toggle("on",r===b));
  $$(".vpane").forEach(p=>{const m=p.dataset.p===v;if(!m)p.classList.remove("on");});
  requestAnimationFrame(()=>$$(".vpane").forEach(p=>{if(p.dataset.p===v)p.classList.add("on");}));
}));

/* ===================== figure viewer ===================== */
/* The vector figures are drawn on a 560 unit grid. On a phone they render whole
   but small, so nothing is ever cropped, and this shows one at a size where the
   labels are readable. The SVG is cloned rather than moved, so the figure in the
   page is untouched. The stage carries .on because the figure animations key off
   an ancestor with that class. */
(function(){
  const view=$("#figview"); if(!view) return;
  const stage=$(".figstage",view), shutBtn=$("#figclose");
  if(!stage||!shutBtn) return;
  let opener=null;

  function open(fig,btn){
    const svg=fig.querySelector("svg.fig"), cap=fig.querySelector(".cap");
    stage.innerHTML="";
    if(svg) stage.appendChild(svg.cloneNode(true));
    if(cap) stage.appendChild(cap.cloneNode(true));
    opener=btn;
    view.classList.add("open"); view.setAttribute("aria-hidden","false");
    document.body.classList.add("figopen");
    view.querySelector(".figviewport").scrollTop=0;
    view.querySelector(".figviewport").scrollLeft=0;
    shutBtn.focus();
  }
  function shut(){
    view.classList.remove("open"); view.setAttribute("aria-hidden","true");
    document.body.classList.remove("figopen");
    stage.innerHTML="";
    if(opener){ opener.focus(); opener=null; }
  }

  $$(".figzoom").forEach(btn=>btn.addEventListener("click",()=>{
    const fig=btn.previousElementSibling;
    if(fig&&fig.classList.contains("vfig")) open(fig,btn);
  }));
  shutBtn.addEventListener("click",shut);
  view.addEventListener("click",e=>{ if(e.target===view) shut(); });
  addEventListener("keydown",e=>{ if(e.key==="Escape"&&view.classList.contains("open")) shut(); });
})();

/* ===================== inference calculator ===================== */
(function(){
  const it=$("#i-tok"),iu=$("#i-usr"),ip=$("#i-prc"),ic=$("#i-cst");
  if(!it)return;
  const fm=n=>n.toLocaleString("en-US",{maximumFractionDigits:0});
  function upd(){
    const tok=it.value/10, usr=iu.value*100, prc=+ip.value, cst=ic.value/100;
    const cost=tok*cst, gm=(prc-cost)/prc*100, bill=usr*cost, be=prc/cst;
    $("#o-tok").textContent=tok.toFixed(1)+"M";
    $("#o-usr").textContent=fm(usr);
    $("#o-prc").textContent="USD "+prc;
    $("#o-cst").textContent="USD "+cst.toFixed(2);
    $("#o-gm").textContent=(gm<0?"":"+")+gm.toFixed(0)+"%";
    $("#o-gm").style.color=gm<0?"var(--rd)":"var(--bone)";
    $("#o-bill").textContent="USD "+(bill>=1000?fm(bill/1000)+"K":fm(bill));
    const vb=$("#o-vb");
    if(gm<0){vb.className="verdictbar vb-bad";vb.textContent=`Negative. Each seat loses USD ${(cost-prc).toFixed(2)} per month.`;}
    else{vb.className="verdictbar vb-ok";vb.textContent=`Positive. Inverts above ${be.toFixed(1)}M tokens per seat.`;}
  }
  [it,iu,ip,ic].forEach(i=>i.addEventListener("input",upd)); upd();
})();

/* ===================== luminaq index ===================== */
(function(){
  const NAMES=["Codebase integrity","Architecture","Licence and IP","Inference economics","Data lineage","Model moat"];
  const DEALS=[
   {meta:["Engagement","LQ-0231"],m2:[["Stage","Seed"],["Region","MENA"],["Cheque","USD 150K"],["Delivered","6 days"]],
    score:31,v:"bad",vt:"Withdraw",
    sum:"Two critical findings. What is being sold is not what is being bought.",
    s:[22,38,9,27,14,31],
    note:"The interface is genuinely good and the front end team is real. Everything described as proprietary is a system prompt and a licence problem. The investor withdrew and told me it was the cheapest four days of the year."},
   {meta:["Engagement","LQ-0244"],m2:[["Stage","Series A"],["Region","United Kingdom"],["Cheque","USD 400K"],["Delivered","5 days"]],
    score:58,v:"mid",vt:"Proceed with conditions",
    sum:"Real engineering with two fixable structural problems. Price the fix, do not walk.",
    s:[71,44,82,39,68,44],
    note:"Competent team carrying real debt in the persistence layer, and unit economics that invert at scale they have not reached yet. Both are engineering problems with known costs. The investor proceeded with a remediation milestone written into the terms."},
   {meta:["Engagement","LQ-0259"],m2:[["Stage","Seed"],["Region","South East Asia"],["Cheque","USD 200K"],["Delivered","4 days"]],
    score:82,v:"good",vt:"Clear",
    sum:"The rarest outcome. The technical claims survive contact with the repository.",
    s:[88,79,91,74,86,74],
    note:"Eighteen months of steady commits across four engineers, a real evaluation harness run on every merge, licensed training data with the paperwork attached, and founders who answered every question with an artefact instead of a story. I found three minor issues and one of them was a typo."}
  ];
  const chips=$$(".dchip");
  function render(d){
    const D=DEALS[d];
    $("#s-meta").innerHTML=`${D.meta[0]} <b>${D.meta[1]}</b><br>`+D.m2.map(([k,v])=>`${k} <b>${v}</b>`).join("<br>");
    $("#s-vd").innerHTML=`<span class="vpill ${D.v}"><i></i>${D.vt}</span>`;
    $("#s-sum").textContent=D.sum;
    $("#s-note").textContent=D.note;
    const col=s=>s<40?"var(--sc-bad)":s<65?"var(--sc-mid)":"var(--sc-good)";
    $("#s-vecs").innerHTML=NAMES.map((n,i)=>
      `<div class="vec"><span class="vn">${n}</span><span class="tr"><i data-w="${D.s[i]}" style="background:${col(D.s[i])}"></i></span><span class="sc">${D.s[i]}</span></div>`).join("");
    requestAnimationFrame(()=>$$("#s-vecs .tr i").forEach((b,i)=>setTimeout(()=>b.style.width=b.dataset.w+"%",i*70)));
    const el=$("#s-score"); let cur=0; const tgt=D.score, t0=performance.now();
    (function tick(t){const p=clamp((t-t0)/900,0,1);const e=1-Math.pow(1-p,3);
      el.textContent=Math.round(tgt*e);el.style.color=col(tgt);if(p<1)requestAnimationFrame(tick);})(t0);
  }
  chips.forEach(c=>c.addEventListener("click",()=>{chips.forEach(x=>x.classList.toggle("on",x===c));render(+c.dataset.d);}));
  let done=false;
  new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!done){done=true;render(0);}}),{threshold:.25}).observe($("#index"));
})();

/* ===================== report pager ===================== */
(function(){
  const docs=$$(".doc"),pgs=$$(".rpside .pg"); if(!docs.length)return; let i=0;
  function go(n){i=(n+docs.length)%docs.length;
    docs.forEach((d,j)=>d.classList.toggle("on",j===i));
    pgs.forEach((p,j)=>p.classList.toggle("on",j===i));
    $("#rp-ct").textContent=String(i+1).padStart(2,"0");}
  pgs.forEach(p=>p.addEventListener("click",()=>go(+p.dataset.g)));
  $("#rp-next").addEventListener("click",()=>go(i+1));
  $("#rp-prev").addEventListener("click",()=>go(i-1));
})();

/* ===================== diagnostic ===================== */
(function(){
  const Q=[
   {t:"You asked how the model was trained. What came back?",
    o:[["A specific run. Dates, hardware, what it cost.",2],["A description of the approach, no specifics.",1],["They talked about the data instead.",0]],
    ask:"Ask to see the training run itself. Which week, which hardware, what it cost. A team that has done it answers in one sentence."},
   {t:"If their model provider doubled prices on Monday, what happens Tuesday?",
    o:[["A second provider is already wired in and tested.",2],["They believe they could switch in a few weeks.",1],["It has not come up.",0]],
    ask:"Ask them to run the product on a different model in front of you. Weeks of work is an answer. Silence is a different answer."},
   {t:"Who wrote the code, and across what period?",
    o:[["Several engineers, steadily, over more than a year.",2],["A small team, mostly in the last six months.",1],["One person, mostly recently.",0]],
    ask:"Ask for read access to the commit history, not the code. Cadence and authorship tell you more than any file will."},
   {t:"What does their evaluation actually look like?",
    o:[["A harness run on every change, with numbers over time.",2],["Manual spot checks by the founders.",1],["The demo is the evaluation.",0]],
    ask:"Ask for the last three evaluation runs with dates. If evaluation exists, this is a two minute request."},
   {t:"Where did the training or retrieval data come from?",
    o:[["Licensed or first party, with the paperwork.",2],["Public sources, described in general terms.",1],["Customer data, or the subject changed.",0]],
    ask:"Ask which customer data is in the training set and where the consent is recorded. Then ask to see the deletion endpoint."},
   {t:"What do they know about their own inference costs?",
    o:[["Cost per user, split by cohort, to the cent.",2],["A single blended monthly figure.",1],["It is in the financial model somewhere.",0]],
    ask:"Ask for gross margin on the heaviest ten percent of users. Blended numbers hide the cohort that decides whether this works."},
   {t:"If general models get twice as good next year, what happens to this product?",
    o:[["It gets better, because the value sits elsewhere.",2],["They would have to reposition.",1],["That is the plan. They ride it.",0]],
    ask:"Ask what they own that a model release cannot delete. If the answer is the interface, that can be true and valuable, but it is priced differently."},
   {t:"How did they handle the hardest technical question you asked?",
    o:[["Direct answer, then offered the artefact.",2],["Confident and general, no artefact.",1],["Redirected to traction or the team.",0]],
    ask:"Ask the same question again in the next meeting, worded differently. Consistency between answers is itself evidence."}
  ];
  const el={n:$("#dg-n"),t:$("#dg-t"),o:$("#dg-o"),q:$("#dg-q"),r:$("#dg-r"),bar:$("#dg-bar")};
  if(!el.n)return;
  let i=0,ans=[];
  function paint(){
    el.n.textContent=`Question ${String(i+1).padStart(2,"0")} of 08`;
    el.t.textContent=Q[i].t;
    el.o.innerHTML=Q[i].o.map((o,j)=>`<button class="dgopt" data-j="${j}"><span class="mk"></span><span class="ot">${o[0]}</span></button>`).join("");
    el.bar.style.width=(i/Q.length*100)+"%";
    $$(".dgopt",el.o).forEach(b=>b.addEventListener("click",()=>{
      ans[i]=Q[i].o[+b.dataset.j][1];
      if(i<Q.length-1){i++;paint();} else finish();
    }));
  }
  function finish(){
    el.bar.style.width="100%"; el.q.style.display="none"; el.r.classList.add("on");
    const raw=ans.reduce((a,b)=>a+b,0), pct=Math.round(raw/(Q.length*2)*100);
    const mv=$("#dg-mv"); mv.textContent="0";
    const col=pct<=35?"var(--sc-bad)":pct<65?"var(--sc-mid)":"var(--sc-good)";
    mv.style.color=col;
    const t0=performance.now();
    (function tick(t){const p=clamp((t-t0)/1000,0,1),e=1-Math.pow(1-p,3);
      mv.textContent=Math.round(pct*e);if(p<1)requestAnimationFrame(tick);})(t0);
    $("#dg-mu").textContent="Signal strength, 0 to 100";
    let cls,vt,h,para;
    if(pct<=35){cls="bad";vt="Reads as a wrapper";h="On what you have seen, this is an interface business.";
      para="That is not automatically a bad investment. Interfaces win markets and the work is real. It is a different investment from the one the deck is describing, at a different price, with a different risk of being deleted by somebody else's model release. Before you move, make them prove the parts that would change this read.";}
    else if(pct<65){cls="mid";vt="Unresolved";h="There is something here, and you cannot yet tell how much.";
      para="Your answers split. Some signals point at real engineering and some point at a story. This is the exact position where investors either overpay or walk away from a good company, and it is the position a few days of evidence resolves cleanly. Start with the questions below.";}
    else{cls="good";vt="Reads like real engineering";h="The signals point at a team that has actually built something.";
      para="This is the minority outcome. It does not clear the deal, because the things that kill AI companies quietly, licence exposure, data provenance and unit economics at the heavy decile, do not show up in conversation at all. But it means the technical story is worth believing enough to verify properly.";}
    $("#dg-vd").innerHTML=`<span class="vpill ${cls}"><i></i>${vt}</span>`;
    $("#dg-h").textContent=h; $("#dg-p").textContent=para;
    const order=ans.map((v,j)=>[v,j]).sort((a,b)=>a[0]-b[0]).slice(0,3).map(x=>x[1]);
    $("#dg-a").innerHTML=order.map((j,k)=>`<li><span>${String(k+1).padStart(2,"0")}</span><span>${Q[j].ask}</span></li>`).join("");
  }
  $("#dg-again").addEventListener("click",()=>{i=0;ans=[];el.r.classList.remove("on");el.q.style.display="";paint();});
  paint();
})();

/* ===================== counters ===================== */
(function(){
  const cio=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return; cio.unobserve(e.target);
    const el=e.target, tgt=parseFloat(el.dataset.cu), dec=(el.dataset.cu.split(".")[1]||"").length;
    const pre=el.dataset.pre||"", suf=el.dataset.suf||"", t0=performance.now();
    (function tick(t){const p=clamp((t-t0)/1400,0,1),k=1-Math.pow(1-p,4);
      el.textContent=pre+(tgt*k).toFixed(dec)+suf;if(p<1)requestAnimationFrame(tick);})(t0);
  }),{threshold:.5});
  $$("[data-cu]").forEach(el=>cio.observe(el));
})();

/* ===================== mobile menu ===================== */
/* Registered before the smooth anchor handler on purpose: a menu link has to
   release the body scroll lock before that handler tries to scroll, or the
   scroll is swallowed and the link appears to do nothing. */
(function(){
  const b=$("#menub"), m=$("#menu"); if(!b||!m) return;
  const label=$(".mt",b);
  function set(open){
    b.setAttribute("aria-expanded",open?"true":"false");
    m.setAttribute("aria-hidden",open?"false":"true");
    m.classList.toggle("open",open);
    document.body.classList.toggle("menuopen",open);
    if(label) label.textContent = open ? "Close" : "Menu";
  }
  const isOpen=()=>b.getAttribute("aria-expanded")==="true";
  b.addEventListener("click",()=>set(!isOpen()));
  $$("#menu a").forEach(a=>a.addEventListener("click",()=>set(false)));
  addEventListener("keydown",e=>{ if(e.key==="Escape"&&isOpen()) set(false); });
  /* widening past the breakpoint hides the button, which would strand it open */
  addEventListener("resize",()=>{ if(innerWidth>1040&&isOpen()) set(false); },{passive:true});
})();

/* ===================== smooth anchors ===================== */
$$('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
  const id=a.getAttribute("href"); if(id==="#"||id==="#top"){e.preventDefault();scrollTo({top:0,behavior:"smooth"});return;}
  const t=document.querySelector(id); if(!t)return; e.preventDefault();
  scrollTo({top:t.getBoundingClientRect().top+scrollY-96,behavior:"smooth"});
}));
