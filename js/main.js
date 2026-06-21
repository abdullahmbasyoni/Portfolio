/* ============================================================================
   المنطق | main.js  (مش محتاج تعدّل هنا — كل النصوص في content.js)
   موقع متعدد الصفحات: كل صفحة بتعرض الأقسام الموجودة فيها بس.
   ============================================================================ */
(function(){
'use strict';
const C = window.CONTENT;
const $ = (s,r=document)=>r.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
let lang = (function(){try{return localStorage.getItem('ab_lang')||'en'}catch(e){return 'en'}})();
let curFilter='all';
const lit = s => s.replace(/\{([^}]+)\}/g,'<span class="lit">$1</span>');
const L=(en,ar)=>lang==='en'?en:ar;
const ICONS={
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.2-5.2A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 9.5c0 3 2 5 5 5"/></svg>',
  in:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 17v-7"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};
/* أيقونات الخدمات للشريط الماشي */
const SVCICONS={
  target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-5A8 8 0 1 1 21 12z"/></svg>',
  pen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20l4-1 9-9-3-3-9 9-1 4z"/><path d="M14 5l3 3"/></svg>',
  mega:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 10v4h4l7 4V6L8 10H4z"/><path d="M18 9a4 4 0 0 1 0 6"/></svg>',
  badge:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="9" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>',
  flow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="6" height="6" rx="1.4"/><rect x="15" y="14" width="6" height="6" rx="1.4"/><path d="M6 10v4a3 3 0 0 0 3 3h6"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7"/></svg>',
  spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></svg>',
  db:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/></svg>',
  code:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 8l-4 4 4 4M15 8l4 4-4 4"/></svg>',
  layers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/></svg>',
  gauge:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 19a8 8 0 1 1 16 0"/><path d="M12 19l4-6"/><circle cx="12" cy="19" r="1.3" fill="currentColor" stroke="none"/></svg>',
  briefcase:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M3 12h18"/></svg>',
  cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 4h2l2.2 11.2a1 1 0 0 0 1 .8h8.4a1 1 0 0 0 1-.8L20 7H6"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg>',
  browser:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M9.5 6.5h.01"/></svg>',
  pie:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M12 3v9"/></svg>',
  checklist:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 6l1.6 1.6L8.5 5M4 13l1.6 1.6L8.5 12M12 6.5h8M12 13.5h8M12 19.5h8"/></svg>',
  chip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3"/></svg>',
  palette:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2 0-1.5 1-2 2.5-2H18a3 3 0 0 0 3-3c0-5-4-9-9-9z"/><circle cx="8.5" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="10.5" r="1" fill="currentColor" stroke="none"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>'
};
const SVCMAP={
  'content strategy':'layers','social media management':'chat','copywriting & scriptwriting':'pen',
  'marketing strategy':'target','personal branding':'badge','marketing operations':'flow',
  'performance analysis':'gauge','business & operations':'briefcase','e-commerce':'cart',
  'web & cms':'browser','performance marketing':'bolt','seo':'search','marketing automation':'gear',
  'ai for marketing':'spark','data & analytics':'chart','technical skills':'code',
  'marketing & analytics':'pie','productivity':'checklist','ai':'chip',
  'design & creative':'palette','web & e-commerce':'globe'
};
function svcIcon(t){ const k=(t||'').toLowerCase().trim();
  if(SVCMAP[k]&&SVCICONS[SVCMAP[k]]) return SVCICONS[SVCMAP[k]];
  if(k.includes('content'))return SVCICONS.layers;
  if(k.includes('social'))return SVCICONS.chat;
  if(k.includes('copywrit')||k.includes('script'))return SVCICONS.pen;
  if(k.includes('brand'))return SVCICONS.badge;
  if(k.includes('operation'))return SVCICONS.briefcase;
  if(k.includes('seo'))return SVCICONS.search;
  if(k.includes('automation'))return SVCICONS.gear;
  if(k.includes('ai'))return SVCICONS.chip;
  if(k.includes('analytic')||k.includes('analysis'))return SVCICONS.gauge;
  if(k.includes('data'))return SVCICONS.chart;
  if(k.includes('performance'))return SVCICONS.bolt;
  if(k.includes('technical')||k.includes('python'))return SVCICONS.code;
  if(k.includes('design'))return SVCICONS.palette;
  if(k.includes('commerce'))return SVCICONS.cart;
  if(k.includes('web'))return SVCICONS.globe;
  if(k.includes('strategy'))return SVCICONS.target;
  return SVCICONS.mega;
}

function currentPage(){var p=(document.body&&document.body.dataset.page)||(location.pathname.split('/').pop()||'index.html');return p||'index.html';}

/* ---------------- RENDER (guarded per-section) ---------------- */
function render(){
  const ar = lang==='ar';
  document.documentElement.lang=lang; document.documentElement.dir=ar?'rtl':'ltr';
  document.body.dir=ar?'rtl':'ltr'; document.body.lang=lang;
  const lb=$('#langBtn'); if(lb) lb.innerHTML = ar?'<b>EN</b> English':'<b>ع</b> العربية';

  renderNav();
  if($('#brandName')) $('#brandName').textContent=C.meta.name;
  if($('#navRole'))   $('#navRole').textContent=L(C.meta.role_en,C.meta.role_ar);
  if($('#navCta'))    $('#navCta').textContent=L(C.nav_cta_en,C.nav_cta_ar);

  if($('#heroH1'))    renderHero();
  if($('#statsWrap')) renderStats();
  if($('#svcMarquee')) renderServicesMarquee();
  if($('#homeCards')) renderHomeCards();
  if($('#homeCta'))   $('#homeCta').textContent=L(C.homecta_en,C.homecta_ar);
  if($('#homeCtaBtn'))$('#homeCtaBtn').textContent=L(C.hero.cta1_en,C.hero.cta1_ar);
  if($('#homeTeaseBody')) renderHomeTease();
  if($('#workClose'))$('#workClose').textContent=L(C.work.close_en,C.work.close_ar);
  if($('#workCloseCta'))$('#workCloseCta').textContent=L(C.hero.cta1_en,C.hero.cta1_ar);
  if($('#pageHeadEyebrow')) renderPageHead();
  if($('#storyBody')) renderStory();
  if($('#approachEyebrow')){$('#approachEyebrow').textContent=L(C.approach.eyebrow_en,C.approach.eyebrow_ar);$('#approachTitle').textContent=L(C.approach.title_en,C.approach.title_ar);}
  if($('#philLead'))  renderApproach();
  if($('#journeyEyebrow')){$('#journeyEyebrow').textContent=L(C.journey.eyebrow_en,C.journey.eyebrow_ar);$('#journeyTitle').textContent=L(C.journey.title_en,C.journey.title_ar);}
  if($('#timeline'))  renderJourney();
  if($('#workGrid'))  renderWork();
  if($('#caseRoot'))  renderCasePage();
  if($('#brandWall')) renderBrandWall();
  if($('#servicesWrap')) renderServices();
  if($('#contactRow'))   renderContact();
  if($('#footMeta')){ $('#footMeta').textContent=L(C.footer_en,C.footer_ar); if($('#footBrand'))$('#footBrand').textContent=C.meta.name; buildFooterSocial(); }

  bindCursor();
}

function renderNav(){
  const page=currentPage();
  const nav=$('#navLinks'), mob=$('#mobileLinks');
  if(nav)nav.innerHTML=''; if(mob)mob.innerHTML='';
  C.nav.forEach(([en,ar,href])=>{
    const active = href===page || (page==='case.html' && href==='work.html');
    if(nav){const a=el('a',active?'active':null,L(en,ar));a.href=href;nav.appendChild(a);}
    if(mob){const b=el('a',active?'active':null,L(en,ar));b.href=href;b.addEventListener('click',closeMenu);mob.appendChild(b);}
  });
}
function renderPageHead(){
  const map={about:'story',work:'work',services:'services'};
  const page=currentPage().replace('.html','');
  const obj = page==='about'?C.story : page==='work'?C.work : page==='services'?C.services : null;
  if(!obj) return;
  $('#pageHeadEyebrow').textContent=L(obj.eyebrow_en,obj.eyebrow_ar);
  $('#pageHeadTitle').textContent=L(obj.title_en,obj.title_ar);
  const lead=$('#pageHeadLead');
  if(lead){ const lx=L(obj.lead_en,obj.lead_ar); if(lx){lead.textContent=lx;lead.style.display='';} else lead.style.display='none'; }
}

function renderHero(){
  const h=C.hero;
  $('#heroEyebrow').textContent=L(h.eyebrow_en,h.eyebrow_ar);
  $('#heroH1').innerHTML=L(h.title_en,h.title_ar).map(l=>`<span class="ln"><span>${lit(l)}</span></span>`).join('');
  $('#heroSub').textContent=L(h.sub_en,h.sub_ar);
  if($('#heroCta1'))$('#heroCta1').textContent=L(h.cta1_en,h.cta1_ar);
  if($('#heroCta2'))$('#heroCta2').textContent=L(h.cta2_en,h.cta2_ar);
  if($('#heroSlogan'))$('#heroSlogan').textContent=L(h.slogan_en,h.slogan_ar);
  if($('#scrollCue'))$('#scrollCue').textContent=L(h.scroll_en,h.scroll_ar);
}
function renderStats(){
  const sw=$('#statsWrap'); sw.innerHTML='';
  C.stats.forEach(([n,en,ar])=>sw.appendChild(el('div','stat',`<div class="n" data-count="${n}">${n}</div><div class="l">${L(en,ar)}</div>`)));
}
function renderHomeCards(){
  const w=$('#homeCards'); w.innerHTML='';
  C.homecards.forEach(c=>{
    const a=el('a','hcard reveal');a.href=c.link;
    a.innerHTML=`<div class="hcard-k">${L(c.t_en,c.t_ar)}</div><p>${L(c.d_en,c.d_ar)}</p>
      <span class="hcard-go">${L(c.cta_en,c.cta_ar)} ${ICONS.arrow}</span>`;
    w.appendChild(a);
  });
}
function renderHomeTease(){
  const t=C.hometease;
  if($('#homeTeaseEyebrow'))$('#homeTeaseEyebrow').textContent=L(t.eyebrow_en,t.eyebrow_ar);
  if($('#teaseName'))$('#teaseName').textContent=L(C.meta.name,C.meta.name_ar);
  $('#homeTeaseBody').textContent=L(t.body_en,t.body_ar);
  if($('#homeTeaseCta'))$('#homeTeaseCta').textContent=L(t.cta_en,t.cta_ar);
}
function renderStory(){
  const sb=$('#storyBody'); sb.innerHTML='';
  L(C.story.paras_en,C.story.paras_ar).forEach(p=>{
    if(p.startsWith('> ')) sb.appendChild(el('div','pullquote reveal',`<span>${p.slice(2)}</span>`));
    else sb.appendChild(el('p','reveal',p));
  });
}
function renderApproach(){
  const a=C.approach;
  $('#philLead').textContent=L(a.lead_en,a.lead_ar);
  const pc=$('#philChips'); pc.innerHTML=''; L(a.chips_en,a.chips_ar).forEach(c=>pc.appendChild(el('span','chip',c)));
  const pv=$('#philValues'); pv.innerHTML='';
  L(a.values_en,a.values_ar).forEach(([b,r],i)=>pv.appendChild(el('li',null,`<span class="x">0${i+1}</span><span><b>${b}</b> ${r}</span>`)));
  $('#philPunch').innerHTML=L(a.punch_en,a.punch_ar).replace(/\{([^}]+)\}/g,'<em>$1</em>');
}
function renderJourney(){
  const tl=$('#timeline'); if(!tl) return;
  if(tl._jst){ try{tl._jst.kill();}catch(e){} tl._jst=null; }
  tl.innerHTML=''; tl.classList.add('jpath');
  const NS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(NS,'svg'); svg.setAttribute('class','jpath-svg'); svg.setAttribute('preserveAspectRatio','none');
  const glow=document.createElementNS(NS,'path'); glow.setAttribute('class','jpath-glow');
  const road=document.createElementNS(NS,'path'); road.setAttribute('class','jpath-road');
  svg.appendChild(glow); svg.appendChild(road); tl.appendChild(svg);
  const items=[];
  C.journey.items.forEach(([y,en,ar,cur])=>{
    const it=el('div','jp-item'+(cur?' cur':''),
      `<span class="jp-node"></span><div class="jp-card"><div class="jp-year">${y}</div><div class="jp-text">${L(en,ar)}</div></div>`);
    tl.appendChild(it); items.push(it);
  });
  const relayout=()=>layoutJourney(tl,svg,road,glow,items);
  requestAnimationFrame(relayout);
  addEventListener('load',relayout,{once:true});
  if(!tl._jr){ tl._jr=true; let rt; addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(relayout,180);}); }
}
function layoutJourney(tl,svg,road,glow,items){
  if(!items.length) return;
  const rtl=(document.body.dir||document.documentElement.dir)==='rtl';
  const W=tl.clientWidth||tl.offsetWidth, H=tl.offsetHeight;
  if(!W||!H) return;
  const railW=64, baseX = rtl ? W-railW/2 : railW/2, n=items.length;
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`); svg.style.height=H+'px';
  const pts=[];
  items.forEach((it,i)=>{
    const node=it.querySelector('.jp-node');
    const cy=it.offsetTop+18;
    const amp=(1-i/(n-1))*(railW*0.42);            /* التعرّج بيقل كل ما ننزل */
    const dir=(i%2===0?-1:1)*(rtl?-1:1);
    const cx=baseX+dir*amp;
    pts.push([cx,cy]); node.style.left=cx+'px'; node.style.top='18px';
  });
  let d=`M ${pts[0][0]} ${pts[0][1]}`;
  for(let i=1;i<pts.length;i++){ const [x0,y0]=pts[i-1],[x1,y1]=pts[i],my=(y0+y1)/2; d+=` C ${x0} ${my}, ${x1} ${my}, ${x1} ${y1}`; }
  road.setAttribute('d',d); glow.setAttribute('d',d);
  let len=0; try{ len=road.getTotalLength(); }catch(e){ len=0; }
  const ST=window.ScrollTrigger;
  if(!len || reduce || !ST || !window.gsap){
    road.style.strokeDasharray='none'; road.style.strokeDashoffset='0';
    items.forEach(it=>it.classList.add('on')); return;
  }
  road.style.strokeDasharray=len; road.style.strokeDashoffset=len;
  tl._jst=ST.create({ trigger:tl, start:'top 78%', end:'bottom 72%', scrub:0.6,
    onUpdate:self=>{ const p=self.progress; road.style.strokeDashoffset=len*(1-p);
      items.forEach((it,i)=>it.classList.toggle('on', (i+0.6)/n <= p+0.001 )); }
  });
}

function renderWork(){
  if($('#workLead')) $('#workLead').textContent=L(C.work.lead_en,C.work.lead_ar);
  const ff=$('#filters');
  if(ff){ ff.innerHTML='';
    C.work.filters.forEach(([k,en,ar])=>{const b=el('button','filt'+(k===curFilter?' on':''),L(en,ar));b.dataset.cat=k;b.addEventListener('click',()=>{
      if(k===curFilter)return; curFilter=k;
      const grid=$('#workGrid'), old=grid?[...grid.children]:[];
      if(window.gsap&&old.length){ gsap.to(old,{opacity:0,y:-12,scale:.97,duration:.22,stagger:.025,ease:'power2.in',onComplete:renderWork}); }
      else renderWork();
    });ff.appendChild(b);});
  }
  const wg=$('#workGrid'); wg.innerHTML='';
  C.work.cases.filter(c=>curFilter==='all'||c.cat===curFilter).forEach(c=>{
    const card=el('div','case'+(c.feat?' feat':''));
    const logo=c.logo?`<span class="case-logo"><img src="${c.logo}" alt="${c.brand}" loading="lazy"></span>`:'';
    const badge=c.feat&&c.badge_en?`<span class="feat-badge">${L(c.badge_en,c.badge_ar)}</span>`:'';
    const metric=L(c.metric_en,c.metric_ar)?`<div class="case-metric"><span class="pulse"></span>${L(c.metric_en,c.metric_ar)}</div>`:'';
    const more=`<span class="case-more">${L('View case','اعرف أكتر')} ${ICONS.arrow}</span>`;
    card.innerHTML=`<div class="case-head">${logo}<div class="case-top"><span class="case-brand">${c.brand}</span><span class="case-region">${L(c.region_en,c.region_ar)}</span></div></div>
      <div class="case-sector">${L(c.sector_en,c.sector_ar)}</div><div class="case-role">${L(c.role_en,c.role_ar)}</div>
      <p class="case-desc">${L(c.desc_en,c.desc_ar)}</p>${badge}${metric}${more}`;
    card.addEventListener('click',()=>{ location.href='case.html?id='+encodeURIComponent(c.id); });
    wg.appendChild(card);
  });
  const cards=[...wg.children];
  if(window.gsap&&cards.length){ gsap.fromTo(cards,{opacity:0,y:32,scale:.96},{opacity:1,y:0,scale:1,duration:.55,stagger:.06,ease:'power3.out',clearProps:'transform'}); }
}
function renderBrandWall(){
  if($('#brandWallH')) $('#brandWallH').textContent=L(C.work.wall_h_en,C.work.wall_h_ar);
  const w=$('#brandWall'); w.innerHTML='';
  C.brands.forEach(b=>{
    if(b.l){ const d=el('div','brand-chip has-logo',`<img src="${b.l}" alt="${b.n}" loading="lazy">`); d.title=b.n; w.appendChild(d); }
    else w.appendChild(el('div','brand-chip',`<span>${b.n}</span>`));
  });
}
function renderServices(){
  const wrap=$('#servicesWrap'); if(!wrap) return; wrap.innerHTML='';
  const touch=matchMedia('(hover:none)').matches;
  let gi=0;
  C.services.tiers.forEach(tier=>{
    const sec=el('div','svc-tier reveal');
    sec.appendChild(el('h3','svc-tier-h',`<span>${L(tier.h_en,tier.h_ar)}</span>`));
    const deck=el('div','svc-deck');
    tier.groups.forEach(g=>{
      const items=(lang==='ar'&&g.items_ar)?g.items_ar:(g.items_en||[]);
      const num=String(++gi).padStart(2,'0');
      const card=el('div','flip');
      card.innerHTML=`<div class="flip-inner">
        <div class="flip-face flip-front">
          <span class="flip-num">${num}</span>
          <span class="flip-ic">${svcIcon(g.t_en)}</span>
          <h4 class="flip-title">${L(g.t_en,g.t_ar)}</h4>
          <span class="flip-hint">${L('What I offer','اللي بقدّمه')} ${ICONS.arrow}</span>
        </div>
        <div class="flip-face flip-back">
          <h4 class="flip-back-title">${L(g.t_en,g.t_ar)}</h4>
          <ul class="flip-list">${items.map(it=>`<li>${it}</li>`).join('')}</ul>
        </div>
      </div>`;
      if(touch) card.addEventListener('click',()=>card.classList.toggle('flipped'));
      deck.appendChild(card);
    });
    sec.appendChild(deck); wrap.appendChild(sec);
  });
  if(window.gsap){ const cards=wrap.querySelectorAll('.flip');
    if(cards.length) gsap.fromTo(cards,{opacity:0,y:42,rotateX:-32,transformOrigin:'50% 100%'},
      {opacity:1,y:0,rotateX:0,duration:.7,stagger:.05,ease:'power3.out',clearProps:'transform'}); }
}
function renderServicesMarquee(){
  const wrap=$('#svcMarquee'); if(!wrap) return;
  if($('#smEyebrow')) $('#smEyebrow').textContent=L(C.homeservices_eyebrow_en,C.homeservices_eyebrow_ar);
  if($('#smTitle'))   $('#smTitle').textContent=L(C.homeservices_title_en,C.homeservices_title_ar);
  const tiers=(C.services&&C.services.tiers)||[];
  const offered=(tiers[0]&&tiers[0].groups)||[];
  const developing=(tiers[2]&&tiers[2].groups)||[];
  function pill(g){
    const items=(g.items_en||[]);
    const sub=items.slice(0,3).join(' · ');
    return `<div class="sm-pill"><span class="sm-ic">${svcIcon(g.t_en)}</span><span class="sm-tx"><b>${g.t_en}</b>${sub?`<i>${sub}</i>`:''}</span></div>`;
  }
  const laneA=offered.map(pill).join(''), laneB=developing.map(pill).join('');
  wrap.innerHTML=`<div class="sm-lane">${laneA}${laneA}</div>`+(laneB?`<div class="sm-lane rev">${laneB}${laneB}</div>`:'');
}
function renderContact(){
  const ct=C.contact, m=C.meta;
  if($('#contactEyebrow'))$('#contactEyebrow').textContent=L(ct.eyebrow_en,ct.eyebrow_ar);
  if($('#contactH'))$('#contactH').textContent=L(ct.title_en,ct.title_ar);
  if($('#contactSub'))$('#contactSub').textContent=L(ct.sub_en,ct.sub_ar);
  const cr=$('#contactRow'); cr.innerHTML='';
  [['mail',L(ct.email_label_en,ct.email_label_ar),m.email,'mailto:'+m.email],
   ['wa',L(ct.wa_label_en,ct.wa_label_ar),m.phone_label,'https://wa.me/'+m.whatsapp],
   ['in',L(ct.in_label_en,ct.in_label_ar),m.linkedin_label,m.linkedin],
   ['pin',L(ct.loc_label_en,ct.loc_label_ar),L(m.location_en,m.location_ar),'']
  ].forEach(([ic,lab,val,href])=>{
    const inner=`${ICONS[ic]}<span style="text-align:start"><span class="lab">${lab}</span><span class="val">${val}</span></span>`;
    let node; if(href){node=el('a','cc',inner);node.href=href;if(ic==='wa'||ic==='in'){node.target='_blank';node.rel='noopener';}} else node=el('div','cc',inner);
    cr.appendChild(node);
  });
  const items=[$('#contactEyebrow'),$('#contactH'),$('#contactSub'),...cr.children,document.querySelector('.end-slogan')].filter(Boolean);
  if(window.gsap && !reduce && items.length){
    gsap.set(items,{opacity:0,y:26});
    let played=false; const play=()=>{ if(played)return; played=true;
      gsap.to(items,{opacity:1,y:0,duration:.6,stagger:.07,ease:'power3.out',clearProps:'transform'}); };
    if(window.__preDone) play(); else { addEventListener('ab:preloaded',play,{once:true}); setTimeout(play,2200); }
  }
}

/* ---------------- FOOTER SOCIAL ---------------- */
const SOCIAL_ICONS={
  linkedin:'<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.74v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.76V1.74C24 .78 23.2 0 22.22 0z"/>',
  instagram:'<path d="M12 2c2.72 0 3.06.01 4.12.06 1.07.05 1.8.22 2.43.47.66.25 1.22.59 1.77 1.15.56.55.9 1.11 1.15 1.77.25.63.42 1.36.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.07-.22 1.8-.47 2.43a4.9 4.9 0 0 1-1.15 1.77c-.55.56-1.11.9-1.77 1.15-.63.25-1.36.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.07-.05-1.8-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.63-.42-1.36-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.07.22-1.8.47-2.43.25-.66.59-1.22 1.15-1.77.55-.56 1.11-.9 1.77-1.15.63-.25 1.36-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 1.8c-2.67 0-2.99.01-4.04.06-.98.04-1.5.21-1.86.35-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.36-.31.88-.35 1.86-.05 1.05-.06 1.37-.06 4.04s.01 2.99.06 4.04c.04.98.21 1.5.35 1.86.18.47.4.8.75 1.15.35.35.68.57 1.15.75.36.14.88.31 1.86.35 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.98-.04 1.5-.21 1.86-.35.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.36.31-.88.35-1.86.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.98-.21-1.5-.35-1.86a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.36-.14-.88-.31-1.86-.35-1.05-.05-1.37-.06-4.04-.06zm0 3.06A5.14 5.14 0 1 1 6.86 12 5.14 5.14 0 0 1 12 6.86zm0 1.8A3.34 3.34 0 1 0 15.34 12 3.34 3.34 0 0 0 12 8.66zm5.34-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/>',
  facebook:'<path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3-.04-1.3-.13-2.45-.13-2.45 0-4.1 1.5-4.1 4.24v2.18H7.3V13h2.85v8h3.35z"/>',
  tiktok:'<path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.1v12.3a2.6 2.6 0 0 1-2.6 2.5 2.6 2.6 0 1 1 .73-5.09V9.5a5.7 5.7 0 0 0-.73-.05A5.66 5.66 0 1 0 15.5 15.1V8.9a7.3 7.3 0 0 0 4.27 1.37V7.16a4.28 4.28 0 0 1-3.17-1.34z"/>'
};
function buildFooterSocial(){
  const list=(C.meta.socials||[]); if(!list.length)return;
  document.querySelectorAll('footer .wrap').forEach(w=>{
    if(w.querySelector('.foot-social'))return;
    const nav=el('div','foot-social'); nav.setAttribute('role','list'); nav.setAttribute('aria-label',L('Social media','وسائل التواصل'));
    list.forEach(s=>{
      const a=document.createElement('a'); a.href=s.url; a.target='_blank'; a.rel='noopener';
      a.setAttribute('aria-label',s.name); a.title=s.name;
      a.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${SOCIAL_ICONS[s.key]||''}</svg>`;
      nav.appendChild(a);
    });
    const meta=w.querySelector('.foot-meta');
    if(meta) w.insertBefore(nav,meta); else w.appendChild(nav);
  });
}

