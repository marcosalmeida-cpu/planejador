(()=>{
'use strict';
const SESSION_KEY='pp_secure_session_v45';
const WORKSPACE_KEY='pp_secure_workspace_v45';
function profile(){try{return localStorage.getItem('planejador_active_profile')||'Marcos'}catch(e){return'Marcos'}}
function navButtons(){return [...document.querySelectorAll('.hub-shell-nav button[data-page-view]')]}
function show(id){
 const target=document.getElementById(id); if(!target)return false;
 document.querySelectorAll('.main > .view').forEach(v=>v.classList.toggle('active',v===target));
 document.querySelectorAll('[data-page-view]').forEach(b=>b.classList.toggle('active',b.dataset.pageView===id));
 try{history.replaceState(null,'','#'+id)}catch(e){}
 window.scrollTo({top:0,behavior:'auto'}); return true;
}
function profileSvg(){return '<svg viewBox="0 0 24 24"><circle cx="12" cy="7.2" r="3.2"/><path d="M5.2 20c.5-4.3 2.8-6.5 6.8-6.5s6.3 2.2 6.8 6.5"/><path d="M8.8 14.2 12 17l3.2-2.8"/></svg>'}
function buildFloating(){
 if(!document.getElementById('hubFloatNav')){const r=document.createElement('div');r.id='hubFloatNav';navButtons().forEach(src=>{const b=document.createElement('button');b.type='button';b.dataset.pageView=src.dataset.pageView;b.title=src.textContent.trim();b.setAttribute('aria-label',src.textContent.trim());b.onclick=()=>show(b.dataset.pageView);r.appendChild(b)});document.body.appendChild(r)}
 if(!document.getElementById('hubFloatTools')){const d=document.createElement('div');d.id='hubFloatTools';d.innerHTML=`<button class="hub-float-profile" type="button" title="Perfil">${profileSvg()}</button><button class="hub-float-hub" type="button" data-hub-launch title="Hub"><span class="mini-mark"></span></button>`;document.body.appendChild(d);d.querySelector('.hub-float-profile').onclick=openProfile}
}
function buildMenu(){if(document.getElementById('hubShellMenuPop'))return;const p=document.createElement('div');p.className='hub-shell-menu-pop';p.id='hubShellMenuPop';navButtons().forEach(src=>{const b=document.createElement('button');b.type='button';b.dataset.pageView=src.dataset.pageView;b.textContent=src.textContent;b.onclick=()=>{show(b.dataset.pageView);p.classList.remove('open')};p.appendChild(b)});document.body.appendChild(p)}
function buildProfile(){if(document.getElementById('hubProfileModal'))return;const m=document.createElement('div');m.className='hub-profile-modal';m.id='hubProfileModal';m.innerHTML=`<div class="hub-profile-card"><div class="hub-profile-head"><h2>Perfil</h2><button class="hub-profile-close" type="button">×</button></div><div class="hub-profile-body"><div class="hub-current-profile"><div class="avatar">${profile().slice(0,1).toUpperCase()}</div><div><b>${profile()}</b><small>Perfil pessoal</small></div></div><div class="hub-profile-actions"><button class="primary" id="hubSwitchProfile" type="button">Trocar perfil</button><button id="hubChangePass" type="button">Alterar senha</button><button class="danger" id="hubLogoutModal" type="button">Sair</button></div></div></div>`;document.body.appendChild(m);m.querySelector('.hub-profile-close').onclick=()=>m.classList.remove('open');m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')});m.querySelector('#hubSwitchProfile').onclick=()=>{logout(false)};m.querySelector('#hubChangePass').onclick=()=>{const p=prompt('Digite a nova senha de 6 dígitos:');if(!p)return;if(!/^\d{6}$/.test(p)){alert('Use exatamente 6 dígitos.');return}localStorage.setItem('planejador_password_'+profile(),p);alert('Senha alterada.')};m.querySelector('#hubLogoutModal').onclick=()=>logout(true)}
function openProfile(){buildProfile();const m=document.getElementById('hubProfileModal');const av=m.querySelector('.avatar'),b=m.querySelector('.hub-current-profile b');av.textContent=profile().slice(0,1).toUpperCase();b.textContent=profile();m.classList.add('open')}
function logout(){try{sessionStorage.removeItem(SESSION_KEY);sessionStorage.removeItem(WORKSPACE_KEY);sessionStorage.removeItem('pp_v42_authed_profile');sessionStorage.removeItem('pp_v41_authed_profile');sessionStorage.removeItem('pp_session_v44_authed_profile')}catch(e){}location.href='index.html'}
function paintTimer(){const el=document.getElementById('sessionTimerHub');if(!el)return;let s=null;try{s=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null')}catch(e){}const left=s?.expiresAt?Math.max(0,Number(s.expiresAt)-Date.now()):0;if(!s?.authenticated||left<=0){el.querySelector('.session-time').textContent='00:00';return}const sec=Math.ceil(left/1000),min=Math.floor(sec/60),ss=sec%60;el.querySelector('.session-time').textContent=String(min).padStart(2,'0')+':'+String(ss).padStart(2,'0')}
function updateIdentity(){document.querySelectorAll('[data-hub-profile-name]').forEach(x=>x.textContent=profile());document.querySelectorAll('[data-hub-profile-letter]').forEach(x=>x.textContent=profile().slice(0,1).toUpperCase())}
function applySplit(){const split=innerWidth>620&&scrollY>=170&&!document.querySelector('.hub-profile-modal.open,.hub-backdrop.open');document.body.classList.toggle('hub-shell-split',split)}
function init(){
 const session=(()=>{try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null')}catch(e){return null}})();
 if(!session?.authenticated&&location.protocol!=='file:'){location.replace('index.html');return}
 buildFloating();buildMenu();buildProfile();updateIdentity();paintTimer();setInterval(paintTimer,1000);
 navButtons().forEach(b=>b.onclick=()=>show(b.dataset.pageView));
 const initial=(location.hash||'').slice(1);show(document.getElementById(initial)?initial:(navButtons()[0]?.dataset.pageView));
 document.querySelector('.hub-shell-profile')?.addEventListener('click',openProfile);
 document.querySelector('.hub-shell-logout')?.addEventListener('click',()=>logout(true));
 document.querySelector('.hub-shell-menu')?.addEventListener('click',e=>{e.stopPropagation();document.getElementById('hubShellMenuPop')?.classList.toggle('open')});
 document.addEventListener('click',e=>{if(!e.target.closest('.hub-shell-menu,#hubShellMenuPop'))document.getElementById('hubShellMenuPop')?.classList.remove('open');const x=e.target.closest?.('[data-v115-open],[data-v130-open]');if(x){const id=x.dataset.v115Open||x.dataset.v130Open;if(document.getElementById(id)){e.preventDefault();show(id)}}});
 addEventListener('scroll',()=>requestAnimationFrame(applySplit),{passive:true});addEventListener('resize',applySplit,{passive:true});applySplit();
 window.showView=show;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
