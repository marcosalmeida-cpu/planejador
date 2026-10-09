(()=>{
'use strict';
const $=id=>document.getElementById(id);
let previousSave25=null,previousOpen25=null;
function fieldOf(id){return $(id)?.closest('.field')||null}
function ensureSections25(){
 const form=document.querySelector('#txModal .formgrid');if(!form||form.classList.contains('v25-launch-form'))return;form.classList.add('v25-launch-form');
 function section(title,desc,key){const s=document.createElement('section');s.className='v25-section';s.dataset.v25Section=key;s.innerHTML=`<div class="v25-section-head"><div><strong>${title}</strong><span>${desc}</span></div></div><div class="v25-section-grid"></div>`;form.appendChild(s);return s.querySelector('.v25-section-grid')}
 const core=section('Tipo e competência','Defina o tipo, status e o mês em que o lançamento deve entrar.','core');
 const details=section('Detalhes','Descreva o lançamento e classifique de forma objetiva.','details');
 const flow=section('Forma e repetição','Escolha como o valor entra ou sai e se ocorre uma vez, parcelado ou mensalmente.','flow');
 const move=(id,dst,cls)=>{const f=fieldOf(id);if(f){if(cls)f.classList.add(cls);dst.appendChild(f)}};
 move('fType',core,'v25-type');move('fStatus',core,'v25-status');move('fYear',core,'v25-year');move('fMonth',core,'v25-month');
 move('fDesc',details,'v25-desc');move('fValue',details,'v25-value');move('fCategory',details,'v25-category');move('fClass',details,'v25-class');
 const origin=fieldOf('fOriginSelect')||fieldOf('fOrigin');if(origin){origin.classList.add('v25-origin');details.appendChild(origin)}
 move('fPayMethod',flow,'v25-pay');const rec=$('standardRecurringBlock');if(rec)flow.appendChild(rec);const card=$('txCardBlock');if(card)flow.appendChild(card);const salary=$('salaryBox');if(salary)flow.appendChild(salary);
 [...form.querySelectorAll('input[type="hidden"]')].forEach(h=>form.insertBefore(h,form.firstChild));
}
function ensureCadence25(){
 const block=$('standardRecurringBlock'),sel=$('standardRecurringMode');if(!block||!sel)return;
 if(!sel.querySelector('option[value="parcelado"]')){const o=document.createElement('option');o.value='parcelado';o.textContent='Parcelado';sel.appendChild(o)}
 let bar=$('v25CadenceBar');if(!bar){bar=document.createElement('div');bar.id='v25CadenceBar';bar.innerHTML='<button type="button" data-v25-mode="unico">À vista</button><button type="button" data-v25-mode="parcelado">Parcelado</button><button type="button" data-v25-mode="recorrente">Recorrente</button>';const old=$('standardRecurringBar');(old||sel).insertAdjacentElement('afterend',bar);bar.addEventListener('click',e=>{const b=e.target.closest('[data-v25-mode]');if(!b)return;sel.value=b.dataset.v25Mode;sync25()})}
}
function syncChoice25(id){const sel=$(id),f=fieldOf(id);if(!sel||!f)return;f.querySelectorAll('.choice-btn').forEach(b=>b.classList.toggle('active',String(b.dataset.choice)===String(sel.value)))}
function labelPayment25(){const type=$('fType')?.value||'entrada',f=fieldOf('fPayMethod'),label=f?.querySelector('label');if(label)label.textContent=type==='entrada'?'Forma de recebimento':'Forma de pagamento';const wrap=f?.querySelector('.choice-wrap');if(wrap){const a=wrap.querySelector('[data-choice="padrao"] span'),b=wrap.querySelector('[data-choice="cartao"] span');if(a)a.textContent='Dinheiro / débito / conta';if(b)b.textContent='Cartão de crédito'}}
function syncCadence25(){const sel=$('standardRecurringMode'),bar=$('v25CadenceBar');if(!sel||!bar)return;bar.querySelectorAll('[data-v25-mode]').forEach(b=>b.classList.toggle('active',b.dataset.v25Mode===sel.value));const inst=$('standardInstallmentFields');if(inst)inst.classList.toggle('show',sel.value==='parcelado');const help=$('standardRecurringHelp');if(help)help.textContent=sel.value==='parcelado'?'Parcelado: distribui o valor total pelo número de parcelas informado.':sel.value==='recorrente'?'Recorrente: repete o mesmo valor todos os meses a partir da competência informada.':'À vista: registra o valor somente na competência informada.'}
function sync25(){
 ensureCadence25();ensureSections25();const modal=$('txModal');if(!modal)return;const type=$('fType')?.value||'entrada',pay=$('fPayMethod')?.value||'padrao';
 modal.classList.toggle('v25-entry-mode',type==='entrada');modal.classList.toggle('v25-entry-card',type==='entrada'&&pay==='cartao');modal.classList.toggle('v25-expense-card',type==='saida'&&pay==='cartao');
 labelPayment25();syncChoice25('fType');syncChoice25('fStatus');syncChoice25('fPayMethod');syncCadence25();
 const origin=fieldOf('fOriginSelect')||fieldOf('fOrigin'),ol=origin?.querySelector('label');if(ol)ol.textContent=type==='entrada'?'Origem / fonte (opcional)':'Origem / credor';
 const block=$('standardRecurringBlock');if(block){if(type==='entrada')block.style.setProperty('display','block','important');else if(pay==='cartao')block.style.setProperty('display','none','important');else block.style.setProperty('display','block','important')}
 const card=$('txCardBlock');if(card){if(pay==='cartao')card.style.setProperty('display','block','important');else card.style.setProperty('display','none','important')}
}
function forceEntryNew25(){
 const edit=$('txEditId')?.value||'';if(edit)return;const type=$('fType');if(!type)return;type.value='entrada';type.dispatchEvent(new Event('change',{bubbles:true}));const status=$('fStatus');if(status)status.value='Quitado';const pay=$('fPayMethod');if(pay)pay.value='padrao';const mode=$('standardRecurringMode');if(mode)mode.value='unico';
 setTimeout(()=>{const cat=$('fCategory');if(cat&&cat.options.length){const revenue=[...cat.options].find(o=>/receita/i.test(o.value||o.textContent));if(revenue)cat.value=revenue.value;else cat.selectedIndex=0}sync25()},25);
}
function wrapOpen25(){
 if(previousOpen25)return;previousOpen25=window.openTx;if(typeof previousOpen25==='function'){window.openTx=function(){const r=previousOpen25.apply(this,arguments);setTimeout(()=>{ensureCadence25();ensureSections25();forceEntryNew25();sync25()},30);return r};try{openTx=window.openTx}catch(e){}}
 document.addEventListener('click',e=>{if(!e.target.closest?.('[data-addtx]'))return;setTimeout(()=>{if($('txModal')?.classList.contains('open'))forceEntryNew25()},70)},false);
}
function markEntryChannel25(beforeIds,editId){let target=null;try{if(editId)target=(custom||[]).find(x=>String(x.id)===String(editId))||null;else target=(custom||[]).slice().reverse().find(x=>!beforeIds.has(String(x.id)))||null}catch(e){}if(!target)return;target.paymentMethod='cartao';target.entryCardId=$('fCardId')?.value||'';try{target.entryCardName=(cards||[]).find(c=>String(c.id)===String(target.entryCardId))?.name||''}catch(e){}target.entryCadence=$('standardRecurringMode')?.value||'unico';try{persist()}catch(e){}try{window.renderAll?.()}catch(e){}}
function wrapSave25(){
 if(previousSave25)return;previousSave25=window.saveTx;if(typeof previousSave25!=='function')return;
 const wrapped=function(){const type=$('fType')?.value||'entrada',pay=$('fPayMethod')?.value||'padrao',editId=$('txEditId')?.value||'',beforeIds=new Set();try{(custom||[]).forEach(x=>beforeIds.add(String(x.id)))}catch(e){}
   if(type==='entrada'&&pay==='cartao'){const payEl=$('fPayMethod');payEl.value='padrao';const result=previousSave25.apply(this,arguments);payEl.value='cartao';markEntryChannel25(beforeIds,editId);return result}
   return previousSave25.apply(this,arguments)
 };
 window.saveTx=wrapped;try{saveTx=wrapped}catch(e){}const b=$('saveTx');if(b)b.onclick=wrapped;
}
function init25(){ensureCadence25();ensureSections25();wrapOpen25();wrapSave25();sync25();const modal=$('txModal');if(modal){new MutationObserver(()=>{if(modal.classList.contains('open'))setTimeout(()=>{ensureCadence25();ensureSections25();sync25()},25)}).observe(modal,{attributes:true,attributeFilter:['class']})}document.addEventListener('change',e=>{if(['fType','fPayMethod','fStatus','standardRecurringMode'].includes(e.target?.id))setTimeout(sync25,0)},false)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init25,650),{once:true});else setTimeout(init25,650);
})();
