
(()=>{
'use strict';
const AREAS=[
 {id:'financas',label:'Finanças',href:'index.html',icon:'R$',desc:'Lançamentos, cartões, dívidas, patrimônio e projeções.'},
 {id:'educacao',label:'Educação',href:'educacao.html',icon:'⌁',desc:'Formações, currículo e trajetória acadêmica.'},
 {id:'saude',label:'Saúde',href:'saude.html',icon:'♡',desc:'Exames, histórico e gráficos comparativos.'},
 {id:'entretenimento',label:'Entretenimento',href:'entretenimento.html',icon:'▶',desc:'Filmes, séries, livros, documentários e viagens.'}
];
function profile(){try{return localStorage.getItem('planejador_active_profile')||'Marcos'}catch(e){return'Marcos'}}
function current(){return document.body.dataset.hubArea||'financas'}
function markup(){return `<div class="hub-backdrop" id="hubAreaOverlay" aria-hidden="true"><div class="hub-universe"><button class="hub-close" type="button" aria-label="Fechar">×</button><div class="hub-title"><span class="hub-mark"></span><h2>Seu Hub Pessoal</h2><p>Escolha para onde quer ir. Cada área carrega somente quando você entra nela.</p></div><div class="hub-areas">${AREAS.map(a=>`<a class="hub-area ${a.id===current()?'current':''}" href="${a.href}"><span class="area-icon">${a.icon}</span><span><b>${a.label}</b><small>${a.desc}</small></span></a>`).join('')}</div></div></div>`}
function ensureOverlay(){if(document.getElementById('hubAreaOverlay'))return;document.body.insertAdjacentHTML('beforeend',markup());const ov=document.getElementById('hubAreaOverlay');ov.querySelector('.hub-close').onclick=()=>close();ov.addEventListener('click',e=>{if(e.target===ov)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()})}
function open(){ensureOverlay();const ov=document.getElementById('hubAreaOverlay');ov.classList.add('open');ov.setAttribute('aria-hidden','false')}
function close(){const ov=document.getElementById('hubAreaOverlay');if(!ov)return;ov.classList.remove('open');ov.setAttribute('aria-hidden','true')}
function buttonHTML(){return `<button class="hub-launch" type="button" data-hub-launch><span class="mini-mark"></span><span class="hub-word">HUB</span></button>`}
function installFinanceButton(){
 if(current()!=='financas'||document.querySelector('.hub-finance-launcher'))return;
 const wrap=document.createElement('div');
 wrap.className='hub-finance-launcher';
 wrap.innerHTML=buttonHTML();
 document.body.appendChild(wrap);
}
function bind(){document.addEventListener('click',e=>{const b=e.target.closest?.('[data-hub-launch]');if(b){e.preventDefault();open()}});installFinanceButton();setTimeout(installFinanceButton,250);setTimeout(installFinanceButton,1200)}
function localNav(){const page=document.body.dataset.hubArea;if(page==='financas')return;const buttons=[...document.querySelectorAll('[data-page-view]')];function show(id){document.querySelectorAll('.main > .view').forEach(v=>v.classList.toggle('active',v.id===id));buttons.forEach(b=>b.classList.toggle('active',b.dataset.pageView===id));try{history.replaceState(null,'','#'+id)}catch(e){};window.dispatchEvent(new CustomEvent('hub:viewchange',{detail:{id}}));return true}buttons.forEach(b=>b.addEventListener('click',()=>show(b.dataset.pageView)));document.addEventListener('click',e=>{const b=e.target.closest?.('[data-v115-open],[data-v130-open]');if(!b)return;const id=b.dataset.v115Open||b.dataset.v130Open;if(document.getElementById(id)){e.preventDefault();show(id)}});window.showView=show;const initial=(location.hash||'').replace('#','');show(document.getElementById(initial)?initial:(buttons[0]?.dataset.pageView||document.querySelector('.main>.view')?.id));}
function updateProfileLabel(){document.querySelectorAll('[data-hub-profile-name]').forEach(x=>x.textContent=profile());document.querySelectorAll('[data-hub-profile-letter]').forEach(x=>x.textContent=profile().slice(0,1).toUpperCase())}
function init(){ensureOverlay();bind();localNav();updateProfileLabel();document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateProfileLabel()});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.HubPessoal={open,close,profile};
})();
