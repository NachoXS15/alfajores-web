/* Mi Emprendimiento Dulce · Componentes de interfaz reutilizables: modales, avisos, formularios y exportación */
'use strict';
/* ---------- UI helpers ---------- */
function toast(m,t=''){const box=$('#toasts');while(box.children.length>=3)box.firstChild.remove();const e=document.createElement('div');e.className='toast '+t;e.textContent=m;box.appendChild(e);setTimeout(()=>{e.style.transition='opacity .4s';e.style.opacity='0';setTimeout(()=>e.remove(),400)},3200)}
const err=m=>{toast(m,'bad');return false};
function modal(title,body,foot,wide){$('#modalTitle').textContent=title;$('#modalBody').innerHTML=body;$('#modalFoot').innerHTML=foot||'';$('#modal').classList.toggle('wide',!!wide);$('#modalWrap').classList.add('open');document.body.classList.add('noscroll');$('#modalBody').scrollTop=0}
function closeModal(){$('#modalWrap').classList.remove('open');document.body.classList.remove('noscroll')}
let _cOk=null,_cCancel=null;
function confirmDlg(msg,ok,o={}){
  _cOk=ok;_cCancel=o.cancel||null;
  $('#confirmTitle').textContent=o.title||'Confirmar';
  $('#confirmBody').innerHTML=`<p>${msg}</p>`;
  $('#confirmFoot').innerHTML=`<button class="btn soft" onclick="confirmClose(false)">${o.cancelText||'Cancelar'}</button><button class="btn ${o.danger?'danger':''}" onclick="confirmClose(true)">${o.okText||'Confirmar'}</button>`;
  $('#confirmWrap').classList.add('open');
}
function confirmClose(yes){$('#confirmWrap').classList.remove('open');const f=yes?_cOk:_cCancel;_cOk=_cCancel=null;if(f)f()}
const fld=(label,inner,help)=>`<label class="fld"><span>${label}</span>${inner}${help?`<small>${help}</small>`:''}</label>`;
const inp=(id,val,type='text',attrs='')=>`<input id="${id}" type="${type}" value="${esc(val??'')}" ${type==='number'?'inputmode="decimal" step="any"':''} ${attrs}>`;
function sel(id,opts,val,attrs=''){return `<select ${id?`id="${id}"`:''} ${attrs}>${opts.map(o=>{const [v,l]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${String(v)===String(val??'')?'selected':''}>${esc(l)}</option>`}).join('')}</select>`}
const V=id=>{const e=document.getElementById(id);return e?e.value:''};
const CK=id=>{const e=document.getElementById(id);return !!(e&&e.checked)};
const pageHead=(t,sub,acts='')=>`<div class="page-head"><div><h1>${t}</h1>${sub?`<p class="muted">${sub}</p>`:''}</div>${acts?`<div class="actions">${acts}</div>`:''}</div>`;
const curTab=(v,d)=>TAB[v]||d;
const tabs=(v,list)=>{const cur=curTab(v,list[0][0]);return `<div class="tabs" role="tablist">${list.map(([k,l])=>`<button class="tab ${k===cur?'on':''}" role="tab" onclick="TAB['${v}']='${k}';render()">${l}</button>`).join('')}</div>`};
const emptyState=(icon,t,txt,btn='')=>`<div class="empty"><div class="empty-ic">${ic(icon,30)}</div><h3>${t}</h3><p>${txt}</p>${btn}</div>`;
const kpi=(l,v,cls='',h='')=>`<div class="kpi ${cls}"><span class="kpi-l">${l}</span><strong>${v}</strong>${h?`<small>${h}</small>`:''}</div>`;
const badge=(t,c='')=>`<span class="badge ${c}">${t}</span>`;
const note=(t,c='info')=>`<div class="note ${c}">${t}</div>`;
const warnList=w=>w&&w.length?note(`<strong>Resultado provisional:</strong> faltan datos para un cálculo completo.<ul>${w.slice(0,6).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`,'warn'):'';
const fv=(k,d)=>(F[VIEW]&&F[VIEW][k]!==undefined)?F[VIEW][k]:d;
function setF(k,v,full){F[VIEW]=F[VIEW]||{};F[VIEW][k]=v;const el=$('#list');if(full||!el||!LISTS[VIEW]){render();return}el.innerHTML=LISTS[VIEW]()}
const match=fields=>{const q=String(fv('q','')).toLowerCase().trim();return !q||fields.some(f=>String(f||'').toLowerCase().includes(q))};
const searchBar=(ph,extra='')=>`<div class="toolbar"><div class="search">${ic('search',18)}<input type="search" placeholder="${ph}" value="${esc(fv('q',''))}" oninput="setF('q',this.value)" aria-label="Buscar"></div>${extra}</div>`;
const fsel=(k,opts,d,label)=>sel('',opts,fv(k,d),`onchange="setF('${k}',this.value)" aria-label="${label}"`);
const ibtn=(icon,fn,label,cls='')=>`<button class="icon-btn ${cls}" onclick="${fn}" aria-label="${label}" title="${label}">${ic(icon,19)}</button>`;
const sumBadge=(g)=>g<0?badge('No cubre costos','bad'):badge('Cubre costos','ok');

function downloadFile(name,content,type){
  try{const blob=new Blob([content],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800);toast('Archivo descargado: '+name,'ok')}
  catch(e){toast('No se pudo generar el archivo','bad')}
}
function downloadCSV(name,headers,rows){
  const q=v=>{const s=String(v??'');return /[;"\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
  const n=v=>typeof v==='number'?String(r2(v)).replace('.',','):v;
  const csv='﻿'+[headers.map(q).join(';'),...rows.map(r=>r.map(x=>q(n(x))).join(';'))].join('\n');
  downloadFile(name+'_'+todayStr()+'.csv',csv,'text/csv;charset=utf-8');
}
