/* ================= UTILIDADES ================= */
const KEY='mcd_data_v1', THEME_KEY='mcd_theme', GUIDE_KEY='mcd_guide', UI_KEY='mcd_ui';
const $=s=>document.querySelector(s);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,9);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=o=>JSON.parse(JSON.stringify(o));
const nl2br=s=>esc(s).replace(/\n/g,'<br>');
function money(n,cur){
  if(n===''||n==null||isNaN(Number(n)))return '';
  try{return new Intl.NumberFormat('es-AR',{style:'currency',currency:cur||S.profile.currency||'ARS',minimumFractionDigits:0,maximumFractionDigits:2}).format(Number(n))}
  catch(e){return '$ '+n}
}
function fmtDate(t){if(!t)return '—';const d=new Date(t);return d.toLocaleDateString('es-AR',{day:'2-digit',month:'short',year:'numeric'})+' · '+d.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}
function lsGet(k,def){try{const v=localStorage.getItem(k);return v?JSON.parse(v):def}catch(e){return def}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}

const IC={
home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
box:'<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
tag:'<path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
price:'<path d="M12 2v20"/><path d="M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
book:'<path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5z"/><path d="M4 19.5V21h16"/>',
palette:'<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.2"/><circle cx="12" cy="7" r="1.2"/><circle cx="16" cy="10" r="1.2"/><path d="M12 21c-1.5-2-1-4 1-4h3"/>',
eye:'<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
moon:'<path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
cam:'<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>',
edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>',
trash:'<path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>',
up:'<path d="M18 15l-6-6-6 6"/>',
down:'<path d="M6 9l6 6 6-6"/>',
left:'<path d="M15 18l-6-6 6-6"/>',
right:'<path d="M9 18l6-6-6-6"/>',
archive:'<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 002 2h12a2 2 0 002-2V8"/><path d="M10 12h4"/>',
restore:'<path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.7 2.8L3 8"/><path d="M3 3v5h5"/>',
x:'<path d="M18 6L6 18M6 6l12 12"/>',
check:'<path d="M20 6L9 17l-5-5"/>',
more:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
desk:'<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
file:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>',
wa:'<path d="M21 11.5a8.4 8.4 0 01-12.4 7.4L3 21l2.1-5.4A8.5 8.5 0 1121 11.5z"/>',
img:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>',
download:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>',
upload:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/>',
spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
guide:'<path d="M2 4h7a3 3 0 013 3v13a2 2 0 00-2-2H2z"/><path d="M22 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z"/>',
replace:'<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>',
warn:'<path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15"/><circle cx="18" cy="5" r="3"/>'
};
const ico=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`;

/* ================= ESTADO ================= */
const SUG_CATS=['Alfajores de chocolate','Alfajores de chocolate blanco','Alfajores clásicos','Alfajores especiales','Alfajores frutales','Ediciones especiales','Otros'];
const SUG_PRES=[['Unidad',1],['Caja de 4',4],['Media docena',6],['Docena',12],['Caja personalizada','']];
const PRESETS={
  artesanal:{label:'Artesanal elegante',desc:'Serif clásica, tarjetas con sombra suave',font:'Playfair Display',body:'Lato',card:'sombra',photo:'arriba',radius:18,align:'center',gap:22,upper:false},
  minimalista:{label:'Minimalista',desc:'Mucho aire, líneas finas, sin adornos',font:'Jost',body:'Jost',card:'plano',photo:'arriba',radius:3,align:'left',gap:34,upper:true},
  clasico:{label:'Clásico',desc:'Tipografía tradicional, marcos definidos',font:'Cormorant Garamond',body:'Lora',card:'borde',photo:'arriba',radius:0,align:'center',gap:20,upper:true},
  calido:{label:'Cálido y delicado',desc:'Bordes muy redondeados, tono suave',font:'Lora',body:'Nunito',card:'sombra',photo:'arriba',radius:26,align:'center',gap:20,upper:false},
  moderno:{label:'Moderno',desc:'Foto al costado, lectura rápida',font:'Poppins',body:'Poppins',card:'borde',photo:'izquierda',radius:12,align:'left',gap:18,upper:false}
};
const FONTS=['Playfair Display','Cormorant Garamond','Lora','DM Serif Display','Jost','Poppins','Lato','Nunito','Nunito Sans'];
function defDesign(){return{style:'artesanal',primary:'#d77d28',secondary:'#4a2c1d',bg:'#fbf7ef',font:'Playfair Display',body:'Lato',card:'sombra',photo:'arriba',cols:2,perPage:0,order:'cats',cover:true,title:'',subtitle:'',showLogo:true}}
function defaultState(){return{v:1,profile:{brand:'',owner:'',logo:'',desc:'',whatsapp:'',instagram:'',other:'',email:'',zone:'',currency:'ARS',appUrl:'',pub:{owner:false,desc:true,whatsapp:true,instagram:true,other:true,email:true,zone:true}},categories:[],products:[],catalogs:[],activeCat:null,onboarded:false,visited:{},exported:false,route:null,updatedAt:null}}
function newCatalog(name){return{id:uid(),name:name||'Catálogo general',intro:'',productIds:[],hiddenCats:[],showPrices:true,showDesc:true,showPres:true,contact:'',orderInfo:'',status:'borrador',pendingReview:false,waMsg:'',design:defDesign(),createdAt:Date.now(),updatedAt:Date.now()}}
function newProduct(){return{id:uid(),name:'',catId:'',desc:'',flavor:'',coating:'',filling:'',features:[],photos:[],presentations:[],status:'activo',available:true,order:0,notes:'',createdAt:Date.now(),updatedAt:Date.now()}}
function newPres(name,qty){return{id:uid(),name:name||'',qty:qty===undefined?1:qty,price:'',desc:'',photo:'',available:true}}

let S=Object.assign(defaultState(),lsGet(KEY,{}));
S.profile=Object.assign(defaultState().profile,S.profile||{});
S.profile.pub=Object.assign(defaultState().profile.pub,S.profile.pub||{});
S.catalogs.forEach(c=>{c.design=Object.assign(defDesign(),c.design||{})});
let GS=lsGet(GUIDE_KEY,{});
let ui=Object.assign({view:'dash',q:'',fc:'',fs:'activo',fa:'',pmode:'m',pcat:null},lsGet(UI_KEY,{}));
let draft=null, saveTimer=null, frameTimer=null;

function setSaveStatus(st,msg){
  const el=$('#savest');
  if(st==='ok'){el.className='savest';el.innerHTML='<i></i><span class="hide-m">Guardado en este dispositivo</span>';el.title='Guardado';}
  else if(st==='ing'){el.className='savest ing';el.innerHTML='<i></i><span class="hide-m">Guardando…</span>';}
  else{el.className='savest err';el.innerHTML='<i></i>No se pudo guardar';el.title=msg||'';}
}
function save(){
  clearTimeout(saveTimer);
  S.updatedAt=Date.now();
  try{localStorage.setItem(KEY,JSON.stringify(S));setSaveStatus('ok');updateProgress();return true}
  catch(e){setSaveStatus('err','Almacenamiento lleno');toast('No se pudo guardar: el almacenamiento del navegador está lleno. Usá fotos más livianas o eliminá algunas.','err',5000);return false}
}
function saveSoon(){setSaveStatus('ing');clearTimeout(saveTimer);saveTimer=setTimeout(save,500)}
function saveUI(){lsSet(UI_KEY,{view:ui.view,pmode:ui.pmode,fs:ui.fs})}

/* ================= HELPERS DE DATOS ================= */
const catById=id=>S.categories.find(c=>c.id===id);
const prodById=id=>S.products.find(p=>p.id===id);
const sortedProducts=()=>S.products.slice().sort((a,b)=>(a.order||0)-(b.order||0));
const activeProducts=()=>sortedProducts().filter(p=>p.status!=='archivado');
function pricedPres(p){return(p.presentations||[]).filter(x=>x.price!==''&&x.price!=null&&!isNaN(Number(x.price)))}
function hasPrice(p){return pricedPres(p).length>0}
function priceRange(p){const ps=pricedPres(p).map(x=>Number(x.price));if(!ps.length)return '';const mn=Math.min(...ps),mx=Math.max(...ps);return mn===mx?money(mn):money(mn)+' – '+money(mx)}
function curCat(){let c=S.catalogs.find(c=>c.id===S.activeCat);if(!c&&S.catalogs.length){c=S.catalogs[0];S.activeCat=c.id}return c||null}
function catalogsWith(pid){return S.catalogs.filter(c=>c.productIds.includes(pid))}
function markPub(c){if(c&&c.status==='publicado')c.pendingReview=true;if(c)c.updatedAt=Date.now()}
function touchProduct(pid){catalogsWith(pid).forEach(markPub)}
function catProducts(cat){return cat.productIds.map(prodById).filter(p=>p&&p.status!=='archivado')}
function visibleCatIds(cat){return S.categories.filter(c=>c.visible!==false&&!(cat.hiddenCats||[]).includes(c.id)).map(c=>c.id)}
function catalogGroups(cat){
  const prods=catProducts(cat), d=cat.design;
  if(d.order==='list'){
    const vis=visibleCatIds(cat);
    return[{title:'',items:prods.filter(p=>!p.catId||!catById(p.catId)||vis.includes(p.catId))}];
  }
  const groups=[];
  S.categories.forEach(c=>{
    if(c.visible===false||(cat.hiddenCats||[]).includes(c.id))return;
    const items=prods.filter(p=>p.catId===c.id);
    if(items.length)groups.push({title:c.name,items});
  });
  const orphan=prods.filter(p=>!p.catId||!catById(p.catId));
  if(orphan.length)groups.push({title:groups.length?'Otros productos':'',items:orphan});
  return groups;
}
function publicContact(){
  const P=S.profile,pu=P.pub,out=[];
  if(pu.owner&&P.owner)out.push(['Responsable',P.owner]);
  if(pu.whatsapp&&P.whatsapp)out.push(['WhatsApp',P.whatsapp]);
  if(pu.instagram&&P.instagram)out.push(['Instagram',P.instagram]);
  if(pu.other&&P.other)out.push(['Redes',P.other]);
  if(pu.email&&P.email)out.push(['Correo',P.email]);
  if(pu.zone&&P.zone)out.push(['Zona de entrega',P.zone]);
  return out;
}

/* ================= TEMA ================= */
function applyTheme(t){document.documentElement.setAttribute('data-theme',t);$('#themeBtn').innerHTML=ico(t==='dark'?'sun':'moon');$('meta[name=theme-color]').content=t==='dark'?'#1b1511':'#f0e6d1'}
function toggleTheme(){const t=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';lsSet(THEME_KEY,t);applyTheme(t);toast(t==='dark'?'Modo noche activado':'Modo día activado')}

/* ================= UI BÁSICA ================= */
let toastT;
function toast(msg,type,ms){const t=$('#toast');t.textContent=msg;t.className='show '+(type||'');clearTimeout(toastT);toastT=setTimeout(()=>t.className='',ms||2600)}
function openModal(title,body,footer,size){
  $('#sheet').className='sheet '+(size||'');
  $('#sheet').innerHTML=`<div class="sh-h"><h2>${title}</h2><button class="ib" onclick="closeModal()" aria-label="Cerrar">${ico('x')}</button></div><div class="sh-b" id="mbody">${body}</div>${footer?`<div class="sh-f" id="mfoot">${footer}</div>`:''}`;
  $('#modal').classList.add('open');document.body.style.overflow='hidden';
}
function closeModal(){$('#modal').classList.remove('open');document.body.style.overflow='';draft=null}
let confirmCb=null;
function askConfirm(title,msg,okLabel,cb,danger){
  confirmCb=cb;
  openModal(title,`<p>${msg}</p>`,`<button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn ${danger?'danger':''}" onclick="const f=confirmCb;closeModal();f&&f()">${okLabel||'Confirmar'}</button>`,'sm');
}
function pickImage(cb,opts){
  const inp=$('#filePick');inp.value='';
  inp.onchange=async()=>{
    const f=inp.files[0];if(!f)return;
    try{const data=await readImage(f,opts);cb(data)}catch(e){toast(e.message||String(e),'err',4000)}
  };
  inp.click();
}
function readImage(file,opts={}){
  const max=opts.max||1000,keepPng=opts.png;
  return new Promise((res,rej)=>{
    if(!/^image\/(jpeg|png|webp)$/.test(file.type))return rej(new Error('Formato no admitido. Usá JPG, PNG o WEBP.'));
    if(file.size>15*1024*1024)return rej(new Error('La imagen supera los 15 MB. Elegí una más liviana.'));
    const fr=new FileReader();
    fr.onerror=()=>rej(new Error('No se pudo leer la imagen.'));
    fr.onload=()=>{
      const img=new Image();
      img.onerror=()=>rej(new Error('La imagen parece dañada.'));
      img.onload=()=>{
        const sc=Math.min(1,max/Math.max(img.width,img.height));
        const c=document.createElement('canvas');c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);
        const x=c.getContext('2d');
        if(!keepPng){x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height)}
        x.drawImage(img,0,0,c.width,c.height);
        res(keepPng&&file.type==='image/png'?c.toDataURL('image/png'):c.toDataURL('image/jpeg',.8));
      };
      img.src=fr.result;
    };
    fr.readAsDataURL(file);
  });
}
function download(name,content,type){
  const blob=content instanceof Blob?content:new Blob([content],{type:type||'text/plain'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);
}
const slug=s=>(s||'catalogo').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'catalogo';
function sw(label,checked,handler,id){return`<label class="sw"><input type="checkbox" ${checked?'checked':''} onchange="${handler}" ${id?`id="${id}"`:''}><span class="tr"></span><span>${label}</span></label>`}

/* ================= NAVEGACIÓN ================= */
const VIEWS={
  dash:{t:'Panel principal',s:'Panel',i:'home',fn:vDash},
  products:{t:'Mis productos',s:'Productos',i:'box',fn:vProducts,after:drawPList},
  cats:{t:'Categorías y variedades',s:'Categorías',i:'tag',fn:vCats},
  prices:{t:'Presentaciones y precios',s:'Precios',i:'price',fn:vPrices},
  catalog:{t:'Mi catálogo',s:'Catálogo',i:'book',fn:vCatalog},
  design:{t:'Diseño y personalización',s:'Diseño',i:'palette',fn:vDesign,after:()=>refreshFrame('dframe')},
  preview:{t:'Vista previa',s:'Vista previa',i:'eye',fn:vPreview,after:()=>refreshFrame('pframe')},
  export:{t:'Exportar y compartir',s:'Exportar',i:'share',fn:vExport,after:drawShare},
  profile:{t:'Mi perfil y configuración',s:'Perfil',i:'user',fn:vProfile}
};
function drawNav(){
  $('#side').innerHTML=`<div class="logo-b"><div class="logo-m">M</div><div><b>Mi Catálogo Dulce</b><small>EMPRENDE DULCE</small></div></div>`+
    Object.entries(VIEWS).map(([k,v])=>`<button class="nav-i ${ui.view===k?'on':''}" onclick="go('${k}')">${ico(v.i)}${v.t}</button>`).join('')+
    `<button class="nav-i" onclick="openWizard()">${ico('spark')}Asistente de inicio</button><div class="foot">Bonus del curso Alfajores Irresistibles · Emprende Dulce</div>`;
  const main=['dash','products','catalog','preview'];
  $('#bnav').innerHTML=main.map(k=>`<button class="bn ${ui.view===k?'on':''}" onclick="go('${k}')">${ico(VIEWS[k].i)}${VIEWS[k].s}</button>`).join('')+
    `<button class="bn ${main.includes(ui.view)?'':'on'}" onclick="openMore()">${ico('more')}Más</button>`;
}
function openMore(){
  openModal('Secciones',`<div class="grid">${Object.entries(VIEWS).map(([k,v])=>`<button class="nav-i ${ui.view===k?'on':''}" onclick="closeModal();go('${k}')">${ico(v.i)}${v.t}</button>`).join('')}<button class="nav-i" onclick="closeModal();openWizard()">${ico('spark')}Asistente de inicio</button></div>`,'','sm');
}
function go(v){ui.view=v;saveUI();if(['design','preview','export'].includes(v)){S.visited[v]=true;save()}render();window.scrollTo(0,0)}
function render(){
  const v=VIEWS[ui.view]||VIEWS.dash;
  $('#vtitle').textContent=v.t;
  $('#main').innerHTML=`<div class="view">${v.fn()}</div>`;
  drawNav();updateProgress();
  if(v.after)v.after();
}

/* ================= PROGRESO ================= */
function progressSteps(){
  const act=activeProducts();const P=S.profile;
  return[
    ['Nombre del emprendimiento',!!P.brand,'profile'],
    ['Primera categoría creada',S.categories.length>0,'cats'],
    ['Primer alfajor cargado',act.length>0,'products'],
    ['Al menos un producto con foto propia',act.some(p=>p.photos.length),'products'],
    ['Al menos un producto con precio',act.some(hasPrice),'prices'],
    ['Catálogo con productos',S.catalogs.some(c=>catProducts(c).length),'catalog'],
    ['Datos de contacto o cómo pedir',!!(publicContact().length||S.catalogs.some(c=>c.contact||c.orderInfo)),'profile'],
    ['Diseño elegido',!!S.visited.design,'design'],
    ['Vista previa revisada',!!S.visited.preview,'preview'],
    ['Catálogo exportado o compartido',!!S.exported,'export']
  ];
}
function updateProgress(){
  const st=progressSteps(),n=st.filter(s=>s[1]).length,pct=Math.round(n/st.length*100);
  $('#progB').style.width=pct+'%';$('#progT').textContent=`Tu catálogo: ${pct}% listo`;
}
function openProgress(){
  const st=progressSteps();
  openModal('Tu camino al catálogo',`<p class="muted mb">Completá estos pasos a tu ritmo. Podés omitir lo opcional y volver cuando quieras.</p>`+
    st.map(s=>`<div class="pstep ${s[1]?'ok':''}"><div class="d">${s[1]?ico('check'):''}</div><span>${s[0]}</span>${s[1]?'':`<button class="btn soft" onclick="closeModal();go('${s[2]}')">Ir</button>`}</div>`).join(''),'','sm');
}

/* ================= GUÍAS POR SECCIÓN ================= */
const GUIDES={
  dash:{q:'Transformá una lista de productos en una presentación comercial clara, atractiva y fácil de compartir.',tips:[
    ['Empezá por lo esencial','Nombre de tu emprendimiento, una categoría, un alfajor con su precio. Con eso ya podés ver tu primer catálogo. Fotos, diseño y textos se suman después.'],
    ['Los números son tuyos y reales','El panel solo muestra lo que vos cargaste: no hay estadísticas inventadas. Si ves “0”, es porque todavía no hay datos.'],
    ['Actualizá cuando cambie algo','Cuando modifiques un precio o una variedad, los catálogos que usan ese producto se actualizan solos. Revisalos en Vista previa antes de volver a compartirlos.']],
    check:['Completar el nombre del emprendimiento','Cargar el primer alfajor','Revisar la vista previa','Exportar o compartir el primer catálogo']},
  products:{q:'Las fotografías de cada producto deben ser tuyas: mostrá lo que realmente vendés.',tips:[
    ['Nombres claros y fáciles de pedir','Usá nombres que tu clienta pueda repetir por WhatsApp: “Alfajor de maicena”, “Triple de chocolate”. Evitá códigos internos.'],
    ['Fotos propias con buena luz','Fotografiá cerca de una ventana, con fondo liso y el alfajor entero o cortado al medio para mostrar el relleno. Si todavía no tenés foto, el catálogo igual se ve prolijo.'],
    ['Describí solo lo que es cierto','No agregues ingredientes, tamaños ni certificaciones que no tengas. El asistente de descripción usa únicamente los datos que cargaste.']],
    check:['Cada producto tiene nombre','Cada producto tiene al menos una foto propia','Las descripciones solo mencionan ingredientes reales','Uso las notas privadas para costos o recordatorios']},
  cats:{q:'Las categorías son sugerencias: modificalas, eliminalas o reemplazalas según tu negocio.',tips:[
    ['Pocas categorías, bien definidas','Con 3 a 5 categorías alcanza para que tu clienta encuentre rápido lo que busca.'],
    ['Ordená según lo que más vendés','La primera categoría es la que más se ve. Subí la de tus productos estrella.'],
    ['Ocultá sin borrar','Si una línea no está disponible esta temporada, ocultá la categoría en lugar de eliminarla.']],
    check:['Tengo al menos una categoría','Cada producto está asignado a una categoría','El orden refleja mis productos principales']},
  prices:{q:'Cada presentación debe tener su propio precio y estado de disponibilidad.',tips:[
    ['Diferenciá unidad y caja','El catálogo muestra “precio por unidad” o “precio total de la caja” y calcula cuánto sale cada alfajor dentro de la caja, para que no haya confusiones.'],
    ['Revisá precios con frecuencia','Usá el ajuste por porcentaje para actualizar todos tus precios de una vez cuando cambien tus costos.'],
    ['Cantidades reales','Una caja de 6 tiene que contener 6. Si armás cajas a pedido, usá “Caja personalizada” y explicá en la descripción cómo funciona.']],
    check:['Todos mis productos activos tienen precio','Diferencié unidad y cajas','Revisé los precios este mes']},
  catalog:{q:'Creá tu catálogo, organizá tus variedades y presentá tus productos de manera profesional.',tips:[
    ['Varios catálogos, mismos productos','Podés tener un catálogo general, otro para fechas especiales y otro con una selección. Los productos no se duplican: si cambiás uno, cambia en todos.'],
    ['Instrucciones para pedir','Contá cómo se hace un pedido, con cuánta anticipación, formas de pago y entrega. Es lo que más preguntan las clientas.'],
    ['Presentación breve','Dos o tres oraciones sobre tu emprendimiento son suficientes. Contá quién sos y qué hacés.']],
    check:['Le puse nombre a mi catálogo','Escribí la presentación de mi emprendimiento','Agregué instrucciones para pedir','Elegí y ordené los productos']},
  design:{q:'Un catálogo profesional, sin necesidad de saber diseñar.',tips:[
    ['Menos es más','Elegí un estilo y un color principal. Si dudás, la paleta de Emprende Dulce ya viene lista.'],
    ['Cuidá el contraste','Fondos claros con textos oscuros se leen mejor en el celular y en el PDF.'],
    ['Probá en la vista previa','Cada cambio se ve al instante a la derecha (o debajo en el celular). Podés volver al diseño original cuando quieras.']],
    check:['Elegí un estilo','Definí mis colores','Revisé la portada (título y subtítulo)']},
  preview:{q:'Revisá el catálogo completo antes de exportarlo o compartirlo.',tips:[
    ['Miralo como tu clienta','La mayoría lo va a abrir desde el celular. Revisá primero la vista móvil.'],
    ['Las advertencias son avisos','Te ayudan a detectar datos faltantes, pero vos decidís si publicás igual.'],
    ['Tu información privada está a salvo','Las notas privadas nunca aparecen en la vista previa, el PDF ni las fichas.']],
    check:['Revisé la vista móvil','Revisé la vista de escritorio','Resolví las advertencias importantes']},
  export:{q:'El catálogo es una herramienta para presentar tus productos: acompañalo con buena atención.',tips:[
    ['PDF en dos toques','Tocá “Generar PDF” y en la ventana de impresión elegí “Guardar como PDF”. En iPhone: Compartir → Imprimir → pellizcá la vista para abrir el PDF.'],
    ['WhatsApp: vos tenés el control','El botón abre WhatsApp con el mensaje preparado. El envío lo hacés vos; la app no manda nada automáticamente.'],
    ['Fichas para redes','Descargá imágenes cuadradas o verticales de cada producto para publicar en tus redes o en estados.']],
    check:['Generé el PDF','Preparé el mensaje de WhatsApp','Descargué al menos una ficha para redes']},
  profile:{q:'Vos decidís qué datos se muestran públicamente.',tips:[
    ['Datos de contacto opcionales','Ningún dato es obligatorio. Activá solo los que quieras mostrar en tus catálogos.'],
    ['Hacé copias de seguridad','Tus datos se guardan en este navegador. Descargá una copia de seguridad cada tanto y usala para pasar tu información a otro dispositivo.'],
    ['Logotipo prolijo','Si tenés logo en PNG con fondo transparente, se verá mejor sobre cualquier color.']],
    check:['Completé nombre de marca y descripción','Elegí qué datos mostrar','Descargué una copia de seguridad']}
};
function guide(k){
  const g=GUIDES[k],st=GS[k]||{},open=st._open;
  return`<section class="card guide ${open?'open':''}" id="guide-${k}">
  <button class="guide-h" onclick="toggleGuide('${k}')">${ico('guide')}Guía rápida de esta sección<span class="ar">${ico('down')}</span></button>
  <div class="guide-b">
    <blockquote class="quote">“${g.q}”<small>Mi Catálogo Dulce · Emprende Dulce</small></blockquote>
    ${g.tips.map(t=>`<div class="tip"><button class="tip-h" onclick="this.parentNode.classList.toggle('open')">${t[0]}<span>+</span></button><div class="tip-b">${t[1]}</div></div>`).join('')}
    <h3 class="mt" style="margin-bottom:4px">Checklist</h3>
    ${g.check.map((c,i)=>`<label class="chk"><input type="checkbox" ${st[i]?'checked':''} onchange="setGuideChk('${k}',${i},this.checked)"><span>${c}</span></label>`).join('')}
  </div></section>`;
}
function toggleGuide(k){GS[k]=GS[k]||{};GS[k]._open=!GS[k]._open;lsSet(GUIDE_KEY,GS);$('#guide-'+k).classList.toggle('open',GS[k]._open)}
function setGuideChk(k,i,v){GS[k]=GS[k]||{};GS[k][i]=v;lsSet(GUIDE_KEY,GS);if(v)toast('¡Bien! Un paso menos','ok')}

/* ================= PANEL ================= */
function vDash(){
  const all=S.products,act=activeProducts();
  const pubIds=new Set();S.catalogs.filter(c=>c.status==='publicado').forEach(c=>catProducts(c).forEach(p=>pubIds.add(p.id)));
  const status=S.catalogs.some(c=>c.status==='publicado')?'Publicado':'Borrador';
  const pend=S.catalogs.filter(c=>c.pendingReview);
  let h=`<div class="sec-h"><div><h2>${S.profile.brand?`Hola, ${esc(S.profile.brand)}`:'Bienvenida a tu panel'}</h2><p>El estado de tu catálogo, con tus datos reales.</p></div></div>`;
  if(!all.length){
    h+=`<div class="card empty"><div class="big">${ico('box')}</div><h2>Tu catálogo empieza acá</h2><p>Todavía no cargaste productos. Seguí estos pasos o usá el asistente, que te guía de a uno.</p>
      <ol class="steps-l"><li>Escribí el nombre de tu emprendimiento</li><li>Creá una categoría</li><li>Cargá tu primer alfajor con su precio</li><li>Elegí el diseño y revisá la vista previa</li></ol>
      <div class="row" style="justify-content:center"><button class="btn" onclick="openWizard()">${ico('spark')}Usar el asistente</button><button class="btn ghost" onclick="openProduct()">${ico('plus')}Crear mi primer alfajor</button></div></div>`;
  }
  h+=`<div class="grid g4 mt">
    ${stat(all.length,'Productos registrados')}
    ${stat(pubIds.size,'En catálogos publicados')}
    ${stat(S.categories.length,'Categorías')}
    ${stat(act.filter(p=>!p.photos.length).length,'Sin fotografía',true)}
    ${stat(act.filter(p=>!hasPrice(p)).length,'Sin precio',true)}
    <div class="card stat"><div class="n" style="font-size:1.4rem">${status}</div><div class="l">Estado del catálogo</div></div>
  </div>
  <p class="hint mt">Última actualización: ${fmtDate(S.updatedAt)}</p>`;
  if(pend.length)h+=`<div class="alert mt">${ico('warn')}<div><b>Cambios sin revisar.</b> Modificaste productos que están en catálogos publicados: ${pend.map(c=>esc(c.name)).join(', ')}. Revisalos en la vista previa y volvé a compartirlos si hace falta. <br><button class="btn soft mt" onclick="go('preview')">Revisar ahora</button></div></div>`;
  h+=`<h3 class="mt mb" style="margin-top:28px">Accesos rápidos</h3><div class="grid g4">
    <button class="qa" onclick="openProduct()">${ico('plus')}Agregar un alfajor</button>
    <button class="qa" onclick="go('cats');setTimeout(()=>{const i=$('#newCat');i&&i.focus()},100)">${ico('tag')}Crear una categoría</button>
    <button class="qa" onclick="go('prices')">${ico('price')}Editar los precios</button>
    <button class="qa" onclick="go('design')">${ico('palette')}Personalizar el diseño</button>
    <button class="qa" onclick="go('preview')">${ico('eye')}Visualizar el catálogo</button>
    <button class="qa" onclick="go('export')">${ico('share')}Exportar o compartir</button>
  </div>`;
  h+=`<div class="grid g2 mt" style="margin-top:24px">${routeCard()}${catalogsSummary()}</div><div class="mt">${guide('dash')}</div>`;
  return h;
}
function stat(n,l,warn){return`<div class="card stat ${warn&&n>0?'warn':''}"><div class="n">${n}</div><div class="l">${l}</div></div>`}
function catalogsSummary(){
  if(!S.catalogs.length)return`<div class="card"><h3>Tus catálogos</h3><p class="muted mt mb">Todavía no creaste ningún catálogo.</p><button class="btn" onclick="createCatalog()">${ico('plus')}Crear catálogo</button></div>`;
  return`<div class="card"><h3>Tus catálogos</h3>${S.catalogs.map(c=>`<div class="lr"><div class="nm"><b>${esc(c.name)}</b><div class="hint">${catProducts(c).length} productos · ${fmtDate(c.updatedAt)}</div></div><span class="badge ${c.status==='publicado'?'ok':''}">${c.status==='publicado'?'Publicado':'Borrador'}</span><button class="ib" onclick="S.activeCat='${c.id}';save();go('catalog')" aria-label="Editar">${ico('edit')}</button></div>`).join('')}</div>`;
}
/* Test de ruta */
const ROUTE_Q=[
  ['¿Ya vendés alfajores?',['Todavía no','Sí, a conocidos','Sí, de forma regular']],
  ['¿Tenés tus precios definidos?',['Todavía no','Algunos','Sí, por unidad y por caja']],
  ['¿Cuántas variedades ofrecés?',['1 o 2','De 3 a 5','6 o más']]
];
let routeAns=[];
function routeCard(){
  const r=S.route;
  if(r!=null){
    const begin=r<=2;
    return`<div class="card"><h3>${ico('route')} Tu ruta recomendada</h3><div class="res"><b>${begin?'Perfil: Principiante':'Perfil: Emprendedora en marcha'}</b>
    <p class="mt" style="margin-top:6px">${begin?'Enfocate en armar una primera propuesta simple y clara.':'Aprovechá las herramientas para mantener tu oferta al día y presentarla en distintos formatos.'}</p>
    <ol style="margin:10px 0 0 18px">${(begin?['Definí 2 o 3 variedades y cargalas con una foto propia','Poné precio por unidad y, si podés, una caja','Elegí el estilo “Artesanal elegante” y revisá la vista previa','Compartí tu primer PDF por WhatsApp']:['Usá el ajuste masivo de precios cuando cambien tus costos','Creá un catálogo por temporada o fecha especial','Descargá fichas de producto para redes','Mantené archivados los productos que salen de temporada']).map(x=>`<li>${x}</li>`).join('')}</ol></div>
    <button class="btn ghost mt" onclick="S.route=null;save();render()">Volver a hacer el test</button></div>`;
  }
  return`<div class="card" id="routeCard"><h3>${ico('route')} Descubrí tu ruta</h3><p class="muted mb">Tres preguntas para recomendarte por dónde empezar.</p>
  ${ROUTE_Q.map((q,i)=>`<p style="font-weight:800;margin:10px 0 6px">${q[0]}</p>${q[1].map((o,j)=>`<button class="qopt ${routeAns[i]===j?'on':''}" onclick="routeAns[${i}]=${j};$('#routeCard').outerHTML=routeCard()">${o}</button>`).join('')}`).join('')}
  <button class="btn block mt" onclick="finishRoute()">Ver mi ruta</button></div>`;
}
function finishRoute(){if(routeAns.filter(x=>x!=null).length<3){toast('Respondé las tres preguntas','err');return}S.route=routeAns.reduce((a,b)=>a+b,0);routeAns=[];save();render();toast('Ruta guardada','ok')}

/* ================= PRODUCTOS ================= */
function vProducts(){
  return`<div class="sec-h"><div><h2>Mis productos</h2><p>Cada variedad de alfajor con su ficha, fotos propias, presentaciones y precios.</p></div><button class="btn" onclick="openProduct()">${ico('plus')}Agregar alfajor</button></div>
  ${guide('products')}
  <div class="toolbar">
    <input class="inp s" type="search" placeholder="Buscar por nombre…" value="${esc(ui.q)}" oninput="ui.q=this.value;drawPList()" aria-label="Buscar">
    <select class="inp" onchange="ui.fc=this.value;drawPList()" aria-label="Categoría"><option value="">Todas las categorías</option>${S.categories.map(c=>`<option value="${c.id}" ${ui.fc===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}<option value="_none" ${ui.fc==='_none'?'selected':''}>Sin categoría</option></select>
    <select class="inp" onchange="ui.fs=this.value;saveUI();drawPList()" aria-label="Estado"><option value="activo" ${ui.fs==='activo'?'selected':''}>Activos</option><option value="archivado" ${ui.fs==='archivado'?'selected':''}>Archivados</option><option value="" ${ui.fs===''?'selected':''}>Todos</option></select>
    <select class="inp" onchange="ui.fa=this.value;drawPList()" aria-label="Disponibilidad"><option value="">Toda disponibilidad</option><option value="si" ${ui.fa==='si'?'selected':''}>Disponibles</option><option value="no" ${ui.fa==='no'?'selected':''}>No disponibles</option></select>
  </div>
  <div id="plist"></div>`;
}
function drawPList(){
  const el=$('#plist');if(!el)return;
  const q=(ui.q||'').toLowerCase().trim();
  let list=sortedProducts().filter(p=>{
    if(q&&!p.name.toLowerCase().includes(q))return false;
    if(ui.fc==='_none'&&p.catId&&catById(p.catId))return false;
    if(ui.fc&&ui.fc!=='_none'&&p.catId!==ui.fc)return false;
    if(ui.fs&&p.status!==ui.fs)return false;
    if(ui.fa==='si'&&!p.available)return false;
    if(ui.fa==='no'&&p.available)return false;
    return true;
  });
  if(!S.products.length){el.innerHTML=`<div class="card empty"><div class="big">${ico('box')}</div><h2>Aún no hay alfajores</h2><p>Creá la ficha de tu primera variedad: nombre, foto, descripción y precio.</p><button class="btn" onclick="openProduct()">${ico('plus')}Crear mi primer alfajor</button></div>`;return}
  if(!list.length){el.innerHTML=`<div class="card empty"><p>No hay productos que coincidan con la búsqueda o los filtros.</p><button class="btn ghost" onclick="ui.q='';ui.fc='';ui.fa='';ui.fs='';render()">Limpiar filtros</button></div>`;return}
  el.innerHTML=`<p class="hint mb">${list.length} producto${list.length>1?'s':''}</p><div class="grid g3">`+list.map(p=>{
    const c=catById(p.catId);
    return`<article class="pc ${p.status==='archivado'?'arch':''}">
      <button class="im" onclick="openProduct('${p.id}')" aria-label="Editar ${esc(p.name)}">${p.photos[0]?`<img src="${p.photos[0]}" alt="">`:`${ico('cam')}Sin foto · tocá para agregar`}</button>
      <div class="bd"><div class="row" style="gap:6px;margin-bottom:6px">${p.status==='archivado'?'<span class="badge">Archivado</span>':''}${!p.available?'<span class="badge err">No disponible</span>':''}${!hasPrice(p)?'<span class="badge warn">Sin precio</span>':''}</div>
      <h3>${esc(p.name)}</h3><div class="meta">${c?esc(c.name):'Sin categoría'} · ${p.presentations.length} presentación${p.presentations.length===1?'':'es'}</div>
      ${hasPrice(p)?`<div class="pr">${priceRange(p)}</div>`:''}</div>
      <div class="acts">
        <button class="ib" onclick="openProduct('${p.id}')" aria-label="Editar" title="Editar">${ico('edit')}</button>
        <button class="ib" onclick="dupProduct('${p.id}')" aria-label="Duplicar" title="Duplicar">${ico('copy')}</button>
        <button class="ib" onclick="moveProduct('${p.id}',-1)" aria-label="Subir" title="Subir en el orden">${ico('up')}</button>
        <button class="ib" onclick="moveProduct('${p.id}',1)" aria-label="Bajar" title="Bajar en el orden">${ico('down')}</button>
        ${p.status==='archivado'?`<button class="ib" onclick="archiveProduct('${p.id}',false)" aria-label="Restaurar" title="Restaurar">${ico('restore')}</button>`:`<button class="ib" onclick="archiveProduct('${p.id}',true)" aria-label="Archivar" title="Archivar">${ico('archive')}</button>`}
        <button class="ib del" onclick="deleteProduct('${p.id}')" aria-label="Eliminar" title="Eliminar">${ico('trash')}</button>
      </div></article>`;
  }).join('')+`</div>`;
}
function normalizeOrder(){sortedProducts().forEach((p,i)=>p.order=i)}
function moveProduct(id,dir){
  normalizeOrder();const list=sortedProducts();const i=list.findIndex(p=>p.id===id),j=i+dir;
  if(j<0||j>=list.length)return;[list[i].order,list[j].order]=[list[j].order,list[i].order];save();drawPList();
}
function dupProduct(id){
  const p=clone(prodById(id));p.id=uid();p.name=p.name+' (copia)';p.createdAt=p.updatedAt=Date.now();
  p.presentations.forEach(x=>x.id=uid());p.order=Math.max(0,...S.products.map(x=>x.order||0))+1;
  S.products.push(p);if(save())toast('Producto duplicado','ok');drawPList();
}
function archiveProduct(id,arch){
  const p=prodById(id);const cs=catalogsWith(id);
  const doIt=()=>{p.status=arch?'archivado':'activo';p.updatedAt=Date.now();touchProduct(id);if(save())toast(arch?'Producto archivado':'Producto restaurado','ok');drawPList()};
  if(arch&&cs.length)askConfirm('Archivar producto',`<b>${esc(p.name)}</b> está en ${cs.length} catálogo${cs.length>1?'s':''} (${cs.map(c=>esc(c.name)).join(', ')}). Al archivarlo dejará de mostrarse en ellos, pero no se borra: podés restaurarlo cuando quieras.`,'Archivar',doIt);
  else doIt();
}
function deleteProduct(id){
  const p=prodById(id),cs=catalogsWith(id);
  askConfirm('Eliminar producto',`¿Eliminar <b>${esc(p.name)}</b> definitivamente? Se borrarán sus fotos y presentaciones.${cs.length?`<br><br><b>Atención:</b> se quitará de ${cs.length} catálogo${cs.length>1?'s':''}: ${cs.map(c=>esc(c.name)).join(', ')}.`:''}<br><br>Si solo querés dejar de mostrarlo, mejor archivalo.`,'Eliminar',()=>{
    S.products=S.products.filter(x=>x.id!==id);cs.forEach(c=>{c.productIds=c.productIds.filter(x=>x!==id);markPub(c)});
    if(save())toast('Producto eliminado','ok');drawPList();
  },true);
}
/* --- Formulario de producto --- */
function openProduct(id){
  if(id){draft=clone(prodById(id));draft._new=false}
  else{draft=newProduct();draft._new=true;draft.presentations=[newPres('Unidad',1)];if(ui.fc&&ui.fc!=='_none')draft.catId=ui.fc;else if(S.categories.length===1)draft.catId=S.categories[0].id;draft._addTo=S.catalogs.length?(curCat().id):''}
  draft._feat=(draft.features||[]).join(', ');
  openModal(id?'Editar alfajor':'Nuevo alfajor',productForm(),`<button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn" onclick="saveProduct()">${ico('check')}Guardar producto</button>`);
}
function reProductForm(){const b=$('#mbody');const st=b.scrollTop;b.innerHTML=productForm();b.scrollTop=st}
function productForm(){
  const p=draft;
  return`<div class="fld"><label class="f" for="pname">Nombre del producto *</label><input id="pname" class="inp" value="${esc(p.name)}" oninput="draft.name=this.value" placeholder="Ej.: Alfajor de maicena" maxlength="80"></div>
  <div class="grid g2">
    <div class="fld"><label class="f">Categoría</label><select class="inp" onchange="draft.catId=this.value"><option value="">Sin categoría</option>${S.categories.map(c=>`<option value="${c.id}" ${p.catId===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select>
      <div class="row mt" style="margin-top:8px;flex-wrap:nowrap"><input id="pnewcat" class="inp" placeholder="Nueva categoría"><button class="btn soft" onclick="formNewCat()">Crear</button></div></div>
    <div>${sw('Disponible para la venta',p.available,'draft.available=this.checked')}
      <div class="fld mt"><label class="f">Estado</label><select class="inp" onchange="draft.status=this.value"><option value="activo" ${p.status==='activo'?'selected':''}>Activo</option><option value="archivado" ${p.status==='archivado'?'selected':''}>Archivado</option></select></div></div>
  </div>
  <div class="grid g3">
    <div class="fld"><label class="f">Sabor principal</label><input class="inp" value="${esc(p.flavor)}" oninput="draft.flavor=this.value" placeholder="Opcional"></div>
    <div class="fld"><label class="f">Tipo de cobertura</label><input class="inp" value="${esc(p.coating)}" oninput="draft.coating=this.value" placeholder="Opcional"></div>
    <div class="fld"><label class="f">Tipo de relleno</label><input class="inp" value="${esc(p.filling)}" oninput="draft.filling=this.value" placeholder="Opcional"></div>
  </div>
  <div class="fld"><label class="f">Características (opcional)</label><input class="inp" value="${esc(p._feat)}" oninput="draft._feat=this.value" placeholder="Separalas con comas. Ej.: sin TACC, edición limitada"><div class="hint">Agregá solo lo que realmente cumple tu producto.</div></div>
  <div class="fld"><label class="f" for="pdesc">Descripción comercial</label><textarea id="pdesc" class="inp" oninput="draft.desc=this.value" placeholder="Contá cómo es tu alfajor con tus palabras." maxlength="600">${esc(p.desc)}</textarea>
    <div class="row" style="margin-top:8px"><button class="btn soft" onclick="suggestInto()">${ico('spark')}Sugerir a partir de mis datos</button><span class="hint">Usa solo los datos que cargaste; no inventa ingredientes.</span></div></div>
  <div class="fld"><label class="f">Fotografías propias</label><div class="hint mb" style="margin-top:0">La primera es la principal. JPG, PNG o WEBP; se optimizan automáticamente.</div>
    <div class="photos">${p.photos.map((ph,i)=>`<div class="pt"><div class="ph"><img src="${ph}" alt="Foto ${i+1}">${i===0?'<b>Principal</b>':''}</div><div class="ctr">
      <button onclick="movePhoto(${i},-1)" aria-label="Mover a la izquierda">${ico('left')}</button>
      <button onclick="replacePhoto(${i})" aria-label="Reemplazar">${ico('replace')}</button>
      <button onclick="movePhoto(${i},1)" aria-label="Mover a la derecha">${ico('right')}</button>
      <button onclick="draft.photos.splice(${i},1);reProductForm()" aria-label="Eliminar foto" style="color:var(--err)">${ico('trash')}</button></div></div>`).join('')}
      ${p.photos.length<6?`<button class="addph" onclick="addPhoto()">${ico('cam')}${p.photos.length?'Agregar otra':'Agregar foto'}</button>`:''}</div></div>
  <div class="fld"><label class="f">Presentaciones y precios</label><div class="hint mb" style="margin-top:0">Cada presentación tiene su propio precio y disponibilidad.</div>
    ${p.presentations.map((x,i)=>presEditor(x,i)).join('')}
    <div class="chips">${SUG_PRES.map(s=>`<button class="chip" onclick="draft.presentations.push(newPres('${s[0]}',${s[1]===''?"''":s[1]}));reProductForm()">+ ${s[0]}</button>`).join('')}<button class="chip" onclick="draft.presentations.push(newPres('',1));reProductForm()">+ Otra</button></div></div>
  <div class="grid g2">
    <div class="fld"><label class="f">Orden de aparición</label><input class="inp" type="number" inputmode="numeric" value="${p.order||0}" oninput="draft.order=Number(this.value)||0"><div class="hint">Los números más bajos aparecen primero.</div></div>
    ${p._new&&S.catalogs.length?`<div class="fld"><label class="f">Agregar al catálogo</label><select class="inp" onchange="draft._addTo=this.value"><option value="">No agregar por ahora</option>${S.catalogs.map(c=>`<option value="${c.id}" ${draft._addTo===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select></div>`:''}
  </div>
  <div class="fld"><label class="f">${ico('lock').replace('<svg','<svg style="width:15px;height:15px;vertical-align:-2px"')} Notas privadas</label><textarea class="inp" oninput="draft.notes=this.value" placeholder="Costos, proveedores, recordatorios… Nunca se muestran en el catálogo.">${esc(p.notes)}</textarea></div>`;
}
function presEditor(x,i){
  const unit=(x.price!==''&&Number(x.qty)>1)?`Equivale a ${money(Number(x.price)/Number(x.qty))} por alfajor`:'';
  return`<div class="pres"><div class="pres-g">
    <div class="n"><label class="f">Nombre</label><input class="inp" value="${esc(x.name)}" oninput="draft.presentations[${i}].name=this.value" placeholder="Ej.: Caja de 6"></div>
    <div><label class="f">Cantidad</label><input class="inp" type="number" inputmode="numeric" min="1" step="1" value="${x.qty}" oninput="draft.presentations[${i}].qty=this.value"></div>
    <div><label class="f">Precio (${esc(S.profile.currency)})</label><input class="inp" type="number" inputmode="decimal" min="0" step="any" value="${x.price}" oninput="draft.presentations[${i}].price=this.value" placeholder="0"></div>
  </div>
  <div class="unitp" style="margin-top:6px">${Number(x.qty)===1?'Precio por unidad':`Precio total de la caja${unit?' · '+unit:''}`}</div>
  <div class="fld mt" style="margin-bottom:6px"><input class="inp" value="${esc(x.desc)}" oninput="draft.presentations[${i}].desc=this.value" placeholder="Descripción opcional (ej.: surtido a elección)"></div>
  <div class="row">${sw('Disponible',x.available,`draft.presentations[${i}].available=this.checked`)}<span class="sp"></span>
    ${x.photo?`<img src="${x.photo}" alt="" style="width:48px;height:48px;border-radius:10px;object-fit:cover">`:''}
    <button class="ib" onclick="presPhoto(${i})" aria-label="Foto de la presentación" title="Foto opcional">${ico('cam')}</button>
    ${x.photo?`<button class="ib" onclick="draft.presentations[${i}].photo='';reProductForm()" aria-label="Quitar foto" title="Quitar foto">${ico('x')}</button>`:''}
    <button class="ib" onclick="movePres(${i},-1)" aria-label="Subir">${ico('up')}</button>
    <button class="ib" onclick="movePres(${i},1)" aria-label="Bajar">${ico('down')}</button>
    <button class="ib" onclick="const c=clone(draft.presentations[${i}]);c.id=uid();c.name+=' (copia)';draft.presentations.splice(${i+1},0,c);reProductForm()" aria-label="Duplicar">${ico('copy')}</button>
    <button class="ib del" onclick="draft.presentations.splice(${i},1);reProductForm()" aria-label="Eliminar">${ico('trash')}</button>
  </div></div>`;
}
function movePres(i,d){const a=draft.presentations,j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];reProductForm()}
function presPhoto(i){pickImage(d=>{if(draft){draft.presentations[i].photo=d;reProductForm()}},{max:700})}
function addPhoto(){pickImage(d=>{if(draft){draft.photos.push(d);reProductForm();toast('Foto agregada','ok')}})}
function replacePhoto(i){pickImage(d=>{if(draft){draft.photos[i]=d;reProductForm();toast('Foto reemplazada','ok')}})}
function movePhoto(i,d){const a=draft.photos,j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];reProductForm()}
function formNewCat(){const v=$('#pnewcat').value.trim();if(!v){toast('Escribí el nombre de la categoría','err');return}const c=addCategory(v);if(c){draft.catId=c.id;reProductForm();toast('Categoría creada','ok')}}
let sugIdx=0;
function suggestDesc(p,variant){
  const feats=(p._feat!==undefined?p._feat.split(','):(p.features||[])).map(s=>s.trim()).filter(Boolean);
  const name=(p.name||'').trim()||'Este alfajor';
  const parts=[];if(p.filling)parts.push('relleno de '+p.filling.trim().toLowerCase());if(p.coating)parts.push('cobertura de '+p.coating.trim().toLowerCase());
  const pres=(p.presentations||[]).filter(x=>x.name).map(x=>x.name.toLowerCase());
  let s;
  if(variant%3===0){s=name+(parts.length?' con '+parts.join(' y '):'')+'.';if(p.flavor)s+=' Sabor principal: '+p.flavor.trim().toLowerCase()+'.';if(feats.length)s+=' '+feats.join(' · ')+'.';if(pres.length)s+=' Disponible en: '+pres.join(', ')+'.'}
  else if(variant%3===1){s=(p.flavor?'Para quienes buscan sabor a '+p.flavor.trim().toLowerCase()+': ':'')+name.toLowerCase().replace(/^./,c=>c.toUpperCase())+(parts.length?', con '+parts.join(' y '):'')+'.';if(feats.length)s+=' Detalles: '+feats.join(', ')+'.';s+=' Consultá disponibilidad y hacé tu pedido.'}
  else{s=name+(parts.length?' · '+parts.map(x=>x.replace(/^./,c=>c.toUpperCase())).join(' · '):'')+(feats.length?' · '+feats.join(' · '):'')+'.'}
  return s.replace(/\s+/g,' ').trim();
}
function suggestInto(){
  if(!draft.name&&!draft.flavor&&!draft.filling&&!draft.coating){toast('Primero completá el nombre, sabor, relleno o cobertura','err');return}
  draft.desc=suggestDesc(draft,sugIdx++);$('#pdesc').value=draft.desc;toast('Sugerencia lista: editala a tu gusto');
}
function saveProduct(){
  const p=draft;if(!p)return;
  p.name=(p.name||'').trim();
  if(!p.name){toast('El producto necesita un nombre','err');$('#pname').focus();return}
  for(const x of p.presentations){
    x.name=(x.name||'').trim();
    if(!x.name){toast('Cada presentación necesita un nombre','err');return}
    const q=Number(x.qty);if(!(q>0)||!Number.isInteger(q)){toast(`“${x.name}”: la cantidad debe ser un número entero mayor a 0`,'err');return}
    x.qty=q;
    if(x.price!==''&&x.price!=null){const n=Number(x.price);if(isNaN(n)||n<0){toast(`“${x.name}”: el precio no puede ser negativo`,'err');return}x.price=n}else x.price='';
  }
  p.features=(p._feat||'').split(',').map(s=>s.trim()).filter(Boolean);
  const addTo=p._addTo,isNew=p._new;delete p._feat;delete p._new;delete p._addTo;
  p.updatedAt=Date.now();
  const i=S.products.findIndex(x=>x.id===p.id);
  if(i>=0)S.products[i]=p;else{if(!p.order)p.order=Math.max(-1,...S.products.map(x=>x.order||0))+1;S.products.push(p)}
  if(isNew&&addTo){const c=S.catalogs.find(c=>c.id===addTo);if(c&&!c.productIds.includes(p.id))c.productIds.push(p.id)}
  touchProduct(p.id);
  const ok=save();closeModal();render();
  if(ok){const n=catalogsWith(p.id).length;toast(n?`Producto guardado · actualizado en ${n} catálogo${n>1?'s':''}`:'Producto guardado','ok')}
}

/* ================= CATEGORÍAS ================= */
function addCategory(name){
  name=(name||'').trim();if(!name)return null;
  if(S.categories.some(c=>c.name.toLowerCase()===name.toLowerCase())){toast('Ya existe una categoría con ese nombre','err');return null}
  const c={id:uid(),name,visible:true,createdAt:Date.now()};S.categories.push(c);save();return c;
}
function vCats(){
  const missing=SUG_CATS.filter(n=>!S.categories.some(c=>c.name.toLowerCase()===n.toLowerCase()));
  return`<div class="sec-h"><div><h2>Categorías y variedades</h2><p>Organizá tus productos como quieras. Las sugerencias son solo un punto de partida.</p></div></div>
  ${guide('cats')}
  <div class="card"><label class="f" for="newCat">Nueva categoría</label><div class="row" style="flex-wrap:nowrap"><input id="newCat" class="inp" placeholder="Ej.: Alfajores de chocolate" onkeydown="if(event.key==='Enter')catAdd()" maxlength="60"><button class="btn" onclick="catAdd()">${ico('plus')}Crear</button></div>
  ${missing.length?`<p class="hint mt mb">Sugerencias (tocá para agregar):</p><div class="chips">${missing.map(n=>`<button class="chip" onclick="addCategory('${n}')&&(toast('Categoría creada','ok'),render())">+ ${n}</button>`).join('')}</div>`:''}</div>
  <div class="card">${S.categories.length?S.categories.map((c,i)=>{const n=S.products.filter(p=>p.catId===c.id).length;return`<div class="lr">
    <div class="nm"><input class="inp" value="${esc(c.name)}" onchange="renameCat('${c.id}',this.value)" aria-label="Nombre de la categoría"><div class="hint">${n} producto${n===1?'':'s'}${c.visible===false?' · oculta en todos los catálogos':''}</div></div>
    ${sw('Visible',c.visible!==false,`catVis('${c.id}',this.checked)`)}
    <button class="ib" onclick="moveCat(${i},-1)" aria-label="Subir">${ico('up')}</button>
    <button class="ib" onclick="moveCat(${i},1)" aria-label="Bajar">${ico('down')}</button>
    <button class="ib" onclick="ui.fc='${c.id}';ui.fs='';go('products')" aria-label="Ver productos" title="Ver productos">${ico('eye')}</button>
    <button class="ib del" onclick="delCat('${c.id}')" aria-label="Eliminar">${ico('trash')}</button></div>`}).join(''):`<div class="empty"><div class="big">${ico('tag')}</div><h3>Sin categorías todavía</h3><p>Creá una o tocá alguna de las sugerencias.</p></div>`}</div>
  ${S.categories.length&&S.products.length?assignBlock():''}`;
}
function assignBlock(){
  return`<div class="card"><h3>Asignar productos</h3><p class="hint mb">Elegí la categoría de cada producto.</p>${activeProducts().map(p=>`<div class="lr"><div class="th">${p.photos[0]?`<img src="${p.photos[0]}" alt="">`:ico('cam')}</div><div class="nm"><b>${esc(p.name)}</b></div><select class="inp" style="max-width:260px" onchange="assignCat('${p.id}',this.value)"><option value="">Sin categoría</option>${S.categories.map(c=>`<option value="${c.id}" ${p.catId===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select></div>`).join('')}</div>`;
}
function catAdd(){const i=$('#newCat');if(addCategory(i.value)){toast('Categoría creada','ok');render();setTimeout(()=>$('#newCat')&&$('#newCat').focus(),50)}else if(!i.value.trim())toast('Escribí un nombre','err')}
function renameCat(id,v){v=v.trim();const c=catById(id);if(!v){toast('El nombre no puede quedar vacío','err');render();return}c.name=v;S.catalogs.forEach(markPub);if(save())toast('Nombre actualizado','ok')}
function catVis(id,v){catById(id).visible=v;S.catalogs.forEach(markPub);save();render()}
function moveCat(i,d){const a=S.categories,j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];S.catalogs.forEach(markPub);save();render()}
function assignCat(pid,cid){const p=prodById(pid);p.catId=cid;p.updatedAt=Date.now();touchProduct(pid);if(save())toast('Categoría asignada','ok')}
function delCat(id){
  const c=catById(id),n=S.products.filter(p=>p.catId===id).length;
  askConfirm('Eliminar categoría',`¿Eliminar <b>${esc(c.name)}</b>?${n?` Sus ${n} producto${n>1?'s':''} quedarán “Sin categoría” (no se borran).`:''}`,'Eliminar',()=>{
    S.categories=S.categories.filter(x=>x.id!==id);S.products.forEach(p=>{if(p.catId===id)p.catId=''});S.catalogs.forEach(k=>{k.hiddenCats=(k.hiddenCats||[]).filter(x=>x!==id);markPub(k)});
    if(save())toast('Categoría eliminada','ok');render();
  },true);
}

/* ================= PRESENTACIONES Y PRECIOS ================= */
function vPrices(){
  const act=activeProducts();
  let h=`<div class="sec-h"><div><h2>Presentaciones y precios</h2><p>Editá rápido las presentaciones y precios de todos tus productos. Los cambios se reflejan al instante en tus catálogos.</p></div></div>${guide('prices')}`;
  if(!act.length)return h+`<div class="card empty"><div class="big">${ico('price')}</div><h3>Primero cargá un producto</h3><p>Las presentaciones se crean dentro de cada alfajor.</p><button class="btn" onclick="openProduct()">${ico('plus')}Agregar alfajor</button></div>`;
  h+=`<div class="card"><h3>Ajuste masivo de precios</h3><p class="hint mb">Útil cuando cambian tus costos. Se aplica a todas las presentaciones con precio de los productos activos.</p>
   <div class="row"><div style="flex:1;min-width:140px"><label class="f">Porcentaje</label><input id="pct" class="inp" type="number" inputmode="decimal" step="any" placeholder="Ej.: 10 o -5"></div>
   <div style="flex:1;min-width:160px"><label class="f">Redondear a</label><select id="rnd" class="inp"><option value="0">Sin redondeo</option><option value="10">$10</option><option value="50" selected>$50</option><option value="100">$100</option></select></div>
   <button class="btn" style="align-self:flex-end" onclick="bulkPrice()">Aplicar ajuste</button></div></div>`;
  h+=act.map(p=>`<div class="card"><div class="row mb"><div class="lr" style="border:none;padding:0;flex:1"><div class="th">${p.photos[0]?`<img src="${p.photos[0]}" alt="">`:ico('cam')}</div><div class="nm"><h3>${esc(p.name)}</h3><div class="hint">${catById(p.catId)?esc(catById(p.catId).name):'Sin categoría'}</div></div></div>
    <button class="btn soft" onclick="openProduct('${p.id}')">${ico('edit')}Ficha completa</button></div>
    ${p.presentations.length?p.presentations.map((x,i)=>`<div class="pres"><div class="pres-g">
      <div class="n"><label class="f">Presentación</label><input class="inp" value="${esc(x.name)}" onchange="setPres('${p.id}',${i},'name',this.value,this)"></div>
      <div><label class="f">Cantidad</label><input class="inp" type="number" inputmode="numeric" min="1" step="1" value="${x.qty}" onchange="setPres('${p.id}',${i},'qty',this.value,this)"></div>
      <div><label class="f">Precio</label><input class="inp" type="number" inputmode="decimal" min="0" step="any" value="${x.price}" placeholder="Sin precio" onchange="setPres('${p.id}',${i},'price',this.value,this)"></div></div>
      <div class="unitp" style="margin-top:6px">${x.qty===1?'Precio por unidad':`Precio total de la caja${x.price!==''?` · ${money(x.price/x.qty)} por alfajor`:''}`}</div>
      <div class="row">${sw('Disponible',x.available,`setPres('${p.id}',${i},'available',this.checked)`)}<span class="sp"></span>
      <button class="ib" onclick="presOp('${p.id}',${i},'up')" aria-label="Subir">${ico('up')}</button>
      <button class="ib" onclick="presOp('${p.id}',${i},'down')" aria-label="Bajar">${ico('down')}</button>
      <button class="ib" onclick="presOp('${p.id}',${i},'dup')" aria-label="Duplicar">${ico('copy')}</button>
      <button class="ib del" onclick="presOp('${p.id}',${i},'del')" aria-label="Eliminar">${ico('trash')}</button></div></div>`).join(''):`<p class="alert">Este producto todavía no tiene presentaciones.</p>`}
    <div class="chips mt">${SUG_PRES.map(s=>`<button class="chip" onclick="presAdd('${p.id}','${s[0]}',${s[1]===''?1:s[1]})">+ ${s[0]}</button>`).join('')}</div></div>`).join('');
  return h;
}
function setPres(pid,i,k,v,el){
  const p=prodById(pid),x=p.presentations[i];
  if(k==='qty'){const q=Number(v);if(!(q>0)||!Number.isInteger(q)){toast('La cantidad debe ser un número entero mayor a 0','err');el.value=x.qty;return}x.qty=q}
  else if(k==='price'){if(v===''){x.price=''}else{const n=Number(v);if(isNaN(n)||n<0){toast('El precio no puede ser negativo','err');el.value=x.price;return}x.price=n}}
  else if(k==='name'){if(!v.trim()){toast('El nombre no puede quedar vacío','err');el.value=x.name;return}x.name=v.trim()}
  else x[k]=v;
  p.updatedAt=Date.now();touchProduct(pid);if(save())toast('Cambio guardado','ok');
  if(k==='qty'||k==='price')render();
}
function presAdd(pid,name,qty){const p=prodById(pid);p.presentations.push(newPres(name,qty));p.updatedAt=Date.now();touchProduct(pid);save();render();toast('Presentación agregada. Completá el precio.')}
function presOp(pid,i,op){
  const p=prodById(pid),a=p.presentations;
  const fin=()=>{p.updatedAt=Date.now();touchProduct(pid);save();render()};
  if(op==='up'&&i>0){[a[i],a[i-1]]=[a[i-1],a[i]];fin()}
  else if(op==='down'&&i<a.length-1){[a[i],a[i+1]]=[a[i+1],a[i]];fin()}
  else if(op==='dup'){const c=clone(a[i]);c.id=uid();c.name+=' (copia)';a.splice(i+1,0,c);fin();toast('Presentación duplicada','ok')}
  else if(op==='del')askConfirm('Eliminar presentación',`¿Eliminar <b>${esc(a[i].name)}</b> de ${esc(p.name)}?`,'Eliminar',()=>{a.splice(i,1);fin();toast('Presentación eliminada','ok')},true);
}
function bulkPrice(){
  const pct=Number($('#pct').value),r=Number($('#rnd').value);
  if(!$('#pct').value||isNaN(pct)||pct===0){toast('Ingresá un porcentaje distinto de 0','err');return}
  if(pct<=-100){toast('El porcentaje debe ser mayor a -100','err');return}
  let n=0;activeProducts().forEach(p=>p.presentations.forEach(x=>{if(x.price!=='')n++}));
  if(!n){toast('No hay precios cargados para ajustar','err');return}
  askConfirm('Ajustar precios',`Se ${pct>0?'aumentarán':'reducirán'} ${n} precio${n>1?'s':''} un ${Math.abs(pct)}%${r?`, redondeando a $${r}`:''}. ¿Continuar?`,'Aplicar',()=>{
    activeProducts().forEach(p=>{let ch=false;p.presentations.forEach(x=>{if(x.price!==''){let v=x.price*(1+pct/100);v=r?Math.round(v/r)*r:Math.round(v*100)/100;x.price=Math.max(0,v);ch=true}});if(ch){p.updatedAt=Date.now();touchProduct(p.id)}});
    if(save())toast('Precios actualizados','ok');render();
  });
}

/* ================= CATÁLOGOS ================= */
function createCatalog(name){const c=newCatalog(name||(S.catalogs.length?'Catálogo '+(S.catalogs.length+1):'Catálogo general'));c.productIds=activeProducts().map(p=>p.id);S.catalogs.push(c);S.activeCat=c.id;if(save())toast('Catálogo creado','ok');go('catalog')}
function catTabs(){
  const c=curCat();
  return`<div class="tabs">${S.catalogs.map(k=>`<button class="tab ${c&&k.id===c.id?'on':''}" onclick="S.activeCat='${k.id}';save();render()">${esc(k.name)}</button>`).join('')}<button class="tab" onclick="createCatalog()">+ Nuevo catálogo</button></div>`;
}
function noCatalog(){return`<div class="card empty"><div class="big">${ico('book')}</div><h2>Creá tu primer catálogo</h2><p>Un catálogo reúne los productos que querés mostrar, con tu presentación, contacto e instrucciones para pedir. Podés tener varios: uno general, otro para fechas especiales…</p><button class="btn" onclick="createCatalog()">${ico('plus')}Crear catálogo</button></div>`}
function setCat(k,v){const c=curCat();c[k]=v;markPub(c);saveSoon()}
function vCatalog(){
  let h=`<div class="sec-h"><div><h2>Mi catálogo</h2><p>Elegí qué productos mostrar, en qué orden y con qué información.</p></div></div>${guide('catalog')}`;
  const c=curCat();if(!c)return h+noCatalog();
  const inC=c.productIds.map(prodById).filter(Boolean);
  const out=activeProducts().filter(p=>!c.productIds.includes(p.id));
  h+=catTabs();
  h+=`<div class="card"><div class="row mb"><h3 style="flex:1">Datos del catálogo</h3><span class="badge ${c.status==='publicado'?'ok':''}">${c.status==='publicado'?'Publicado':'Borrador'}</span></div>
  <div class="grid g2"><div class="fld"><label class="f">Nombre del catálogo</label><input class="inp" value="${esc(c.name)}" oninput="setCat('name',this.value)" onchange="render()" maxlength="70"></div>
  <div class="fld"><label class="f">Marca</label><div class="row" style="flex-wrap:nowrap">${S.profile.logo?`<img src="${S.profile.logo}" alt="Logo" style="width:48px;height:48px;object-fit:contain;border-radius:10px;background:var(--beige)">`:''}<input class="inp" value="${esc(S.profile.brand)}" oninput="S.profile.brand=this.value;S.catalogs.forEach(markPub);saveSoon()" placeholder="Nombre de tu emprendimiento"></div><div class="hint">El logotipo se carga en <a href="#" onclick="go('profile');return false">Mi perfil</a>.</div></div></div>
  <div class="fld"><label class="f">Presentación de tu emprendimiento</label><textarea class="inp" oninput="setCat('intro',this.value)" placeholder="Contá en pocas líneas quién sos y qué hacés." maxlength="700">${esc(c.intro)}</textarea></div>
  <div class="grid g2"><div class="fld"><label class="f">Información de contacto</label><textarea class="inp" oninput="setCat('contact',this.value)" placeholder="Ej.: Pedidos de lunes a viernes por WhatsApp.">${esc(c.contact)}</textarea><div class="hint">Además se muestran los datos públicos de tu perfil.</div></div>
  <div class="fld"><label class="f">Instrucciones para hacer pedidos</label><textarea class="inp" oninput="setCat('orderInfo',this.value)" placeholder="Anticipación, formas de pago, retiro o envío…">${esc(c.orderInfo)}</textarea></div></div>
  <h3 class="mt mb">Qué mostrar</h3><div class="grid g3">${sw('Mostrar precios',c.showPrices,"setCat('showPrices',this.checked)")}${sw('Mostrar descripciones',c.showDesc,"setCat('showDesc',this.checked)")}${sw('Mostrar presentaciones',c.showPres,"setCat('showPres',this.checked)")}</div>
  <div class="row mt"><button class="btn" onclick="save();toast('Borrador guardado','ok')">${ico('check')}Guardar borrador</button><button class="btn ghost" onclick="go('preview')">${ico('eye')}Ver vista previa</button><span class="sp"></span>
  <button class="btn soft" onclick="dupCatalog()">${ico('copy')}Duplicar</button><button class="btn danger" onclick="delCatalog()">${ico('trash')}Eliminar</button></div></div>`;
  h+=`<div class="grid g2"><div class="card"><h3>Productos en este catálogo (${inC.length})</h3><p class="hint mb">Ordená con las flechas. Este orden se usa dentro de cada categoría.</p>
  ${inC.length?inC.map((p,i)=>`<div class="lr"><div class="th">${p.photos[0]?`<img src="${p.photos[0]}" alt="">`:ico('cam')}</div><div class="nm"><b>${esc(p.name)}</b><div class="hint">${p.status==='archivado'?'<span class="badge">Archivado · no se muestra</span>':(catById(p.catId)?esc(catById(p.catId).name):'Sin categoría')}</div></div>
    <button class="ib" onclick="moveInCat(${i},-1)" aria-label="Subir">${ico('up')}</button><button class="ib" onclick="moveInCat(${i},1)" aria-label="Bajar">${ico('down')}</button><button class="ib del" onclick="toggleInCat('${p.id}')" aria-label="Quitar del catálogo">${ico('x')}</button></div>`).join(''):'<p class="muted">Todavía no agregaste productos.</p>'}</div>
  <div class="card"><div class="row mb"><h3 style="flex:1">Disponibles para agregar (${out.length})</h3>${out.length?`<button class="btn soft" onclick="addAllInCat()">Agregar todos</button>`:''}</div>
  ${out.length?out.map(p=>`<div class="lr"><div class="th">${p.photos[0]?`<img src="${p.photos[0]}" alt="">`:ico('cam')}</div><div class="nm"><b>${esc(p.name)}</b><div class="hint">${hasPrice(p)?priceRange(p):'Sin precio'}</div></div><button class="btn soft" onclick="toggleInCat('${p.id}')">${ico('plus')}Agregar</button></div>`).join(''):`<p class="muted">${S.products.length?'Todos tus productos activos ya están en este catálogo.':'Cargá productos para poder agregarlos.'}</p>${S.products.length?'':`<button class="btn mt" onclick="openProduct()">${ico('plus')}Agregar alfajor</button>`}`}</div></div>`;
  h+=`<div class="card"><h3>Categorías en este catálogo</h3><p class="hint mb">Mostrá u ocultá categorías solo en este catálogo. El orden de las categorías se define en <a href="#" onclick="go('cats');return false">Categorías</a>.</p>
  ${S.categories.length?S.categories.map((k,i)=>`<div class="lr"><div class="nm"><b>${esc(k.name)}</b><div class="hint">${catProducts(c).filter(p=>p.catId===k.id).length} productos en este catálogo${k.visible===false?' · oculta en general':''}</div></div>${sw('Mostrar',!(c.hiddenCats||[]).includes(k.id),`hideCatIn('${k.id}',!this.checked)`)}<button class="ib" onclick="moveCat(${i},-1)" aria-label="Subir">${ico('up')}</button><button class="ib" onclick="moveCat(${i},1)" aria-label="Bajar">${ico('down')}</button></div>`).join(''):'<p class="muted">No creaste categorías. Los productos se muestran en una sola lista.</p>'}</div>`;
  return h;
}
function moveInCat(i,d){const c=curCat(),a=c.productIds,j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];markPub(c);save();render()}
function toggleInCat(pid){const c=curCat();if(c.productIds.includes(pid))c.productIds=c.productIds.filter(x=>x!==pid);else c.productIds.push(pid);markPub(c);if(save())toast('Catálogo actualizado','ok');render()}
function addAllInCat(){const c=curCat();activeProducts().forEach(p=>{if(!c.productIds.includes(p.id))c.productIds.push(p.id)});markPub(c);save();render();toast('Productos agregados','ok')}
function hideCatIn(id,hide){const c=curCat();c.hiddenCats=(c.hiddenCats||[]).filter(x=>x!==id);if(hide)c.hiddenCats.push(id);markPub(c);save();render()}
function dupCatalog(){const c=clone(curCat());c.id=uid();c.name+=' (copia)';c.status='borrador';c.pendingReview=false;c.createdAt=c.updatedAt=Date.now();S.catalogs.push(c);S.activeCat=c.id;if(save())toast('Catálogo duplicado (los productos no se duplican)','ok');render()}
function delCatalog(){const c=curCat();askConfirm('Eliminar catálogo',`¿Eliminar el catálogo <b>${esc(c.name)}</b>? Tus productos no se borran.`,'Eliminar',()=>{S.catalogs=S.catalogs.filter(x=>x.id!==c.id);S.activeCat=S.catalogs[0]?S.catalogs[0].id:null;if(save())toast('Catálogo eliminado','ok');render()},true)}

/* ================= DISEÑO ================= */
function setD(k,v,rerender){const c=curCat();c.design[k]=v;markPub(c);saveSoon();if(rerender)render();else queueFrame('dframe')}
function applyPreset(k){const c=curCat(),p=PRESETS[k];Object.assign(c.design,{style:k,font:p.font,body:p.body,card:p.card,photo:p.photo});markPub(c);save();render();toast('Estilo aplicado: '+p.label,'ok')}
function vDesign(){
  let h=`<div class="sec-h"><div><h2>Diseño y personalización</h2><p>Elegí un estilo y ajustá lo básico. Sin conocimientos de diseño.</p></div></div>${guide('design')}`;
  const c=curCat();if(!c)return h+noCatalog();
  const d=c.design;
  h+=catTabs()+`<div class="design-l"><div>
  <div class="card"><h3 class="mb">Estilo visual</h3><div class="grid g3">${Object.entries(PRESETS).map(([k,p])=>`<button class="preset ${d.style===k?'on':''}" onclick="applyPreset('${k}')"><b style="font-family:'${p.font}'">${p.label}</b><small>${p.desc}</small></button>`).join('')}</div></div>
  <div class="card"><h3 class="mb">Portada</h3>${sw('Mostrar portada',d.cover,"setD('cover',this.checked)")}${sw('Mostrar logotipo',d.showLogo,"setD('showLogo',this.checked)")}
   <div class="grid g2 mt"><div class="fld"><label class="f">Título</label><input class="inp" value="${esc(d.title)}" oninput="setD('title',this.value)" placeholder="${esc(S.profile.brand||'Nombre de tu marca')}"></div><div class="fld"><label class="f">Subtítulo</label><input class="inp" value="${esc(d.subtitle)}" oninput="setD('subtitle',this.value)" placeholder="${esc(c.name)}"></div></div>
   <p class="hint">Contacto e instrucciones se editan en <a href="#" onclick="go('catalog');return false">Mi catálogo</a>; logotipo en <a href="#" onclick="go('profile');return false">Mi perfil</a>.</p></div>
  <div class="card"><h3 class="mb">Colores</h3><div class="grid g3">
   <div class="fld"><label class="f">Color principal</label><input type="color" class="inp" value="${d.primary}" oninput="setD('primary',this.value)"></div>
   <div class="fld"><label class="f">Color secundario (títulos)</label><input type="color" class="inp" value="${d.secondary}" oninput="setD('secondary',this.value)"></div>
   <div class="fld"><label class="f">Fondo del catálogo</label><input type="color" class="inp" value="${d.bg}" oninput="setD('bg',this.value)"></div></div>
   <div class="chips"><button class="chip" onclick="setPal('#d77d28','#4a2c1d','#fbf7ef')">Emprende Dulce</button><button class="chip" onclick="setPal('#a0522d','#3b2416','#ffffff')">Chocolate</button><button class="chip" onclick="setPal('#c76b7e','#5a3340','#fdf6f7')">Rosado suave</button><button class="chip" onclick="setPal('#6b8f71','#2f3e33','#f7f8f3')">Verde salvia</button><button class="chip" onclick="setPal('#222222','#111111','#ffffff')">Blanco y negro</button></div></div>
  <div class="card"><h3 class="mb">Tipografía y composición</h3><div class="grid g2">
   <div class="fld"><label class="f">Tipografía de títulos</label><select class="inp" onchange="setD('font',this.value)">${FONTS.map(f=>`<option ${d.font===f?'selected':''}>${f}</option>`).join('')}</select></div>
   <div class="fld"><label class="f">Tipografía de textos</label><select class="inp" onchange="setD('body',this.value)">${FONTS.map(f=>`<option ${d.body===f?'selected':''}>${f}</option>`).join('')}</select></div>
   <div class="fld"><label class="f">Estilo de tarjetas</label><select class="inp" onchange="setD('card',this.value)"><option value="sombra" ${d.card==='sombra'?'selected':''}>Con sombra suave</option><option value="borde" ${d.card==='borde'?'selected':''}>Con borde</option><option value="plano" ${d.card==='plano'?'selected':''}>Plana, sin marco</option></select></div>
   <div class="fld"><label class="f">Distribución de fotografías</label><select class="inp" onchange="setD('photo',this.value)"><option value="arriba" ${d.photo==='arriba'?'selected':''}>Foto arriba</option><option value="izquierda" ${d.photo==='izquierda'?'selected':''}>Foto al costado</option><option value="grande" ${d.photo==='grande'?'selected':''}>Foto grande cuadrada</option></select></div>
   <div class="fld"><label class="f">Productos por fila</label><select class="inp" onchange="setD('cols',Number(this.value))">${[1,2,3].map(n=>`<option value="${n}" ${d.cols===n?'selected':''}>${n}</option>`).join('')}</select><div class="hint">En celulares siempre se muestra uno por fila.</div></div>
   <div class="fld"><label class="f">Productos por página (PDF)</label><select class="inp" onchange="setD('perPage',Number(this.value))"><option value="0" ${!d.perPage?'selected':''}>Automático</option>${[2,4,6,8].map(n=>`<option value="${n}" ${d.perPage===n?'selected':''}>${n}</option>`).join('')}</select></div>
   <div class="fld"><label class="f">Orden de los elementos</label><select class="inp" onchange="setD('order',this.value)"><option value="cats" ${d.order==='cats'?'selected':''}>Agrupados por categoría</option><option value="list" ${d.order==='list'?'selected':''}>Lista única (orden del catálogo)</option></select></div></div></div>
  <div class="card row"><span class="muted" style="flex:1">¿Querés volver a empezar?</span><button class="btn ghost" onclick="resetDesign()">${ico('restore')}Restablecer diseño predeterminado</button></div>
  </div><div class="sticky"><div class="card" style="padding:16px"><div class="row"><b style="flex:1">Vista previa en vivo</b><button class="btn soft" onclick="go('preview')">Ampliar</button></div><div class="seg" style="display:flex"><button style="flex:1;justify-content:center" class="${ui.pmode==='m'?'on':''}" onclick="ui.pmode='m';saveUI();render()">${ico('phone')}Móvil</button><button style="flex:1;justify-content:center" class="${ui.pmode==='d'?'on':''}" onclick="ui.pmode='d';saveUI();render()">${ico('desk')}Escritorio</button></div><div class="pv-wrap" style="padding:20px 10px 14px">${deviceHTML('dframe',ui.pmode,'Vista previa del diseño')}</div></div></div></div>`;
  return h;
}
function setPal(a,b,c){const d=curCat().design;d.primary=a;d.secondary=b;d.bg=c;markPub(curCat());save();render()}
function resetDesign(){askConfirm('Restablecer diseño','Se volverá al estilo “Artesanal elegante” con la paleta de Emprende Dulce. Tus productos y textos no cambian.','Restablecer',()=>{curCat().design=defDesign();markPub(curCat());save();render();toast('Diseño restablecido','ok')})}

/* ================= RENDER DEL CATÁLOGO (HTML PÚBLICO) ================= */
/* El "modelo" contiene SOLO información pública: nunca notas privadas ni datos ocultos. */
function catalogModel(cat,opt={}){
  const P=S.profile;
  const mp=p=>({name:p.name,flavor:p.flavor||'',coating:p.coating||'',filling:p.filling||'',desc:cat.showDesc?(p.desc||''):'',features:p.features||[],available:p.available!==false,photo:p.photos[0]||'',
    presentations:(p.presentations||[]).map(x=>({name:x.name,qty:x.qty,price:cat.showPrices?x.price:'',desc:x.desc||'',available:x.available!==false,photo:x.photo||''}))});
  let groups;
  if(opt.single){const p=prodById(opt.single);groups=p?[{title:'',items:[mp(p)]}]:[]}
  else groups=catalogGroups(cat).map(g=>({title:g.title,items:g.items.map(mp)}));
  return{v:1,brand:P.brand||'',logo:P.logo||'',currency:P.currency||'ARS',design:Object.assign(defDesign(),clone(cat.design||{})),name:cat.name||'',
    intro:cat.intro||(P.pub.desc?P.desc:''),contact:cat.contact||'',orderInfo:cat.orderInfo||'',showPrices:!!cat.showPrices,showDesc:!!cat.showDesc,showPres:!!cat.showPres,
    pc:publicContact(),wa:(P.pub.whatsapp&&P.whatsapp)?P.whatsapp:'',single:!!opt.single,date:Date.now(),groups};
}
function presLine(x,m){
  const sp=m.showPrices,pr=sp&&x.price!==''&&x.price!=null;
  const sub=x.qty===1?(sp?'Precio por unidad':'Unidad'):(sp?`Caja de ${x.qty} u. · precio total${pr?` (${money(x.price/x.qty,m.currency)} c/u)`:''}`:`${x.qty} unidades`);
  return`<div class="pr ${x.available?'':'off'}">${x.photo?`<img class="pimg" src="${x.photo}" alt="">`:''}<div class="pn">${esc(x.name)}<small>${sub}${x.desc?' · '+esc(x.desc):''}${x.available?'':' · Sin stock por ahora'}</small></div>${pr?`<div class="pp">${money(x.price,m.currency)}</div>`:(sp?'<div class="pp q">Consultar</div>':'')}</div>`;
}
function cardHTML(p,m){
  const d=m.design,ph=p.photo;
  const variety=[p.flavor&&`Sabor: ${esc(p.flavor)}`,p.coating&&`Cobertura: ${esc(p.coating)}`,p.filling&&`Relleno: ${esc(p.filling)}`].filter(Boolean).join(' · ');
  const pres=p.presentations||[];
  const priced=pres.filter(x=>x.price!==''&&x.price!=null&&!isNaN(Number(x.price)));
  let prices='';
  if(m.showPres&&pres.length)prices=`<div class="pres">${pres.map(x=>presLine(x,m)).join('')}</div>`;
  else if(m.showPrices&&priced.length){const mn=Math.min(...priced.map(x=>Number(x.price)));prices=`<div class="pres"><div class="pr"><div class="pn">${priced.length>1?'Desde':'Precio'}</div><div class="pp">${money(mn,m.currency)}</div></div></div>`}
  const lay=d.photo==='izquierda'&&ph?'left':(d.photo==='grande'?'big':'');
  return`<article class="card ${lay} ${ph?'':'noph'}">${ph?`<div class="ph"><img src="${ph}" alt="${esc(p.name)}"></div>`:''}<div class="body">
    ${!p.available?'<span class="na">No disponible por el momento</span>':''}
    <h3 class="name">${esc(p.name)}</h3>${variety?`<div class="var">${variety}</div>`:''}
    ${p.desc?`<p class="desc">${nl2br(p.desc)}</p>`:''}
    ${p.features&&p.features.length?`<div class="feats">${p.features.map(f=>`<span>${esc(f)}</span>`).join('')}</div>`:''}
    ${prices}</div></article>`;
}
function buildCatalogHTML(m,opt={}){
  const d=Object.assign(defDesign(),m.design||{}),pre=PRESETS[d.style]||PRESETS.artesanal;
  const fams=[...new Set([d.font,d.body])].map(f=>'family='+f.replace(/ /g,'+')+':wght@400;600;700').join('&');
  const r=pre.radius,align=pre.align,gap=pre.gap;
  const cardBg=d.card==='plano'?'transparent':'#ffffff';
  const cardDeco=d.card==='sombra'?'box-shadow:0 6px 22px rgba(60,35,20,.09);':d.card==='borde'?`border:1.5px solid ${d.primary}55;`:`border-bottom:1px solid rgba(0,0,0,.1);`;
  const title=d.title||m.brand||m.name, sub=d.subtitle||(d.title||m.brand?m.name:'');
  const contact=m.pc||[];
  const waNum=String(m.wa||'').replace(/\D/g,'');
  const fab=!opt.print&&waNum;
  let body='';
  if(m.single){
    const p=m.groups[0]&&m.groups[0].items[0];
    body=`<div class="mini-h">${m.logo&&d.showLogo?`<img src="${m.logo}" alt="">`:''}<b>${esc(m.brand)}</b></div><div class="single">${p?cardHTML(p,m):''}</div>`;
  }else{
    if(d.cover)body+=`<header class="cover">${m.logo&&d.showLogo?`<img class="logo" src="${m.logo}" alt="Logo">`:''}${m.brand&&title!==m.brand?`<div class="brand">${esc(m.brand)}</div>`:''}<h1>${esc(title)}</h1>${sub?`<div class="sub">${esc(sub)}</div>`:''}${m.intro?`<p class="intro">${nl2br(m.intro)}</p>`:''}</header>`;
    else if(m.intro)body+=`<p class="intro" style="margin-bottom:24px">${nl2br(m.intro)}</p>`;
    const groups=m.groups||[];
    if(!groups.some(g=>g.items.length))body+=`<p class="emptyc">Este catálogo todavía no tiene productos visibles.</p>`;
    groups.forEach(g=>{
      if(!g.items.length)return;
      if(g.title)body+=`<h2 class="cat-t">${esc(g.title)}</h2>`;
      const per=opt.print&&d.perPage?d.perPage:0;
      if(per){for(let i=0;i<g.items.length;i+=per){const ch=g.items.slice(i,i+per);body+=`<div class="grid ${i+per<g.items.length?'pgbreak':''}">${ch.map(p=>cardHTML(p,m)).join('')}</div>`}}
      else body+=`<div class="grid">${g.items.map(p=>cardHTML(p,m)).join('')}</div>`;
    });
  }
  if(m.contact||m.orderInfo||contact.length)body+=`<footer class="foot">${m.orderInfo?`<h3>Cómo hacer tu pedido</h3><p>${nl2br(m.orderInfo)}</p>`:''}${m.contact||contact.length?`<h3>Contacto</h3>${m.contact?`<p>${nl2br(m.contact)}</p>`:''}${contact.length?`<ul>${contact.map(c=>`<li><b>${esc(c[0])}:</b> ${esc(c[1])}</li>`).join('')}</ul>`:''}`:''}</footer>`;
  body+=`<p class="credit">${esc(m.brand)}${m.brand?' · ':''}Catálogo actualizado el ${new Date(m.date||Date.now()).toLocaleDateString('es-AR')}</p>`;
  if(fab){const pn=m.single&&m.groups[0]&&m.groups[0].items[0]?m.groups[0].items[0].name:'';body+=`<a class="wa-fab" target="_blank" rel="noopener" href="https://wa.me/${waNum}?text=${encodeURIComponent('¡Hola! Vi '+(pn?'el producto '+pn+' en ':'')+'tu catálogo'+(m.brand?' de '+m.brand:'')+' y quiero hacer un pedido.')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 01-12.4 7.4L3 21l2.1-5.4A8.5 8.5 0 1121 11.5z"/></svg>Hacer mi pedido</a>`}
  const css=`*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'${d.body}',Georgia,sans-serif;background:${d.bg};color:#3d2a1f;line-height:1.55;-webkit-print-color-adjust:exact;print-color-adjust:exact;-webkit-text-size-adjust:100%}
.wrap{max-width:1000px;margin:0 auto;padding:26px 20px ${fab?'110px':'40px'}}
h1,h2,h3{font-family:'${d.font}',Georgia,serif;color:${d.secondary};font-weight:700;line-height:1.2}
.cover{text-align:center;padding:44px 16px 36px;border-bottom:2px solid ${d.primary};margin-bottom:26px}
.cover .logo{max-width:150px;max-height:120px;object-fit:contain;margin:0 auto 14px;display:block}
.brand{letter-spacing:.22em;text-transform:uppercase;font-size:.78rem;color:${d.primary};font-weight:700;margin-bottom:6px}
.cover h1{font-size:clamp(2rem,7vw,3.2rem);${pre.upper?'text-transform:uppercase;letter-spacing:.06em;':''}}
.cover .sub{font-size:1.1rem;opacity:.8;margin-top:6px}
.intro{max-width:620px;margin:18px auto 0;font-size:1rem}
.cat-t{text-align:${align};font-size:${pre.upper?'1.2rem':'1.6rem'};margin:34px 0 18px;${pre.upper?'text-transform:uppercase;letter-spacing:.1em;':''}break-after:avoid;page-break-after:avoid}
.cat-t:after{content:'';display:block;width:48px;height:3px;background:${d.primary};margin:10px ${align==='center'?'auto':'0'} 0;border-radius:3px}
.grid{display:grid;grid-template-columns:repeat(${d.cols},minmax(0,1fr));gap:${gap}px;margin-bottom:${gap}px}
.card{background:${cardBg};border-radius:${r}px;overflow:hidden;break-inside:avoid;page-break-inside:avoid;display:flex;flex-direction:column;${cardDeco}}
.card.noph{border-top:5px solid ${d.primary}}
.ph{aspect-ratio:4/3;overflow:hidden;background:#f1ebe1}
.ph img{width:100%;height:100%;object-fit:cover;display:block}
.card.big .ph{aspect-ratio:1/1}
.card.left{flex-direction:row}.card.left .ph{width:42%;aspect-ratio:auto;min-height:190px}.card.left .body{flex:1}
.body{padding:18px 20px 20px;flex:1;${d.card==='plano'?'padding-left:2px;padding-right:2px;':''}}
.name{font-size:1.28rem;margin-bottom:4px}
.var{font-size:.84rem;opacity:.72;margin-bottom:10px}
.desc{font-size:.93rem;margin-bottom:12px}
.feats{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.feats span{font-size:.74rem;padding:3px 10px;border-radius:50px;background:${d.primary}1f;color:${d.secondary};font-weight:600}
.pres{border-top:1px dashed rgba(0,0,0,.15);margin-top:12px;padding-top:6px}
.pr{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:7px 0;font-size:.93rem}
.pr.off{opacity:.55}
.pr .pn{flex:1;font-weight:600}.pr .pn small{display:block;opacity:.68;font-size:.77rem;font-weight:400}
.pr .pp{font-weight:700;color:${d.primary};white-space:nowrap;text-align:right;font-size:1rem}.pr .pp.q{font-size:.8rem;opacity:.8}
.pimg{width:40px;height:40px;border-radius:8px;object-fit:cover}
.na{display:inline-block;background:#f6e3e0;color:#9d3a2e;font-size:.72rem;padding:3px 10px;border-radius:50px;font-weight:700;margin-bottom:8px}
.foot{margin-top:36px;padding:24px 26px;border-radius:${r}px;background:rgba(255,255,255,.65);border:1px solid ${d.primary}40;break-inside:avoid;page-break-inside:avoid}
.foot h3{font-size:1.15rem;margin:0 0 8px}.foot p+h3,.foot ul+h3{margin-top:18px}.foot ul{list-style:none}.foot li{padding:3px 0}
.credit{text-align:center;font-size:.72rem;opacity:.55;margin-top:26px}
.emptyc{text-align:center;opacity:.6;padding:40px 0}
.mini-h{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:20px;color:${d.secondary};font-family:'${d.font}',serif;font-size:1.2rem}.mini-h img{height:44px;max-width:100px;object-fit:contain}
.single{max-width:480px;margin:0 auto}
.wa-fab{position:fixed;right:16px;bottom:16px;display:inline-flex;align-items:center;gap:8px;min-height:52px;padding:0 22px;border-radius:50px;background:#25a35a;color:#fff;font-family:'${d.body}',sans-serif;font-weight:700;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.2);touch-action:manipulation;-webkit-tap-highlight-color:rgba(0,0,0,0)}
.wa-fab svg{width:22px;height:22px}
@media(max-width:600px){.grid{grid-template-columns:1fr}.card.left{flex-direction:column}.card.left .ph{width:100%;aspect-ratio:4/3;min-height:0}.wrap{padding:18px 16px ${fab?'100px':'30px'}}}
@media print{@page{size:A4;margin:12mm}.wa-fab{display:none}.wrap{padding:0;max-width:none}.cover{min-height:250mm;display:flex;flex-direction:column;justify-content:center;align-items:center;page-break-after:always;break-after:page;border:none}.pgbreak{break-after:page;page-break-after:always}.grid{grid-template-columns:repeat(${Math.max(d.cols,m.single?1:2)},minmax(0,1fr))}.single .grid{grid-template-columns:1fr}}`;
  const ttl=m.single&&m.groups[0]&&m.groups[0].items[0]?m.groups[0].items[0].name+(m.brand?' · '+m.brand:''):title;
  return`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(ttl)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?${fams}&display=swap" rel="stylesheet"><style>${css}</style></head><body><div class="wrap">${body}</div>${opt.autoPrint?'<script>window.addEventListener("load",function(){setTimeout(function(){window.print()},700)})<\/script>':''}</body></html>`;
}
const DEVICES={m:{w:390,h:844,bw:414,bh:868,label:'Celular'},d:{w:1280,h:800,bw:1282,bh:841,label:'Escritorio'}};
function deviceHTML(id,mode,title){
  const D=DEVICES[mode];
  return`<div class="dev-wrap" data-dev="${mode}"><div class="dev-stage" style="width:${D.bw}px;height:${D.bh}px"><div class="dev-box dev-${mode}" style="width:${D.bw}px;height:${D.bh}px">${mode==='d'?`<div class="dev-bar"><i></i><i></i><i></i><span>${esc((S.profile.brand||'mi-catalogo').toLowerCase())} · catálogo</span></div>`:'<div class="dev-notch"></div>'}<iframe id="${id}" title="${title||'Vista previa'}" style="width:${D.w}px;height:${D.h}px"></iframe></div></div><div class="dev-cap"></div></div>`;
}
function fitDevices(){
  document.querySelectorAll('.dev-wrap').forEach(w=>{
    const D=DEVICES[w.dataset.dev],avail=w.clientWidth;if(!avail)return;
    const maxH=Math.max(D===DEVICES.m?560:420,window.innerHeight-(D===DEVICES.m?170:150));
    const sc=Math.min(1,avail/D.bw,maxH/D.bh);
    const st=w.querySelector('.dev-stage');st.style.width=Math.floor(D.bw*sc)+'px';st.style.height=Math.floor(D.bh*sc)+'px';
    w.querySelector('.dev-box').style.transform=`scale(${sc})`;
    w.querySelector('.dev-cap').textContent=`${D.label} · pantalla de ${D.w}×${D.h} px`+(sc<0.995?` · mostrada al ${Math.round(sc*100)}%`:' · tamaño real');
  });
}
let fitT;window.addEventListener('resize',()=>{clearTimeout(fitT);fitT=setTimeout(fitDevices,120)});
function queueFrame(id){clearTimeout(frameTimer);frameTimer=setTimeout(()=>refreshFrame(id),250)}
function refreshFrame(id){
  const f=document.getElementById(id);const c=curCat();if(!f||!c)return;
  fitDevices();
  f.srcdoc=buildCatalogHTML(catalogModel(c));
}

/* ================= VISTA PREVIA ================= */
function warnings(c){
  const w=[],prods=catProducts(c);
  if(!prods.length)w.push(['err','El catálogo no tiene productos visibles. Agregá al menos uno para poder exportarlo.']);
  const noName=prods.filter(p=>!p.name.trim());if(noName.length)w.push(['err',`${noName.length} producto(s) sin nombre.`]);
  const noPh=prods.filter(p=>!p.photos.length);if(noPh.length)w.push(['warn',`${noPh.length} producto(s) sin fotografía: ${noPh.map(p=>esc(p.name)).join(', ')}.`]);
  if(c.showPrices){const np=prods.filter(p=>!hasPrice(p));if(np.length)w.push(['warn',`${np.length} producto(s) sin precio (se mostrará “Consultar”): ${np.map(p=>esc(p.name)).join(', ')}.`])}
  if(!c.contact&&!publicContact().length)w.push(['warn','El catálogo no tiene información de contacto.']);
  const vis=visibleCatIds(c);const emptyCats=S.categories.filter(k=>vis.includes(k.id)&&!prods.some(p=>p.catId===k.id));
  if(emptyCats.length&&c.design.order==='cats')w.push(['info',`Categorías sin productos en este catálogo (no se muestran): ${emptyCats.map(k=>esc(k.name)).join(', ')}.`]);
  const hiddenBy=prods.filter(p=>p.catId&&catById(p.catId)&&!vis.includes(p.catId));if(hiddenBy.length)w.push(['info',`${hiddenBy.length} producto(s) no se muestran porque su categoría está oculta.`]);
  const na=prods.filter(p=>!p.available);if(na.length)w.push(['info',`${na.length} producto(s) marcados como no disponibles (se muestran con un aviso): ${na.map(p=>esc(p.name)).join(', ')}.`]);
  const arch=c.productIds.map(prodById).filter(p=>p&&p.status==='archivado');if(arch.length)w.push(['info',`${arch.length} producto(s) archivados no aparecen.`]);
  return w;
}
function warnHTML(w){return w.length?w.map(x=>`<div class="alert ${x[0]==='err'?'err':x[0]==='info'?'info':''}">${ico(x[0]==='info'?'eye':'warn')}<div>${x[1]}</div></div>`).join(''):`<div class="alert ok">${ico('check')}<div>Todo en orden: no encontramos datos importantes faltantes.</div></div>`}
function vPreview(){
  let h=`<div class="sec-h"><div><h2>Vista previa</h2><p>Así verá tu clienta el catálogo. Las notas privadas nunca se muestran.</p></div></div>${guide('preview')}`;
  const c=curCat();if(!c)return h+noCatalog();
  if(c.pendingReview){c.pendingReview=false;save()}
  h+=catTabs()+`<div class="card"><h3 class="mb">Revisión antes de compartir</h3>${warnHTML(warnings(c))}<p class="hint mt">Las advertencias son informativas: podés exportar igual, salvo que el catálogo no tenga productos.</p></div>
  <div class="row mt mb"><div class="seg"><button class="${ui.pmode==='m'?'on':''}" onclick="ui.pmode='m';saveUI();render()">${ico('phone')}Móvil</button><button class="${ui.pmode==='d'?'on':''}" onclick="ui.pmode='d';saveUI();render()">${ico('desk')}Escritorio</button></div><span class="sp"></span><button class="btn ghost" onclick="go('design')">${ico('palette')}Ajustar diseño</button><button class="btn" onclick="go('export')">${ico('share')}Exportar</button></div>
  <div class="pv-wrap">${deviceHTML('pframe',ui.pmode,'Vista previa del catálogo')}</div>`;
  return h;
}

/* ================= EXPORTAR Y COMPARTIR ================= */
function markExported(){if(!S.exported){S.exported=true;save()}}
function exportPDF(){
  const c=curCat();if(!catProducts(c).length){toast('Agregá al menos un producto visible antes de generar el PDF','err');return}
  const html=buildCatalogHTML(catalogModel(c),{print:true,autoPrint:true});
  const w=window.open('','_blank');
  if(w){w.document.open();w.document.write(html);w.document.close();markExported();toast('Se abrió la ventana de impresión: elegí “Guardar como PDF”','ok',4500);return}
  const f=document.createElement('iframe');f.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0';document.body.appendChild(f);
  f.srcdoc=buildCatalogHTML(catalogModel(c),{print:true});
  f.onload=()=>{setTimeout(()=>{try{f.contentWindow.focus();f.contentWindow.print();markExported()}catch(e){toast('No se pudo abrir la impresión. Probá con el enlace o el archivo web.','err')}setTimeout(()=>f.remove(),60000)},700)};
}
function exportWeb(single){
  const c=curCat();const html=buildCatalogHTML(catalogModel(c,{single}));
  const name=single?slug(prodById(single).name)+'-ficha.html':slug(c.name)+'.html';
  download(name,html,'text/html');markExported();toast('Archivo descargado: '+name,'ok');
}

/* --- Enlaces para compartir: el catálogo viaja comprimido dentro del enlace --- */
const LINK_LIMIT=60000;
function b64u(u8){let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function ub64(str){str=str.replace(/-/g,'+').replace(/_/g,'/');while(str.length%4)str+='=';const bin=atob(str),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u}
async function packData(obj){
  const bytes=new TextEncoder().encode(JSON.stringify(obj));
  if(typeof CompressionStream!=='undefined'){try{const st=new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));return 'z'+b64u(new Uint8Array(await new Response(st).arrayBuffer()))}catch(e){}}
  return 'j'+b64u(bytes);
}
async function unpackData(s){
  const t=s[0],u=ub64(s.slice(1));
  if(t==='z'){const st=new Blob([u]).stream().pipeThrough(new DecompressionStream('deflate-raw'));return JSON.parse(await new Response(st).text())}
  return JSON.parse(new TextDecoder().decode(u));
}
function shrinkImg(src,max,q,bg){return new Promise(res=>{if(!src)return res('');const i=new Image();i.onload=()=>{const sc=Math.min(1,max/Math.max(i.width,i.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(i.width*sc));c.height=Math.max(1,Math.round(i.height*sc));const x=c.getContext('2d');x.fillStyle=bg||'#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',q))};i.onerror=()=>res('');i.src=src})}
function isLocalApp(){return !/^https?:$/.test(location.protocol)}
function shareBase(){const u=(S.profile.appUrl||'').trim();if(!isLocalApp())return location.href.split('#')[0];return(u||location.href).split('#')[0]}
async function buildLink(cat,opt={}){
  const base=shareBase(),mode=opt.photos||'auto';
  const model=catalogModel(cat,{single:opt.single});
  if(model.logo)model.logo=await shrinkImg(model.logo,160,.75,model.design.bg);
  const make=async(max,q)=>{const m=clone(model);for(const g of m.groups)for(const it of g.items){it.photo=(max&&it.photo)?await shrinkImg(it.photo,max,q):'';it.presentations.forEach(x=>x.photo='')}return base+'#c='+await packData(m)};
  let url,photos=true;
  if(mode==='none'){url=await make(0);photos=false}
  else if(mode==='full')url=await make(420,.62);
  else{url=await make(280,.5);if(url.length>LINK_LIMIT)url=await make(180,.42);if(url.length>LINK_LIMIT){url=await make(0);photos=false}}
  const hasPh=model.groups.some(g=>g.items.some(i=>i.photo));
  return{url,photos:photos&&hasPh,len:url.length,at:Date.now(),dropped:mode==='auto'&&!photos&&hasPh};
}
let linkBusy=false;
async function genCatalogLink(){
  const c=curCat();if(!catProducts(c).length){toast('Agregá al menos un producto visible antes de generar el enlace','err');return}
  if(linkBusy)return;linkBusy=true;
  const b=$('#lkBtn');if(b){b.disabled=true;b.textContent='Generando enlace…'}
  try{
    const mode=$('#lkPh').value;const r=await buildLink(c,{photos:mode});
    c.link=r;c.linkMode=mode;markExported();
    if(save()){render();toast(r.dropped?'Enlace listo, sin fotos: con fotos quedaba demasiado largo para WhatsApp':'Enlace listo para compartir','ok',4500)}
  }catch(e){toast('No se pudo generar el enlace','err');if(b){b.disabled=false;b.textContent='Generar enlace'}}
  finally{linkBusy=false}
}
function linkStale(c){return c.link&&(c.updatedAt||0)>c.link.at}
function openLink(url){window.open(url,'_blank','noopener')}
async function shareLink(url,title){
  if(navigator.share){try{await navigator.share({title,url});return}catch(e){if(e&&e.name==='AbortError')return}}
  copyText(url);
}
function waLink(url,what){const b=S.profile.brand;openWA(`¡Hola! Te comparto ${what}${b?' de '+b:''}:\n${url}`,'')}
function linkBox(r,title,what){
  const u=esc(r.url);
  return`<div class="linkbox"><input class="inp" readonly value="${u}" onclick="this.select()" aria-label="Enlace"></div>
  <p class="hint">${r.photos?'Con fotos':'Sin fotos'} · ${r.len.toLocaleString('es-AR')} caracteres · generado el ${fmtDate(r.at)}</p>
  ${r.len>LINK_LIMIT?`<div class="alert">${ico('warn')}<div>Este enlace es muy largo y puede no abrirse desde WhatsApp. Generalo de nuevo con la opción <b>Sin fotos</b>.</div></div>`:''}
  <div class="row"><button class="btn" onclick="copyText(${esc(JSON.stringify(r.url))})">${ico('copy')}Copiar enlace</button><button class="btn ghost" onclick="waLink(${esc(JSON.stringify(r.url))},'${what}')">${ico('wa')}Enviar por WhatsApp</button>${navigator.share?`<button class="btn ghost" onclick="shareLink(${esc(JSON.stringify(r.url))},${esc(JSON.stringify(title))})">${ico('share')}Compartir</button>`:''}<button class="btn soft" onclick="openLink(${esc(JSON.stringify(r.url))})">${ico('eye')}Abrir</button></div>`;
}

function waDefault(c){
  const P=S.profile;let t=`¡Hola! Te comparto el catálogo${P.brand?' de '+P.brand:''}${c.name?' — '+c.name:''}.\n`;
  catalogGroups(c).forEach(g=>{
    if(!g.items.length)return;
    if(g.title)t+=`\n*${g.title}*\n`;else t+='\n';
    g.items.forEach(p=>{
      t+=`• ${p.name}${p.available?'':' (no disponible por ahora)'}`;
      if(c.showPrices){const ps=(c.showPres?p.presentations:pricedPres(p).slice(0,1)).filter(x=>x.price!==''&&x.available);if(ps.length)t+=': '+ps.map(x=>`${x.name} ${money(x.price)}`).join(' · ')}
      t+='\n';
    });
  });
  if(c.orderInfo)t+=`\n*Cómo pedir:* ${c.orderInfo}\n`;
  if(c.contact)t+=`\n${c.contact}\n`;
  return t.trim();
}
function openWA(text,num){
  num=(num||'').replace(/\D/g,'');
  const url=(num?`https://wa.me/${num}`:'https://wa.me/')+'?text='+encodeURIComponent(text);
  window.open(url,'_blank');markExported();toast('Se abrió WhatsApp con el mensaje preparado. El envío lo hacés vos.','ok',4500);
}
function sendWAMsg(){const c=curCat();let t=$('#waMsg').value;const lk=$('#waLk');if(lk&&lk.checked&&c.link)t+=`\n\nVer el catálogo completo:\n${c.link.url}`;openWA(t,$('#waNum').value)}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Copiado al portapapeles','ok')}catch(e){const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy');toast('Copiado al portapapeles','ok')}catch(_){toast('No se pudo copiar','err')}a.remove()}}
const h3i=(i,t)=>`<h3 class="h3i">${ico(i)}<span>${t}</span></h3>`;
function vExport(){
  let h=`<div class="sec-h"><div><h2>Exportar y compartir</h2><p>Compartí tu catálogo con un enlace, por WhatsApp, en PDF o con imágenes de cada producto para tus redes.</p></div></div>${guide('export')}`;
  const c=curCat();if(!c)return h+noCatalog();
  const prods=catProducts(c);
  if(!c.waMsg)c.waMsg=waDefault(c);
  const w=warnings(c),errs=w.filter(x=>x[0]==='err').length,warns=w.filter(x=>x[0]==='warn').length;
  const local=isLocalApp();
  if(!ui.shP||!prods.some(p=>p.id===ui.shP))ui.shP=prods[0]?prods[0].id:'';
  h+=catTabs();
  // Estado
  h+=`<div class="card"><div class="row"><div style="flex:1;min-width:200px"><h3>Estado: <span class="badge ${c.status==='publicado'?'ok':''}">${c.status==='publicado'?'Publicado':'Borrador'}</span></h3><p class="hint" style="margin-top:6px">${errs?'Hay datos imprescindibles faltantes.':warns?`${warns} advertencia(s) para revisar en la <a href="#" onclick="go('preview');return false">vista previa</a>.`:'Listo para compartir.'}</p></div>
   ${c.status==='publicado'?`<button class="btn ghost" onclick="setStatus('borrador')">Volver a borrador</button>`:`<button class="btn ok" onclick="setStatus('publicado')" ${prods.length?'':'disabled'}>${ico('flag')}Marcar como publicado</button>`}</div></div>`;
  // Enlace
  h+=`<div class="card card-hl">${h3i('globe','Enlace para compartir el catálogo')}
   <p class="hint">Generá un enlace que tus clientas abren directamente en el celular o la computadora, sin descargar nada ni iniciar sesión. Solo incluye lo que se ve en el catálogo: nunca tus notas privadas.</p>
   ${local?`<div class="alert">${ico('warn')}<div><b>La app está abierta desde un archivo de este dispositivo.</b> Para que otras personas puedan abrir el enlace, la app tiene que estar publicada en internet (por ejemplo, en tu sitio web). Si ya lo está, pegá su dirección acá:
     <input class="inp" style="margin-top:10px" type="url" inputmode="url" value="${esc(S.profile.appUrl||'')}" placeholder="https://tusitio.com/mi-catalogo-dulce.html" onchange="S.profile.appUrl=this.value.trim();save();render()">
     <div class="hint">${S.profile.appUrl?'Los enlaces nuevos usarán esta dirección.':'Mientras no la completes, el enlace solo se abrirá en este dispositivo.'}</div></div></div>`:''}
   <div class="grid g2 align-end"><div class="fld"><label class="f" for="lkPh">Fotos en el enlace</label><select id="lkPh" class="inp">
     <option value="auto" ${(c.linkMode||'auto')==='auto'?'selected':''}>Automático: fotos livianas si entran</option>
     <option value="full" ${c.linkMode==='full'?'selected':''}>Fotos en mejor calidad (enlace más largo)</option>
     <option value="none" ${c.linkMode==='none'?'selected':''}>Sin fotos (enlace más corto)</option></select></div>
     <button class="btn" id="lkBtn" onclick="genCatalogLink()" ${prods.length?'':'disabled'}>${ico('globe')}${c.link?'Generar enlace actualizado':'Generar enlace'}</button></div>
   ${c.link?(linkStale(c)?`<div class="alert">${ico('warn')}<div><b>Hiciste cambios después de generar este enlace.</b> Generá uno nuevo para que tus clientas vean la versión actual.</div></div>`:'')+linkBox(c.link,c.name,'el catálogo'):''}
   <details class="how"><summary>¿Cómo funciona el enlace?</summary><p>El catálogo viaja comprimido dentro del enlace mismo, sin pasar por ningún servidor. Por eso cada enlace es una “foto” del momento: si cambiás precios o productos, generá uno nuevo y compartilo. Un enlace que ya enviaste no se puede desactivar: dejá de usarlo y enviá el nuevo.</p></details></div>`;
  // WhatsApp
  h+=`<div class="card">${h3i('wa','Mensaje de WhatsApp con la lista de productos')}
   <p class="hint">Un mensaje de texto con tus productos y precios. El botón abre WhatsApp con el texto listo: vos elegís el contacto y lo enviás.</p>
   <div class="grid g2"><div class="fld"><label class="f" for="waNum">Número de la clienta (opcional)</label><input id="waNum" class="inp" type="tel" inputmode="tel" placeholder="Ej.: 5491122334455 (con código de país, sin +)"></div>
   <div class="fld"><label class="f">Enlace</label>${c.link?sw('Agregar el enlace del catálogo al final',true,'','waLk'):`<p class="hint" style="margin-top:12px">Generá el enlace de arriba para poder sumarlo al mensaje.</p>`}</div></div>
   <div class="fld"><label class="f" for="waMsg">Mensaje</label><textarea id="waMsg" class="inp" style="min-height:200px" oninput="curCat().waMsg=this.value;saveSoon()">${esc(c.waMsg)}</textarea></div>
   <div class="row"><button class="btn" onclick="sendWAMsg()">${ico('wa')}Abrir WhatsApp</button><button class="btn ghost" onclick="copyText($('#waMsg').value)">${ico('copy')}Copiar mensaje</button><button class="btn soft" onclick="curCat().waMsg=waDefault(curCat());save();render();toast('Mensaje regenerado con los datos actuales')">${ico('restore')}Regenerar con precios actuales</button></div></div>`;
  // Producto individual
  h+=`<div class="card">${h3i('img','Compartir un solo producto')}
   <p class="hint">Ideal para promocionar un alfajor en Instagram, Facebook o en tus estados de WhatsApp, sin enviar el catálogo completo.</p>`;
  if(!prods.length)h+=`<p class="muted">Agregá productos al catálogo para poder compartirlos.</p></div>`;
  else h+=`<div class="grid g2 align-end"><div class="fld"><label class="f" for="shP">Paso 1 · Elegí el producto</label><select id="shP" class="inp" onchange="ui.shP=this.value;ui.plink=null;$('#plBox').innerHTML='';drawShare()">${prods.map(p=>`<option value="${p.id}" ${ui.shP===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></div>
     <div class="fld">${sw('Mostrar precios al compartir',c.showPrices,'drawShare()','shPr')}</div></div>
   <p class="f" style="margin-bottom:0">Paso 2 · Elegí cómo compartirlo</p>
   <div class="grid g2 opts">
    <div class="opt">${h3i('img','Imagen para redes sociales')}
     <p class="hint">Una imagen lista para publicar con tu foto, el nombre del producto${c.showPrices?' y los precios':''}.</p>
     <div class="fld"><label class="f" for="shF">Formato</label><select id="shF" class="inp" onchange="ui.shF=this.value;drawShare()">
       <option value="sq" ${(ui.shF||'sq')==='sq'?'selected':''}>Publicación cuadrada (1080×1080) · feed de Instagram y Facebook</option>
       <option value="v" ${ui.shF==='v'?'selected':''}>Publicación vertical (1080×1350) · feed de Instagram</option>
       <option value="st" ${ui.shF==='st'?'selected':''}>Historia o estado (1080×1920) · Instagram, Facebook y WhatsApp</option></select></div>
     <div class="imgprev"><canvas id="shCanvas" aria-label="Vista previa de la imagen"></canvas></div>
     <div class="row"><button class="btn" onclick="shareImg('download')">${ico('download')}Descargar imagen</button>${navigator.share?`<button class="btn ghost" onclick="shareImg('share')">${ico('share')}Compartir imagen</button>`:''}</div></div>
    <div class="opt">${h3i('globe','Enlace de este producto')}
     <p class="hint">Un enlace que abre solo la ficha de este producto, con su foto, descripción y presentaciones.</p>
     <button class="btn block" id="plBtn" onclick="genProductLink()">${ico('globe')}Generar enlace del producto</button>
     <div id="plBox" class="stack-s">${ui.plink&&ui.plink.pid===ui.shP?linkBox(ui.plink,'Producto','este producto'):''}</div>
     <hr class="sep">
     ${h3i('wa','Texto por WhatsApp')}
     <p class="hint">Abre WhatsApp con el nombre, la descripción y los precios de este producto.</p>
     <button class="btn ghost block" onclick="waProduct()">${ico('wa')}Enviar por WhatsApp</button>
     <hr class="sep">
     ${h3i('file','Ficha descargable')}
     <p class="hint">Descargá la ficha del producto como página web (un archivo) para enviarla por correo o mensaje.</p>
     <button class="btn soft block" onclick="exportWeb($('#shP').value)">${ico('download')}Descargar ficha (.html)</button></div>
   </div></div>`;
  // Archivos
  h+=`<div class="grid g2">
   <div class="card">${h3i('file','Catálogo en PDF')}<p class="hint">Para imprimir o enviar como archivo. Incluye portada, logotipo, categorías, fotos, descripciones, presentaciones, precios (si están activos), contacto e instrucciones. Los productos no se cortan entre páginas.</p>
    <button class="btn block" onclick="exportPDF()" ${prods.length?'':'disabled'}>${ico('download')}Generar PDF</button><p class="hint">En la ventana de impresión elegí <b>“Guardar como PDF”</b> como destino.</p></div>
   <div class="card">${h3i('download','Catálogo como archivo web')}<p class="hint">Descargá el catálogo como página web en un solo archivo. Sirve como respaldo o para subirlo a tu propio sitio. No incluye notas privadas.</p>
    <button class="btn soft block" onclick="exportWeb()" ${prods.length?'':'disabled'}>${ico('download')}Descargar catálogo (.html)</button></div></div>`;
  return h;
}
async function genProductLink(){
  const pid=$('#shP').value,b=$('#plBtn');b.disabled=true;b.textContent='Generando enlace…';
  try{const r=await buildLink(curCat(),{single:pid,photos:'auto'});ui.plink=Object.assign(r,{pid});$('#plBox').innerHTML=linkBox(r,prodById(pid).name,'este producto');markExported();toast('Enlace del producto listo','ok')}
  catch(e){toast('No se pudo generar el enlace','err')}
  b.disabled=false;b.innerHTML=ico('globe')+'Generar enlace actualizado';
}
function setStatus(s){const c=curCat();if(s==='publicado'){const w=warnings(c);if(w.some(x=>x[0]==='err')){toast('Faltan datos imprescindibles: revisá la vista previa','err');return}}c.status=s;c.pendingReview=false;c.updatedAt=Date.now();if(c.link)c.link.at=c.updatedAt;if(save())toast(s==='publicado'?'Catálogo marcado como publicado':'Catálogo en borrador','ok');render()}
function waProduct(){
  const c=curCat(),p=prodById($('#shP').value),inc=$('#shPr').checked;
  let t=`${p.name}${S.profile.brand?' — '+S.profile.brand:''}\n`;if(c.showDesc&&p.desc)t+=`\n${p.desc}\n`;
  if(inc){const ps=p.presentations.filter(x=>x.price!==''&&x.available);if(ps.length)t+='\n'+ps.map(x=>`• ${x.name}: ${money(x.price)}`).join('\n')+'\n'}
  if(ui.plink&&ui.plink.pid===p.id)t+=`\nVer ficha: ${ui.plink.url}\n`;
  if(c.orderInfo)t+=`\n${c.orderInfo}`;
  openWA(t.trim(),'');
}
function wrapText(x,text,maxW){const words=String(text).split(/\s+/),lines=[];let l='';words.forEach(w=>{const t=l?l+' '+w:w;if(x.measureText(t).width>maxW&&l){lines.push(l);l=w}else l=t});if(l)lines.push(l);return lines}
function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src})}
async function drawProductImage(p,fmt,withPrice){
  const c=curCat(),d=c.design,P=S.profile;
  const W=1080,H=fmt==='v'?1350:fmt==='st'?1920:1080;
  const cv=$('#shCanvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');
  try{await document.fonts.load(`700 60px "${d.font}"`);await document.fonts.load(`400 30px "${d.body}"`)}catch(e){}
  x.fillStyle=d.bg;x.fillRect(0,0,W,H);
  let y=0;const pad=70;
  if(p.photos[0]){
    const img=await loadImg(p.photos[0]);const ph=Math.round(H*(fmt==='st'?.52:.56));
    const r=Math.max(W/img.width,ph/img.height),iw=img.width*r,ih=img.height*r;
    x.save();x.beginPath();x.rect(0,0,W,ph);x.clip();x.drawImage(img,(W-iw)/2,(ph-ih)/2,iw,ih);x.restore();
    y=ph+70;
  }else{x.fillStyle=d.primary;x.fillRect(0,0,W,22);y=fmt==='sq'?200:300}
  if(P.logo&&!p.photos[0]&&d.showLogo){try{const lg=await loadImg(P.logo);const s=Math.min(180/lg.width,120/lg.height);x.drawImage(lg,(W-lg.width*s)/2,y-150,lg.width*s,lg.height*s);y+=10}catch(e){}}
  x.textAlign='center';
  if(P.brand){x.fillStyle=d.primary;x.font=`700 30px "${d.body}", sans-serif`;x.fillText(P.brand.toUpperCase().split('').join(String.fromCharCode(8202)),W/2,y);y+=74}
  x.fillStyle=d.secondary;x.font=`700 70px "${d.font}", serif`;
  wrapText(x,p.name,W-pad*2).slice(0,2).forEach(l=>{x.fillText(l,W/2,y);y+=82});
  const variety=[p.flavor,p.filling&&('Relleno: '+p.filling),p.coating&&('Cobertura: '+p.coating)].filter(Boolean).join(' · ');
  if(variety){x.globalAlpha=.75;x.font=`400 32px "${d.body}", sans-serif`;wrapText(x,variety,W-pad*2).slice(0,2).forEach(l=>{x.fillText(l,W/2,y);y+=44});x.globalAlpha=1;y+=10}
  if(withPrice){
    const ps=p.presentations.filter(z=>z.price!==''&&z.available).slice(0,fmt==='sq'?3:5);
    if(ps.length){y+=12;ps.forEach(z=>{x.font=`600 36px "${d.body}", sans-serif`;x.fillStyle=d.secondary;const label=z.name+(z.qty>1?` (${z.qty} u.)`:'');const pr=money(z.price);
      x.textAlign='left';x.fillText(label,pad+40,y);x.textAlign='right';x.fillStyle=d.primary;x.font=`700 40px "${d.body}", sans-serif`;x.fillText(pr,W-pad-40,y);
      x.strokeStyle='rgba(0,0,0,.12)';x.setLineDash([6,8]);x.beginPath();x.moveTo(pad+40,y+20);x.lineTo(W-pad-40,y+20);x.stroke();x.setLineDash([]);y+=64});x.textAlign='center'}
  }
  if(!p.available){x.fillStyle='#9d3a2e';x.font=`700 30px "${d.body}", sans-serif`;x.fillText('No disponible por el momento',W/2,Math.min(y+20,H-110))}
  const ct=publicContact().filter(c=>['WhatsApp','Instagram'].includes(c[0])).map(c=>c[1]).join('   ·   ');
  if(ct){x.fillStyle=d.secondary;x.globalAlpha=.8;x.font=`600 30px "${d.body}", sans-serif`;x.fillText(ct,W/2,H-60);x.globalAlpha=1}
  x.fillStyle=d.primary;x.fillRect(0,H-14,W,14);
  return cv;
}
let drawSeq=0;
async function drawShare(){
  if(!$('#shCanvas')||!$('#shP'))return;
  const seq=++drawSeq;const p=prodById($('#shP').value);if(!p)return;
  try{await drawProductImage(p,$('#shF').value,$('#shPr').checked)}catch(e){}
  if(seq!==drawSeq)return;
}
async function shareImg(mode){
  const p=prodById($('#shP').value),fmt=$('#shF').value,wp=$('#shPr').checked;
  try{
    const cv=await drawProductImage(p,fmt,wp);
    const blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.92));
    const name=slug(p.name)+'-'+(fmt==='sq'?'cuadrado':fmt==='v'?'vertical':'historia')+'.jpg';
    if(mode==='share'){
      const file=new File([blob],name,{type:'image/jpeg'});
      if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:p.name});markExported();return}
      toast('Tu navegador no permite compartir imágenes: se descargará','err');
    }
    download(name,blob);markExported();toast('Imagen descargada','ok');
  }catch(e){if(e&&e.name==='AbortError')return;toast('No se pudo generar la imagen','err')}
}

/* ================= VISTA PÚBLICA (al abrir un enlace) ================= */
async function publicView(){
  document.body.classList.add('public');
  const f=document.createElement('iframe');f.id='pubFrame';f.title='Catálogo';document.body.appendChild(f);
  try{
    const m=await unpackData(location.hash.slice(3));
    if(!m||!Array.isArray(m.groups))throw new Error('x');
    const it=m.single&&m.groups[0]&&m.groups[0].items[0];
    document.title=(it?it.name+' · ':'')+(m.brand||m.name||'Catálogo');
    f.srcdoc=buildCatalogHTML(m,{});
  }catch(e){
    f.remove();const d=document.createElement('div');d.className='pub-err';
    d.innerHTML='<h1>No pudimos abrir este catálogo</h1><p>El enlace está incompleto o fue modificado. Pedile a quien te lo envió que te lo comparta de nuevo.</p>';
    document.body.appendChild(d);
  }
}

/* ================= PERFIL ================= */
function setP(k,v){S.profile[k]=v;S.catalogs.forEach(markPub);saveSoon()}
function setPub(k,v){S.profile.pub[k]=v;S.catalogs.forEach(markPub);save()}
function vProfile(){
  const P=S.profile,used=((localStorage.getItem(KEY)||'').length*2/1048576);
  const f=(k,label,ph,type)=>`<div class="fld"><label class="f">${label}</label><input class="inp" type="${type||'text'}" value="${esc(P[k])}" oninput="setP('${k}',this.value)" placeholder="${ph||'Opcional'}"></div>`;
  return`<div class="sec-h"><div><h2>Mi perfil y configuración</h2><p>La identidad de tu emprendimiento. Todos los datos de contacto son opcionales.</p></div></div>${guide('profile')}
  <div class="card"><h3 class="mb">Identidad comercial</h3>
   <div class="row mb" style="align-items:flex-start"><div class="logo-prev">${P.logo?`<img src="${P.logo}" alt="Logotipo">`:ico('img')}</div><div><p style="font-weight:800">Logotipo</p><p class="hint mb">PNG con fondo transparente o JPG.</p><div class="row"><button class="btn soft" onclick="pickImage(d=>{S.profile.logo=d;S.catalogs.forEach(markPub);if(save())toast('Logotipo guardado','ok');render()},{max:600,png:true})">${ico('upload')}${P.logo?'Reemplazar':'Subir logotipo'}</button>${P.logo?`<button class="btn danger" onclick="askConfirm('Quitar logotipo','¿Quitar el logotipo?','Quitar',()=>{S.profile.logo='';save();render()},true)">Quitar</button>`:''}</div></div></div>
   <div class="grid g2">${f('brand','Nombre de la marca','Ej.: Dulces de Lu')}${f('owner','Persona responsable')}</div>
   <div class="fld"><label class="f">Descripción del emprendimiento</label><textarea class="inp" oninput="setP('desc',this.value)" placeholder="Se usa en la portada si el catálogo no tiene su propia presentación.">${esc(P.desc)}</textarea></div>
   <div class="grid g2">${f('whatsapp','WhatsApp comercial','Ej.: +54 9 11 2233-4455','tel')}${f('instagram','Instagram','Ej.: @dulcesdelu')}${f('other','Otras redes')}${f('email','Correo de contacto','Opcional','email')}${f('zone','Zona de entrega','Ej.: Zona norte de GBA')}
   <div class="fld"><label class="f">Moneda</label><select class="inp" onchange="setP('currency',this.value);save();render()">${[['ARS','Peso argentino (ARS)'],['USD','Dólar (USD)'],['UYU','Peso uruguayo (UYU)'],['CLP','Peso chileno (CLP)'],['MXN','Peso mexicano (MXN)'],['EUR','Euro (EUR)']].map(m=>`<option value="${m[0]}" ${P.currency===m[0]?'selected':''}>${m[1]}</option>`).join('')}</select></div></div></div>
  <div class="card"><h3>Dirección pública de la app</h3><p class="hint">Si publicaste Mi Catálogo Dulce en internet, pegá acá su dirección. Se usa para armar los enlaces que compartís.</p><input class="inp" type="url" inputmode="url" value="${esc(P.appUrl||'')}" placeholder="https://tusitio.com/mi-catalogo-dulce.html" oninput="setP('appUrl',this.value.trim())"></div>
  <div class="card"><h3>Qué se muestra en tus catálogos</h3><p class="hint mb">Elegí qué datos aparecen públicamente. Los que estén vacíos no se muestran.</p><div class="grid g3">
   ${[['owner','Persona responsable'],['desc','Descripción'],['whatsapp','WhatsApp'],['instagram','Instagram'],['other','Otras redes'],['email','Correo'],['zone','Zona de entrega']].map(k=>sw(k[1],P.pub[k[0]],`setPub('${k[0]}',this.checked)`)).join('')}</div></div>
  <div class="card"><h3>Tus datos</h3><p class="hint mb">Se guardan automáticamente en este navegador. Usá la copia de seguridad para conservarlos o pasarlos a otro dispositivo.</p>
   <p style="font-weight:700;font-size:.85rem">Espacio usado: ${used.toFixed(2)} MB de ~5 MB disponibles</p><div class="meter mb" style="margin-top:6px"><span style="width:${Math.min(100,used/5*100)}%"></span></div>
   <div class="row"><button class="btn" onclick="exportBackup()">${ico('download')}Descargar copia de seguridad</button><button class="btn ghost" onclick="importBackup()">${ico('upload')}Restaurar copia</button><button class="btn ghost" onclick="openWizard()">${ico('spark')}Abrir asistente de inicio</button></div></div>
  <div class="card"><h3>Cuenta y privacidad</h3>
   <div class="alert info mt">${ico('lock')}<div>Esta versión funciona sin cuenta: no pide contraseña y no envía tus datos a ningún servidor. Tus productos, fotos y notas privadas quedan solo en este dispositivo. Las cuentas con sincronización entre celular y computadora requieren la versión con servidor; mientras tanto, usá la copia de seguridad para mover tus datos.</div></div>
   <div class="row mt"><button class="btn danger" onclick="wipeAll()">${ico('trash')}Eliminar todos mis datos</button></div></div>`;
}
function exportBackup(){download(`mi-catalogo-dulce-respaldo-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(S,null,1),'application/json');toast('Copia de seguridad descargada','ok')}
function importBackup(){
  const inp=$('#jsonPick');inp.value='';
  inp.onchange=()=>{const f=inp.files[0];if(!f)return;const fr=new FileReader();fr.onload=()=>{
    try{const d=JSON.parse(fr.result);if(!d||!Array.isArray(d.products)||!Array.isArray(d.catalogs)||!d.profile)throw 0;
      askConfirm('Restaurar copia',`La copia tiene ${d.products.length} producto(s) y ${d.catalogs.length} catálogo(s). Reemplazará los datos actuales de este dispositivo.`,'Restaurar',()=>{
        const old=S;S=Object.assign(defaultState(),d);S.profile=Object.assign(defaultState().profile,d.profile);S.profile.pub=Object.assign(defaultState().profile.pub,d.profile.pub||{});S.catalogs.forEach(c=>c.design=Object.assign(defDesign(),c.design||{}));
        if(save()){toast('Datos restaurados','ok');render()}else{S=old}
      });
    }catch(e){toast('El archivo no es una copia válida de Mi Catálogo Dulce','err')}};fr.readAsText(f)};
  inp.click();
}
function wipeAll(){
  openModal('Eliminar todos mis datos',`<p>Se borrarán <b>todos</b> tus productos, fotos, categorías, catálogos y configuración de este dispositivo. Esta acción no se puede deshacer.</p><p class="mt">Te recomendamos descargar antes una copia de seguridad.</p><div class="fld mt"><label class="f">Escribí BORRAR para confirmar</label><input id="wipeIn" class="inp" autocomplete="off"></div>`,
  `<button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn danger" onclick="if($('#wipeIn').value.trim().toUpperCase()==='BORRAR'){localStorage.removeItem(KEY);localStorage.removeItem(GUIDE_KEY);S=defaultState();GS={};save();closeModal();go('dash');toast('Datos eliminados','ok')}else toast('Escribí BORRAR para confirmar','err')">Eliminar todo</button>`,'sm');
}