/* ---------------- MODAL ---------------- */
function openModal(c){
  const w=C.work, mb=$('#modalBody'); if(!mb)return;
  const logo=c.logo?`<div class="m-logo"><img src="${c.logo}" alt="${c.brand}"></div>`:'';
  mb.innerHTML=`${logo}<div class="m-region">${L(c.region_en,c.region_ar)} · ${L(c.sector_en,c.sector_ar)}</div>
    <h3>${c.brand}</h3><div class="m-role">${L(c.role_en,c.role_ar)}</div>
    <div class="m-block"><h5>${L(w.modal_challenge_en,w.modal_challenge_ar)}</h5><p>${L(c.challenge_en,c.challenge_ar)}</p></div>
    <div class="m-block"><h5>${L(w.modal_solution_en,w.modal_solution_ar)}</h5><p>${L(c.solution_en,c.solution_ar)}</p></div>
    <div class="m-block"><h5>${L(w.modal_result_en,w.modal_result_ar)}</h5><p>${L(c.desc_en,c.desc_ar)}</p></div>
    ${L(c.metric_en,c.metric_ar)?`<div class="m-metric"><span class="pulse"></span>${L(c.metric_en,c.metric_ar)}</div>`:''}`;
  $('#modalBack').classList.add('open'); document.body.style.overflow='hidden';
}
function closeModal(){ const b=$('#modalBack'); if(b)b.classList.remove('open'); document.body.style.overflow=''; }

