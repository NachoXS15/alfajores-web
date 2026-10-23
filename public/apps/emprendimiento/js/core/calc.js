/* Mi Emprendimiento Dulce · Lógica de negocio: costos, precios, simulador, ventas, inventario y métricas */
'use strict';
/* =========================================================
   LÓGICA DE NEGOCIO (fórmulas documentadas)
   ========================================================= */
/* Costo por unidad base (g, ml o unidad) = precio total / cantidad comprada convertida a unidad base */
function ingCostBase(g){
  if(!g||isBlank(g.precioTotal))return null;
  const q=toBase(g.cantidadCompra,g.unidadCompra),p=num(g.precioTotal);
  if(!(q>0)||p<0)return null;
  return p/q;
}
/* Costo por unidad de material = precio total / cantidad comprada */
function matCostU(m){
  if(!m||isBlank(m.precioTotal))return null;
  const q=num(m.cantidadCompra),p=num(m.precioTotal);
  return q>0&&p>=0?p/q:null;
}
/* Costo de receta:
   ingredientes = Σ (cantidad convertida × costo por unidad base)
   mano de obra = minutos de trabajo / 60 × valor hora
   indirectos  = importe asignado por tanda (gas, luz, etc.)
   packaging individual = Σ costo material × cantidad por alfajor × rendimiento
   costo unitario = costo total de la tanda / rendimiento */
function recipeCost(r){
  const warn=[],lines=[];let ing=0;
  (r.items||[]).forEach(it=>{
    const g=ING(it.ingId);let c=null;
    if(!g)warn.push('Hay un ingrediente sin seleccionar o eliminado');
    else if(!compat(it.unidad,g.unidadCompra))warn.push(`Unidad incompatible en ${g.nombre} (se compra en ${UNITS[g.unidadCompra].l})`);
    else if(!(num(it.cantidad)>0))warn.push(`Falta la cantidad de ${g.nombre}`);
    else{const cb=ingCostBase(g);if(cb==null)warn.push(`Falta el precio de ${g.nombre}`);else c=toBase(it.cantidad,it.unidad)*cb}
    if(c!=null)ing+=c;
    lines.push({...it,g,costo:c});
  });
  if(!(r.items||[]).length)warn.push('La receta todavía no tiene ingredientes');
  const rend=num(r.rendimiento);
  if(!(rend>0))warn.push('El rendimiento debe ser mayor que cero');
  const vh=num(S.profile.valorHora);
  if(num(r.moMin)>0&&!(vh>0))warn.push('Cargá el valor de tu hora de trabajo en Mi cuenta para incluir la mano de obra');
  const mo=num(r.moMin)/60*vh;
  const ind=num(r.indirectos);
  let packU=0;
  (r.packaging||[]).forEach(x=>{const m=MAT(x.matId);const cu=matCostU(m);if(!m)warn.push('Hay un material de packaging sin seleccionar');else if(cu==null)warn.push(`Falta el costo de ${m.nombre}`);else packU+=cu*num(x.cant)});
  const pack=rend>0?packU*rend:0;
  const total=ing+mo+ind+pack;
  const unit=rend>0?total/rend:null;
  return{lines,ing,mo,ind,packU,pack,total,unit,rend,warn:[...new Set(warn)],provisional:warn.length>0};
}
const productUnits=p=>sum(p.items||[],i=>num(i.cant));
/* Costo de presentación = Σ (costo unitario de receta × cantidad) + packaging de la presentación + otros costos.
   El packaging individual ya está en el costo unitario de la receta: no se vuelve a sumar. */
function productCost(p){
  const warn=[];let prod=0,ok=true;
  (p.items||[]).forEach(it=>{
    const r=REC(it.recetaId);
    if(!r){warn.push('Hay una receta sin seleccionar o eliminada');ok=false;return}
    if(!(num(it.cant)>0)){warn.push(`Falta la cantidad de ${r.nombre}`);ok=false;return}
    const rc=recipeCost(r);rc.warn.forEach(w=>warn.push(`${r.nombre}: ${w}`));
    if(rc.unit==null){ok=false;return}
    prod+=rc.unit*num(it.cant);
  });
  if(!(p.items||[]).length){warn.push('El producto no tiene recetas asociadas');ok=false}
  let pack=0;
  (p.packaging||[]).forEach(x=>{const m=MAT(x.matId);const cu=matCostU(m);if(!m)warn.push('Hay un material sin seleccionar');else if(cu==null)warn.push(`Falta el costo de ${m.nombre}`);else pack+=cu*num(x.cant)});
  const extra=num(p.extras);
  const units=productUnits(p);
  const total=ok?prod+pack+extra:null;
  return{prod,pack,extra,total,units,unitCost:total!=null&&units>0?total/units:null,warn:[...new Set(warn)],provisional:warn.length>0||!ok};
}
/* Precio de venta:
   Según margen:  precio = costo / (1 − margen − comisiones)
   Según recargo: precio = costo × (1 + recargo) / (1 − comisiones)
   (las comisiones son % que se descuentan del precio cobrado) */
