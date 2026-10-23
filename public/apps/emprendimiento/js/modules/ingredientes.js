/* Mi Emprendimiento Dulce · Ingredientes e insumos */
'use strict';
/* =========================================================
   INGREDIENTES E INSUMOS
   ========================================================= */
const CATS_ING=['Harinas y almidones','Azúcar y endulzantes','Chocolate y cacao','Dulce de leche y rellenos','Manteca y grasas','Huevos y lácteos','Esencias y saborizantes','Frutos secos y otros ingredientes','Envases y packaging','Etiquetas y decoración','Materiales de producción','Otros insumos'];
function costLabel(g){
  const cb=ingCostBase(g);if(cb==null)return badge('Sin precio','warn');
  const u=usoU(g),d=UNITS[u].d;
  let s=`${money(cb*UNITS[u].f)} <span class="muted xs">/ ${UNITS[u].l}</span>`;
  if(d!=='u'&&UNITS[u].f===1)s+=`<div class="muted xs">${money(cb*1000)} / ${d==='m'?'kg':'l'}</div>`;
  return s;
}
VIEWS.ingredientes=()=>pageHead('Ingredientes e insumos','Registrá lo que comprás y cuánto pagaste: la app calcula el costo por gramo, mililitro o unidad y conserva el historial de precios.',`<button class="btn" onclick="editIng()">${ic('plus')} Nuevo ingrediente</button>`)+
  (S.ingredients.length?searchBar('Buscar por nombre, marca o proveedor',fsel('cat',[['','Todas las categorías'],...CATS_ING],'','Categoría')+fsel('ord',[['nombre','Ordenar por nombre'],['fecha','Última actualización'],['stock','Stock bajo primero']],'nombre','Ordenar'))+`<div id="list">${LISTS.ingredientes()}</div>`
  :emptyState('jar','Todavía no cargaste ingredientes','Empezá por los básicos: harina, fécula de maíz, manteca, azúcar, huevos, dulce de leche y chocolate. Con el precio y la cantidad comprada calculamos el costo exacto.',`<button class="btn" onclick="editIng()">${ic('plus')} Cargar mi primer ingrediente</button>`));
