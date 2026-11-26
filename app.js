// Small points begin near the lettering and gather into the paths as they are drawn.
const svgNS='http://www.w3.org/2000/svg';
document.querySelectorAll('.laser-section').forEach((section, sectionIndex)=>{
 const group=section.querySelector('svg > g');
 const paths=[...group.querySelectorAll('path')];
 const dust=document.createElementNS(svgNS,'g');
 dust.setAttribute('class','particle-field');
 for(let i=0;i<paths.length;i+=3){
  const values=paths[i].getAttribute('d').match(/[-+]?(?:\d*\.)?\d+/g).map(Number);
  const wrap=document.createElementNS(svgNS,'g');wrap.setAttribute('class','particle-drift');
  const point=document.createElementNS(svgNS,'circle');point.setAttribute('class','particle');
  point.setAttribute('cx',values[0]);point.setAttribute('cy',values[1]);point.setAttribute('r', i%12===0 ? '.038' : '.026');
  const seed=i*1.618+sectionIndex*2.1;
  point.style.setProperty('--dx',`${(Math.sin(seed)*.65).toFixed(3)}px`);
  point.style.setProperty('--dy',`${(Math.cos(seed*1.3)*.52).toFixed(3)}px`);
  point.style.setProperty('--order',paths[i].style.getPropertyValue('--order'));
  point.style.setProperty('--step',paths[i].style.getPropertyValue('--step'));
  wrap.style.setProperty('--drift-delay',`${-(i%11)*.19}s`);
  point.style.setProperty('--twinkle',`${1.6+(i%5)*.24}s`);
  point.style.setProperty('--brightness',i%12===0 ? '.95' : '.72');
  wrap.append(point);dust.append(wrap);
 }
 group.prepend(dust);
});
// Restart the drawing cycle only while each artwork is in view.
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const sections=[...document.querySelectorAll('.laser-section')];
const observer=new IntersectionObserver(entries=>{
 for(const entry of entries){
  if(entry.isIntersecting)entry.target.classList.add('is-visible');
  else entry.target.classList.remove('is-visible');
 }
},{threshold:.3});
sections.forEach(section=>{
 observer.observe(section);
 section.addEventListener('animationend',event=>{
  if(event.target!==section || event.animationName!=='laser-cycle-clock' || reducedMotion.matches)return;
  section.classList.remove('is-visible');
  void section.offsetWidth;
  section.classList.add('is-visible');
 });
});