function priceFrom(cost,metodo,valor,com){
  const v=num(valor)/100,c=num(com)/100;
  if(metodo==='manual'){const p=num(valor);return p>0?{price:p}:{err:'Ingresá un precio de venta mayor que cero.'}}
  if(!(cost>0))return{err:'Necesitás un costo mayor que cero para calcular el precio.'};
  if(c<0||c>=1)return{err:'Las comisiones deben ser de 0% a menos de 100%.'};
  if(metodo==='margen'){
    if(v<0||v>=1)return{err:'El margen debe ser mayor o igual a 0% y menor a 100%.'};
    if(v+c>=1)return{err:'Margen + comisiones deben sumar menos de 100%.'};
    return{price:cost/(1-v-c)};
  }
  if(v<0)return{err:'El recargo no puede ser negativo.'};
  return{price:cost*(1+v)/(1-c)};
}
/* Ganancia bruta = precio − comisiones − costo; Margen = ganancia / precio; Recargo = (precio − costo) / costo */
function priceMetrics(cost,price,com){
  const comAmt=price*num(com)/100;const g=price-comAmt-cost;
  return{comAmt,g,margin:price>0?g/price:null,markup:cost>0?(price-cost)/cost:null};
}
function roundUp(x,step){step=num(step);return step>0?Math.ceil(x/step-1e-9)*step:r2(x)}
/* Simulador: contribución unitaria = precio × (1 − comisión) − costo variable unitario
   Punto de equilibrio = gastos fijos / contribución unitaria (solo si es positiva) */
function simulate(o){
  const price=num(o.price),qty=num(o.qty),c=num(o.com)/100,fixed=num(o.fixed);
  const varU=num(o.cost)+num(o.extra);
  const ing=price*qty,comT=ing*c,varT=varU*qty+comT;
  const contribU=price*(1-c)-varU;
  const bruta=ing-varT,res=bruta-fixed;
  return{ing,comT,varT,contribU,contribRatio:price>0?contribU/price:null,bruta,res,
    pe:contribU>0?fixed/contribU:null,meta:contribU>0?(fixed+num(o.objetivo))/contribU:null};
}

/* ---------- Ventas, pedidos y cobros ---------- */
const lineSub=items=>sum(items||[],i=>num(i.cant)*num(i.precio));
const saleTotal=s=>r2(lineSub(s.items)-num(s.descuento));
const saleCost=s=>r2(sum(s.items||[],i=>num(i.cant)*num(i.costo)));
const saleCom=s=>r2(saleTotal(s)*num(s.com)/100);
const saleProfit=s=>r2(saleTotal(s)-saleCost(s)-saleCom(s));
const saleCobrado=s=>r2(sum(s.cobros||[],c=>num(c.monto)));
const saleSaldo=s=>r2(saleTotal(s)-saleCobrado(s));
const saleUnits=s=>sum(s.items||[],i=>num(i.cant)*num(i.unidades||1));
const saleProvisional=s=>(s.items||[]).some(i=>i.provisional);
const orderTotal=o=>r2(lineSub(o.items)-num(o.descuento));
const orderPaid=o=>r2(sum((o.pagos||[]).filter(p=>p.confirmado),p=>num(p.monto)));
const orderUnconfirmed=o=>r2(sum((o.pagos||[]).filter(p=>!p.confirmado),p=>num(p.monto)));
const orderSaldo=o=>r2(orderTotal(o)-orderPaid(o));
const ORDER_OPEN=o=>!o.ventaId&&o.estado!=='Cancelado'&&o.estado!=='Entregado';
const ESTADOS=['Consultado','Pendiente de confirmación','Confirmado','En preparación','Listo para entregar','Entregado','Cancelado'];
const MEDIOS=['Efectivo','Transferencia','Mercado Pago','Tarjeta de débito','Tarjeta de crédito','Otro'];
/* Saldo por cobrar total, sin duplicar: pedidos no convertidos + ventas */
function totalPorCobrar(){
  const o=sum(S.orders.filter(o=>!o.ventaId&&o.estado!=='Cancelado'),o=>Math.max(0,orderSaldo(o)));
  const s=sum(S.sales,s=>Math.max(0,saleSaldo(s)));
  return r2(o+s);
}
function snapItem(prodId,cant,precio){
  const p=PROD(prodId);const pc=p?productCost(p):{total:null,provisional:true};
  return{prodId,nombre:p?p.nombre:'Producto',cant:num(cant),precio:r2(num(precio)),costo:pc.total!=null?r2(pc.total):0,provisional:!!pc.provisional||pc.total==null,unidades:p?productUnits(p):1};
}