LISTS.ingredientes=()=>{
  let a=S.ingredients.filter(g=>match([g.nombre,g.marca,g.proveedor,g.categoria])&&(!fv('cat','')||g.categoria===fv('cat','')));
  const o=fv('ord','nombre');
  a=[...a].sort((x,y)=>o==='fecha'?String(y.fecha||'').localeCompare(String(x.fecha||'')):o==='stock'?(stockOf('ing',x.id)-num(x.stockMin))-(stockOf('ing',y.id)-num(y.stockMin)):x.nombre.localeCompare(y.nombre));
  if(!a.length)return `<p class="muted pad">No hay resultados con esos filtros.</p>`;
  return `<div class="tbl"><table><thead><tr><th>Ingrediente</th><th>Categoría</th><th class="r">Costo de uso</th><th class="r">Stock</th><th>Precio actualizado</th><th></th></tr></thead><tbody>${a.map(g=>{const s=stockOf('ing',g.id),u=usoU(g),low=num(g.stockMin)>0&&s<=num(g.stockMin);return `<tr><td><strong>${esc(g.nombre)}</strong><div class="muted xs">${esc([g.marca,g.proveedor].filter(Boolean).join(' · '))||`${fnum(g.cantidadCompra)} ${UNITS[g.unidadCompra].l} a ${money(num(g.precioTotal))}`}</div></td><td class="sm-t">${esc(g.categoria)}</td><td class="r">${costLabel(g)}</td><td class="r ${low?'badc':''}">${fq(s,u)}${low?'<div class="xs">Stock bajo</div>':''}</td><td>${fdate(g.fecha)}</td><td class="acts">${ibtn('dollar',`updPrice('${g.id}')`,'Actualizar precio')}${ibtn('history',`ingHistory('${g.id}')`,'Historial de precios')}${ibtn('edit',`editIng('${g.id}')`,'Editar')}${ibtn('trash',`delIng('${g.id}')`,'Eliminar','del')}</td></tr>`}).join('')}</tbody></table></div>`;
};
function editIng(id){
  const g=id?ING(id):null;
  D=g?{...g}:{nombre:'',categoria:CATS_ING[0],marca:'',proveedor:'',unidadCompra:'kg',cantidadCompra:'',precioTotal:'',unidadUso:'g',notas:''};
  const u=usoU(D);
  modal(g?'Editar ingrediente':'Nuevo ingrediente',`<div class="grid2">${fld('Nombre *',`<input id="f_nombre" value="${esc(D.nombre)}" placeholder="Ej: Harina 0000">`)}${fld('Categoría',sel('f_cat',CATS_ING,D.categoria))}${fld('Marca (opcional)',inp('f_marca',D.marca))}${fld('Proveedor (opcional)',inp('f_prov',D.proveedor))}</div>
  <h4 class="sub">Última compra</h4><div class="grid3">${fld('Cantidad comprada *',inp('f_cant',D.cantidadCompra,'number','min="0" oninput="prevIng()"'))}${fld('Unidad de compra',sel('f_uc',Object.keys(UNITS).map(k=>[k,UNITS[k].l]),D.unidadCompra,'onchange="ingUnitChange()"'))}${fld('Precio total pagado *',inp('f_precio',D.precioTotal,'number','min="0" oninput="prevIng()"'))}</div>
  ${fld('Unidad para medir en recetas',sel('f_uu',compatUnits(D.unidadCompra).map(k=>[k,UNITS[k].l]),u,'onchange="prevIng()"'),'Ej: comprás por kg pero medís en gramos. Gramos y mililitros no se convierten entre sí.')}
  <div id="ingPrev" class="calc-prev"></div>
  <div class="grid2">${g?`<div class="fld"><span>Stock actual</span><div class="ro">${fq(stockOf('ing',g.id),u)}</div><small>Para modificarlo registrá un movimiento en Inventario.</small></div>`:fld('Cantidad disponible hoy',inp('f_stock','','number','min="0"'),'En la unidad de medida de recetas.')}${fld('Stock mínimo para alertas',inp('f_min',g?fromBase(num(g.stockMin),u):'','number','min="0"'),'En la unidad de medida de recetas.')}</div>
  ${fld('Notas',`<textarea id="f_notas" rows="2">${esc(D.notas)}</textarea>`)}`,
  `<button class="btn soft" onclick="closeModal()">Cancelar</button><button class="btn" onclick="saveIng()">${ic('check')} Guardar</button>`);
  prevIng();
}
function ingUnitChange(){const uc=V('f_uc');const base=UNITS[uc].d==='m'?'g':UNITS[uc].d==='v'?'ml':'u';$('#f_uu').innerHTML=compatUnits(uc).map(k=>`<option value="${k}" ${k===base?'selected':''}>${UNITS[k].l}</option>`).join('');prevIng()}
function prevIng(){const e=$('#ingPrev');if(!e)return;const q=toBase(V('f_cant'),V('f_uc')),p=V('f_precio'),uu=V('f_uu');if(!(q>0)||isBlank(p)){e.innerHTML='<span class="muted">Completá cantidad y precio para ver el costo por unidad.</span>';return}const cb=num(p)/q;e.innerHTML=`Costo por ${UNITS[uu].l}: <b>${money(cb*UNITS[uu].f)}</b>${UNITS[uu].d!=='u'?` · por ${UNITS[uu].d==='m'?'kg':'l'}: <b>${money(cb*1000)}</b>`:''}<div class="muted xs">Fórmula: precio total ÷ cantidad comprada convertida a ${UNITS[uu].d==='m'?'gramos':UNITS[uu].d==='v'?'mililitros':'unidades'}.</div>`}
const usedInRecipes=id=>S.recipes.filter(r=>(r.items||[]).some(i=>i.ingId===id));
const impactSnap=id=>Object.fromEntries(usedInRecipes(id).map(r=>[r.id,recipeCost(r).unit]));
function saveIng(){
  const nombre=V('f_nombre').trim(),cant=num(V('f_cant')),precio=V('f_precio'),uc=V('f_uc'),uu=V('f_uu'),min=num(V('f_min'));
  if(!nombre)return err('Ingresá el nombre del ingrediente.');
  if(!(cant>0))return err('La cantidad comprada debe ser mayor que cero.');
  if(isBlank(precio)||num(precio)<0)return err('Ingresá un precio válido (cero o mayor).');
  if(min<0)return err('El stock mínimo no puede ser negativo.');
  const isNew=!D.id;const st=isNew?num(V('f_stock')):0;if(st<0)return err('La cantidad disponible no puede ser negativa.');
  let g=isNew?{id:uid(),historial:[],stockInicial:0,creado:new Date().toISOString()}:ING(D.id);
  if(!isNew&&UNITS[g.unidadCompra].d!==UNITS[uc].d&&(usedInRecipes(g.id).length||S.movements.some(m=>m.refId===g.id)))return err('No podés cambiar a una unidad incompatible: este ingrediente ya se usa en recetas o tiene movimientos.');
  const before=isNew?null:impactSnap(g.id);
  const changed=isNew||num(g.precioTotal)!==num(precio)||num(g.cantidadCompra)!==cant||g.unidadCompra!==uc;
  Object.assign(g,{nombre,categoria:V('f_cat'),marca:V('f_marca').trim(),proveedor:V('f_prov').trim(),unidadCompra:uc,cantidadCompra:cant,precioTotal:num(precio),unidadUso:uu,stockMin:toBase(min,uu),notas:V('f_notas').trim()});
  if(isNew){g.stockInicial=toBase(st,uu);S.ingredients.push(g)}
  if(changed){g.fecha=todayStr();g.historial=g.historial||[];g.historial.push({fecha:todayStr(),cantidad:cant,unidad:uc,precio:num(precio)})}
  save('Ingrediente guardado');closeModal();render();
  if(before&&changed)showImpact(g,before);
}
function updPrice(id){
  const g=ING(id);D={id};
  modal('Actualizar precio · '+g.nombre,`<p class="muted mb">Precio actual: ${fnum(g.cantidadCompra)} ${UNITS[g.unidadCompra].l} a ${money(num(g.precioTotal))} (${fdate(g.fecha)}).</p>
  <div class="grid3">${fld('Cantidad',inp('p_cant',g.cantidadCompra,'number','min="0"'))}${fld('Unidad',sel('p_u',compatUnits(g.unidadCompra).map(k=>[k,UNITS[k].l]),g.unidadCompra))}${fld('Precio total nuevo *',inp('p_precio','','number','min="0"'))}</div>
  ${fld('Fecha del precio',inp('p_fecha',todayStr(),'date'))}
  <label class="chk"><input type="checkbox" id="p_compra"> Registrar también como compra (suma esa cantidad al stock)</label>
  ${note('El nuevo precio actualiza las estimaciones de tus recetas y productos. Las ventas ya registradas conservan el costo que tenían.')}`,
  `<button class="btn soft" onclick="closeModal()">Cancelar</button><button class="btn" onclick="savePrice()">${ic('check')} Actualizar</button>`);
}
function savePrice(){
  const g=ING(D.id),cant=num(V('p_cant')),u=V('p_u'),p=V('p_precio'),f=V('p_fecha')||todayStr();
  if(!(cant>0))return err('La cantidad debe ser mayor que cero.');if(isBlank(p)||num(p)<0)return err('Ingresá un precio válido.');
  const before=impactSnap(g.id);
  g.historial=g.historial||[];g.historial.push({fecha:f,cantidad:cant,unidad:u,precio:num(p)});
  Object.assign(g,{cantidadCompra:cant,unidadCompra:u,precioTotal:num(p),fecha:f});
  if(CK('p_compra'))addMov('ing',g.id,toBase(cant,u),'compra','Compra al actualizar precio',null,f);
  save('Precio actualizado');closeModal();render();showImpact(g,before);
}
function showImpact(g,before){
  const rows=Object.keys(before).map(id=>{const r=REC(id);if(!r)return null;const now=recipeCost(r).unit;return{r,a:before[id],b:now}}).filter(x=>x&&x.a!==x.b);
  if(!rows.length)return;
  D={impact:rows.map(x=>x.r.id)};
  modal('Impacto en tus recetas',`<p class="muted mb">El cambio en <strong>${esc(g.nombre)}</strong> modifica el costo por alfajor de estas recetas:</p><div class="tbl"><table><thead><tr><th>Receta</th><th class="r">Antes</th><th class="r">Ahora</th><th class="r">Variación</th></tr></thead><tbody>${rows.map(x=>{const v=x.a&&x.b!=null?(x.b-x.a)/x.a:null;return `<tr><td>${esc(x.r.nombre)}</td><td class="r">${money(x.a)}</td><td class="r"><strong>${money(x.b)}</strong></td><td class="r ${v>0?'badc':'okc'}">${v==null?'—':(v>0?'+':'')+pct(v)}</td></tr>`}).join('')}</tbody></table></div>${note('Revisá los precios de venta de los productos que usan estas recetas.','warn')}`,
  `<button class="btn soft" onclick="closeModal()">Cerrar</button><button class="btn" onclick="D.impact.forEach(id=>snapVersion(id,'Actualización de precio de ingrediente'));save('Versiones de costo guardadas');closeModal()">Guardar versión de costos</button>`);
}
function ingHistory(id){
  const g=ING(id);const h=[...(g.historial||[])];const u=usoU(g);
  modal('Historial de precios · '+g.nombre,h.length?`<div class="tbl"><table><thead><tr><th>Fecha</th><th>Compra</th><th class="r">Precio</th><th class="r">Costo por ${UNITS[u].l}</th><th class="r">Variación</th></tr></thead><tbody>${h.map((x,i)=>{const cb=num(x.precio)/toBase(x.cantidad,x.unidad);const prev=i>0?num(h[i-1].precio)/toBase(h[i-1].cantidad,h[i-1].unidad):null;const v=prev?(cb-prev)/prev:null;return `<tr><td>${fdate(x.fecha)}</td><td>${fnum(x.cantidad)} ${UNITS[x.unidad]?UNITS[x.unidad].l:''}</td><td class="r">${money(num(x.precio))}</td><td class="r">${money(cb*UNITS[u].f)}</td><td class="r ${v>0?'badc':v<0?'okc':''}">${v==null?'—':(v>0?'+':'')+pct(v)}</td></tr>`}).join('')}</tbody></table></div>`:'<p class="muted">Sin historial.</p>',`<button class="btn soft" onclick="closeModal()">Cerrar</button>`);
}
function delIng(id){
  const g=ING(id),used=usedInRecipes(id);
  if(used.length)return modal('No se puede eliminar',`<p>${esc(g.nombre)} se usa en: <strong>${used.map(r=>esc(r.nombre)).join(', ')}</strong>.</p><p class="muted mt">Quitalo primero de esas recetas para no dejar costos incompletos.</p>`,`<button class="btn" onclick="closeModal()">Entendido</button>`);
  confirmDlg(`¿Eliminar <strong>${esc(g.nombre)}</strong>? También se eliminarán sus movimientos de inventario.`,()=>{S.ingredients=S.ingredients.filter(x=>x.id!==id);S.movements=S.movements.filter(m=>!(m.kind==='ing'&&m.refId===id));save('Ingrediente eliminado');render()},{danger:true,okText:'Eliminar'});
}
