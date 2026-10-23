/* Mi Emprendimiento Dulce · Panel principal */
'use strict';
/* =========================================================
   PANEL PRINCIPAL
   ========================================================= */
VIEWS.panel=()=>{
  const P=S.profile;const per=fv('per','mes');const R=periodRange(per);
  const head=pageHead(`Hola${P.nombre?', '+esc(P.nombre):''}`,P.negocio?`Resumen de <strong>${esc(P.negocio)}</strong> con tus datos reales.`:'Resumen de tu emprendimiento.',fsel('per',[['dia','Hoy'],['semana','Esta semana'],['mes','Este mes'],['anio','Este año']],'mes','Período')+``);
  const quick=`<div class="card"><h3>Accesos rápidos</h3><div class="quick">
    <button onclick="go('recetas');setTimeout(()=>editRecipe(),50)">${ic('book')}Crear una receta</button>
    <button onclick="go('ingredientes');setTimeout(()=>editIng(),50)">${ic('jar')}Registrar un ingrediente</button>
    <button onclick="TAB.productos='calc';go('productos')">${ic('calc')}Calcular un precio</button>
    <button onclick="go('pedidos');setTimeout(()=>editOrder(),50)">${ic('clip')}Crear un pedido</button>
    <button onclick="go('ventas');setTimeout(()=>editSale(),50)">${ic('cash')}Registrar una venta</button>
    <button onclick="go('informes')">${ic('file')}Consultar un informe</button></div></div>`;
  const empty=!S.ingredients.length&&!S.recipes.length&&!S.products.length&&!S.orders.length&&!S.sales.length;
  if(empty)return head+emptyState('home','Tu panel se completa con tus datos','Todavía no hay información cargada, por eso no mostramos indicadores. Seguí estos tres pasos para tener tu primer costo y precio:',`<div class="actions" style="justify-content:center"><button class="btn" onclick="go('ingredientes');setTimeout(()=>editIng(),50)">1 · Cargar ingredientes</button><button class="btn ghost" onclick="go('recetas')">2 · Crear una receta</button><button class="btn ghost" onclick="go('productos')">3 · Definir un precio</button></div><p class="mt"><button class="btn soft sm" onclick="restartWizard()">Abrir el asistente guiado</button></p>`)+`<div class="mt">${quick}</div>`;
  const sales=S.sales.filter(s=>inR(s.fecha,R));
  const fact=sum(sales,saleTotal),cob=cobradoIn(R),gan=sum(sales,saleProfit);
  const pend=S.orders.filter(ORDER_OPEN);const t=todayStr(),lim=addDays(t,7);
  const prox=pend.filter(o=>o.entrega&&o.entrega>=t&&o.entrega<=lim).sort((a,b)=>a.entrega.localeCompare(b.entrega));
  const vencidos=pend.filter(o=>o.entrega&&o.entrega<t);
  const low=lowStock();const porCobrar=totalPorCobrar();
  const prods=S.products.filter(p=>p.activo!==false);
  let h=head+`<div class="kpis">
    ${kpi('Recetas registradas',S.recipes.filter(r=>!r.archivada).length)}
    ${kpi('Productos activos',prods.length)}
    ${kpi('Facturación · '+PER_LBL[per],money(fact),'acc',sales.length+' venta(s) registrada(s)')}
    ${kpi('Dinero cobrado · '+PER_LBL[per],money(cob),'','Cobros confirmados')}
    ${kpi('Ganancia bruta estimada',money(gan),gan<0?'neg':'pos',sales.some(saleProvisional)?'Incluye costos provisionales':'Ventas − costos − comisiones')}
    ${kpi('Pedidos pendientes',pend.length,'',prox.length+' para los próximos 7 días')}
    ${kpi('Por cobrar',money(porCobrar),porCobrar>0?'neg':'','Pedidos y ventas con saldo')}
    ${kpi('Stock bajo',low.length,low.length?'neg':'','Ingredientes y materiales')}
  </div>`;
  h+=`<div class="split"><div>`;
  h+=`<div class="card"><div class="card-head"><h3>Tus productos</h3><button class="btn soft sm" onclick="go('productos')">Ver todos</button></div>`+
    (prods.length?`<div class="tbl"><table style="min-width:440px"><thead><tr><th>Producto</th><th class="r">Costo</th><th class="r">Precio</th><th class="r">Ganancia</th><th class="r">Margen</th></tr></thead><tbody>${prods.slice(0,8).map(p=>{const pc=productCost(p);const m=pc.total!=null&&num(p.precio)>0?priceMetrics(pc.total,num(p.precio),0):null;return `<tr><td><strong>${esc(p.nombre)}</strong> ${pc.provisional?badge('Provisional','warn'):''}<div class="muted xs">${pc.units} alfajor(es) · ${money(pc.unitCost)} c/u</div></td><td class="r">${money(pc.total)}</td><td class="r">${num(p.precio)>0?money(num(p.precio)):badge('Sin precio','warn')}</td><td class="r ${m&&m.g<0?'badc':'okc'}">${m?money(m.g):'—'}</td><td class="r">${m?pct(m.margin):'—'}</td></tr>`}).join('')}</tbody></table></div>`:`<p class="muted">Todavía no creaste productos. <a href="#" onclick="go('productos');return false">Crear un producto</a></p>`)+`</div>`;
  h+=`<div class="card"><div class="card-head"><h3>Próximas entregas</h3><button class="btn soft sm" onclick="go('pedidos')">Pedidos</button></div>`+
    (vencidos.length?note(`${ic('alert',16)} Tenés ${vencidos.length} pedido(s) con fecha de entrega vencida sin marcar como entregado.`,'bad'):'')+
    (prox.length?prox.slice(0,6).map(o=>`<div class="list-row"><div><strong>#${o.num} · ${esc(o.clienteNombre||'Sin cliente')}</strong><div class="muted xs">${fdate(o.entrega)} · ${esc(o.estado)}</div></div><div class="r"><div>${money(orderTotal(o))}</div>${orderSaldo(o)>0?`<div class="badc xs">Saldo ${money(orderSaldo(o))}</div>`:'<div class="okc xs">Pagado</div>'}</div></div>`).join(''):'<p class="muted">No hay entregas en los próximos 7 días.</p>')+`</div>`;
  h+=`</div><div>`;
  h+=`<div class="card"><div class="card-head"><h3>Metas</h3><button class="btn soft sm" onclick="go('metas')">Ver metas</button></div>`+(S.goals.length?S.goals.slice(0,4).map(g=>{const R2=periodRange(g.periodo);const a=metricIn(g.tipo,R2);const p=num(g.objetivo)>0?Math.min(1,a/num(g.objetivo)):0;return `<div class="mb"><div class="list-row" style="border:0;padding:4px 0"><span>${esc(GOAL_T[g.tipo][0])} · ${PER_LBL[g.periodo]}</span><strong>${pct(p)}</strong></div><div class="bar ${p>=1?'ok':''}"><i style="width:${p*100}%"></i></div></div>`}).join(''):'<p class="muted">Creá una meta para seguir tu avance.</p>')+`</div>`;
  h+=`<div class="card"><div class="card-head"><h3>Stock bajo</h3><button class="btn soft sm" onclick="go('inventario')">Inventario</button></div>`+(low.length?low.slice(0,8).map(x=>`<div class="list-row"><span>${esc(x.it.nombre)}</span><span class="badc xs">${x.kind==='ing'?fq(x.s,x.u):fnum(x.s)+' '+esc(x.it.unidad||'u.')} (mín. ${x.kind==='ing'?fq(x.mn,x.u):fnum(x.mn)})</span></div>`).join(''):'<p class="muted">Sin alertas. Definí stock mínimo en tus ingredientes y materiales para recibir avisos.</p>')+`</div>`;
  h+=`</div></div><div class="mt">${quick}</div>`;
  h+=note('Las ganancias que ves son <strong>estimaciones</strong> calculadas con los costos que cargaste. No garantizan ingresos.','info');
  return h;
};
