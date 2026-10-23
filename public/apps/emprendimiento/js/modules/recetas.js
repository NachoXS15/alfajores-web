/* Mi Emprendimiento Dulce · Mis recetas y costos */
'use strict';
/* =========================================================
   MIS RECETAS Y COSTOS
   ========================================================= */
VIEWS.recetas=()=>pageHead('Mis recetas y costos','Cada receta calcula su costo por tanda y por alfajor: ingredientes, tu mano de obra, gastos indirectos y packaging individual.',`<button class="btn" onclick="editRecipe()">${ic('plus')} Nueva receta</button>`)+
  (S.recipes.length?searchBar('Buscar receta',fsel('est',[['act','Activas'],['arch','Archivadas'],['all','Todas']],'act','Estado')+fsel('ord',[['nombre','Ordenar por nombre'],['costo','Mayor costo unitario'],['mod','Última modificación']],'nombre','Ordenar'))+`<div id="list">${LISTS.recetas()}</div>`
  :emptyState('book','Creá tu primera receta','Elegí los ingredientes que ya cargaste, indicá cuánto usás y cuántos alfajores salen. El costo se calcula solo.',`<button class="btn" onclick="editRecipe()">${ic('plus')} Crear receta</button>`));
LISTS.recetas=()=>{
  const est=fv('est','act'),o=fv('ord','nombre');
  let a=S.recipes.filter(r=>match([r.nombre,r.desc])&&(est==='all'||(est==='arch'?r.archivada:!r.archivada)));
  const cost=new Map(a.map(r=>[r.id,recipeCost(r)]));
  a.sort((x,y)=>o==='costo'?(cost.get(y.id).unit||0)-(cost.get(x.id).unit||0):o==='mod'?String(y.mod).localeCompare(String(x.mod)):x.nombre.localeCompare(y.nombre));
  if(!a.length)return `<p class="muted pad">No hay recetas con esos filtros.</p>`;
  return `<div class="cards sub4">${a.map(r=>{const rc=cost.get(r.id);return `<div class="item-card"><div class="ic-top"><div><h3>${esc(r.nombre)}</h3><div class="muted xs">${esc(r.desc||'')}</div></div>${rc.provisional?badge('Provisional','warn'):badge('Completa','ok')}${r.archivada?badge('Archivada'):''}</div>
  <div><div class="muted xs">Costo por alfajor</div><div class="ic-big">${money(rc.unit)}</div></div>
  <div class="ic-rows"><span>Rendimiento</span><span>${fnum(num(r.rendimiento))} alfajores</span><span>Costo de la tanda</span><span>${money(rc.total)}</span><span>Media docena</span><span>${money(rc.unit!=null?rc.unit*6:null)}</span><span>Docena</span><span>${money(rc.unit!=null?rc.unit*12:null)}</span></div>
  <div class="ic-acts">${ibtn('eye',`viewRecipe('${r.id}')`,'Ver detalle y escalar')}${ibtn('edit',`editRecipe('${r.id}')`,'Editar')}${ibtn('copy',`editRecipe('${r.id}',true)`,'Duplicar')}${ibtn('archive',`archRecipe('${r.id}')`,r.archivada?'Restaurar':'Archivar')}${ibtn('trash',`delRecipe('${r.id}')`,'Eliminar','del')}</div></div>`}).join('')}</div>`;
};
function editRecipe(id,dup){
  if(!S.ingredients.length){toast('Primero registrá al menos un ingrediente','warn');go('ingredientes');return}
  const r=id?REC(id):null;
  D=r?JSON.parse(JSON.stringify(r)):{id:null,nombre:'',desc:'',items:[{ingId:'',cantidad:'',unidad:'g'}],rendimiento:'',tPrep:'',tCoc:'',moMin:'',indirectos:'',packaging:[],notas:''};
  if(dup){D.id=null;D.nombre+=' (copia)';D.versiones=[];D.archivada=false;D._dup=true}
  mRecipe();
}
function mRecipe(){
  const io=[['','Elegí un ingrediente…'],...S.ingredients.map(g=>[g.id,g.nombre])];
  const mo=[['','Elegí un material…'],...S.materials.map(m=>[m.id,m.nombre])];
  const body=`<div class="grid2">${fld('Nombre de la receta *',`<input value="${esc(D.nombre)}" oninput="D.nombre=this.value" placeholder="Ej: Alfajor de chocolate">`)}${fld('Rendimiento: alfajores por tanda *',`<input type="number" inputmode="numeric" min="1" step="1" value="${esc(D.rendimiento)}" oninput="D.rendimiento=this.value;prevRecipe()">`)}</div>
  ${fld('Descripción (opcional)',`<input value="${esc(D.desc)}" oninput="D.desc=this.value">`)}
  <h4 class="sub">Ingredientes</h4><div class="lines">${D.items.map((it,i)=>{const g=ING(it.ingId);const uo=g?compatUnits(g.unidadCompra):Object.keys(UNITS);return `<div class="line">${sel('',io,it.ingId,`onchange="lineIng(${i},this.value)" aria-label="Ingrediente"`)}<input type="number" inputmode="decimal" step="any" min="0" placeholder="Cantidad" aria-label="Cantidad" value="${esc(it.cantidad)}" oninput="D.items[${i}].cantidad=this.value;prevRecipe()">${sel('',uo.map(u=>[u,UNITS[u].l]),it.unidad,`onchange="D.items[${i}].unidad=this.value;prevRecipe()" aria-label="Unidad"`)}<button class="icon-btn del" onclick="D.items.splice(${i},1);mRecipe()" aria-label="Quitar">${ic('x')}</button></div>`}).join('')}</div>
  <button class="btn ghost sm" onclick="D.items.push({ingId:'',cantidad:'',unidad:'g'});mRecipe()">${ic('plus')} Agregar ingrediente</button>
  <h4 class="sub">Tiempo, mano de obra y gastos</h4>
  <div class="grid3">${fld('Preparación (min)',`<input type="number" inputmode="decimal" min="0" value="${esc(D.tPrep)}" oninput="D.tPrep=this.value">`)}${fld('Cocción (min)',`<input type="number" inputmode="decimal" min="0" value="${esc(D.tCoc)}" oninput="D.tCoc=this.value">`)}${fld('Minutos de trabajo a cobrar',`<input type="number" inputmode="decimal" min="0" value="${esc(D.moMin)}" oninput="D.moMin=this.value;prevRecipe()">`,`Valor hora: ${money(num(S.profile.valorHora))}`)}</div>
  ${fld('Gastos indirectos asignados por tanda',`<input type="number" inputmode="decimal" min="0" value="${esc(D.indirectos)}" oninput="D.indirectos=this.value;prevRecipe()">`,'Gas, luz, limpieza. Solo lo que corresponde a esta tanda.')}
  <h4 class="sub">Packaging individual por alfajor (opcional)</h4>
  <p class="muted xs mb">Ej: papel o film para envolver cada alfajor. El packaging de la caja se carga en el producto, así no se cuenta dos veces.</p>
  ${S.materials.length?`<div class="lines">${D.packaging.map((x,i)=>`<div class="line l3">${sel('',mo,x.matId,`onchange="D.packaging[${i}].matId=this.value;prevRecipe()" aria-label="Material"`)}<input type="number" inputmode="decimal" min="0" step="any" placeholder="Cant. por alfajor" value="${esc(x.cant)}" oninput="D.packaging[${i}].cant=this.value;prevRecipe()"><button class="icon-btn del" onclick="D.packaging.splice(${i},1);mRecipe()" aria-label="Quitar">${ic('x')}</button></div>`).join('')}</div><button class="btn ghost sm" onclick="D.packaging.push({matId:'',cant:1});mRecipe()">${ic('plus')} Agregar material</button>`:`<p class="muted xs">No tenés materiales cargados. Podés agregarlos en Packaging y materiales.</p>`}
  ${fld('Notas',`<textarea rows="2" oninput="D.notas=this.value">${esc(D.notas)}</textarea>`)}
  <div id="recPrev"></div>`;
  modal(D.id?'Editar receta':(D._dup?'Duplicar receta':'Nueva receta'),body,`<button class="btn soft" onclick="closeModal()">Cancelar</button><button class="btn" onclick="saveRecipe()">${ic('check')} Guardar receta</button>`,true);
  prevRecipe();
}
function lineIng(i,v){D.items[i].ingId=v;const g=ING(v);if(g){const u=usoU(g);D.items[i].unidad=u}mRecipe()}
function prevRecipe(){const e=$('#recPrev');if(!e)return;const rc=recipeCost(D);e.innerHTML=`<div class="calc-prev"><div class="res-rows" style="margin:0"><span>Ingredientes</span><span>${money(rc.ing)}</span><span>Mano de obra</span><span>${money(rc.mo)}</span><span>Gastos indirectos</span><span>${money(rc.ind)}</span><span>Packaging individual</span><span>${money(rc.pack)}</span><span class="strong">Costo total de la tanda</span><span class="strong">${money(rc.total)}</span><span class="strong">Costo por alfajor</span><span class="strong">${money(rc.unit)}</span></div></div>${warnList(rc.warn)}`}
function snapVersion(id,nota){const r=REC(id);if(!r)return;const rc=recipeCost(r);r.versiones=r.versiones||[];r.versiones.push({fecha:new Date().toISOString(),unit:rc.unit,total:rc.total,rend:num(r.rendimiento),nota:nota||'',provisional:rc.provisional,items:(r.items||[]).map(i=>({...i}))})}
function saveRecipe(){
  if(!D.nombre.trim())return err('Ingresá el nombre de la receta.');
  if(!(num(D.rendimiento)>0))return err('El rendimiento debe ser mayor que cero.');
  if(!D.items.length)return err('Agregá al menos un ingrediente.');
  if(D.items.some(i=>!i.ingId))return err('Elegí el ingrediente en cada línea o quitá las vacías.');
  if(D.items.some(i=>!(num(i.cantidad)>0)))return err('Todas las cantidades deben ser mayores que cero.');
  if([D.tPrep,D.tCoc,D.moMin,D.indirectos].some(v=>num(v)<0)||D.packaging.some(x=>num(x.cant)<0))return err('No se permiten valores negativos.');
  D.packaging=D.packaging.filter(x=>x.matId);
  const now=new Date().toISOString();
  const data={nombre:D.nombre.trim(),desc:(D.desc||'').trim(),items:D.items.map(i=>({ingId:i.ingId,cantidad:num(i.cantidad),unidad:i.unidad})),rendimiento:num(D.rendimiento),tPrep:D.tPrep,tCoc:D.tCoc,moMin:num(D.moMin),indirectos:num(D.indirectos),packaging:D.packaging.map(x=>({matId:x.matId,cant:num(x.cant)})),notas:D.notas||'',mod:now};
  let r;
  if(D.id){r=REC(D.id);Object.assign(r,data)}else{r={id:uid(),creado:now,archivada:false,versiones:[],...data};S.recipes.push(r)}
  const rc=recipeCost(r);const last=(r.versiones||[]).slice(-1)[0];
  if(!last||r2(last.unit||0)!==r2(rc.unit||0)||last.rend!==r.rendimiento)snapVersion(r.id,D.id?'Edición':'Versión inicial');
  save('Receta guardada');closeModal();render();
}
function viewRecipe(id){
  const r=REC(id),rc=recipeCost(r);
  const body=`${warnList(rc.warn)}<div class="split"><div>
  <h4 class="mb">Ingredientes de la tanda</h4><div class="tbl"><table style="min-width:0"><thead><tr><th>Ingrediente</th><th class="r">Cantidad</th><th class="r">Costo</th></tr></thead><tbody>${rc.lines.map(l=>`<tr><td>${l.g?esc(l.g.nombre):'<span class="badc">Eliminado</span>'}</td><td class="r">${fnum(num(l.cantidad),3)} ${UNITS[l.unidad]?UNITS[l.unidad].l:''}</td><td class="r">${money(l.costo)}</td></tr>`).join('')}<tr class="tot"><td>Total ingredientes</td><td></td><td class="r">${money(rc.ing)}</td></tr></tbody></table></div>
  <div class="res-rows mt"><span>Mano de obra (${fnum(num(r.moMin))} min)</span><span>${money(rc.mo)}</span><span>Gastos indirectos</span><span>${money(rc.ind)}</span><span>Packaging individual</span><span>${money(rc.pack)}</span><span class="strong">Costo total de producción</span><span class="strong">${money(rc.total)}</span><span>Tiempo total</span><span>${fnum(num(r.tPrep)+num(r.tCoc))} min</span></div>
  </div><div>
  <div class="calc-prev"><div class="muted xs">Costo por alfajor</div><div class="res-big">${money(rc.unit)}</div><div class="res-rows"><span>Caja de 4</span><span>${money(rc.unit!=null?rc.unit*4:null)}</span><span>Media docena</span><span>${money(rc.unit!=null?rc.unit*6:null)}</span><span>Docena</span><span>${money(rc.unit!=null?rc.unit*12:null)}</span></div>
  ${fld('Otra presentación: cantidad de alfajores',`<input type="number" inputmode="numeric" min="1" value="24" oninput="$('#presOut').textContent=${rc.unit==null?"'—'":'money('+rc.unit+'*num(this.value))'}">`)}<div>Costo: <b id="presOut">${money(rc.unit!=null?rc.unit*24:null)}</b> <span class="muted xs">(sin packaging de presentación)</span></div></div>
  <h4 class="mt mb">${ic('scale',18)} Escalar receta</h4>
  ${fld('¿Cuántos alfajores necesitás producir?',`<input type="number" inputmode="numeric" min="1" value="${num(r.rendimiento)||''}" oninput="scaleOut('${r.id}',this.value)">`)}<div id="scaleOut"></div>
  </div></div>
  <h4 class="sub">Historial de versiones y costos</h4>${(r.versiones||[]).length?`<div class="tbl"><table><thead><tr><th>Fecha</th><th>Detalle</th><th class="r">Rendimiento</th><th class="r">Costo tanda</th><th class="r">Costo por alfajor</th></tr></thead><tbody>${[...r.versiones].reverse().map(v=>`<tr><td>${fdate(v.fecha)}</td><td>${esc(v.nota||'')}${v.provisional?' '+badge('Provisional','warn'):''}</td><td class="r">${fnum(v.rend)}</td><td class="r">${money(v.total)}</td><td class="r"><strong>${money(v.unit)}</strong></td></tr>`).join('')}</tbody></table></div>`:'<p class="muted">Sin versiones guardadas.</p>'}
  ${r.notas?`<h4 class="sub">Notas</h4><p>${esc(r.notas)}</p>`:''}<p class="muted xs mt">Creada: ${fdate(r.creado)} · Última modificación: ${fdate(r.mod)}</p>`;
  modal(r.nombre,body,`<button class="btn soft" onclick="snapVersion('${r.id}','Guardada manualmente');save('Versión guardada');viewRecipe('${r.id}')">${ic('history')} Guardar versión</button><button class="btn" onclick="closeModal();editRecipe('${r.id}')">${ic('edit')} Editar</button>`,true);
  scaleOut(r.id,r.rendimiento);
}
function scaleOut(id,target){
  const r=REC(id),t=num(target),rend=num(r.rendimiento),e=$('#scaleOut');if(!e)return;
  if(!(t>0)||!(rend>0)){e.innerHTML=note('Ingresá una cantidad mayor que cero.','warn');return}
  const f=t/rend,rc=recipeCost(r);
  e.innerHTML=`<p class="xs muted mb">Factor: ×${fnum(f,3)} (${fnum(f,2)} tandas)</p>${Math.abs(f-Math.round(f))>1e-9?note('La cantidad no es múltiplo del rendimiento original: las cantidades se calcularon en forma proporcional y pueden requerir ajustes prácticos (por ejemplo, huevos).','warn'):''}<div class="tbl"><table style="min-width:0"><tbody>${(r.items||[]).map(i=>{const g=ING(i.ingId);return `<tr><td>${g?esc(g.nombre):'—'}</td><td class="r"><strong>${fnum(num(i.cantidad)*f,2)} ${UNITS[i.unidad]?UNITS[i.unidad].l:''}</strong></td></tr>`}).join('')}<tr class="tot"><td>Costo estimado</td><td class="r">${money(rc.total!=null?rc.total*f:null)}</td></tr></tbody></table></div>`;
}
function archRecipe(id){const r=REC(id);r.archivada=!r.archivada;save(r.archivada?'Receta archivada':'Receta restaurada');render()}
function delRecipe(id){
  const r=REC(id);const used=S.products.filter(p=>(p.items||[]).some(i=>i.recetaId===id));
  if(used.length)return modal('No se puede eliminar',`<p>La receta se usa en: <strong>${used.map(p=>esc(p.nombre)).join(', ')}</strong>.</p><p class="muted mt">Podés archivarla para ocultarla sin perder el historial.</p>`,`<button class="btn soft" onclick="closeModal()">Cerrar</button><button class="btn" onclick="closeModal();archRecipe('${id}')">Archivar</button>`);
  confirmDlg(`¿Eliminar la receta <strong>${esc(r.nombre)}</strong> y su historial de versiones? Esta acción no se puede deshacer.`,()=>{S.recipes=S.recipes.filter(x=>x.id!==id);save('Receta eliminada');render()},{danger:true,okText:'Eliminar'});
}
