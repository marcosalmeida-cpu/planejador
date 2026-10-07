(()=>{
'use strict';
const AREAS=[
 {id:'financas',label:'Finanças',href:'index.html'},
 {id:'educacao',label:'Educação',href:'educacao.html'},
 {id:'saude',label:'Saúde',href:'saude.html'},
 {id:'entretenimento',label:'Entretenimento',href:'entretenimento.html'}
];
function profile(){try{return localStorage.getItem('planejador_active_profile')||'Marcos'}catch(e){return'Marcos'}}
function current(){return document.body.dataset.hubArea||'financas'}
function markup(){return `<div class="hub-backdrop" id="hubAreaOverlay" aria-hidden="true"><div class="hub-universe"><button class="hub-close" type="button" aria-label="Fechar">×</button><div class="hub-title"><span class="hub-mark"></span><h2>Hub Pessoal</h2></div><div class="hub-areas">${AREAS.map(a=>`<a class="hub-area ${a.id===current()?'current':''}" href="${a.href}"><b>${a.label}</b></a>`).join('')}</div></div></div>`}
function ensureOverlay(){if(document.getElementById('hubAreaOverlay'))return;document.body.insertAdjacentHTML('beforeend',markup());const ov=document.getElementById('hubAreaOverlay');ov.querySelector('.hub-close').onclick=()=>close();ov.addEventListener('click',e=>{if(e.target===ov)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()})}
function open(){ensureOverlay();const ov=document.getElementById('hubAreaOverlay');ov.classList.add('open');ov.setAttribute('aria-hidden','false')}
function close(){const ov=document.getElementById('hubAreaOverlay');if(!ov)return;ov.classList.remove('open');ov.setAttribute('aria-hidden','true')}
function buttonHTML(){return `<button class="hub-launch" type="button" data-hub-launch><span class="mini-mark"></span><span class="hub-word">HUB</span></button>`}
function visibleProfileAnchor(){
 const candidates=[document.getElementById('v76ProfilePod'),...document.querySelectorAll('.profile-man')];
 return candidates.find(el=>{if(!el)return false;const cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>.05&&r.width>20&&r.height>20&&r.bottom>0&&r.top<innerHeight;})||null;
}
function positionFinanceButton(){
 if(current()!=='financas')return;
 const wrap=document.querySelector('.hub-finance-launcher');if(!wrap)return;
 const anchor=visibleProfileAnchor();const h=40,gap=9;
 if(anchor){const r=anchor.getBoundingClientRect();let left=r.right+gap;const estimated=94;if(left+estimated>innerWidth-8)left=Math.max(8,r.left-estimated-gap);wrap.style.left=Math.round(left)+'px';wrap.style.right='auto';wrap.style.top=Math.max(7,Math.round(r.top+(r.height-h)/2))+'px';}
 else{wrap.style.left='auto';wrap.style.right='70px';wrap.style.top='10px';}
}
function installFinanceButton(){if(current()!=='financas')return;let wrap=document.querySelector('.hub-finance-launcher');if(!wrap){wrap=document.createElement('div');wrap.className='hub-finance-launcher';wrap.innerHTML=buttonHTML();document.body.appendChild(wrap);}positionFinanceButton();}
let posRAF=0;function schedulePosition(){if(posRAF)return;posRAF=requestAnimationFrame(()=>{posRAF=0;positionFinanceButton();});}
function syncLoginLock(){const ov=document.getElementById('loginOverlay');const visible=!!ov&&getComputedStyle(ov).display!=='none'&&getComputedStyle(ov).visibility!=='hidden';document.documentElement.classList.toggle('hub-login-lock',visible);document.body?.classList.toggle('hub-login-lock',visible)}
function bind(){document.addEventListener('click',e=>{const b=e.target.closest?.('[data-hub-launch]');if(b){e.preventDefault();open();}});installFinanceButton();syncLoginLock();[80,300,900,1800].forEach(ms=>setTimeout(()=>{installFinanceButton();syncLoginLock();},ms));addEventListener('resize',schedulePosition,{passive:true});addEventListener('scroll',schedulePosition,{passive:true});const mo=new MutationObserver(()=>{schedulePosition();syncLoginLock();});mo.observe(document.body,{childList:true,subtree:false});const login=document.getElementById('loginOverlay');if(login)mo.observe(login,{attributes:true,attributeFilter:['class','style']});}

const PAGE_ICONS={
 'edu-overview':'⌂','edu-curriculo':'≡','edu-formacoes':'▤','edu-publicacoes':'▥',
 'health-overview':'⌂','health-exams':'✚',
 'ent-overview':'⌂','ent-filmes':'▷','ent-docs':'◉','ent-series':'▦','ent-livros':'▥','ent-viagens':'✈'
};
function ensureIntegratedShell(){
 if(current()==='financas'||!document.body.classList.contains('hub-page'))return;
 if(!document.querySelector('.hub-float-nav')){
   const rail=document.createElement('div');rail.className='hub-float-nav';rail.setAttribute('aria-label','Navegação rápida');
   document.querySelectorAll('.hub-local-nav button[data-page-view]').forEach(src=>{
     const b=document.createElement('button');b.type='button';b.dataset.pageView=src.dataset.pageView;b.title=src.textContent.trim();b.setAttribute('aria-label',src.textContent.trim());b.textContent=PAGE_ICONS[src.dataset.pageView]||'•';
     b.onclick=()=>{src.click();syncIntegratedActive();};rail.appendChild(b);
   });document.body.appendChild(rail);
 }
 if(!document.querySelector('.hub-float-actions')){
   const box=document.createElement('div');box.className='hub-float-actions';
   box.innerHTML='<button class="hub-float-hub" type="button" data-hub-launch aria-label="Abrir Hub">HUB</button><button class="hub-float-profile" type="button" aria-label="Perfil" title="Perfil"><span data-hub-profile-letter>M</span></button>';
   box.querySelector('.hub-float-profile').onclick=()=>location.href='index.html';document.body.appendChild(box);
 }
 syncIntegratedActive();
}
function syncIntegratedActive(){
 const id=document.querySelector('.hub-local-nav button.active')?.dataset.pageView;
 document.querySelectorAll('.hub-float-nav button[data-page-view]').forEach(b=>b.classList.toggle('active',b.dataset.pageView===id));
}
function syncIntegratedHeader(){
 if(current()==='financas'||!document.body.classList.contains('hub-page'))return;
 const should=innerWidth>640&&scrollY>155&&!document.getElementById('hubAreaOverlay')?.classList.contains('open');
 document.body.classList.toggle('hub-split-header',should);
}

function localNav(){const page=document.body.dataset.hubArea;if(page==='financas')return;const buttons=[...document.querySelectorAll('[data-page-view]')];function show(id){document.querySelectorAll('.main > .view').forEach(v=>v.classList.toggle('active',v.id===id));buttons.forEach(b=>b.classList.toggle('active',b.dataset.pageView===id));try{history.replaceState(null,'','#'+id)}catch(e){}window.dispatchEvent(new CustomEvent('hub:viewchange',{detail:{id}}));syncIntegratedActive();return true}buttons.forEach(b=>b.addEventListener('click',()=>show(b.dataset.pageView)));document.addEventListener('click',e=>{const b=e.target.closest?.('[data-v115-open],[data-v130-open]');if(!b)return;const id=b.dataset.v115Open||b.dataset.v130Open;if(document.getElementById(id)){e.preventDefault();show(id)}});window.showView=show;const initial=(location.hash||'').replace('#','');show(document.getElementById(initial)?initial:(buttons[0]?.dataset.pageView||document.querySelector('.main>.view')?.id));}
function updateProfileLabel(){document.querySelectorAll('[data-hub-profile-name]').forEach(x=>x.textContent=profile());document.querySelectorAll('[data-hub-profile-letter]').forEach(x=>x.textContent=profile().slice(0,1).toUpperCase())}
function init(){ensureOverlay();bind();localNav();ensureIntegratedShell();updateProfileLabel();syncIntegratedHeader();addEventListener('scroll',syncIntegratedHeader,{passive:true});addEventListener('resize',syncIntegratedHeader,{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateProfileLabel()});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.HubPessoal={open,close,profile};
})();
