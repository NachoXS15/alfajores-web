/* Mi Emprendimiento Dulce · Asistente de configuración inicial (9 pasos) */
'use strict';
/* =========================================================
   ASISTENTE DE CONFIGURACIÓN INICIAL (9 pasos)
   ========================================================= */
let W=null;
function startWizard(){
  W=LS.get('med_wiz',null)||{step:0,rec:{nombre:'',items:[],rendimiento:'',moMin:'',indirectos:'',packaging:[]},margen:40,tipo:'docena',red:'50',recId:null};
  $('#app').classList.add('hidden');$('#wizard').classList.remove('hidden');wizRender();
}
const WZ_T=['Tu emprendimiento','Moneda y preferencias','Tus primeros ingredientes','Tu primera receta','Rendimiento de la receta','Costos adicionales','Tu primer costo unitario','Tu precio de venta','¡Listo para empezar!'];
function wizRender(){
  LS.set('med_wiz',W);
  const s=W.step,P=S.profile;let body='';
  if(s===0)body=`<p class="muted mb">Contanos cómo se llama tu emprendimiento. Podés cambiarlo cuando quieras.</p>
    ${fld('Nombre del emprendimiento *',`<input id="w_neg" value="${esc(W.neg??P.negocio)}" oninput="W.neg=this.value;LS.set('med_wiz',W)" placeholder="Ej: Alfajores de la Abuela">`)}
    ${fld('Tu nombre',`<input id="w_nom" value="${esc(W.nom??P.nombre)}" oninput="W.nom=this.value;LS.set('med_wiz',W)" placeholder="Ej: Carolina">`)}
    <div class="fld"><span>¿En qué etapa estás?</span><div class="seg">${[['inicio','Estoy empezando'],['marcha','Ya vendo']].map(([k,l])=>`<button class="${P.etapa===k?'on':''}" onclick="S.profile.etapa='${k}';save();wizRender()">${l}</button>`).join('')}</div></div>`;
  if(s===1)body=`<p class="muted mb">Estos datos se usan para calcular tus costos y resultados.</p>
    ${fld('Moneda',sel('w_mon',[['ARS','Peso argentino (ARS)'],['USD','Dólar (USD)'],['UYU','Peso uruguayo (UYU)'],['CLP','Peso chileno (CLP)'],['MXN','Peso mexicano (MXN)'],['EUR','Euro (EUR)']],P.moneda))}
    ${fld('Valor de tu hora de trabajo',inp('w_vh',P.valorHora||'','number','min="0" placeholder="Ej: 3000"'),'Tu tiempo también es un costo. Si todavía no lo sabés, dejalo en 0 y completalo después.')}
    ${fld('Gastos fijos mensuales estimados',inp('w_gf',P.gastosFijosMes||'','number','min="0" placeholder="Ej: 40000"'),'Monotributo, internet, parte del alquiler, publicidad. Se usa en el simulador.')}`;
  if(s===2)body=`<p class="muted mb">Cargá lo que compraste y cuánto pagaste. Calculamos el costo por gramo, mililitro o unidad.</p>
    <div class="grid2">${fld('Ingrediente',`<input id="w_in" placeholder="Ej: Harina 0000">`)}${fld('Precio pagado',inp('w_ip','','number','min="0" placeholder="Ej: 1200"'))}</div>
    <div class="grid2">${fld('Cantidad comprada',inp('w_iq','','number','min="0" placeholder="Ej: 1"'))}${fld('Unidad',sel('w_iu',Object.keys(UNITS).map(u=>[u,UNITS[u].l]),'kg'))}</div>
    <button class="btn ghost" onclick="wizAddIng()">${ic('plus')} Agregar ingrediente</button>
    <div class="mt">${S.ingredients.length?S.ingredients.map(g=>{const cb=ingCostBase(g);const u=UNITS[g.unidadCompra].d==='u'?'u':(UNITS[g.unidadCompra].d==='m'?'kg':'l');return `<div class="list-row"><span>${esc(g.nombre)}</span><span class="muted">${cb==null?'—':money(cb*UNITS[u].f)+' / '+UNITS[u].l}</span></div>`}).join(''):'<p class="muted xs">Todavía no cargaste ingredientes.</p>'}</div>`;
  if(s===3){const opts=[['','Elegí…'],...S.ingredients.map(g=>[g.id,g.nombre])];
    body=S.ingredients.length?`${fld('Nombre de la receta *',`<input value="${esc(W.rec.nombre)}" oninput="W.rec.nombre=this.value" placeholder="Ej: Alfajor de maicena">`)}
    <h4 class="sub">Ingredientes de la receta</h4><div class="lines">${W.rec.items.map((it,i)=>{const g=ING(it.ingId);const uo=g?compatUnits(g.unidadCompra):['g'];return `<div class="line">${sel('',opts,it.ingId,`onchange="W.rec.items[${i}].ingId=this.value;const g=ING(this.value);if(g)W.rec.items[${i}].unidad=usoU(g)==='kg'?'g':usoU(g)==='l'?'ml':usoU(g);wizRender()" aria-label="Ingrediente"`)}<input type="number" inputmode="decimal" step="any" min="0" placeholder="Cantidad" value="${esc(it.cantidad)}" oninput="W.rec.items[${i}].cantidad=this.value;LS.set('med_wiz',W)">${sel('',uo.map(u=>[u,UNITS[u].l]),it.unidad,`onchange="W.rec.items[${i}].unidad=this.value"`)}<button class="icon-btn del" onclick="W.rec.items.splice(${i},1);wizRender()" aria-label="Quitar">${ic('x')}</button></div>`}).join('')}</div>
    <button class="btn ghost sm" onclick="W.rec.items.push({ingId:'',cantidad:'',unidad:'g'});wizRender()">${ic('plus')} Agregar ingrediente a la receta</button>`
    :note('Primero necesitás cargar ingredientes. Volvé al paso anterior u omití este paso para hacerlo más tarde.','warn');}
  if(s===4)body=`${fld('¿Cuántos alfajores salen de esta receta? *',`<input type="number" inputmode="numeric" min="1" step="1" value="${esc(W.rec.rendimiento)}" oninput="W.rec.rendimiento=this.value;LS.set('med_wiz',W)" placeholder="Ej: 24">`,'Contá los alfajores armados (tapa + tapa con relleno = 1 alfajor).')}`;
  if(s===5)body=`<p class="muted mb">Sumá lo que no se ve: tu tiempo y los gastos de elaboración (gas, luz). Podés dejar en 0 lo que no quieras incluir.</p>
    ${fld('Minutos de trabajo para esta tanda',`<input type="number" inputmode="decimal" min="0" value="${esc(W.rec.moMin)}" oninput="W.rec.moMin=this.value;LS.set('med_wiz',W)" placeholder="Ej: 120">`,`Valor hora configurado: ${money(num(S.profile.valorHora))}`)}
    ${fld('Gastos indirectos por tanda',`<input type="number" inputmode="decimal" min="0" value="${esc(W.rec.indirectos)}" oninput="W.rec.indirectos=this.value;LS.set('med_wiz',W)" placeholder="Ej: 800">`,'Gas del horno, luz, artículos de limpieza.')}`;
  if(s===6){const rc=recipeCost(W.rec);body=`<p class="muted">Este es el costo real de cada alfajor de <strong>${esc(W.rec.nombre||'tu receta')}</strong>:</p>
    <div class="res-big mt">${money(rc.unit)}</div><p class="muted xs">por alfajor</p>
    <div class="res-rows"><span>Ingredientes</span><span>${money(rc.ing)}</span><span>Mano de obra</span><span>${money(rc.mo)}</span><span>Gastos indirectos</span><span>${money(rc.ind)}</span><span class="strong">Costo total de la tanda</span><span class="strong">${money(rc.total)}</span><span>Media docena</span><span>${money(rc.unit!=null?rc.unit*6:null)}</span><span>Docena</span><span>${money(rc.unit!=null?rc.unit*12:null)}</span></div>${warnList(rc.warn)}`;}
  if(s===7){const rc=recipeCost(W.rec);const q={individual:1,media:6,docena:12}[W.tipo];const cost=rc.unit!=null?rc.unit*q:null;const pr=cost?priceFrom(cost,'margen',W.margen,0):{err:'Sin costo calculado'};const rp=pr.price?roundUp(pr.price,W.red):null;const m=rp?priceMetrics(cost,rp,0):null;
    body=`<div class="fld"><span>Presentación</span><div class="seg">${[['individual','Individual'],['media','Media docena'],['docena','Docena']].map(([k,l])=>`<button class="${W.tipo===k?'on':''}" onclick="W.tipo='${k}';wizRender()">${l}</button>`).join('')}</div></div>
    ${fld('Margen de ganancia deseado (%)',`<input type="number" inputmode="decimal" min="0" max="95" value="${esc(W.margen)}" onchange="W.margen=this.value;wizRender()">`,'Margen = parte del precio que queda como ganancia bruta. Se calcula: precio = costo / (1 − margen).')}
    ${fld('Redondear a',sel('',[['0','Sin redondeo'],['10','$10'],['50','$50'],['100','$100']],W.red,`onchange="W.red=this.value;wizRender()"`))}
    ${pr.err?note(pr.err,'warn'):`<div class="calc-prev"><div class="muted xs">Precio sugerido</div><div class="res-big">${money(rp)}</div><div class="res-rows"><span>Costo de la presentación</span><span>${money(cost)}</span><span>Ganancia bruta estimada</span><span class="okc">${money(m.g)}</span><span>Margen real luego del redondeo</span><span>${pct(m.margin)}</span></div></div><p class="muted xs">Es una referencia para decidir, no un precio de mercado garantizado.</p>`}`;}
  if(s===8)body=`<p>Ya tenés tu base armada. Desde el panel principal vas a ver el resumen de tu emprendimiento y accesos rápidos para seguir: cargar packaging, registrar pedidos, ventas y metas.</p>${W.recId?note('Guardamos tu receta y tu producto. Podés editarlos cuando quieras.','ok'):''}<blockquote>Conocer tus números es el primer paso para que tu emprendimiento dulce crezca con orden.</blockquote>`;
  const optional=s>=2&&s<=7;
  $('#wizard').innerHTML=`<div class="wz"><div class="wz-top"><div class="brand" style="padding:0"><small>EMPRENDE DULCE</small><strong>Configuración inicial</strong></div><button class="btn soft sm" onclick="wizFinish(true)">Saltar asistente</button></div>
  <div class="wz-dots">${WZ_T.map((_,i)=>`<i class="${i<=s?'on':''}"></i>`).join('')}</div>
  <div class="card"><p class="muted xs">Paso ${s+1} de ${WZ_T.length}</p><h2>${WZ_T[s]}</h2><div class="mt">${body}</div>
  <div class="wz-foot"><div>${s>0?`<button class="btn soft" onclick="W.step--;wizRender()">Atrás</button>`:''}</div><div class="actions">${optional?`<button class="btn ghost" onclick="wizSkip()">Omitir este paso</button>`:''}<button class="btn" onclick="wizNext()">${s===8?'Ir al panel principal':'Continuar'} ${ic('arrow',18)}</button></div></div></div></div>`;
  window.scrollTo(0,0);
}
function wizAddIng(){
  const n=V('w_in').trim(),p=V('w_ip'),q=num(V('w_iq')),u=V('w_iu');
  if(!n)return err('Ingresá el nombre del ingrediente.');if(!(q>0))return err('La cantidad debe ser mayor que cero.');if(isBlank(p)||num(p)<0)return err('Ingresá un precio válido.');
  const base=UNITS[u].d==='m'?'g':UNITS[u].d==='v'?'ml':'u';
  S.ingredients.push({id:uid(),nombre:n,categoria:'Otros insumos',marca:'',proveedor:'',unidadCompra:u,cantidadCompra:q,precioTotal:num(p),unidadUso:base,stockInicial:0,stockMin:0,notas:'',fecha:todayStr(),creado:new Date().toISOString(),historial:[{fecha:todayStr(),cantidad:q,unidad:u,precio:num(p)}]});
  save('Ingrediente agregado');wizRender();
}
function wizSkip(){if(W.step===3||W.step===4||W.step===5){W.step=8}else W.step++;wizRender()}
function wizNext(){
  const s=W.step;
  if(s===0){const n=V('w_neg').trim();if(!n)return err('Ingresá el nombre de tu emprendimiento.');S.profile.negocio=n;S.profile.nombre=V('w_nom').trim();save()}
  if(s===1){if(num(V('w_vh'))<0||num(V('w_gf'))<0)return err('Los valores no pueden ser negativos.');S.profile.moneda=V('w_mon');S.profile.valorHora=num(V('w_vh'));S.profile.gastosFijosMes=num(V('w_gf'));save()}
  if(s===3){if(!S.ingredients.length){W.step=8;return wizRender()}if(!W.rec.nombre.trim())return err('Poné un nombre a la receta.');if(!W.rec.items.length)return err('Agregá al menos un ingrediente.');if(W.rec.items.some(i=>!i.ingId||!(num(i.cantidad)>0)))return err('Completá ingrediente y cantidad en cada línea.')}
  if(s===4&&!(num(W.rec.rendimiento)>0))return err('El rendimiento debe ser mayor que cero.');
  if(s===5&&(num(W.rec.moMin)<0||num(W.rec.indirectos)<0))return err('Los valores no pueden ser negativos.');
  if(s===6&&!W.recId){
    const now=new Date().toISOString();const r={id:uid(),nombre:W.rec.nombre.trim(),desc:'',items:W.rec.items.map(i=>({ingId:i.ingId,cantidad:num(i.cantidad),unidad:i.unidad})),rendimiento:num(W.rec.rendimiento),tPrep:'',tCoc:'',moMin:num(W.rec.moMin),indirectos:num(W.rec.indirectos),packaging:[],notas:'',creado:now,mod:now,archivada:false,versiones:[]};
    const rc=recipeCost(r);r.versiones.push({fecha:now,unit:rc.unit,total:rc.total,rend:r.rendimiento,nota:'Versión inicial',provisional:rc.provisional});
    S.recipes.push(r);W.recId=r.id;save('Receta guardada');
  }
  if(s===7&&W.recId&&!W.prodId){
    const r=REC(W.recId);const q={individual:1,media:6,docena:12}[W.tipo];const rc=recipeCost(r);const cost=rc.unit!=null?rc.unit*q:null;const pr=cost?priceFrom(cost,'margen',W.margen,0):{};
    if(pr.err)return err(pr.err);
    const price=pr.price?roundUp(pr.price,W.red):0;
    const p={id:uid(),nombre:r.nombre+' · '+({individual:'Individual',media:'Media docena',docena:'Docena'}[W.tipo]),sabor:'',desc:'',tipoPres:W.tipo,items:[{recetaId:r.id,cant:q}],packaging:[],extras:0,precio:price,activo:true,notas:'',precios:[{fecha:todayStr(),precio:price}],creado:new Date().toISOString()};
    S.products.push(p);W.prodId=p.id;save('Producto creado');
  }
  if(s===8)return wizFinish();
  W.step++;wizRender();
}
function wizFinish(skip){S.profile.onboarded=true;save();LS.del('med_wiz');W=null;VIEW='panel';showApp();if(skip)toast('Podés volver al asistente desde Mi cuenta.')}
function restartWizard(){S.profile.onboarded=false;save();startWizard()}
