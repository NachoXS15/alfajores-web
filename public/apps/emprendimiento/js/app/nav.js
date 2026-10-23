/* Mi Emprendimiento Dulce · Navegación, tema y arranque */
'use strict';
/* =========================================================
   NAVEGACIÓN, TEMA Y ARRANQUE
   ========================================================= */
const NAV=[
  ['panel','Panel principal','home'],['recetas','Mis recetas y costos','book'],['ingredientes','Ingredientes e insumos','jar'],
  ['productos','Productos y precios','tag'],['ganancias','Ganancias y simulador','chart'],['pedidos','Pedidos y clientes','clip'],
  ['ventas','Ventas y cobros','cash'],['packaging','Packaging y materiales','box'],['inventario','Inventario','layers'],
  ['produccion','Producción','oven'],['metas','Metas del emprendimiento','target'],['informes','Informes y reportes','file'],
  ['guia','Guía para empezar','bulb'],['cuenta','Mi cuenta y configuración','user']
];
let VIEW=LS.get('med_view','panel');if(!NAV.some(n=>n[0]===VIEW))VIEW='panel';

function renderNav(){
  $('#nav').innerHTML=NAV.map(([k,l,i])=>`<button class="nav-btn ${k===VIEW?'on':''}" onclick="go('${k}')">${ic(i)}<span>${l}</span></button>`).join('');
  const bn=[['panel','Panel','home'],['recetas','Recetas','book'],['pedidos','Pedidos','clip'],['ventas','Ventas','cash']];
  $('#bottomnav').innerHTML=bn.map(([k,l,i])=>`<button class="${k===VIEW?'on':''}" onclick="go('${k}')">${ic(i,22)}<span>${l}</span></button>`).join('')+`<button class="${bn.some(b=>b[0]===VIEW)?'':'on'}" onclick="openDrawer()">${ic('menu',22)}<span>Más</span></button>`;
  const cur=NAV.find(n=>n[0]===VIEW);$('#tTitle').textContent=cur?cur[1]:'';
}
function go(v){VIEW=v;LS.set('med_view',v);closeDrawer();render();window.scrollTo(0,0)}
function render(){
  const fn=VIEWS[VIEW]||VIEWS.panel;
  try{$('#main').innerHTML=fn()}catch(e){console.error(e);$('#main').innerHTML=note('Ocurrió un error al mostrar esta sección. Tus datos no se perdieron. Probá recargar la página.','bad')}
  $('#main').style.animation='none';void $('#main').offsetWidth;$('#main').style.animation='';
  renderNav();updProgress();
}
function openDrawer(){$('#sidebar').classList.add('open');$('#drawerOverlay').classList.add('open')}
function closeDrawer(){$('#sidebar').classList.remove('open');$('#drawerOverlay').classList.remove('open')}
function applyTheme(t){document.documentElement.setAttribute('data-theme',t);const b=$('#themeBtn');if(b)b.innerHTML=ic(t==='dark'?'sun':'moon',21);const m=document.querySelector('meta[name=theme-color]');if(m)m.content=t==='dark'?'#16110e':'#e25508'}
function toggleTheme(){const t=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';LS.set('med_theme',t);applyTheme(t);toast(t==='dark'?'Modo noche activado':'Modo día activado')}

const STEPS=[
  ['Completar el perfil del emprendimiento',()=>!!S.profile.negocio,'cuenta'],
  ['Cargar al menos 3 ingredientes con precio',()=>S.ingredients.filter(g=>ingCostBase(g)!=null).length>=3,'ingredientes'],
  ['Crear tu primera receta',()=>S.recipes.length>0,'recetas'],
  ['Registrar tu packaging',()=>S.materials.length>0,'packaging'],
  ['Crear un producto con precio de venta',()=>S.products.some(p=>num(p.precio)>0),'productos'],
  ['Registrar un pedido',()=>S.orders.length>0,'pedidos'],
  ['Registrar una venta',()=>S.sales.length>0,'ventas'],
  ['Registrar una tanda de producción',()=>S.batches.length>0,'produccion'],
  ['Crear una meta',()=>S.goals.length>0,'metas'],
  ['Descargar una copia de seguridad',()=>!!S.profile.lastBackup,'cuenta']
];
function updProgress(){const done=STEPS.filter(s=>s[1]()).length;const p=Math.round(done/STEPS.length*100);const b=$('#progBar');if(b)b.style.width=p+'%';const t=$('#progTxt');if(t)t.textContent=p+'%'}

function enterApp(){
  try{sessionStorage.setItem('med_welcomed','1')}catch(e){}
  $('#welcome').classList.add('hidden');
  if(!S.profile.onboarded){startWizard()}else showApp();
}
function showApp(){$('#wizard').classList.add('hidden');$('#app').classList.remove('hidden');render();syncInd(true)}