/* ---------------- CASE DETAIL PAGE (case.html?id=) ---------------- */
let lbList=[], lbIndex=0;
function caseId(){ try{return new URLSearchParams(location.search).get('id')||'';}catch(e){return '';} }
function renderCasePage(){
  const root=$('#caseRoot'); if(!root) return;
  const w=C.work, cases=w.cases||[];
  const id=caseId();
  const idx=cases.findIndex(c=>c.id===id);
  const c=cases[idx];
  if(!c){ root.innerHTML=`<header class="page-head"><div class="wrap"><a class="case-back" href="work.html">${ICONS.arrow} ${L(w.case_back_en,w.case_back_ar)}</a><h1 class="page-title">404</h1><p class="page-lead lead">${L('Project not found.','المشروع مش موجود.')}</p></div></header>`; return; }

  /* meta / title */
  document.title = `${c.brand} — ${C.meta.name}`;
  const md=document.querySelector('meta[name="description"]'); if(md) md.setAttribute('content', L(c.desc_en,c.desc_ar)||'');

  const logo=c.logo?`<span class="case-hero-logo"><img src="${c.logo}" alt="${c.brand}"></span>`:'';
  const badge=(c.feat&&c.badge_en)?`<span class="case-badge">${L(c.badge_en,c.badge_ar)}</span>`:'';

  /* ---- aside: facts + services + links + pdfs ---- */
  const fact=(lab,val)=>val?`<div class="cf"><span class="cf-l">${lab}</span><span class="cf-v">${val}</span></div>`:'';
  let facts = fact(L(w.case_market_label_en,w.case_market_label_ar), L(c.region_en,c.region_ar))
            + fact(L(w.case_role_label_en,w.case_role_label_ar), L(c.role_en,c.role_ar))
            + fact(L(w.case_duration_label_en,w.case_duration_label_ar), L(c.duration_en,c.duration_ar));
  const svcArr=(lang==='ar'&&c.services_ar)?c.services_ar:(c.services_en||[]);
  const svc = svcArr.length?`<div class="case-aside-block"><h4>${L(w.case_services_en,w.case_services_ar)}</h4><div class="taglist">${svcArr.map(s=>`<span>${s}</span>`).join('')}</div></div>`:'';
  const links=(c.links||[]).length?`<div class="case-aside-block"><h4>${L(w.case_links_en,w.case_links_ar)}</h4><div class="case-links">${c.links.map(l=>`<a class="case-link" href="${l.url}" target="_blank" rel="noopener">${ICONS.arrow}<span>${L(l.label_en,l.label_ar)}</span></a>`).join('')}</div></div>`:'';
  const pdfs=(c.pdfs||[]).length?`<div class="case-aside-block"><h4>${L(w.case_pdf_en,w.case_pdf_ar)}</h4><div class="case-files">${c.pdfs.map(p=>`<a class="case-file" href="${p.file}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg><span><b>${L(p.label_en,p.label_ar)}</b><i>${L(w.case_view_pdf_en,w.case_view_pdf_ar)}</i></span></a>`).join('')}</div></div>`:'';

  /* ---- main column ---- */
  const about=(c.about_en||c.about_ar)?`<div class="case-sec reveal"><h3 class="case-h">${L(w.case_about_en,w.case_about_ar)}</h3><p class="case-p">${L(c.about_en,c.about_ar)}</p></div>`:'';
  const did=`<div class="case-sec reveal"><h3 class="case-h">${L(w.case_did_en,w.case_did_ar)}</h3>
      <p class="case-p"><strong>${L(w.modal_challenge_en,w.modal_challenge_ar)}:</strong> ${L(c.challenge_en,c.challenge_ar)}</p>
      <p class="case-p">${L(c.solution_en,c.solution_ar)}</p></div>`;
  const resArr=(lang==='ar'&&c.results_ar)?c.results_ar:(c.results_en||[]);
  const results = resArr.length
      ? `<div class="case-sec reveal"><h3 class="case-h">${L(w.case_results_en,w.case_results_ar)}</h3><ul class="case-results">${resArr.map(r=>`<li><span class="pulse"></span>${r}</li>`).join('')}</ul></div>`
      : (L(c.metric_en,c.metric_ar)?`<div class="case-sec reveal"><h3 class="case-h">${L(w.case_results_en,w.case_results_ar)}</h3><div class="case-metric" style="align-self:flex-start"><span class="pulse"></span>${L(c.metric_en,c.metric_ar)}</div></div>`:'');

  /* ---- work showcase (gallery) ---- */
  let gallery='';
  if((c.gallery||[]).length){
    lbList=c.gallery;
    const shots=c.gallery.map((g,i)=>`<button class="shot reveal" data-i="${i}"><img src="${g.src}" alt="${L(g.cap_en,g.cap_ar)||c.brand}" loading="lazy">${(g.cap_en||g.cap_ar)?`<span class="shot-cap">${L(g.cap_en,g.cap_ar)}</span>`:''}</button>`).join('');
    gallery=`<div class="case-sec case-showcase"><h3 class="case-h">${L(w.case_work_en,w.case_work_ar)}</h3><div class="shots">${shots}</div></div>`;
  } else { lbList=[]; }

  /* ---- sub-projects (files inside the case: client websites/profiles) ---- */
  let projects='';
  if((c.subprojects||[]).length){
    const fileIc='<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>';
    const cards=c.subprojects.map(sp=>`<article class="subproj reveal">
        ${sp.thumb?`<div class="subproj-thumb"><img src="${sp.thumb}" alt="${L(sp.title_en,sp.title_ar)}" loading="lazy"></div>`:''}
        <div class="subproj-body">
          <h4>${L(sp.title_en,sp.title_ar)}</h4>
          ${(sp.note_en||sp.note_ar)?`<p>${L(sp.note_en,sp.note_ar)}</p>`:''}
          <div class="subproj-actions">
            ${sp.pdf?`<a class="subproj-btn" href="${sp.pdf}" target="_blank" rel="noopener">${fileIc}<span>${L('Open content','افتح المحتوى')}</span></a>`:''}
            ${sp.link?`<a class="subproj-btn ghost" href="${sp.link}" target="_blank" rel="noopener">${ICONS.arrow}<span>${L('Visit site','زيارة الموقع')}</span></a>`:''}
          </div>
        </div>
      </article>`).join('');
    projects=`<div class="case-sec case-projects"><h3 class="case-h">${L('Projects','المشاريع')}</h3><div class="subprojects">${cards}</div></div>`;
  }

  /* ---- featured video(s) ---- */
  let videos='';
  if((c.videos||[]).length){
    const vids=c.videos.map(v=>`<figure class="case-vid reveal"><video controls preload="metadata" playsinline ${v.poster?`poster="${v.poster}"`:''}><source src="${v.src}" type="video/mp4"></video>${(v.cap_en||v.cap_ar)?`<figcaption>${L(v.cap_en,v.cap_ar)}</figcaption>`:''}</figure>`).join('');
    videos=`<div class="case-sec case-showcase"><h3 class="case-h">${L('Featured video','الفيديو')}</h3><div class="case-vids">${vids}</div></div>`;
  }

  /* ---- prev / next ---- */
  const prev=cases[idx-1], next=cases[idx+1];
  const navHtml=(prev||next)?`<div class="case-pager wrap">
      ${prev?`<a class="cpag cpag-prev" href="case.html?id=${encodeURIComponent(prev.id)}"><span class="cpag-l">${ICONS.arrow} ${L(w.case_prev_en,w.case_prev_ar)}</span><span class="cpag-b">${prev.brand}</span></a>`:`<span></span>`}
      ${next?`<a class="cpag cpag-next" href="case.html?id=${encodeURIComponent(next.id)}"><span class="cpag-l">${L(w.case_next_en,w.case_next_ar)} ${ICONS.arrow}</span><span class="cpag-b">${next.brand}</span></a>`:`<span></span>`}
    </div>`:'';

  root.innerHTML=`
    <header class="page-head case-top-sec">
      <div class="wrap reveal">
        <a class="case-back" href="work.html">${ICONS.arrow}<span>${L(w.case_back_en,w.case_back_ar)}</span></a>
        <div class="case-hero">
          ${logo}
          <div class="case-hero-txt">
            <span class="eyebrow">${L(c.region_en,c.region_ar)} · ${L(c.sector_en,c.sector_ar)}</span>
            <h1 class="page-title">${c.brand}</h1>
            <div class="case-hero-role">${L(c.role_en,c.role_ar)}</div>
            ${badge}
          </div>
        </div>
        <p class="page-lead lead">${L(c.desc_en,c.desc_ar)}</p>
      </div>
    </header>
    <section class="first case-body-sec">
      <div class="wrap">
        <div class="case-cols">
          <div class="case-main">${about}${did}${results}</div>
          <aside class="case-aside reveal"><div class="case-facts">${facts}</div>${svc}${links}${pdfs}</aside>
        </div>
        ${projects}
        ${videos}
        ${gallery}
      </div>
    </section>
    ${navHtml}
    <section class="work-close"><div class="wrap reveal">
      <h3>${L(w.case_cta_h_en,w.case_cta_h_ar)}</h3>
      <a class="btn btn-primary" href="contact.html">${L(w.case_cta_btn_en,w.case_cta_btn_ar)}</a>
    </div></section>`;

  /* bind gallery -> lightbox */
  root.querySelectorAll('.shot').forEach(b=>b.addEventListener('click',()=>openLightbox(parseInt(b.dataset.i,10))));
}

