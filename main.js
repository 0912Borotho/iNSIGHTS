(()=>{
const $=(s,c=document)=>[...c.querySelectorAll(s)];
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* hero load-in */
$('.hero-grid>div:first-child>*').forEach((el,i)=>el.style.animationDelay=i*.12+'s');
$('.bar').forEach((b,i)=>b.style.animationDelay=.6+i*.08+'s');

/* scroll reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -40px 0px'});
$('.pillar,.service,.audience-card').forEach(el=>{el.style.setProperty('--d',([...el.parentNode.children].indexOf(el)%3)*.1+'s');el.classList.add('reveal');io.observe(el)});
$('.section-head,.story-card,.copy,.contact-grid>*,.tech-inner>*').forEach(el=>{el.classList.add('reveal');io.observe(el)});

/* infographics: stats count-up, journey line, hub cards */
$('.j-step').forEach((el,i)=>el.style.setProperty('--d',i*.3+'s'));
$('.hub-card').forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--d',i*.12+'s')});
const count=el=>{
  const to=+el.dataset.count,from=+(el.dataset.from||0);
  if(rm){el.textContent=to;return}
  const t0=performance.now();
  const tick=t=>{
    const k=Math.min((t-t0)/1400,1),e=1-Math.pow(1-k,3);
    el.textContent=Math.round(from+(to-from)*e);
    if(k<1)requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const io2=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('in');
  $('[data-count]',e.target).forEach(count);
  io2.unobserve(e.target);
}),{threshold:.25});
$('.journey,.stat,.hub-card,.hub-tree').forEach(el=>io2.observe(el));

/* insight card reveal */
$('.insight-card').forEach(el=>{el.classList.add('reveal');io.observe(el)});

/* progress rings: set up each circle's dash length, then animate on scroll */
$('.ring').forEach(ring=>{
  const pct=+ring.dataset.pct;
  const fill=ring.querySelector('.ring-fill');
  const r=fill.r.baseVal.value;
  const c=2*Math.PI*r;
  fill.style.strokeDasharray=c;
  fill.style.strokeDashoffset=c;
  fill.dataset.offset=c-(c*pct/100);
});
const ringIo=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('in');
  const fill=e.target.querySelector('.ring-fill');
  if(fill)fill.style.strokeDashoffset=fill.dataset.offset;
  fill&&fill.style.setProperty('transition','stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1)');
  $('[data-count]',e.target).forEach(count);
  ringIo.unobserve(e.target);
}),{threshold:.4});
$('.ring-item').forEach(el=>ringIo.observe(el));

/* progress bar + header state */
const bar=document.createElement('div');
bar.className='progress';
document.body.prepend(bar);
const hd=document.querySelector('header');
const onScroll=()=>{
  const h=document.documentElement;
  bar.style.transform='scaleX('+(scrollY/(h.scrollHeight-innerHeight||1))+')';
  hd.classList.toggle('scrolled',scrollY>20);
};
addEventListener('scroll',onScroll,{passive:true});
onScroll();

/* active nav link */
const nl=$('.navlinks a');
const so=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)nl.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));
}),{rootMargin:'-45% 0px -50% 0px'});
$('main section[id]').forEach(s=>so.observe(s));

/* dashboard tilt (mouse devices) */
if(matchMedia('(hover:hover)').matches){
  const hero=document.querySelector('.hero'),dash=document.querySelector('.dashboard');
  hero.addEventListener('pointermove',e=>{
    const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    dash.style.transform='perspective(900px) rotate(2deg) rotateY('+x*8+'deg) rotateX('+(-y*8)+'deg)';
  });
  hero.addEventListener('pointerleave',()=>dash.style.transform='');
}

/* mobile menu */
const menuBtn=document.getElementById('menu'),navLinks=document.getElementById('navlinks');
if(menuBtn&&navLinks){
  menuBtn.addEventListener('click',()=>{
    const o=navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',o);
  });
  navLinks.querySelectorAll('a').forEach(l=>l.addEventListener('click',()=>{
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
  }));
}

/* contact form: opens the visitor's email app with the enquiry prepared */
document.getElementById('contactForm').addEventListener('submit',e=>{
  e.preventDefault();
  const f=new FormData(e.currentTarget);
  const subject=encodeURIComponent('Website enquiry: '+f.get('service'));
  const body=encodeURIComponent('Name: '+f.get('name')+'\nEmail: '+f.get('email')+'\nService: '+f.get('service')+'\n\nMessage:\n'+(f.get('message')||'Hello'));
  window.location.href='mailto:borothomaxwell@gmail.com?subject='+subject+'&body='+body;
});
})();
