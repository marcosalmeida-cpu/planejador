(()=>{
'use strict';
const BTN_ID='v23FullscreenBtn';
const expandIcon='<svg class="v23-expand" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4M16 4h4v4M20 16v4h-4M4 16v4h4"/></svg>';
const contractIcon='<svg class="v23-contract" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M20 15h-5v5M4 15h5v5"/></svg>';
function fsElement(){return document.fullscreenElement||document.webkitFullscreenElement||null}
function supported(){return !!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen)}
async function enter(){
  const el=document.documentElement;
  if(el.requestFullscreen) return el.requestFullscreen({navigationUI:'hide'}).catch(()=>el.requestFullscreen());
  if(el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
}
async function exit(){
  if(document.exitFullscreen)return document.exitFullscreen();
  if(document.webkitExitFullscreen)return document.webkitExitFullscreen();
}
function sync(){
  const b=document.getElementById(BTN_ID);if(!b)return;
  const on=!!fsElement();
  b.setAttribute('aria-pressed',String(on));
  b.setAttribute('aria-label',on?'Sair da tela cheia':'Entrar em tela cheia');
  b.title=on?'Sair da tela cheia':'Tela cheia';
}
function install(){
  const bar=document.querySelector('.v13-topinner');
  if(!bar||document.getElementById(BTN_ID))return false;
  const b=document.createElement('button');
  b.type='button';b.id=BTN_ID;b.className='v23-fullscreen';
  b.innerHTML=expandIcon+contractIcon;
  b.setAttribute('aria-pressed','false');
  if(!supported()){b.setAttribute('aria-disabled','true');b.title='Tela cheia não disponível neste navegador'}
  b.addEventListener('click',async()=>{
    if(!supported())return;
    try{if(fsElement())await exit();else await enter()}catch(e){}
    sync();
  });
  bar.appendChild(b);sync();return true;
}
function boot(){
  if(install())return;
  const mo=new MutationObserver(()=>{if(install())mo.disconnect()});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(()=>{install();mo.disconnect()},2500);
}
document.addEventListener('fullscreenchange',sync);
document.addEventListener('webkitfullscreenchange',sync);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