/* ---------------- LIGHTBOX ---------------- */
function openLightbox(i){
  const lb=$('#lightbox'); if(!lb||!lbList.length)return;
  lbIndex=(i+lbList.length)%lbList.length;
  const g=lbList[lbIndex];
  $('#lbImg').src=g.src; $('#lbImg').alt=L(g.cap_en,g.cap_ar)||'';
  $('#lbCap').textContent=L(g.cap_en,g.cap_ar)||'';
  lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
}
function closeLightbox(){ const lb=$('#lightbox'); if(!lb)return; lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
function lbStep(d){ if(lbList.length) openLightbox(lbIndex+d); }

/* ---------------- LANGUAGE ---------------- */
function setLang(l){ lang=l; try{localStorage.setItem('ab_lang',l)}catch(e){} render(); initScroll(); }

/* ---------------- MENU ---------------- */
function closeMenu(){ const m=$('#mobileMenu'); if(m)m.classList.remove('open'); }

/* ---------------- CURSOR ---------------- */
let cx=innerWidth/2,cy=innerHeight/2,rx=cx,ry=cy;
function initCursor(){
  if(matchMedia('(hover:none)').matches) return;
  const dot=$('#cDot'), ring=$('#cRing'); if(!dot||!ring)return;
  addEventListener('mousemove',e=>{cx=e.clientX;cy=e.clientY;dot.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;});
  (function loop(){rx+=(cx-rx)*.18;ry+=(cy-ry)*.18;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(loop);})();
}
function bindCursor(){
  if(matchMedia('(hover:none)').matches) return;
  const ring=$('#cRing'); if(!ring)return;
  const SEL='a,button,.case,.hcard,.cc,.cpag,.case-file,.subproj,.flip,.chip,.brand-chip,.sm-pill,.filt,.subproj-btn,.case-link';
  document.addEventListener('mouseover',e=>{ if(e.target.closest&&e.target.closest(SEL)) ring.classList.add('hover'); },{passive:true});
  document.addEventListener('mouseout',e=>{ const to=e.relatedTarget; if(!to||!(to.closest&&to.closest(SEL))) ring.classList.remove('hover'); },{passive:true});
}
/* ---------------- MAGNETIC ---------------- */
function initMagnetic(){
  if(matchMedia('(hover:none)').matches) return;
  document.addEventListener('mousemove',e=>{
    document.querySelectorAll('.btn').forEach(b=>{
      const r=b.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),d=Math.hypot(dx,dy);
      if(d<90)b.style.transform=`translate(${dx*.25}px,${dy*.35}px)`; else b.style.transform='';
    });
  });
}
/* ---------------- CARD 3D TILT (calm) ---------------- */
function initCardFx(){
  if(matchMedia('(hover:none)').matches) return;
  let cur=null;
  document.addEventListener('mousemove',e=>{
    const card=(e.target.closest&&e.target.closest('.hcard, .case, .cpag, .cc, .case-file, .subproj'))||null;
    if(card!==cur){ if(cur)cur.style.transform=''; cur=card; }
    if(!card) return;
    const r=card.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
    card.style.setProperty('--mx',(px*100)+'%');
    card.style.setProperty('--my',(py*100)+'%');
    if(!card.matches('.cc, .case-file, .subproj')){
      const rx=((0.5-py)*7).toFixed(2), ry=((px-0.5)*7).toFixed(2);
      card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    }
  },{passive:true});
}

