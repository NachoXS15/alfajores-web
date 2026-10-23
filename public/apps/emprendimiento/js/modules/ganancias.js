/* Mi Emprendimiento Dulce · Ganancias y simulador */
'use strict';
/* =========================================================
   GANANCIAS Y SIMULADOR
   ========================================================= */
let SIM=Object.assign({prodId:'',costo:'',precio:'',qty:50,extra:0,com:'',fixed:'',periodo:'Mes',objetivo:''},LS.get('med_sim',{}));
VIEWS.ganancias=()=>{
  const t=curTab('ganancias','sim');
  return pageHead('Ganancias y simulador','Simulá escenarios de venta, calculá tu punto de equilibrio y registrá los gastos del negocio.')+tabs('ganancias',[['sim','Simulador'],['esc','Escenarios guardados'],['gastos','Gastos del negocio']])+(t==='sim'?simView():t==='esc'?escView():gastosView());
};
function simBase(){
  const p=SIM.prodId?PROD(SIM.prodId):null;let cost,warn=[],units=1;
  if(p){const pc=productCost(p);cost=pc.total;warn=pc.warn;units=pc.units||1}else cost=num(SIM.costo);
  const price=isBlank(SIM.precio)?(p?num(p.precio):0):num(SIM.precio);
  const com=isBlank(SIM.com)?num(S.profile.comisionDef):num(SIM.com);
  const fixed=isBlank(SIM.fixed)?num(S.profile.gastosFijosMes):num(SIM.fixed);
  return{p,cost,warn,units,price,com,fixed};
}
function simView(){
  const prods=S.products.filter(p=>p.activo!==false);if(SIM.prodId&&!PROD(SIM.prodId))SIM.prodId='';
  const b=simBase();
  return `<div class="split"><div class="card"><h3>${ic('chart')} Escenario</h3>
  ${fld('Producto',sel('',[['','Sin producto: ingresar costo manual'],...prods.map(p=>[p.id,p.nombre])],SIM.prodId,`onchange="SIM.prodId=this.value;SIM.precio='';LS.set('med_sim',SIM);render()"`))}
  ${SIM.prodId?`<p class="muted xs mb">Costo de la presentación: <strong>${money(b.cost)}</strong> · ${b.units} alfajor(es)</p>`:fld('Costo variable por presentación',`<input type="number" inputmode="decimal" min="0" value="${esc(SIM.costo)}" oninput="sset('costo',this.value)">`)}
  <div class="grid2">${fld('Precio de venta',`<input type="number" inputmode="decimal" min="0" value="${esc(isBlank(SIM.precio)?(b.p?num(b.p.precio)||'':''):SIM.precio)}" oninput="sset('precio',this.value)">`)}${fld('Cantidad a vender',`<input type="number" inputmode="numeric" min="0" value="${esc(SIM.qty)}" oninput="sset('qty',this.value)">`,'Presentaciones en el período')}</div>
  <div class="grid2">${fld('Otros costos variables por unidad',`<input type="number" inputmode="decimal" min="0" value="${esc(SIM.extra)}" oninput="sset('extra',this.value)">`,'Ej: envío incluido')}${fld('Comisiones e impuestos (%)',`<input type="number" inputmode="decimal" min="0" max="99" value="${esc(isBlank(SIM.com)?S.profile.comisionDef:SIM.com)}" oninput="sset('com',this.value)">`)}</div>
  <div class="grid2">${fld('Gastos fijos del período',`<input type="number" inputmode="decimal" min="0" value="${esc(isBlank(SIM.fixed)?S.profile.gastosFijosMes:SIM.fixed)}" oninput="sset('fixed',this.value)">`)}${fld('Período de análisis',sel('',['Día','Semana','Mes','Temporada'],SIM.periodo,`onchange="sset('periodo',this.value)"`))}</div>
  ${fld('Resultado operativo que querés alcanzar',`<input type="number" inputmode="decimal" min="0" value="${esc(SIM.objetivo)}" oninput="sset('objetivo',this.value)">`,'Opcional: calculamos cuántas unidades necesitarías vender.')}
  </div><div id="simOut">${simOut()}</div></div>`;
}
function sset(k,v){SIM[k]=v;LS.set('med_sim',SIM);const e=$('#simOut');if(e)e.innerHTML=simOut()}
function simOut(){
  const b=simBase();
  if(!(b.cost>0))return `<div class="card">${note(b.p?'El producto no tiene costo calculable todavía.':'Ingresá un costo para simular.','warn')}${warnList(b.warn)}</div>`;
  if(!(b.price>0))return `<div class="card">${note('Ingresá un precio de venta.','warn')}</div>`;
  if(b.com>=100)return `<div class="card">${note('Las comisiones deben ser menores a 100%.','bad')}</div>`;
  const s=simulate({price:b.price,cost:b.cost,qty:SIM.qty,extra:SIM.extra,com:b.com,fixed:b.fixed,objetivo:SIM.objetivo});
  const q=num(SIM.qty);
  let h=`<div class="card"><h3>Resultado estimado · ${esc(SIM.periodo)}</h3>
  <div class="kpis" style="grid-template-columns:1fr 1fr">${kpi('Ingresos estimados (facturación)',money(s.ing))}${kpi('Resultado operativo estimado',money(s.res),s.res<0?'neg':'pos')}</div>
  <div class="res-rows"><span>Ingresos estimados</span><span>${money(s.ing)}</span><span>Comisiones e impuestos</span><span>− ${money(s.comT)}</span><span>Costos variables (producto + otros)</span><span>− ${money(s.varT-s.comT)}</span><span class="strong">Ganancia bruta estimada</span><span class="strong">${money(s.bruta)}</span><span>Gastos fijos del período</span><span>− ${money(b.fixed)}</span><span class="strong">Resultado operativo estimado</span><span class="strong ${s.res<0?'badc':'okc'}">${money(s.res)}</span>
  <span>Margen de contribución por presentación</span><span class="${s.contribU<=0?'badc':''}">${money(s.contribU)} (${pct(s.contribRatio)})</span><span>Ganancia estimada por presentación</span><span>${money(s.contribU)}</span><span>Ganancia estimada por alfajor</span><span>${money(s.contribU/b.units)}</span></div>
  <h4 class="sub">Punto de equilibrio</h4>${s.pe==null?note('Con este precio y estos costos el margen de contribución es cero o negativo: <strong>no se puede alcanzar el punto de equilibrio</strong>. Revisá el precio o los costos.','bad'):`<p>Necesitás vender <strong>${fnum(Math.ceil(s.pe-1e-9),0)} presentaciones</strong> (${money(Math.ceil(s.pe-1e-9)*b.price)}) para cubrir los gastos fijos.</p><div class="formula">Punto de equilibrio = gastos fijos ÷ contribución unitaria = ${money(b.fixed)} ÷ ${money(s.contribU)}</div>`}
  ${num(SIM.objetivo)>0&&s.meta!=null?`<h4 class="sub">Meta de resultado</h4><p>Para lograr un resultado operativo de <strong>${money(num(SIM.objetivo))}</strong> necesitarías vender <strong>${fnum(Math.ceil(s.meta-1e-9),0)} presentaciones</strong>.</p>`:''}
  ${warnList(b.warn)}
  <button class="btn ghost block mt" onclick="saveScenario()">${ic('plus')} Guardar escenario para comparar</button></div>`;
  const rows=[.5,1,1.5,2].map(f=>Math.round(q*f)).filter((v,i,a)=>v>0&&a.indexOf(v)===i);
  if(rows.length)h+=`<div class="card"><h3>Diferentes cantidades</h3><div class="tbl"><table style="min-width:0"><thead><tr><th class="r">Cantidad</th><th class="r">Ingresos</th><th class="r">Ganancia bruta</th><th class="r">Resultado</th></tr></thead><tbody>${rows.map(n=>{const x=simulate({price:b.price,cost:b.cost,qty:n,extra:SIM.extra,com:b.com,fixed:b.fixed});return `<tr><td class="r">${n}</td><td class="r">${money(x.ing)}</td><td class="r">${money(x.bruta)}</td><td class="r ${x.res<0?'badc':'okc'}"><strong>${money(x.res)}</strong></td></tr>`}).join('')}</tbody></table></div></div>`;
  h+=`<div class="card"><h3>Conceptos que no hay que mezclar</h3><div class="res-rows" style="grid-template-columns:auto 1fr"><span class="strong">Facturación</span><span style="text-align:left;font-weight:400">Importe de las ventas.</span><span class="strong">Cobros</span><span style="text-align:left;font-weight:400">Dinero efectivamente recibido.</span><span class="strong">Ganancia bruta</span><span style="text-align:left;font-weight:400">Ingresos menos costos variables definidos.</span><span class="strong">Resultado operativo</span><span style="text-align:left;font-weight:400">Ganancia bruta menos gastos fijos contemplados.</span><span class="strong">Flujo de caja</span><span style="text-align:left;font-weight:400">Entradas y salidas de dinero registradas.</span></div>${note('Si vendés varios productos, el punto de equilibrio real depende de la combinación de productos vendidos y de sus márgenes. Todos los valores son estimaciones, no resultados asegurados.')}</div>`;
  return h;
}
function saveScenario(){
  const b=simBase();const s=simulate({price:b.price,cost:b.cost,qty:SIM.qty,extra:SIM.extra,com:b.com,fixed:b.fixed,objetivo:SIM.objetivo});
  S.scenarios.push({id:uid(),fecha:new Date().toISOString(),nombre:(b.p?b.p.nombre:'Costo manual')+' · '+fnum(num(SIM.qty),0)+' u.',periodo:SIM.periodo,precio:b.price,costo:b.cost,qty:num(SIM.qty),extra:num(SIM.extra),com:b.com,fixed:b.fixed,ing:s.ing,bruta:s.bruta,res:s.res,pe:s.pe});
  save('Escenario guardado');
}
function escView(){
  if(!S.scenarios.length)return emptyState('chart','No guardaste escenarios','En el simulador, tocá "Guardar escenario" para comparar distintas cantidades, precios o costos.',`<button class="btn" onclick="TAB.ganancias='sim';render()">Ir al simulador</button>`);
  return `<div class="tbl"><table><thead><tr><th>Escenario</th><th class="r">Precio</th><th class="r">Costo</th><th class="r">Cant.</th><th class="r">Ingresos</th><th class="r">Ganancia bruta</th><th class="r">Gastos fijos</th><th class="r">Resultado</th><th class="r">Equilibrio</th><th></th></tr></thead><tbody>${S.scenarios.map(x=>`<tr><td><strong>${esc(x.nombre)}</strong><div class="muted xs">${esc(x.periodo)} · ${fdate(x.fecha)}</div></td><td class="r">${money(x.precio)}</td><td class="r">${money(x.costo)}</td><td class="r">${x.qty}</td><td class="r">${money(x.ing)}</td><td class="r">${money(x.bruta)}</td><td class="r">${money(x.fixed)}</td><td class="r ${x.res<0?'badc':'okc'}"><strong>${money(x.res)}</strong></td><td class="r">${x.pe==null?'No alcanzable':fnum(Math.ceil(x.pe-1e-9),0)+' u.'}</td><td class="acts">${ibtn('trash',`S.scenarios=S.scenarios.filter(s=>s.id!=='${x.id}');save();render()`,'Eliminar','del')}</td></tr>`).join('')}</tbody></table></div>`;
}
const CATS_GASTO=['Alquiler','Servicios (luz, gas, internet)','Monotributo e impuestos','Publicidad','Transporte','Herramientas y equipamiento','Capacitación','Otros'];
function gastosView(){
  const R=periodRange('mes');const mes=gastosIn(R);
  return `<div class="split"><div class="card"><h3>Registrar gasto</h3>
  <div class="grid2">${fld('Fecha',inp('g_f',todayStr(),'date'))}${fld('Importe *',inp('g_m','','number','min="0"'))}</div>
  ${fld('Concepto *',inp('g_c','','text','placeholder="Ej: Factura de gas"'))}${fld('Categoría',sel('g_cat',CATS_GASTO,CATS_GASTO[0]))}
  <button class="btn block" onclick="addGasto()">${ic('plus')} Registrar gasto</button>
  <p class="muted xs mt">Registrá aquí los gastos operativos que no forman parte del costo directo de cada receta, para no contarlos dos veces.</p></div>
  <div class="card"><div class="card-head"><h3>Gastos registrados</h3>${badge('Este mes: '+money(mes),'acc')}</div>
  ${mes>0?`<button class="btn soft sm mb" onclick="S.profile.gastosFijosMes=${mes};save('Gastos fijos mensuales actualizados');">Usar ${money(mes)} como gastos fijos mensuales</button>`:''}
  ${S.expenses.length?[...S.expenses].sort((a,b)=>b.fecha.localeCompare(a.fecha)).slice(0,60).map(e=>`<div class="list-row"><div><strong>${esc(e.concepto)}</strong><div class="muted xs">${fdate(e.fecha)} · ${esc(e.categoria)}</div></div><div style="display:flex;align-items:center;gap:4px"><strong>${money(num(e.monto))}</strong>${ibtn('trash',`delGasto('${e.id}')`,'Eliminar','del')}</div></div>`).join(''):'<p class="muted">Todavía no registraste gastos.</p>'}</div></div>`;
}
function addGasto(){const m=V('g_m'),c=V('g_c').trim();if(!c)return err('Ingresá el concepto.');if(!(num(m)>0))return err('El importe debe ser mayor que cero.');S.expenses.push({id:uid(),fecha:V('g_f')||todayStr(),concepto:c,categoria:V('g_cat'),monto:r2(num(m))});save('Gasto registrado');render()}
function delGasto(id){confirmDlg('¿Eliminar este gasto?',()=>{S.expenses=S.expenses.filter(e=>e.id!==id);save('Gasto eliminado');render()},{danger:true,okText:'Eliminar'})}
