(()=>{
'use strict';
const AREAS=[
 {id:'financas',label:'Finanças',href:'index.html'},
 {id:'educacao',label:'Educação',href:'educacao.html'},
 {id:'saude',label:'Saúde',href:'saude.html'},
 {id:'entretenimento',label:'Entretenimento',href:'entretenimento.html'}
];
function current(){return document.body.dataset.hubArea||'financas'}
function markup(){
 return `<div class="hub-backdrop" id="hubAreaOverlay" aria-hidden="true">
  <div class="hub-universe" role="dialog" aria-modal="true" aria-labelledby="hubModalTitle">
   <button class="hub-close" type="button" aria-label="Fechar">×</button>
   <div class="hub-title"><span class="hub-mark" aria-hidden="true"></span><h2 id="hubModalTitle">Hub Pessoal</h2></div>
   <div class="hub-areas">${AREAS.map((a,i)=>`<a class="hub-area ${a.id===current()?'current':''}" href="${a.href}" aria-label="Abrir ${a.label}"><span class="hub-index">0${i+1}</span><b>${a.label}</b></a>`).join('')}</div>
  </div>
 </div>`
}
function ensureOverlay(){
 if(document.getElementById('hubAreaOverlay'))return;
 document.body.insertAdjacentHTML('beforeend',markup());
 const ov=document.getElementById('hubAreaOverlay');
 ov.querySelector('.hub-close').addEventListener('click',close);
 ov.addEventListener('click',e=>{if(e.target===ov)close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ov.classList.contains('open'))close()});
}
function open(){ensureOverlay();const ov=document.getElementById('hubAreaOverlay');ov.classList.add('open');ov.setAttribute('aria-hidden','false');document.documentElement.classList.add('hub-modal-lock')}
function close(){const ov=document.getElementById('hubAreaOverlay');if(!ov)return;ov.classList.remove('open');ov.setAttribute('aria-hidden','true');document.documentElement.classList.remove('hub-modal-lock')}
function syncLoginLock(){const ov=document.getElementById('loginOverlay');const visible=!!ov&&getComputedStyle(ov).display!=='none'&&getComputedStyle(ov).visibility!=='hidden';document.documentElement.classList.toggle('hub-login-lock',visible);document.body?.classList.toggle('hub-login-lock',visible)}
function bind(){
 document.addEventListener('click',e=>{const b=e.target.closest?.('[data-hub-launch]');if(!b)return;e.preventDefault();e.stopPropagation();open()});
 syncLoginLock();
 const login=document.getElementById('loginOverlay');if(login)new MutationObserver(syncLoginLock).observe(login,{attributes:true,attributeFilter:['class','style']});
}
function init(){ensureOverlay();bind()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.HubPessoal={open,close};
})();
