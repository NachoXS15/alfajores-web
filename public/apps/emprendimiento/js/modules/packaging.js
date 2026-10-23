/* Mi Emprendimiento Dulce · Packaging y materiales */
'use strict';
/* =========================================================
   PACKAGING Y MATERIALES
   ========================================================= */
const CATS_MAT=['Cajas','Bolsas','Etiquetas','Cintas','Separadores','Envoltorios (papel, film)','Bandejas','Otros'];
const UNIT_MAT=['unidad','metro','hoja','rollo','paquete'];
VIEWS.packaging=()=>{
  const t=curTab('packaging','mat');
  return pageHead('Packaging y materiales','Cajas, bolsas, etiquetas, cintas y envoltorios: costo por unidad, stock y presentaciones.',t==='mat'?`<button class="btn" onclick="editMat()">${ic('plus')} Nuevo material</button>`:'')+tabs('packaging',[['mat','Materiales'],['pers','Presentación personalizada'],['compras','Lista de compras']])+(t==='mat'?matView():t==='pers'?persView():shoppingView(true));
};
function matView(){
  if(!S.materials.length)return emptyState('box','Todavía no cargaste materiales','Registrá tus cajas, etiquetas, cintas y envoltorios para sumarlos al costo de cada presentación.',`<button class="btn" onclick="editMat()">${ic('plus')} Cargar material</button>`);
  return searchBar('Buscar material',fsel('cat',[['','Todas las categorías'],...CATS_MAT],'','Categoría'))+`<div id="list">${LISTS.packaging()}</div>`;
}
LISTS.packaging=()=>{
  const a=S.materials.filter(m=>match([m.nombre,m.proveedor])&&(!fv('cat','')||m.categoria===fv('cat',''))).sort((x,y)=>x.nombre.localeCompare(y.nombre));
  if(!a.length)return `<p class="muted pad">Sin resultados.</p>`;
  return `<div class="tbl"><table><thead><tr><th>Material</th><th>Categoría</th><th class="r">Costo por ${'unidad'}</th><th class="r">Stock</th><th class="r">Mínimo</th><th>Actualizado</th><th></th></tr></thead><tbody>${a.map(m=>{const s=stockOf('mat',m.id),low=num(m.stockMin)>0&&s<=num(m.stockMin);return `<tr><td><strong>${esc(m.nombre)}</strong><div class="muted xs">${esc(m.proveedor||'')}</div></td><td class="sm-t">${esc(m.categoria)}</td><td class="r">${matCostU(m)==null?badge('Sin precio','warn'):money(matCostU(m))+' <span class="muted xs">/ '+esc(m.unidad||'unidad')+'</span>'}</td><td class="r ${low?'badc':''}">${fnum(s)}${low?'<div class="xs">Stock bajo</div>':''}</td><td class="r">${fnum(num(m.stockMin))}</td><td>${fdate(m.fecha)}</td><td class="acts">${ibtn('history',`matHistory('${m.id}')`,'Historial de precios')}${ibtn('edit',`editMat('${m.id}')`,'Editar')}${ibtn('trash',`delMat('${m.id}')`,'Eliminar','del')}</td></tr>`}).join('')}</tbody></table></div>`;
};
function editMat(id){
  const m=id?MAT(id):{nombre:'',categoria:CATS_MAT[0],proveedor:'',cantidadCompra:'',unidad:'unidad',precioTotal:'',stockMin:'',notas:''};D={id};
  modal(id?'Editar material':'Nuevo material',`<div class="grid2">${fld('Nombre *',inp('m_n',m.nombre,'text','placeholder="Ej: Caja para 6 alfajores"'))}${fld('Categoría',sel('m_c',CATS_MAT,m.categoria))}</div>${fld('Proveedor (opcional)',inp('m_p',m.proveedor))}
  <div class="grid3">${fld('Cantidad comprada *',inp('m_q',m.cantidadCompra,'number','min="0" oninput="prevMat()"'))}${fld('Unidad',sel('m_u',UNIT_MAT,m.unidad,'onchange="prevMat()"'))}${fld('Precio total *',inp('m_pr',m.precioTotal,'number','min="0" oninput="prevMat()"'))}</div><div id="matPrev" class="calc-prev"></div>
  <div class="grid2">${id?`<div class="fld"><span>Stock actual</span><div class="ro">${fnum(stockOf('mat',id))}</div><small>Se modifica desde Inventario.</small></div>`:fld('Stock disponible hoy',inp('m_s','','number','min="0"'))}${fld('Stock mínimo',inp('m_min',m.stockMin,'number','min="0"'))}</div>${fld('Notas',`<textarea id="m_no" rows="2">${esc(m.notas)}</textarea>`)}`,
  `<button class="btn soft" onclick="closeModal()">Cancelar</button><button class="btn" onclick="saveMat()">${ic('check')} Guardar</button>`);prevMat();
}
function prevMat(){const e=$('#matPrev');if(!e)return;const q=num(V('m_q')),p=V('m_pr');e.innerHTML=q>0&&!isBlank(p)?`Costo por ${esc(V('m_u'))}: <b>${money(num(p)/q)}</b>`:'<span class="muted">Completá cantidad y precio.</span>'}
function saveMat(){
  const n=V('m_n').trim(),q=num(V('m_q')),p=V('m_pr');
  if(!n)return err('Ingresá el nombre.');if(!(q>0))return err('La cantidad debe ser mayor que cero.');if(isBlank(p)||num(p)<0)return err('Ingresá un precio válido.');
  if(num(V('m_min'))<0||num(V('m_s'))<0)return err('El stock no puede ser negativo.');
  const data={nombre:n,categoria:V('m_c'),proveedor:V('m_p').trim(),cantidadCompra:q,unidad:V('m_u'),precioTotal:num(p),stockMin:num(V('m_min')),notas:V('m_no').trim()};
  if(D.id){const m=MAT(D.id);const ch=num(m.precioTotal)!==data.precioTotal||num(m.cantidadCompra)!==q;Object.assign(m,data);if(ch){m.fecha=todayStr();m.historial=m.historial||[];m.historial.push({fecha:todayStr(),cantidad:q,precio:data.precioTotal})}}
  else S.materials.push({id:uid(),creado:new Date().toISOString(),fecha:todayStr(),stockInicial:num(V('m_s')),historial:[{fecha:todayStr(),cantidad:q,precio:data.precioTotal}],...data});
  save('Material guardado');closeModal();render();
}
function matHistory(id){const m=MAT(id);const h=m.historial||[];modal('Historial · '+m.nombre,h.length?`<div class="tbl"><table style="min-width:0"><thead><tr><th>Fecha</th><th class="r">Cantidad</th><th class="r">Precio</th><th class="r">Por ${esc(m.unidad||'unidad')}</th></tr></thead><tbody>${h.map(x=>`<tr><td>${fdate(x.fecha)}</td><td class="r">${fnum(x.cantidad)}</td><td class="r">${money(num(x.precio))}</td><td class="r">${money(num(x.precio)/num(x.cantidad))}</td></tr>`).join('')}</tbody></table></div>`:'<p class="muted">Sin historial.</p>',`<button class="btn soft" onclick="closeModal()">Cerrar</button>`)}
function delMat(id){const m=MAT(id);const used=S.products.some(p=>(p.packaging||[]).some(x=>x.matId===id))||S.recipes.some(r=>(r.packaging||[]).some(x=>x.matId===id));if(used)return modal('No se puede eliminar',`<p>${esc(m.nombre)} se usa en recetas o productos. Quitalo de ellos primero.</p>`,`<button class="btn" onclick="closeModal()">Entendido</button>`);confirmDlg(`¿Eliminar <strong>${esc(m.nombre)}</strong> y sus movimientos?`,()=>{S.materials=S.materials.filter(x=>x.id!==id);S.movements=S.movements.filter(x=>!(x.kind==='mat'&&x.refId===id));save('Material eliminado');render()},{danger:true,okText:'Eliminar'})}
let CUST=Object.assign({recetaId:'',cant:6,lines:[]},LS.get('med_cust',{}));
function persView(){
  if(!S.recipes.length)return emptyState('box','Necesitás una receta','La presentación personalizada combina alfajores de una receta con los materiales que elijas.',`<button class="btn" onclick="go('recetas')">Ir a recetas</button>`);
  if(!CUST.recetaId||!REC(CUST.recetaId))CUST.recetaId=S.recipes[0].id;
  const mo=[['','Elegí un material…'],...S.materials.map(m=>[m.id,m.nombre])];
  return `<div class="split"><div class="card"><h3>Armá tu presentación</h3>${fld('Receta',sel('',S.recipes.map(r=>[r.id,r.nombre]),CUST.recetaId,`onchange="CUST.recetaId=this.value;custSave()"`))}${fld('Cantidad de alfajores',`<input type="number" inputmode="numeric" min="1" value="${esc(CUST.cant)}" oninput="CUST.cant=this.value;custOut()">`)}
  <h4 class="sub">Materiales</h4><div class="lines">${CUST.lines.map((x,i)=>`<div class="line l3">${sel('',mo,x.matId,`onchange="CUST.lines[${i}].matId=this.value;custOut()"`)}<input type="number" inputmode="decimal" min="0" value="${esc(x.cant)}" oninput="CUST.lines[${i}].cant=this.value;custOut()"><button class="icon-btn del" onclick="CUST.lines.splice(${i},1);custSave()" aria-label="Quitar">${ic('x')}</button></div>`).join('')}</div>
  ${S.materials.length?`<button class="btn ghost sm" onclick="CUST.lines.push({matId:'',cant:1});custSave()">${ic('plus')} Agregar material</button>`:'<p class="muted xs">Cargá materiales en la pestaña Materiales.</p>'}</div><div class="card" id="custOut"></div></div>`+(setTimeout(custOut,0),'');
}
function custSave(){LS.set('med_cust',CUST);render()}
function custOut(){LS.set('med_cust',CUST);const e=$('#custOut');if(!e)return;const r=REC(CUST.recetaId);const rc=r?recipeCost(r):null;const n=num(CUST.cant);let mat=0,miss=false;CUST.lines.forEach(x=>{const c=matCostU(MAT(x.matId));if(c==null){if(x.matId)miss=true}else mat+=c*num(x.cant)});const alf=rc&&rc.unit!=null?rc.unit*n:null;
  e.innerHTML=`<h3>Costo de la presentación</h3><div class="res-big">${money(alf!=null?alf+mat:null)}</div><div class="res-rows"><span>${fnum(n)} alfajores</span><span>${money(alf)}</span><span>Materiales</span><span>${money(mat)}</span><span>Costo por alfajor (con materiales)</span><span>${money(alf!=null&&n>0?(alf+mat)/n:null)}</span></div>${miss?note('Algún material no tiene precio cargado.','warn'):''}${rc?warnList(rc.warn):''}<button class="btn block mt" onclick="custToProduct()">${ic('plus')} Crear producto con esta presentación</button>`}
function custToProduct(){editProduct(null,false,{nombre:'Caja personalizada x'+num(CUST.cant),tipoPres:'personalizada',items:[{recetaId:CUST.recetaId,cant:num(CUST.cant)}],packaging:CUST.lines.filter(x=>x.matId).map(x=>({...x}))})}
