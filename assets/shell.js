(()=>{
'use strict';
const SESSION_KEY='pp_secure_session_v45', WORKSPACE_KEY='pp_secure_workspace_v45';
function profile(){try{return localStorage.getItem('planejador_active_profile')||'Marcos'}catch(e){return'Marcos'}}
function show(id){
  const target=document.getElementById(id);if(!target)return false;
  document.querySelectorAll('.main .view').forEach(v=>v.classList.toggle('active',v===target));
  document.querySelectorAll('[data-page-view]').forEach(b=>b.classList.toggle('active',b.dataset.pageView===id));
  try{history.replaceState(null,'','#'+id)}catch(e){}
  document.getElementById('financeShellMenuPop')?.classList.remove('open');
  try{window.ppEntertainmentV130?.render?.(id)}catch(e){}
  try{window.dispatchEvent(new CustomEvent('hub:viewchange',{detail:{id}}))}catch(e){}
  window.scrollTo({top:0,behavior:'auto'});
  return true;
}
function profileSvg(){return '<svg viewBox="0 0 24 24"><circle cx="12" cy="7.2" r="3.2"/><path d="M5.2 20c.5-4.3 2.8-6.5 6.8-6.5s6.3 2.2 6.8 6.5"/><path d="M8.8 14.2 12 17l3.2-2.8"/></svg>'}
function buildFloating(){
  if(!document.getElementById('financeFloatNav')){
    const r=document.createElement('div');r.id='financeFloatNav';
    document.querySelectorAll('.finance-shell-menu-pop [data-page-view]').forEach(src=>{const b=document.createElement('button');b.type='button';b.dataset.pageView=src.dataset.pageView;b.title=src.textContent.trim();b.setAttribute('aria-label',src.textContent.trim());b.onclick=()=>show(b.dataset.pageView);r.appendChild(b)});
    document.body.appendChild(r)
  }
  if(!document.getElementById('financeFloatTools')){
    const d=document.createElement('div');d.id='financeFloatTools';d.innerHTML=`<button class="float-profile" type="button" title="Perfil">${profileSvg()}</button>`;document.body.appendChild(d);d.querySelector('.float-profile').onclick=openProfile
  }
}
function buildProfile(){if(document.getElementById('hubProfileModal'))return;const m=document.createElement('div');m.className='hub-profile-modal';m.id='hubProfileModal';m.innerHTML=`<div class="hub-profile-card"><div class="hub-profile-head"><h2>Perfil</h2><button class="hub-profile-close" type="button">×</button></div><div class="hub-profile-body"><div class="hub-current-profile"><div class="avatar">${profile().slice(0,1).toUpperCase()}</div><div><b>${profile()}</b><small>Perfil pessoal</small></div></div><div class="hub-profile-actions"><button class="primary" id="hubSwitchProfile" type="button">Trocar perfil</button><button id="hubChangePass" type="button">Alterar senha</button><button class="danger" id="hubLogoutModal" type="button">Sair</button></div></div></div>`;document.body.appendChild(m);m.querySelector('.hub-profile-close').onclick=()=>m.classList.remove('open');m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')});m.querySelector('#hubSwitchProfile').onclick=()=>logout();m.querySelector('#hubChangePass').onclick=()=>{const p=prompt('Digite a nova senha de 6 dígitos:');if(!p)return;if(!/^\d{6}$/.test(p)){alert('Use exatamente 6 dígitos.');return}localStorage.setItem('planejador_password_'+profile(),p);alert('Senha alterada.')};m.querySelector('#hubLogoutModal').onclick=logout}
function openProfile(){buildProfile();const m=document.getElementById('hubProfileModal');m.querySelector('.avatar').textContent=profile().slice(0,1).toUpperCase();m.querySelector('.hub-current-profile b').textContent=profile();m.classList.add('open')}
function logout(){try{sessionStorage.removeItem(SESSION_KEY);sessionStorage.removeItem(WORKSPACE_KEY);sessionStorage.removeItem('pp_v42_authed_profile');sessionStorage.removeItem('pp_v41_authed_profile');sessionStorage.removeItem('pp_session_v44_authed_profile')}catch(e){}location.href='index.html'}
function paintTimer(){const el=document.querySelector('.finance-timer');if(!el)return;let s=null;try{s=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null')}catch(e){}const left=s?.expiresAt?Math.max(0,Number(s.expiresAt)-Date.now()):0;if(!s?.authenticated||left<=0){el.querySelector('.session-time').textContent='00:00';return}const sec=Math.ceil(left/1000),min=Math.floor(sec/60),ss=sec%60;el.querySelector('.session-time').textContent=String(min).padStart(2,'0')+':'+String(ss).padStart(2,'0')}
function backup(){const data={type:'HubPessoalBackup',exportedAt:new Date().toISOString(),profile:profile(),localStorage:{}};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&(k.startsWith('pp_')||k.startsWith('planejador_')))data.localStorage[k]=localStorage.getItem(k)}const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`Hub_Pessoal_Backup_${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function applySplit(){const split=innerWidth>560&&scrollY>=170&&!document.querySelector('.hub-profile-modal.open,.hub-backdrop.open');document.body.classList.toggle('finance-shell-split',split)}
function init(){
 let s=null;try{s=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null')}catch(e){}if(!s?.authenticated&&location.protocol!=='file:'){location.replace('index.html');return}
 buildProfile();buildFloating();paintTimer();setInterval(paintTimer,1000);
 const menu=document.getElementById('financeShellMenuPop');
 menu?.querySelectorAll('[data-page-view]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show(b.dataset.pageView)}));
 document.querySelector('.finance-profile-icon')?.addEventListener('click',openProfile);
 document.querySelector('.finance-logout')?.addEventListener('click',logout);
 document.querySelector('.finance-backup')?.addEventListener('click',backup);
 document.querySelector('.finance-menu')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();menu?.classList.toggle('open')});
 document.addEventListener('click',e=>{if(!e.target.closest('.finance-menu,#financeShellMenuPop'))menu?.classList.remove('open');const x=e.target.closest?.('[data-v115-open],[data-v130-open]');if(x){const id=x.dataset.v115Open||x.dataset.v130Open;if(document.getElementById(id)){e.preventDefault();show(id)}}});
 const initial=(location.hash||'').slice(1);const first=menu?.querySelector('[data-page-view]')?.dataset.pageView;show(document.getElementById(initial)?initial:first);
 addEventListener('scroll',()=>requestAnimationFrame(applySplit),{passive:true});addEventListener('resize',applySplit,{passive:true});applySplit();window.showView=show
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
