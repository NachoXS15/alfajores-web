/* Mi Emprendimiento Dulce · Producción */
'use strict';
/* =========================================================
   PRODUCCIÓN
   ========================================================= */
const B_EST=['Pendiente','En preparación','Completada'];
VIEWS.produccion=()=>{
  const t=curTab('produccion','plan');
  return pageHead('Producción','Planificá cuánto elaborar, calculá ingredientes y packaging, generá la lista de compras y registrá tus tandas.')+tabs('produccion',[['plan','Planificación'],['compras','Lista de compras'],['tandas','Tandas de producción']])+(t==='plan'?planView():t==='compras'?shoppingView():batchView());
};
function planNeeds(){
  const rec={},mats={},warn=[];
  S.plan.forEach(l=>{const p=PROD(l.prodId);if(!p){warn.push('Hay un producto eliminado en el plan');return}
    (p.items||[]).forEach(it=>{rec[it.recetaId]=(rec[it.recetaId]||0)+num(it.cant)*num(l.cant)});
    (p.packaging||[]).forEach(x=>{mats[x.matId]=(mats[x.matId]||0)+num(x.cant)*num(l.cant)})});
  const ings={},recRows=[];
  for(const rid in rec){const r=REC(rid);if(!r){warn.push('Receta no encontrada');continue}const u=rec[rid],rend=num(r.rendimiento);if(!(rend>0)){warn.push(r.nombre+': rendimiento inválido');continue}const f=u/rend;recRows.push({r,u,f});
    (r.items||[]).forEach(it=>{const g=ING(it.ingId);if(!g||!compat(it.unidad,g.unidadCompra)){warn.push(r.nombre+': ingrediente faltante o con unidad incompatible');return}ings[g.id]=(ings[g.id]||0)+toBase(it.cantidad,it.unidad)*f});
    (r.packaging||[]).forEach(x=>{mats[x.matId]=(mats[x.matId]||0)+num(x.cant)*u})}
  const ingRows=Object.entries(ings).map(([id,need])=>{const g=ING(id),st=stockOf('ing',id),falta=Math.max(0,need-Math.max(0,st)),cb=ingCostBase(g);return{kind:'ing',it:g,need,st,falta,costo:cb!=null?falta*cb:null,u:usoU(g)}});
  const matRows=Object.entries(mats).map(([id,need])=>{const m=MAT(id);if(!m)return null;const st=stockOf('mat',id),falta=Math.max(0,need-Math.max(0,st)),cu=matCostU(m);return{kind:'mat',it:m,need,st,falta,costo:cu!=null?falta*cu:null}}).filter(Boolean);
  return{recRows,ingRows,matRows,warn:[...new Set(warn)]};
}
function planView(){
  if(!S.products.length)return emptyState('oven','Necesitás productos para planificar','Creá tus productos y después indicá cuántos vas a elaborar.',`<button class="btn" onclick="go('productos')">Ir a productos</button>`);
  const po=S.products.filter(p=>p.activo!==false).map(p=>[p.id,p.nombre]);const N=planNeeds();
  let h=`<div class="card"><div class="card-head"><h3>¿Qué vas a producir?</h3><div class="actions"><button class="btn soft sm" onclick="planFromOrders()">${ic('clip')} Agregar pedidos confirmados</button>${S.plan.length?`<button class="btn soft sm" onclick="confirmDlg('¿Vaciar la planificación?',()=>{S.plan=[];save();render()})">Vaciar</button>`:''}</div></div>
  <div class="lines">${S.plan.map((l,i)=>`<div class="line l3">${sel('',[['','Elegí un producto…'],...po],l.prodId,`onchange="S.plan[${i}].prodId=this.value;save();render()"`)}<input type="number" inputmode="numeric" min="1" value="${esc(l.cant)}" onchange="S.plan[${i}].cant=Math.max(0,num(this.value));save();render()" aria-label="Cantidad de presentaciones"><button class="icon-btn del" onclick="S.plan.splice(${i},1);save();render()" aria-label="Quitar">${ic('x')}</button></div>${l.orderId?`<div class="muted xs" style="margin:-4px 0 4px 8px">Desde pedido #${byId(S.orders,l.orderId)?.num||'—'}</div>`:''}`).join('')}</div>
  <button class="btn ghost sm" onclick="S.plan.push({id:uid(),prodId:'${po[0]?po[0][0]:''}',cant:1});save();render()">${ic('plus')} Agregar producto</button>
  <p class="muted xs mt">Modificar la planificación no altera ventas ni pedidos registrados.</p></div>`;
  if(!S.plan.length)return h;
  h+=warnList(N.warn);
  h+=`<div class="card"><div class="card-head"><h3>Recetas a elaborar</h3><button class="btn sm" onclick="batchesFromPlan()">${ic('plus')} Crear tandas desde el plan</button></div><div class="tbl"><table style="min-width:0"><thead><tr><th>Receta</th><th class="r">Alfajores</th><th class="r">Tandas exactas</th><th class="r">Tandas completas</th></tr></thead><tbody>${N.recRows.map(x=>`<tr><td>${esc(x.r.nombre)}</td><td class="r"><strong>${fnum(x.u)}</strong></td><td class="r">${fnum(x.f,2)}</td><td class="r">${Math.ceil(x.f-1e-9)}</td></tr>`).join('')}</tbody></table></div>${N.recRows.some(x=>Math.abs(x.f-Math.round(x.f))>1e-9)?note('Algunas cantidades no son múltiplo del rendimiento: los ingredientes se calcularon en forma proporcional.','warn'):''}</div>`;
  h+=`<div class="card"><h3>Ingredientes necesarios (consolidados)</h3>${needTable(N.ingRows)}</div><div class="card"><h3>Packaging necesario</h3>${N.matRows.length?needTable(N.matRows):'<p class="muted">Los productos planificados no tienen packaging asociado.</p>'}</div>`;
  return h;
}
function needTable(rows){const sh=(r,v)=>r.kind==='ing'?fq(v,r.u):fnum(v)+' '+esc(r.it.unidad||'');return `<div class="tbl"><table style="min-width:0"><thead><tr><th>Recurso</th><th class="r">Necesario</th><th class="r">En stock</th><th class="r">Falta</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.it.nombre)}</td><td class="r">${sh(r,r.need)}</td><td class="r">${sh(r,r.st)}</td><td class="r ${r.falta>0?'badc':'okc'}"><strong>${r.falta>0?sh(r,r.falta):'OK'}</strong></td></tr>`).join('')}</tbody></table></div>`}
function planFromOrders(){let n=0;S.orders.filter(o=>!o.ventaId&&(o.estado==='Confirmado'||o.estado==='En preparación')).forEach(o=>{if(S.plan.some(l=>l.orderId===o.id))return;(o.items||[]).forEach(i=>{if(PROD(i.prodId)){S.plan.push({id:uid(),prodId:i.prodId,cant:num(i.cant),orderId:o.id});n++}})});save();render();toast(n?`Se agregaron ${n} línea(s) desde pedidos`:'No hay pedidos confirmados nuevos para agregar',n?'ok':'')}
function batchesFromPlan(){const N=planNeeds();if(!N.recRows.length)return toast('No hay recetas para crear tandas','warn');confirmDlg(`Se crearán ${N.recRows.length} tanda(s) pendientes con las cantidades del plan. ¿Continuar?`,()=>{N.recRows.forEach(x=>S.batches.push({id:uid(),recetaId:x.r.id,unidades:x.u,fecha:todayStr(),estado:'Pendiente',descontado:false,notas:'Desde planificación'}));save('Tandas creadas');TAB.produccion='tandas';render()})}
function shoppingView(fromPack){
  const N=planNeeds();const rows=[...N.ingRows,...N.matRows].filter(r=>r.falta>0);
  if(!S.plan.length)return emptyState('oven','La lista de compras sale de tu planificación','Indicá qué vas a producir en Producción → Planificación y acá verás lo que falta comprar según tu stock.',`<button class="btn" onclick="TAB.produccion='plan';go('produccion')">Planificar producción</button>`);
  if(!rows.length)return note('Con tu stock actual alcanza para la producción planificada. No hace falta comprar nada.','ok');
  const tot=sum(rows,r=>r.costo||0);const sh=(r,v)=>r.kind==='ing'?fq(v,r.u):fnum(v)+' '+esc(r.it.unidad||'');
  return `<div class="card"><div class="card-head"><h3>Lista de compras</h3><div class="actions"><button class="btn soft sm" onclick="exportShopping()">${ic('down')} CSV</button><button class="btn soft sm" onclick="window.print()">${ic('print')} Imprimir</button></div></div><div class="tbl"><table style="min-width:0"><thead><tr><th>Comprar</th><th>Tipo</th><th class="r">Cantidad faltante</th><th class="r">Costo estimado</th></tr></thead><tbody>${rows.map(r=>`<tr><td><strong>${esc(r.it.nombre)}</strong>${r.it.proveedor?`<div class="muted xs">${esc(r.it.proveedor)}</div>`:''}</td><td class="sm-t">${r.kind==='ing'?'Ingrediente':'Packaging'}</td><td class="r">${sh(r,r.falta)}</td><td class="r">${money(r.costo)}</td></tr>`).join('')}<tr class="tot"><td colspan="3">Total estimado (a precios actuales)</td><td class="r">${money(tot)}</td></tr></tbody></table></div><p class="muted xs mt">Las necesidades se consolidan por ingrediente para no contar dos veces lo mismo entre recetas.</p></div>`;
}
function exportShopping(){const N=planNeeds();const rows=[...N.ingRows,...N.matRows].filter(r=>r.falta>0);downloadCSV('lista_de_compras',['Recurso','Tipo','Cantidad faltante','Unidad','Costo estimado'],rows.map(r=>[r.it.nombre,r.kind==='ing'?'Ingrediente':'Packaging',r.kind==='ing'?r4(fromBase(r.falta,r.u)):r.falta,r.kind==='ing'?UNITS[r.u].l:(r.it.unidad||''),r.costo==null?'':r.costo]))}
function batchView(){
  const ro=S.recipes.filter(r=>!r.archivada).map(r=>[r.id,r.nombre]);
  if(!ro.length)return emptyState('oven','Necesitás una receta','Creá una receta para registrar tandas de producción.',`<button class="btn" onclick="go('recetas')">Ir a recetas</button>`);
  const a=[...S.batches].sort((x,y)=>String(y.fecha).localeCompare(String(x.fecha)));
  return `<div class="card"><h3>Registrar tanda</h3><div class="grid3">${fld('Receta',sel('b_r',ro,ro[0][0]))}${fld('Alfajores a producir',inp('b_u','','number','min="1" placeholder="Ej: 48"'))}${fld('Fecha',inp('b_f',todayStr(),'date'))}</div><button class="btn" onclick="addBatch()">${ic('plus')} Agregar tanda</button></div>`+
  (a.length?`<div class="tbl mt"><table><thead><tr><th>Fecha</th><th>Receta</th><th class="r">Alfajores</th><th>Estado</th><th>Inventario</th><th></th></tr></thead><tbody>${a.map(b=>{const r=REC(b.recetaId);return `<tr><td>${fdate(b.fecha)}</td><td><strong>${r?esc(r.nombre):'Receta eliminada'}</strong>${b.notas?`<div class="muted xs">${esc(b.notas)}</div>`:''}</td><td class="r">${fnum(num(b.unidades))}</td><td>${sel('',B_EST,b.estado,`onchange="setBatch('${b.id}',this.value)" aria-label="Estado" style="min-width:150px"`)}</td><td>${b.descontado?badge('Descontado','ok'):badge('Sin descontar')}</td><td class="acts">${ibtn('trash',`delBatch('${b.id}')`,'Eliminar','del')}</td></tr>`}).join('')}</tbody></table></div>`:`<p class="muted pad">Todavía no registraste tandas.</p>`);
}
function addBatch(){const u=num(V('b_u'));if(!(u>0))return err('Indicá cuántos alfajores vas a producir.');S.batches.push({id:uid(),recetaId:V('b_r'),unidades:u,fecha:V('b_f')||todayStr(),estado:'Pendiente',descontado:false,notas:''});save('Tanda registrada');render()}
function setBatch(id,v){const b=byId(S.batches,id);const prev=b.estado;b.estado=v;
  if(v==='Completada'&&!b.descontado){save();confirmDlg('Tanda completada. ¿Descontar del inventario los ingredientes y el packaging individual utilizados?',()=>{if(batchMovs(b)){b.descontado=true;save('Inventario actualizado')}else toast('No se pudo calcular el consumo (revisá la receta).','bad');render()},{okText:'Descontar',cancelText:'No descontar',cancel:render});return}
  if(prev==='Completada'&&v!=='Completada'&&b.descontado){removeMovsOf(b.id);b.descontado=false;toast('Se revirtió el descuento de inventario de esta tanda')}
  save('Estado actualizado');render()}
function delBatch(id){const b=byId(S.batches,id);confirmDlg(`¿Eliminar esta tanda?${b.descontado?' También se revertirá su descuento de inventario.':''}`,()=>{removeMovsOf(id);S.batches=S.batches.filter(x=>x.id!==id);save('Tanda eliminada');render()},{danger:true,okText:'Eliminar'})}