/* ---------------- SMOOTH SCROLL ---------------- */
let lenis;
function initSmooth(){
  if(reduce||typeof Lenis==='undefined') return;
  lenis=new Lenis({duration:1.1,smoothWheel:true});
  function raf(t){lenis.raf(t);requestAnimationFrame(raf);} requestAnimationFrame(raf);
  if(window.gsap&&window.ScrollTrigger) lenis.on('scroll',ScrollTrigger.update);
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a&&a.getAttribute('href').length>1){e.preventDefault();const t=$(a.getAttribute('href'));if(t)lenis.scrollTo(t,{offset:-10});closeMenu();}});
}
/* ---------------- REVEAL / COUNTERS ---------------- */
let ioSet=false;
function initScroll(){
  if(window.gsap&&window.ScrollTrigger){
    if(ioSet) ScrollTrigger.getAll().forEach(t=>t.kill());
    gsap.utils.toArray('.reveal').forEach(n=>gsap.fromTo(n,{opacity:0,y:28},{opacity:1,y:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:n,start:'top 88%'}}));
    gsap.utils.toArray('[data-count]').forEach(n=>ScrollTrigger.create({trigger:n,start:'top 90%',once:true,onEnter:()=>countUp(n)}));
    ioSet=true;
  }else{
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');if(e.target.matches('[data-count]'))countUp(e.target);io.unobserve(e.target);}}),{threshold:.12});
    document.querySelectorAll('.reveal,[data-count]').forEach(n=>io.observe(n));
  }
}
function countUp(n){
  const raw=n.dataset.count, num=parseInt(raw,10)||0, suffix=raw.replace(/[0-9]/g,'');
  let s=null; function step(t){if(!s)s=t;const p=Math.min((t-s)/1100,1);n.textContent=Math.round(num*(1-Math.pow(1-p,3)))+suffix;if(p<1)requestAnimationFrame(step);} requestAnimationFrame(step);
}



