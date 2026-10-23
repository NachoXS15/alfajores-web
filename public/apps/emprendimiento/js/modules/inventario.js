/* Mi Emprendimiento Dulce · Inventario */
'use strict';
/* =========================================================
   INVENTARIO
   ========================================================= */
const MOV_T={compra:['Compra',1],produccion:['Consumo en producción',-1],venta:['Venta (packaging)',-1],ajuste:['Ajuste manual',0],merma:['Merma o desperdicio',-1],devolucion:['Devolución',0]};
VIEWS.inventario=()=>{
  const t=curTab('inventario','stock');
  return pageHead('Inventario','Stock = saldo inicial + movimientos registrados. Todo cambio manual queda registrado con fecha y motivo.',`<button class="btn" onclick="newMov()">${ic('plus')} Registrar movimiento</button>`)+
  note(`<strong>Cuándo se descuenta cada recurso:</strong> los <strong>ingredientes y el packaging individual</strong> se descuentan al completar una tanda de producción. El <strong>packaging de la presentación</strong> (cajas, etiquetas) se descuenta al registrar la venta. Así nada se descuenta dos veces.`)+
  tabs('inventario',[['stock','Existencias'],['movs','Movimientos']])+(t==='stock'?stockView():movsView());
};
function stockView(){
  if(!S.ingredients.length&&!S.materials.length)return emptyState('layers','No hay recursos para controlar','Cargá ingredientes y materiales con su stock disponible para empezar.',`<button class="btn" onclick="go('ingredientes')">Ir a ingredientes</button>`);
  return searchBar('Buscar recurso',fsel('tipo',[['','Ingredientes y materiales'],['ing','Solo ingredientes'],['mat','Solo materiales'],['bajo','Solo stock bajo']],'','Tipo'))+`<div id="list">${LISTS.inventario()}</div>`;
}
LISTS.inventario=()=>{
  if(curTab('inventario','stock')==='movs')return movsList();
  const t=fv('tipo','');const rows=[...S.ingredients.map(g=>({kind:'ing',it:g,s:stockOf('ing',g.id),mn:num(g.stockMin),u:usoU(g)})),...S.materials.map(m=>({kind:'mat',it:m,s:stockOf('mat',m.id),mn:num(m.stockMin)}))].filter(r=>match([r.it.nombre])&&(t===''||(t==='bajo'?r.mn>0&&r.s<=r.mn:r.kind===t)));
  if(!rows.length)return `<p class="muted pad">Sin resultados.</p>`;
  const show=(r,v)=>r.kind==='ing'?fq(v,r.u):fnum(v)+' '+esc(r.it.unidad||'');
  return `<div class="tbl"><table><thead><tr><th>Recurso</th><th>Tipo</th><th class="r">Stock actual</th><th class="r">Mínimo</th><th>Estado</th><th></th></tr></thead><tbody>${rows.map(r=>`<tr><td><strong>${esc(r.it.nombre)}</strong></td><td class="sm-t">${r.kind==='ing'?'Ingrediente':'Material'}</td><td class="r"><strong>${show(r,r.s)}</strong></td><td class="r">${r.mn>0?show(r,r.mn):'—'}</td><td>${r.s<0?badge('Negativo: revisar','bad'):r.s===0?badge('Sin stock','bad'):r.mn>0&&r.s<=r.mn?badge('Reponer','warn'):badge('OK','ok')}</td><td class="acts">${ibtn('plus',`newMov('${r.kind}:${r.it.id}')`,'Registrar movimiento')}</td></tr>`).join('')}</tbody></table></div>`;
};
function movsView(){if(!S.movements.length)return emptyState('layers','Sin movimientos','Las compras, consumos de producción, ventas y ajustes aparecerán acá.');return `<div class="toolbar">${fsel('mt',[['','Todos los tipos'],...Object.entries(MOV_T).map(([k,v])=>[k,v[0]])],'','Tipo')}<div class="search">${ic('search',18)}<input type="search" placeholder="Buscar recurso o motivo" value="${esc(fv('q',''))}" oninput="setF('q',this.value)"></div></div><div id="list">${movsList()}</div>`}
function movsList(){
  const t=fv('mt','');const a=S.movements.filter(m=>(t===''||m.tipo===t)).map(m=>({m,it:m.kind==='ing'?ING(m.refId):MAT(m.refId)})).filter(x=>x.it&&match([x.it.nombre,x.m.motivo])).sort((a,b)=>String(b.m.fecha).localeCompare(String(a.m.fecha))||String(b.m.creado).localeCompare(String(a.m.creado)));
  if(!a.length)return `<p class="muted pad">Sin movimientos con esos filtros.</p>`;
  return `<div class="tbl"><table><thead><tr><th>Fecha</th><th>Recurso</th><th>Tipo</th><th class="r">Cantidad</th><th>Motivo</th><th></th></tr></thead><tbody>${a.slice(0,300).map(({m,it})=>`<tr><td>${fdate(m.fecha)}</td><td>${esc(it.nombre)}</td><td class="sm-t">${esc((MOV_T[m.tipo]||[m.tipo])[0])}</td><td class="r ${m.cantidad<0?'badc':'okc'}">${m.cantidad>0?'+':''}${m.kind==='ing'?fq(m.cantidad,usoU(it)):fnum(m.cantidad)}</td><td class="sm-t">${esc(m.motivo)}${m.origen?' <span class="muted xs">(automático)</span>':''}</td><td class="acts">${m.origen?'':ibtn('trash',`delMov('${m.id}')`,'Eliminar','del')}</td></tr>`).join('')}</tbody></table></div>`;
}
function newMov(pre){
  if(!S.ingredients.length&&!S.materials.length)return toast('Primero cargá ingredientes o materiales','warn');
  const opts=[...S.ingredients.map(g=>['ing:'+g.id,'Ingrediente · '+g.nombre]),...S.materials.map(m=>['mat:'+m.id,'Material · '+m.nombre])];
  modal('Registrar movimiento',`${fld('Recurso',sel('mv_r',opts,pre||opts[0][0],'onchange="movUnit()"'))}<div class="grid2">${fld('Tipo',sel('mv_t',[['compra','Compra'],['ajuste','Ajuste manual'],['merma','Merma o desperdicio'],['devolucion','Devolución']],'compra','onchange="movUnit()"'))}${fld('Dirección',sel('mv_d',[['1','Entrada (suma)'],['-1','Salida (resta)']],'1'))}</div>
  <div class="grid2">${fld('Cantidad *','<input id="mv_q" type="number" inputmode="decimal" step="any" min="0">')}<div id="mv_uw" style="display:contents"></div></div>${fld('Fecha',inp('mv_f',todayStr(),'date'))}${fld('Motivo *',inp('mv_m','','text','placeholder="Ej: Compra en mayorista / se rompieron 3 cajas"'))}`,
  `<button class="btn soft" onclick="closeModal()">Cancelar</button><button class="btn" onclick="saveMov()">${ic('check')} Registrar</button>`);movUnit();
}
function movUnit(){const [k,id]=V('mv_r').split(':');const t=V('mv_t');const d=$('#mv_d');if(t==='compra'){d.value='1';d.disabled=true}else if(t==='merma'){d.value='-1';d.disabled=true}else d.disabled=false;const w=$('#mv_uw');if(k==='ing'){const g=ING(id);w.innerHTML=fld('Unidad',sel('mv_u',compatUnits(g.unidadCompra).map(u=>[u,UNITS[u].l]),usoU(g)))}else{const m=MAT(id);w.innerHTML=`<div class="fld"><span>Unidad</span><div class="ro">${esc(m.unidad||'unidad')}</div></div>`}}
function saveMov(){const [k,id]=V('mv_r').split(':');const q=num(V('mv_q'));const t=V('mv_t');const mot=V('mv_m').trim();if(!(q>0))return err('La cantidad debe ser mayor que cero.');if(!mot)return err('Indicá el motivo del movimiento.');const dir=t==='compra'?1:t==='merma'?-1:num(V('mv_d'));const base=k==='ing'?toBase(q,V('mv_u')):q;addMov(k,id,base*dir,t,mot,null,V('mv_f')||todayStr());save('Movimiento registrado');closeModal();render()}
function delMov(id){confirmDlg('¿Eliminar este movimiento manual? El stock se recalculará.',()=>{S.movements=S.movements.filter(m=>m.id!==id);save('Movimiento eliminado');render()},{danger:true,okText:'Eliminar'})}