/* ================= ASISTENTE DE INICIO ================= */
let wz=null;
const WZ_STEPS=10;
function openWizard(){wz={step:0,brand:S.profile.brand,logo:S.profile.logo,cat:'',name:'',flavor:'',filling:'',coating:'',photo:'',desc:'',pu:'',pd:'',style:'artesanal'};renderWizard()}
function wzField(k,ph,label){return`<div class="fld"><label class="f">${label}</label><input class="inp" value="${esc(wz[k])}" oninput="wz['${k}']=this.value" placeholder="${ph}"></div>`}
function renderWizard(){
  const s=wz.step;let t='',p='',b='',optional=false;
  if(s===0){t='¿Cómo se llama tu emprendimiento?';p='Es el nombre que verán tus clientas en la portada.';b=wzField('brand','Ej.: Dulces de Lu','Nombre del emprendimiento')}
  else if(s===1){optional=true;t='Agregá tu logotipo';p='Si todavía no tenés, podés omitir este paso.';b=`<div style="display:flex;flex-direction:column;align-items:center;gap:12px"><div class="logo-prev">${wz.logo?`<img src="${wz.logo}" alt="">`:ico('img')}</div><button class="btn soft" onclick="pickImage(d=>{wz.logo=d;renderWizard()},{max:600,png:true})">${ico('upload')}${wz.logo?'Cambiar logotipo':'Subir logotipo'}</button></div>`}
  else if(s===2){optional=true;t='Creá tu primera categoría';p='Agrupá tus alfajores. Podés cambiarla cuando quieras.';b=wzField('cat','Ej.: Alfajores clásicos','Nombre de la categoría')+`<div class="chips">${SUG_CATS.slice(0,6).map(n=>`<button class="chip ${wz.cat===n?'on':''}" onclick="wz.cat='${n}';renderWizard()">${n}</button>`).join('')}</div>`}
  else if(s===3){t='Registrá tu primer alfajor';p='Completá solo lo que sepas. Lo demás es opcional.';b=wzField('name','Ej.: Alfajor de maicena','Nombre del alfajor *')+`<div class="grid g3">${wzField('flavor','Opcional','Sabor principal')}${wzField('filling','Opcional','Relleno')}${wzField('coating','Opcional','Cobertura')}</div>`}
  else if(s===4){optional=true;t='Cargá una foto propia';p='Una foto real de tu alfajor. Si todavía no la tenés, la agregás después.';b=`<div style="display:flex;flex-direction:column;align-items:center;gap:12px">${wz.photo?`<img src="${wz.photo}" alt="" style="width:100%;max-width:320px;aspect-ratio:4/3;object-fit:cover;border-radius:16px">`:`<button class="addph" style="width:260px;height:180px" onclick="pickImage(d=>{wz.photo=d;renderWizard()})">${ico('cam')}Elegir foto</button>`}${wz.photo?`<button class="btn soft" onclick="pickImage(d=>{wz.photo=d;renderWizard()})">${ico('replace')}Cambiar foto</button>`:''}</div>`}
  else if(s===5){optional=true;t='Escribí una descripción';p='Contá cómo es. Podés pedir una sugerencia basada solo en tus datos.';b=`<textarea id="wzd" class="inp" oninput="wz.desc=this.value" placeholder="Ej.: Tapitas de maicena con dulce de leche y coco rallado.">${esc(wz.desc)}</textarea><button class="btn soft mt" onclick="wz.desc=suggestDesc({name:wz.name,flavor:wz.flavor,filling:wz.filling,coating:wz.coating,features:[]},sugIdx++);$('#wzd').value=wz.desc">${ico('spark')}Sugerir a partir de mis datos</button>`}
  else if(s===6){optional=true;t='Precio y presentaciones';p='Cargá el precio por unidad y, si vendés por docena, también ese. Después podés sumar más presentaciones.';b=`<div class="grid g2"><div class="fld"><label class="f">Precio por unidad (${esc(S.profile.currency)})</label><input class="inp" type="number" inputmode="decimal" min="0" value="${esc(wz.pu)}" oninput="wz.pu=this.value"></div><div class="fld"><label class="f">Precio por docena (opcional)</label><input class="inp" type="number" inputmode="decimal" min="0" value="${esc(wz.pd)}" oninput="wz.pd=this.value"></div></div>`}
  else if(s===7){t='Elegí el diseño';p='Podés cambiarlo y personalizarlo cuando quieras.';b=`<div class="grid g2">${Object.entries(PRESETS).map(([k,v])=>`<button class="preset ${wz.style===k?'on':''}" onclick="wz.style='${k}';renderWizard()"><b style="font-family:'${v.font}'">${v.label}</b><small>${v.desc}</small></button>`).join('')}</div>`}
  else if(s===8){t='Revisá y creá tu catálogo';p='Esto es lo que vamos a guardar:';b=`<div class="card" style="box-shadow:none"><p><b>Emprendimiento:</b> ${esc(wz.brand)||'<span class="muted">sin nombre</span>'}</p><p><b>Logotipo:</b> ${wz.logo?'cargado':'—'}</p><p><b>Categoría:</b> ${esc(wz.cat)||'—'}</p><p><b>Alfajor:</b> ${esc(wz.name)||'<span class="muted">no cargado</span>'}</p><p><b>Foto:</b> ${wz.photo?'cargada':'—'}</p><p><b>Precios:</b> ${wz.pu?'Unidad '+money(wz.pu):''}${wz.pd?' · Docena '+money(wz.pd):''}${!wz.pu&&!wz.pd?'—':''}</p><p><b>Estilo:</b> ${PRESETS[wz.style].label}</p></div>`}
  else{t='¡Tu catálogo está creado!';p='Ahora revisá la vista previa y, cuando te guste, exportalo o compartilo.';b=`<div class="empty" style="padding:10px"><div class="big">${ico('check')}</div></div><div class="grid g2"><button class="btn" onclick="closeModal();go('preview')">${ico('eye')}Ver vista previa</button><button class="btn ghost" onclick="closeModal();go('export')">${ico('share')}Exportar o compartir</button></div><button class="btn soft block mt" onclick="closeModal();go('dash')">Ir al panel</button>`}
  const dots=Array.from({length:WZ_STEPS},(_,i)=>`<i class="${i===s?'on':i<s?'done':''}"></i>`).join('');
  const body=`<div class="wz-dots">${dots}</div><div class="wz-n">PASO ${s+1} DE ${WZ_STEPS}</div><h2 class="wz-t">${t}</h2><p class="wz-p">${p}</p>${b}`;
  let foot='';
  if(s<9)foot=`${s>0?`<button class="btn ghost" onclick="wz.step--;renderWizard()">Atrás</button>`:`<button class="btn ghost" onclick="S.onboarded=true;save();closeModal()">Ahora no</button>`}<span class="sp"></span>${optional?`<button class="btn soft" onclick="wzNext(true)">Omitir</button>`:''}<button class="btn" onclick="wzNext()">${s===8?'Crear mi catálogo':'Siguiente'}</button>`;
  if($('#modal').classList.contains('open')&&$('#mbody')&&$('.wz-dots')){$('#mbody').innerHTML=body;$('#mfoot').innerHTML=foot}
  else openModal('Asistente de inicio',body,foot||' ');
  if(s===9)$('#mfoot').style.display='none';else $('#mfoot').style.display='';
}
function wzNext(skip){
  const s=wz.step;
  if(skip){if(s===1)wz.logo=wz.logo||'';if(s===4)wz.photo='';if(s===5)wz.desc='';if(s===6){wz.pu='';wz.pd=''}}
  if(s===0&&!wz.brand.trim()){toast('Escribí el nombre de tu emprendimiento','err');return}
  if(s===3&&!wz.name.trim()){toast('Escribí el nombre de tu alfajor','err');return}
  if(s===6&&((wz.pu!==''&&Number(wz.pu)<0)||(wz.pd!==''&&Number(wz.pd)<0))){toast('El precio no puede ser negativo','err');return}
  if(s===8){commitWizard();}
  wz.step++;renderWizard();
}
function commitWizard(){
  S.profile.brand=wz.brand.trim();if(wz.logo)S.profile.logo=wz.logo;
  let cat=null;if(wz.cat.trim()){cat=S.categories.find(c=>c.name.toLowerCase()===wz.cat.trim().toLowerCase())||{id:uid(),name:wz.cat.trim(),visible:true,createdAt:Date.now()};if(!S.categories.includes(cat))S.categories.push(cat)}
  let prod=null;
  if(wz.name.trim()){
    prod=newProduct();Object.assign(prod,{name:wz.name.trim(),flavor:wz.flavor.trim(),filling:wz.filling.trim(),coating:wz.coating.trim(),desc:wz.desc.trim(),catId:cat?cat.id:'',photos:wz.photo?[wz.photo]:[]});
    const u=newPres('Unidad',1);if(wz.pu!=='')u.price=Number(wz.pu);prod.presentations=[u];
    if(wz.pd!==''){const dd=newPres('Docena',12);dd.price=Number(wz.pd);prod.presentations.push(dd)}
    prod.order=Math.max(-1,...S.products.map(x=>x.order||0))+1;S.products.push(prod);
  }
  let c=curCat();if(!c){c=newCatalog('Catálogo general');S.catalogs.push(c);S.activeCat=c.id}
  const pr=PRESETS[wz.style];Object.assign(c.design,{style:wz.style,font:pr.font,body:pr.body,card:pr.card,photo:pr.photo});
  if(prod&&!c.productIds.includes(prod.id))c.productIds.push(prod.id);
  S.visited.design=true;S.onboarded=true;
  if(save())toast('¡Catálogo creado y guardado!','ok');
  render();
}

/* ================= INICIO ================= */
function enterApp(){
  $('#welcome').classList.add('hide');
  sessionStorage&&(function(){try{sessionStorage.setItem('mcd_in','1')}catch(e){}})();
  if(!S.onboarded&&!S.products.length)setTimeout(openWizard,250);
}
(function init(){
  if(/^#c=/.test(location.hash)){publicView();return}
  applyTheme(lsGet(THEME_KEY,null)||(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
  if(!VIEWS[ui.view])ui.view='dash';
  try{if(sessionStorage.getItem('mcd_in'))$('#welcome').classList.add('hide')}catch(e){}
  render();
  if(S.updatedAt)setSaveStatus('ok');else $('#savest').innerHTML='';
  try{localStorage.setItem('mcd_test','1');localStorage.removeItem('mcd_test')}catch(e){setSaveStatus('err');toast('Este navegador no permite guardar datos (modo privado). Tus cambios se perderán al cerrar.','err',6000)}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#modal').classList.contains('open'))closeModal()});
})();
window.addEventListener('hashchange',()=>{if(/^#c=/.test(location.hash)||document.body.classList.contains('public'))location.reload()});