/* ---------------- PRELOADER ---------------- */
function preload(){
  const bar=$('#preBar'), logo=$('#preLogo'), pre=$('#pre'); if(!pre)return;
  if(window.gsap&&logo) gsap.to(logo,{opacity:1,y:0,duration:.6,ease:'power2.out'}); else if(logo){logo.style.opacity=1;logo.style.transform='none';}
  let p=0; const t=setInterval(()=>{p=Math.min(p+Math.random()*24,100);if(bar)bar.style.width=p+'%';
    if(p>=100){clearInterval(t);setTimeout(()=>{pre.classList.add('done');window.__preDone=true;try{window.dispatchEvent(new Event('ab:preloaded'));}catch(e){}if(lenis)lenis.start();},300);}},130);
}

/* ---------------- BOOT ---------------- */
function boot(){
  const lb=$('#langBtn'); if(lb)lb.addEventListener('click',()=>setLang(lang==='en'?'ar':'en'));
  const mb=$('#menuBtn'); if(mb)mb.addEventListener('click',()=>{ const m=$('#mobileMenu'); if(!m)return; m.classList.add('open');
    const links=m.querySelectorAll('#mobileLinks a');
    if(window.gsap && !reduce && links.length){ gsap.fromTo(links,{opacity:0,y:18},{opacity:1,y:0,duration:.45,stagger:.06,ease:'power3.out',delay:.08,clearProps:'transform'}); }
  });
  const cm=$('#closeMenu'); if(cm)cm.addEventListener('click',closeMenu);
  const mc=$('#modalClose'); if(mc)mc.addEventListener('click',closeModal);
  const mbk=$('#modalBack'); if(mbk)mbk.addEventListener('click',e=>{if(e.target===mbk)closeModal();});
  const lbc=$('#lbClose'); if(lbc)lbc.addEventListener('click',closeLightbox);
  const lbp=$('#lbPrev'); if(lbp)lbp.addEventListener('click',()=>lbStep(-1));
  const lbn=$('#lbNext'); if(lbn)lbn.addEventListener('click',()=>lbStep(1));
  const lbEl=$('#lightbox'); if(lbEl)lbEl.addEventListener('click',e=>{if(e.target===lbEl)closeLightbox();});
  addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeModal();closeLightbox();}
    const lo=$('#lightbox'); if(lo&&lo.classList.contains('open')){ if(e.key==='ArrowRight')lbStep(1); if(e.key==='ArrowLeft')lbStep(-1); }
  });
  const navEl=$('#nav'); if(navEl)addEventListener('scroll',()=>navEl.classList.toggle('scrolled',scrollY>40),{passive:true});
  if(window.gsap&&window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  render(); initSmooth(); initScroll(); initCursor(); initMagnetic(); initCardFx(); initBgField(); preload();
}
/* ============================================================
   SITE-WIDE BACKGROUND INTELLIGENCE LAYER  ("from chaos to clarity"
   expressed through behaviour, never literally)
   - Hundreds of subtle particles ("ideas / data points") drifting calmly
   - Ultra-thin proximity connections that appear & fade naturally
   - Cursor = a gentle strategic force (attract + swirl, never sticks)
   - Per-section invisible gravity that subtly re-organises the field
   - Fixed layer, behind ALL content, pointer-events:none, perf-tuned
   ============================================================ */
