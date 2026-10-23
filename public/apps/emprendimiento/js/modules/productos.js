/* Mi Emprendimiento Dulce · Productos y precios (catálogo + calculadora) */
'use strict';
/* =========================================================
   PRODUCTOS Y PRECIOS (catálogo + calculadora)
   ========================================================= */
const PRES={individual:['Alfajor individual',1],caja4:['Caja de 4 unidades',4],media:['Media docena',6],docena:['Docena',12],personalizada:['Caja personalizada',null],combo:['Combo de productos',null]};
VIEWS.productos=()=>{
  const t=curTab('productos','cat');
  return pageHead('Productos y precios','Convertí tus recetas en productos con presentación, packaging y precio de venta.',t==='cat'?`<button class="btn" onclick="editProduct()">${ic('plus')} Nuevo producto</button>`:'')+tabs('productos',[['cat','Catálogo'],['calc','Calculadora de precios']])+(t==='calc'?calcView():catView());
};
function catView(){
  if(!S.products.length)return emptyState('tag','Todavía no tenés productos',S.recipes.length?'Elegí una receta, la presentación (individual, caja, docena) y el packaging. Después definís el precio.':'Primero creá una receta: el producto toma su costo por alfajor.',S.recipes.length?`<button class="btn" onclick="editProduct()">${ic('plus')} Crear producto</button>`:`<button class="btn" onclick="go('recetas')">Ir a recetas</button>`);
  return searchBar('Buscar producto o sabor',fsel('est',[['act','Activos'],['arch','Archivados'],['all','Todos']],'act','Estado')+fsel('ord',[['nombre','Ordenar por nombre'],['margen','Menor margen primero'],['precio','Mayor precio']],'nombre','Ordenar'))+`<div id="list">${LISTS.productos()}</div>`;
}
LISTS.productos=()=>{
  const est=fv('est','act'),o=fv('ord','nombre');
  let a=S.products.filter(p=>match([p.nombre,p.sabor,p.desc])&&(est==='all'||(est==='arch'?p.activo===false:p.activo!==false)));
  const pcs=new Map(a.map(p=>[p.id,productCost(p)]));
  const mg=p=>{const pc=pcs.get(p.id);return pc.total!=null&&num(p.precio)>0?priceMetrics(pc.total,num(p.precio),0).margin:-9};
  a.sort((x,y)=>o==='margen'?mg(x)-mg(y):o==='precio'?num(y.precio)-num(x.precio):x.nombre.localeCompare(y.nombre));
  if(!a.length)return `<p class="muted pad">No hay productos con esos filtros.</p>`;
  return `<div class="cards sub4">${a.map(p=>{const pc=pcs.get(p.id);const pr=num(p.precio);const m=pc.total!=null&&pr>0?priceMetrics(pc.total,pr,0):null;return `<div class="item-card"><div class="ic-top"><div><h3>${esc(p.nombre)}</h3><div class="muted xs">${esc((PRES[p.tipoPres]||['Presentación'])[0])} · ${pc.units} alfajor(es)${p.sabor?' · '+esc(p.sabor):''}</div></div>${p.activo===false?badge('Archivado'):pc.provisional?badge('Provisional','warn'):m?sumBadge(m.g):badge('Sin precio','warn')}</div>
  <div><div class="muted xs">Precio de venta</div><div class="ic-big">${pr>0?money(pr):'—'}</div></div>
  <div class="ic-rows"><span>Costo de la presentación</span><span>${money(pc.total)}</span><span>Ganancia bruta estimada</span><span class="${m&&m.g<0?'badc':'okc'}">${m?money(m.g):'—'}</span><span>Margen / Recargo</span><span>${m?pct(m.margin)+' / '+pct(m.markup):'—'}</span><span>Precio por alfajor</span><span>${pr>0&&pc.units?money(pr/pc.units):'—'}</span></div>
  <div class="ic-acts">${ibtn('calc',`calcFor('${p.id}')`,'Calcular precio')}${ibtn('edit',`editProduct('${p.id}')`,'Editar')}${ibtn('copy',`editProduct('${p.id}',true)`,'Duplicar')}${ibtn('archive',`archProduct('${p.id}')`,p.activo===false?'Reactivar':'Archivar')}${ibtn('trash',`delProduct('${p.id}')`,'Eliminar','del')}</div></div>`}).join('')}</div>`;
};
function editProduct(id,dup,preset){
  if(!S.recipes.length){toast('Primero creá una receta','warn');go('recetas');return}
  const p=id?PROD(id):null;
  D=p?JSON.parse(JSON.stringify(p)):Object.assign({id:null,nombre:'',sabor:'',desc:'',tipoPres:'docena',items:[{recetaId:S.recipes.filter(r=>!r.archivada)[0]?.id||S.recipes[0].id,cant:12}],packaging:[],extras:'',precio:'',activo:true,notas:''},preset||{});
  if(dup){D.id=null;D.nombre+=' (copia)';D.precios=[]}
  mProduct();
}
function mProduct(){
  const ro=[['','Elegí una receta…'],...S.recipes.filter(r=>!r.archivada||D.items.some(i=>i.recetaId===r.id)).map(r=>[r.id,r.nombre])];
  const mo=[['','Elegí un material…'],...S.materials.map(m=>[m.id,m.nombre])];
  const body=`<div class="grid2">${fld('Nombre comercial *',`<input value="${esc(D.nombre)}" oninput="D.nombre=this.value" placeholder="Ej: Docena de alfajores de maicena">`)}${fld('Variedad o sabor',`<input value="${esc(D.sabor)}" oninput="D.sabor=this.value" placeholder="Ej: Dulce de leche">`)}</div>
  ${fld('Presentación',sel('',Object.entries(PRES).map(([k,v])=>[k,v[0]]),D.tipoPres,`onchange="presChange(this.value)"`),'Las cantidades se pueden modificar.')}
  ${fld('Descripción',`<input value="${esc(D.desc)}" oninput="D.desc=this.value">`)}
  <h4 class="sub">Contenido (recetas y cantidad de alfajores)</h4>
  <div class="lines">${D.items.map((it,i)=>`<div class="line l3">${sel('',ro,it.recetaId,`onchange="D.items[${i}].recetaId=this.value;prevProduct()" aria-label="Receta"`)}<input type="number" inputmode="numeric" min="1" step="1" placeholder="Alfajores" value="${esc(it.cant)}" oninput="D.items[${i}].cant=this.value;prevProduct()" aria-label="Cantidad"><button class="icon-btn del" onclick="D.items.splice(${i},1);mProduct()" aria-label="Quitar">${ic('x')}</button></div>`).join('')}</div>
  <button class="btn ghost sm" onclick="D.items.push({recetaId:'',cant:1});mProduct()">${ic('plus')} Agregar otra receta (cajas surtidas o combos)</button>
  <h4 class="sub">Packaging de la presentación</h4>
  <p class="muted xs mb">Caja, etiqueta, cinta, separadores. No repitas el packaging individual que ya está en la receta.</p>
  ${S.materials.length?`<div class="lines">${D.packaging.map((x,i)=>`<div class="line l3">${sel('',mo,x.matId,`onchange="D.packaging[${i}].matId=this.value;prevProduct()" aria-label="Material"`)}<input type="number" inputmode="decimal" min="0" step="any" placeholder="Cantidad" value="${esc(x.cant)}" oninput="D.packaging[${i}].cant=this.value;prevProduct()"><button class="icon-btn del" onclick="D.packaging.splice(${i},1);mProduct()" aria-label="Quitar">${ic('x')}</button></div>`).join('')}</div><button class="btn ghost sm" onclick="D.packaging.push({matId:'',cant:1});mProduct()">${ic('plus')} Agregar material</button>`:`<p class="muted xs">Cargá cajas y etiquetas en Packaging y materiales para sumarlas acá.</p>`}
  <div class="grid2 mt">${fld('Otros costos por presentación',`<input type="number" inputmode="decimal" min="0" value="${esc(D.extras)}" oninput="D.extras=this.value;prevProduct()">`,'Ej: impresión personalizada. No incluyas gastos fijos.')}${fld('Precio de venta',`<input type="number" inputmode="decimal" min="0" value="${esc(D.precio)}" oninput="D.precio=this.value;prevProduct()">`,'Podés calcularlo después con la calculadora.')}</div>
  <label class="chk"><input type="checkbox" ${D.activo!==false?'checked':''} onchange="D.activo=this.checked"> Producto activo</label>
  ${fld('Notas',`<textarea rows="2" oninput="D.notas=this.value">${esc(D.notas)}</textarea>`)}<div id="prodPrev"></div>`;
  modal(D.id?'Editar producto':'Nuevo producto',body,`<button class="btn soft" onclick="closeModal()">Cancelar</button><button class="btn" onclick="saveProduct()">${ic('check')} Guardar producto</button>`,true);
  prevProduct();
}
function presChange(v){D.tipoPres=v;const q=PRES[v][1];if(q&&D.items.length===1)D.items[0].cant=q;mProduct()}
function prevProduct(){
  const e=$('#prodPrev');if(!e)return;const pc=productCost(D);const pr=num(D.precio);const m=pc.total!=null&&pr>0?priceMetrics(pc.total,pr,0):null;
  const rpack=new Set();D.items.forEach(i=>{const r=REC(i.recetaId);(r?.packaging||[]).forEach(x=>rpack.add(x.matId))});
  const dup=D.packaging.filter(x=>rpack.has(x.matId)).map(x=>MAT(x.matId)?.nombre);
  e.innerHTML=`<div class="calc-prev"><div class="res-rows" style="margin:0"><span>Alfajores (${pc.units} u., incluye packaging individual)</span><span>${money(pc.prod)}</span><span>Packaging de presentación</span><span>${money(pc.pack)}</span><span>Otros costos</span><span>${money(pc.extra)}</span><span class="strong">Costo de la presentación</span><span class="strong">${money(pc.total)}</span>${m?`<span>Ganancia bruta estimada</span><span class="${m.g<0?'badc':'okc'}">${money(m.g)}</span><span>Margen sobre el precio</span><span>${pct(m.margin)}</span>`:''}</div></div>${m&&m.g<0?note('El precio no cubre los costos considerados.','bad'):''}${dup.length?note(`<strong>Posible doble conteo:</strong> ${esc(dup.join(', '))} ya está como packaging individual en la receta.`,'warn'):''}${warnList(pc.warn)}`;
}
function saveProduct(){
  if(!D.nombre.trim())return err('Ingresá el nombre comercial.');
  if(!D.items.length||D.items.some(i=>!i.recetaId))return err('Elegí la receta en cada línea.');
  if(D.items.some(i=>!(num(i.cant)>0)))return err('Las cantidades de alfajores deben ser mayores que cero.');
  if(num(D.precio)<0||num(D.extras)<0||D.packaging.some(x=>num(x.cant)<0))return err('No se permiten valores negativos.');
  const data={nombre:D.nombre.trim(),sabor:(D.sabor||'').trim(),desc:(D.desc||'').trim(),tipoPres:D.tipoPres,items:D.items.map(i=>({recetaId:i.recetaId,cant:num(i.cant)})),packaging:D.packaging.filter(x=>x.matId).map(x=>({matId:x.matId,cant:num(x.cant)})),extras:num(D.extras),precio:r2(num(D.precio)),activo:D.activo!==false,notas:D.notas||''};
  let p;
  if(D.id){p=PROD(D.id);const old=num(p.precio);Object.assign(p,data);if(old!==data.precio){p.precios=p.precios||[];p.precios.push({fecha:todayStr(),precio:data.precio})}}
  else{p={id:uid(),creado:new Date().toISOString(),precios:data.precio>0?[{fecha:todayStr(),precio:data.precio}]:[],...data};S.products.push(p)}
  save('Producto guardado');closeModal();render();
}
function archProduct(id){const p=PROD(id);p.activo=p.activo===false;save(p.activo?'Producto reactivado':'Producto archivado');render()}
function delProduct(id){
  const p=PROD(id);const used=S.orders.some(o=>(o.items||[]).some(i=>i.prodId===id))||S.plan.some(l=>l.prodId===id);
  if(used)return modal('No se puede eliminar',`<p>${esc(p.nombre)} está en pedidos o en la planificación de producción.</p><p class="muted mt">Archivalo para ocultarlo del catálogo. Las ventas registradas conservan sus datos igualmente.</p>`,`<button class="btn soft" onclick="closeModal()">Cerrar</button><button class="btn" onclick="closeModal();archProduct('${id}')">Archivar</button>`);
  confirmDlg(`¿Eliminar <strong>${esc(p.nombre)}</strong>? Las ventas ya registradas conservan su información.`,()=>{S.products=S.products.filter(x=>x.id!==id);save('Producto eliminado');render()},{danger:true,okText:'Eliminar'});
}
/* ---- Calculadora de precios ---- */
let CALC=Object.assign({src:'',costo:'',unidades:1,metodo:'margen',valor:40,manual:'',com:0,red:'50'},LS.get('med_calc',{}));
function calcFor(id){CALC.src=id;CALC.metodo='margen';LS.set('med_calc',CALC);TAB.productos='calc';render()}
function calcView(){
  const prods=S.products.filter(p=>p.activo!==false);
  if(CALC.src&&!PROD(CALC.src))CALC.src='';
  const c=CALC;
  return `<div class="split"><div class="card"><h3>${ic('calc')} Datos</h3>
  ${fld('Producto',sel('',[['','Ingresar un costo manualmente'],...prods.map(p=>[p.id,p.nombre])],c.src,`onchange="CALC.src=this.value;LS.set('med_calc',CALC);render()"`))}
  ${c.src?'':`<div class="grid2">${fld('Costo total',`<input type="number" inputmode="decimal" min="0" value="${esc(c.costo)}" oninput="cset('costo',this.value)">`)}${fld('Alfajores incluidos',`<input type="number" inputmode="numeric" min="1" value="${esc(c.unidades)}" oninput="cset('unidades',this.value)">`)}</div>`}
  <div class="fld"><span>Método</span><div class="seg">${[['margen','Según margen'],['recargo','Según recargo'],['manual','Precio manual']].map(([k,l])=>`<button class="${c.metodo===k?'on':''}" onclick="CALC.metodo='${k}';LS.set('med_calc',CALC);render()">${l}</button>`).join('')}</div></div>
  ${c.metodo==='manual'?fld('Precio de venta a evaluar',`<input type="number" inputmode="decimal" min="0" value="${esc(c.manual)}" oninput="cset('manual',this.value)">`):fld(c.metodo==='margen'?'Margen deseado sobre el precio (%)':'Recargo sobre el costo (%)',`<input type="number" inputmode="decimal" min="0" value="${esc(c.valor)}" oninput="cset('valor',this.value)">`,c.metodo==='margen'?'Entre 0% y menos de 100%.':'Porcentaje que se suma al costo.')}
  ${fld('Comisiones e impuestos sobre la venta (%)',`<input type="number" inputmode="decimal" min="0" max="99" value="${esc(c.com)}" oninput="cset('com',this.value)">`,'Ej: Mercado Pago, apps de delivery, ingresos brutos. Se descuentan del precio cobrado.')}
  ${c.metodo!=='manual'?fld('Redondear hacia arriba a',sel('',[['0','Sin redondeo'],['10','$10'],['50','$50'],['100','$100'],['500','$500']],c.red,`onchange="cset('red',this.value)"`)):''}
  <div class="note info"><strong>Fórmulas utilizadas</strong><div class="formula">Margen: precio = costo ÷ (1 − margen − comisiones)</div><div class="formula">Recargo: precio = costo × (1 + recargo) ÷ (1 − comisiones)</div><p class="xs mt">El <strong>margen</strong> se mide sobre el precio de venta; el <strong>recargo</strong>, sobre el costo. Un 40% de margen no es lo mismo que un 40% de recargo.</p></div>
  </div><div id="calcOut">${calcOut()}</div></div>`;
}
function cset(k,v){CALC[k]=v;LS.set('med_calc',CALC);const e=$('#calcOut');if(e)e.innerHTML=calcOut()}
function calcOut(){
  const c=CALC;const p=c.src?PROD(c.src):null;let cost,units,warn=[];
  if(p){const pc=productCost(p);cost=pc.total;units=pc.units;warn=pc.warn}else{cost=num(c.costo);units=num(c.unidades)||1}
  if(!(cost>0))return `<div class="card">${note(p?'Este producto todavía no tiene un costo calculable. Revisá su receta.':'Ingresá el costo para calcular el precio.','warn')}${warnList(warn)}</div>`;
  const r=priceFrom(cost,c.metodo,c.metodo==='manual'?c.manual:c.valor,c.com);
  if(r.err)return `<div class="card">${note(r.err,'bad')}</div>`;
  const raw=r.price,price=c.metodo==='manual'?raw:roundUp(raw,c.red);
  const m=priceMetrics(cost,price,c.com);
  const cur=p?num(p.precio):0;const mc=cur>0?priceMetrics(cost,cur,c.com):null;
  let h=`<div class="card"><h3>Resultado</h3><div class="muted xs">${c.metodo==='manual'?'Precio evaluado':'Precio sugerido'}${p?' · '+esc(p.nombre):''}</div><div class="res-big">${money(price)}</div>${c.metodo!=='manual'&&r2(raw)!==r2(price)?`<p class="muted xs">Precio calculado sin redondeo: ${money(raw)}</p>`:''}
  ${m.g<0?note('Este precio <strong>no cubre los costos considerados</strong>.','bad'):''}
  <div class="res-rows"><span>Costo de la presentación</span><span>${money(cost)}</span><span>Comisiones e impuestos (${fnum(num(c.com),1)}%)</span><span>${money(m.comAmt)}</span><span class="strong">Ganancia bruta estimada</span><span class="strong ${m.g<0?'badc':'okc'}">${money(m.g)}</span><span>Margen sobre el precio${c.metodo!=='manual'?' (luego del redondeo)':''}</span><span>${pct(m.margin)}</span><span>Recargo sobre el costo</span><span>${pct(m.markup)}</span>
  ${units>0?`<span>Costo por alfajor</span><span>${money(cost/units)}</span><span>Precio por alfajor</span><span>${money(price/units)}</span><span>Ganancia por alfajor</span><span>${money(m.g/units)}</span><span>Equivalente media docena</span><span>${money(price/units*6)}</span><span>Equivalente docena</span><span>${money(price/units*12)}</span>`:''}</div>
  ${p?`<h4 class="sub">Comparación con tu precio actual</h4>${cur>0?`<div class="res-rows" style="margin:0"><span>Precio actual</span><span>${money(cur)}</span><span>Margen actual</span><span class="${mc.g<0?'badc':''}">${pct(mc.margin)}</span><span>Diferencia con el ${c.metodo==='manual'?'evaluado':'sugerido'}</span><span class="${price-cur>0?'warnc':'okc'}">${(price-cur>0?'+':'')+money(price-cur)}</span></div>`:'<p class="muted">Este producto todavía no tiene precio.</p>'}<button class="btn block mt" onclick="applyPrice(${r2(price)})">${ic('check')} Usar ${money(price)} como precio de venta</button>`:''}
  ${warnList(warn)}<p class="muted xs mt">Los precios sugeridos son referencias para tomar decisiones, no precios de mercado garantizados.</p></div>`;
  if(c.metodo!=='manual'){
    h+=`<div class="card"><h3>Comparar márgenes</h3><div class="tbl"><table style="min-width:0"><thead><tr><th>Margen</th><th class="r">Precio</th><th class="r">Ganancia</th><th class="r">Recargo</th></tr></thead><tbody>${[20,30,40,50,60].map(v=>{const x=priceFrom(cost,'margen',v,c.com);if(x.err)return `<tr><td>${v}%</td><td colspan="3" class="muted">No aplica</td></tr>`;const pp=roundUp(x.price,c.red),mm=priceMetrics(cost,pp,c.com);return `<tr><td>${v}%</td><td class="r"><strong>${money(pp)}</strong></td><td class="r okc">${money(mm.g)}</td><td class="r">${pct(mm.markup)}</td></tr>`}).join('')}</tbody></table></div></div>`;
  }
  return h;
}
function applyPrice(v){const p=PROD(CALC.src);if(!p)return;if(num(p.precio)!==v){p.precios=p.precios||[];p.precios.push({fecha:todayStr(),precio:v})}p.precio=v;save('Precio actualizado en '+p.nombre);const e=$('#calcOut');if(e)e.innerHTML=calcOut()}