/* ---------- Inventario ---------- */
function stockOf(kind,id){
  const it=kind==='ing'?ING(id):MAT(id);if(!it)return 0;
  let s=num(it.stockInicial);
  for(const m of S.movements)if(m.kind===kind&&m.refId===id)s+=num(m.cantidad);
  return r4(s);
}
function addMov(kind,refId,cantidad,tipo,motivo,origen,fecha){
  S.movements.push({id:uid(),fecha:fecha||todayStr(),creado:new Date().toISOString(),kind,refId,cantidad:r4(cantidad),tipo,motivo:motivo||'',origen:origen||null});
}
const removeMovsOf=id=>{S.movements=S.movements.filter(m=>!(m.origen&&m.origen.id===id))};
function lowStock(){
  const out=[];
  S.ingredients.forEach(g=>{const s=stockOf('ing',g.id),mn=num(g.stockMin);if(mn>0&&s<=mn)out.push({kind:'ing',it:g,s,mn,u:usoU(g)})});
  S.materials.forEach(m=>{const s=stockOf('mat',m.id),mn=num(m.stockMin);if(mn>0&&s<=mn)out.push({kind:'mat',it:m,s,mn})});
  return out;
}
/* Packaging de presentación: se descuenta al registrar la venta */
function salePackMovs(sale){
  (sale.items||[]).forEach(i=>{const p=PROD(i.prodId);if(!p)return;
    (p.packaging||[]).forEach(x=>{if(MAT(x.matId)&&num(x.cant)>0)addMov('mat',x.matId,-num(x.cant)*num(i.cant),'venta','Venta #'+sale.num,{tipo:'venta',id:sale.id},sale.fecha)});
  });
}
/* Ingredientes y packaging individual: se descuentan al completar una tanda */
function batchMovs(b){
  const r=REC(b.recetaId);if(!r)return false;
  const f=num(b.unidades)/num(r.rendimiento);if(!(f>0)||!isFinite(f))return false;
  (r.items||[]).forEach(it=>{const g=ING(it.ingId);if(g&&compat(it.unidad,g.unidadCompra))addMov('ing',g.id,-toBase(it.cantidad,it.unidad)*f,'produccion','Tanda de '+r.nombre,{tipo:'tanda',id:b.id},b.fecha)});
  (r.packaging||[]).forEach(x=>{if(MAT(x.matId))addMov('mat',x.matId,-num(x.cant)*num(b.unidades),'produccion','Tanda de '+r.nombre,{tipo:'tanda',id:b.id},b.fecha)});
  return true;
}

/* ---------- Métricas por período (metas e informes) ---------- */
function cobradoIn(R){
  const s=sum(S.sales,s=>sum((s.cobros||[]).filter(c=>inR(c.fecha,R)),c=>num(c.monto)));
  const o=sum(S.orders.filter(o=>!o.ventaId),o=>sum((o.pagos||[]).filter(p=>p.confirmado&&inR(p.fecha,R)),p=>num(p.monto)));
  return r2(s+o);
}
const gastosIn=R=>r2(sum(S.expenses.filter(e=>inR(e.fecha,R)),e=>num(e.monto)));
function metricIn(tipo,R){
  const sales=S.sales.filter(s=>inR(s.fecha,R));
  switch(tipo){
    case 'facturacion':return r2(sum(sales,saleTotal));
    case 'cobrado':return cobradoIn(R);
    case 'unidades':return sum(sales,saleUnits);
    case 'pedidos':return S.orders.filter(o=>inR(o.fecha,R)&&o.estado!=='Cancelado').length;
    case 'ganancia':return r2(sum(sales,saleProfit));
    case 'resultado':return r2(sum(sales,saleProfit)-gastosIn(R));
    case 'producidos':return sum(S.batches.filter(b=>b.estado==='Completada'&&inR(b.fecha,R)),b=>num(b.unidades));
  }
  return 0;
}
const GOAL_T={
  facturacion:['Facturación','Suma de ventas registradas (no es ganancia ni dinero cobrado).',true],
  cobrado:['Dinero cobrado','Cobros efectivamente recibidos y confirmados.',true],
  unidades:['Alfajores vendidos','Unidades vendidas según ventas registradas.',false],
  pedidos:['Pedidos recibidos','Pedidos cargados en el período (sin cancelados).',false],
  ganancia:['Ganancia bruta estimada','Ventas − costos guardados en cada venta − comisiones.',true],
  resultado:['Resultado operativo estimado','Ganancia bruta estimada − gastos registrados del período.',true],
  producidos:['Alfajores elaborados','Unidades de tandas marcadas como completadas.',false]
};