let bgFieldMode='scatter';
function initBgField(){
  // canvas is injected so the layer exists on every page without editing each HTML
  let cv=document.getElementById('bg-field');
  if(!cv){ cv=document.createElement('canvas'); cv.id='bg-field'; cv.setAttribute('aria-hidden','true'); document.body.insertBefore(cv,document.body.firstChild); }
  const ctx=cv.getContext('2d',{alpha:true}); if(!ctx) return;
  const PARTICLE='231,234,238', LINE='95,158,219', ACC='95,158,219';
  let W=0,H=0,DPR=Math.min(devicePixelRatio||1,2);
  let parts=[], grid=new Map(), CELL=120, D=120, R2D=120*120;
  let mx=-1e5,my=-1e5,hasMouse=false,lastMx=0,lastMy=0;
  let org=0, running=true;

  function setup(){
    W=innerWidth; H=innerHeight; cv.width=W*DPR; cv.height=H*DPR; cv.style.width=W+'px'; cv.style.height=H+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
    const isM=W<760;
    D=isM?92:124; CELL=D; R2D=D*D;
    const target=isM?Math.min(60,Math.round(W*H/16000)):Math.min(150,Math.round(W*H/13000));
    parts=[];
    for(let i=0;i<target;i++) parts.push({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*0.18, vy:(Math.random()-.5)*0.18,
      ph:Math.random()*6.28, sp:0.2+Math.random()*0.5, r:0.6+Math.random()*1.4,
      cl:Math.floor(Math.random()*6)
    });
  }
  setup();

  if(reduce){ // motion-sensitive users: render one calm static frame, no loop/interaction
    drawStatic(); return;
  }

  // ---- pointer: gentle, fluid presence ----
  addEventListener('pointermove',e=>{ mx=e.clientX; my=e.clientY; lastMx=mx; lastMy=my; hasMouse=true; },{passive:true});
  addEventListener('pointerleave',()=>{ hasMouse=false; mx=my=-1e5; });
  addEventListener('blur',()=>{ hasMouse=false; });

  setupFieldModes();                       // section gravity (ScrollTrigger, IO fallback)

  document.addEventListener('visibilitychange',()=>{ running=!document.hidden; if(running) requestAnimationFrame(loop); });
  let rt; addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(setup,200); },{passive:true});

  // tiny per-mode gravity — kept subliminal (scaled by org which eases in)
  function modeForce(p){
    if(org<0.01) return;
    const cx=W/2, cy=H/2, k=org;
    if(bgFieldMode==='circle'){ const dx=p.x-cx,dy=p.y-cy,d=Math.hypot(dx,dy)||1,Rr=Math.min(W,H)*0.30; const f=(Rr-d)*0.00006*k; p.vx+=dx/d*f; p.vy+=dy/d*f; }
    else if(bgFieldMode==='hflow'){ p.vx+=((p.vx>=0?0.05:-0.05)-p.vx*0.03)*0.06*k; p.vy-=p.vy*0.05*k; }
    else if(bgFieldMode==='network'){ const gs=Math.min(W,H)*0.17, nx=Math.round(p.x/gs)*gs, ny=Math.round(p.y/gs)*gs; p.vx+=(nx-p.x)*0.00009*k; p.vy+=(ny-p.y)*0.00009*k; }
    else if(bgFieldMode==='clusters'){ const ccx=(0.22+0.28*(p.cl%3))*W, ccy=(0.3+0.4*((p.cl/3)|0))*H; p.vx+=(ccx-p.x)*0.0001*k; p.vy+=(ccy-p.y)*0.0001*k; }
    else if(bgFieldMode==='converge'){ p.vx+=(cx-p.x)*0.00016*k; p.vy+=(cy-p.y)*0.00016*k; }
  }

  function scrollProg(){ const sh=(document.documentElement.scrollHeight||document.body.scrollHeight||0); const d=Math.max(sh-innerHeight,1); return Math.min(Math.max((window.scrollY||window.pageYOffset||0)/d,0),1); }
  function step(t){
    grid.clear();
    const SP=scrollProg();                                   // 0 top .. 1 bottom of site
    const endPull=Math.min(Math.max((SP-0.70)/0.30,0),1);    // gather toward the end
    const driftMul=1+SP*1.0, _cx=W/2, _cy=H/2;
    for(let i=0;i<parts.length;i++){ const p=parts[i];
      p.vx+=Math.cos(t*p.sp+p.ph)*0.008*driftMul; p.vy+=Math.sin(t*p.sp*1.1+p.ph)*0.008*driftMul;  // drift, faster as you scroll
      modeForce(p);
      if(endPull>0){ p.vx+=(_cx-p.x)*0.00024*endPull; p.vy+=(_cy-p.y)*0.00024*endPull; }            // converge near the bottom
      if(hasMouse){ const dx=mx-p.x,dy=my-p.y,d2=dx*dx+dy*dy,RR=180; if(d2<RR*RR){ const d=Math.sqrt(d2)||1,f=1-d/RR;
        p.vx+=(dx/d)*f*0.034+(-dy/d)*f*0.04;   // gentle pull + stronger swirl => orbits, never knots
        p.vy+=(dy/d)*f*0.034+( dx/d)*f*0.04; } }
      p.vx*=0.965; p.vy*=0.965;
      const sp=Math.hypot(p.vx,p.vy), MAX=hasMouse?1.35:((0.9+SP*1.1)*(1-0.45*endPull)); if(sp>MAX){ p.vx=p.vx/sp*MAX; p.vy=p.vy/sp*MAX; }
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<-20)p.x=W+20; else if(p.x>W+20)p.x=-20;
      if(p.y<-20)p.y=H+20; else if(p.y>H+20)p.y=-20;
      const gx=(p.x/CELL)|0, gy=(p.y/CELL)|0, key=gx+'|'+gy; let c=grid.get(key); if(!c){c=[];grid.set(key,c);} c.push(i);
    }
  }
  function drawConnections(){
    ctx.lineWidth=1;
    for(let i=0;i<parts.length;i++){ const p=parts[i], gx=(p.x/CELL)|0, gy=(p.y/CELL)|0;
      for(let ox=-1;ox<=1;ox++)for(let oy=-1;oy<=1;oy++){ const cell=grid.get((gx+ox)+'|'+(gy+oy)); if(!cell)continue;
        for(let n=0;n<cell.length;n++){ const j=cell[n]; if(j<=i)continue; const q=parts[j];
          const dx=p.x-q.x, dy=p.y-q.y, d2=dx*dx+dy*dy;
          if(d2<R2D){ const d=Math.sqrt(d2), a=1-d/D; const al=0.06*a;
            ctx.strokeStyle='rgba('+LINE+','+al.toFixed(3)+')'; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
          }
        }
      }
    }
  }
  function drawParticles(){
    for(const p of parts){
      let near=0; if(hasMouse){ const dx=mx-p.x,dy=my-p.y,d2=dx*dx+dy*dy; if(d2<150*150) near=1-Math.sqrt(d2)/150; }
      if(near>0){ ctx.fillStyle='rgba(150,178,214,'+(0.19+0.18*near).toFixed(3)+')'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*(1+near*0.3),0,6.283); ctx.fill(); }
      else{ ctx.fillStyle='rgba('+PARTICLE+',0.19)'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.283); ctx.fill(); }
    }
  }
  function drawStatic(){ ctx.clearRect(0,0,W,H);
    grid.clear(); for(let i=0;i<parts.length;i++){ const p=parts[i],gx=(p.x/CELL)|0,gy=(p.y/CELL)|0,key=gx+'|'+gy; let c=grid.get(key); if(!c){c=[];grid.set(key,c);}c.push(i);} 
    drawConnections(); drawParticles(); }

  function loop(now){
    if(!running) return;
    const t=now*0.001;
    const want=bgFieldMode==='scatter'?0:1; org+=(want-org)*0.02;   // organisation eases in/out
    ctx.clearRect(0,0,W,H);
    step(t); drawConnections(); drawParticles();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
function setupFieldModes(){
  // Subconscious per-section gravity. Real selectors per page; missing ones simply no-op.
  const page=(document.body.getAttribute('data-page')||'').replace('.html','');
  const map={
    index:[['.hero','scatter'],['.svc-marquee-sec','hflow'],['.home-tease','circle'],['.home-sec','clusters'],['footer','converge']],
    about:[['.hero','scatter'],['.approach','circle'],['.timeline','hflow'],['footer','converge']],
    work:[['.hero','scatter'],['.work-grid','clusters'],['.cases','clusters'],['footer','converge']],
    services:[['.hero','scatter'],['.svc-list','network'],['.services','network'],['footer','converge']],
    contact:[['.hero','converge'],['.contact','converge'],['footer','converge']],
    case:[['.case-hero','scatter'],['.case-main','hflow'],['footer','converge']]
  };
  const list=map[page]||[['footer','converge']];
  const apply=(el,mode)=>{ bgFieldMode=mode; };
  if(window.gsap&&window.ScrollTrigger){
    list.forEach(([sel,mode])=>document.querySelectorAll(sel).forEach(el=>{
      ScrollTrigger.create({trigger:el,start:'top 60%',end:'bottom 40%',onToggle:s=>{ if(s.isActive) apply(el,mode); }});
    }));
  } else {
    const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting&&e.intersectionRatio>0.3){ const m=e.target.getAttribute('data-fieldmode'); if(m) bgFieldMode=m; } }),{threshold:[0.3,0.6]});
    list.forEach(([sel,mode])=>document.querySelectorAll(sel).forEach(el=>{ el.setAttribute('data-fieldmode',mode); io.observe(el); }));
  }
}
if(document.readyState!=='loading') boot(); else document.addEventListener('DOMContentLoaded',boot);
})();
