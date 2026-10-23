/* Mi Emprendimiento Dulce · Ventas y cobros */
'use strict';
/* =========================================================
   VENTAS Y COBROS
   ========================================================= */
function salesRange(){const p=fv('per','mes');if(p==='custom')return[fv('desde',periodRange('mes')[0]),fv('hasta',todayStr())];return periodRange(p)}
VIEWS.ventas=()=>{
  const head=pageHead('Ventas y cobros','Registro de ventas reales, separado de las simulaciones. Cada venta guarda el precio y el costo del momento.',`<button class="btn" onclick="editSale()">${ic('plus')} Registrar venta</button>`);
  if(!S.sales.length)return head+emptyState('cash','Todavía no registraste ventas',S.products.length?'Registrá una venta directa o convertí un pedido entregado en venta.':'Primero creá un producto con precio.',S.products.length?`<button class="btn" onclick="editSale()">${ic('plus')} Registrar venta</button>`:`<button class="btn" onclick="go('productos')">Ir a productos</button>`);
  const p=fv('per','mes');
  return head+`<div class="toolbar">${fsel('per',[['hoy','Hoy'],['semana','Esta semana'],['mes','Este mes'],['anio','Este año'],['todo','Todo'],['custom','Período personalizado']],'mes','Período').replace('onchange="setF(\'per\',this.value)"','onchange="setF(\'per\',this.value,true)"')}${p==='custom'?`<input type="date" value="${esc(fv('desde',periodRange('mes')[0]))}" onchange="setF('desde',this.value,true)" aria-label="Desde"><input type="date" value="${esc(fv('hasta',todayStr()))}" onchange="setF('hasta',this.value,true)" aria-label="Hasta">`:''}<div class="search">${ic('search',18)}<input type="search" placeholder="Buscar cliente o número" value="${esc(fv('q',''))}" oninput="setF('q',this.value)" aria-label="Buscar"></div></div><div id="list">${LISTS.ventas()}</div>`;
};
LISTS.ventas=()=>{
  const R=salesRange();
  const a=S.sales.filter(s=>inR(s.fecha,R)&&match([s.clienteNombre,'#'+s.num,s.num,s.medio])).sort((x,y)=>String(y.fecha).localeCompare(String(x.fecha))||y.num-x.num);
  const fact=sum(a,saleTotal),cob=sum(a,saleCobrado),cost=sum(a,saleCost),com=sum(a,saleCom),gan=sum(a,saleProfit);
  let h=`<div class="kpis">${kpi('Facturación registrada',money(fact),'acc',a.length+' venta(s)')}${kpi('Cobrado de estas ventas',money(cob),'pos')}${kpi('Pendiente de cobro',money(fact-cob),fact-cob>0?'neg':'')}${kpi('Costos asociados',money(cost+com),'','Producto + comisiones')}${kpi('Ganancia bruta estimada',money(gan),gan<0?'neg':'pos',a.some(saleProvisional)?'Algunos costos son provisionales':'')}</div>`;
  if(!a.length)return h+`<p class="muted pad">No hay ventas en este período.</p>`;
  h+=`<div class="tbl"><table><thead><tr><th>Venta</th><th>Fecha</th><th class="r">Total</th><th class="r">Cobrado</th><th class="r">Saldo</th><th class="r">Ganancia est.</th><th></th></tr></thead><tbody>${a.map(s=>{const sd=saleSaldo(s);return `<tr><td><strong>#${s.num}${s.clienteNombre?' · '+esc(s.clienteNombre):''}</strong><div class="muted xs">${s.items.map(i=>`${fnum(i.cant)}× ${esc(i.nombre)}`).join(', ')}${s.pedidoId?' · desde pedido':''}</div></td><td>${fdate(s.fecha)}<div class="muted xs">${esc(s.medio||'')}</div></td><td class="r">${money(saleTotal(s))}</td><td class="r okc">${money(saleCobrado(s))}</td><td class="r ${sd>0?'badc':''}">${money(sd)}</td><td class="r">${money(saleProfit(s))}${saleProvisional(s)?'<div class="warnc xs">Provisional</div>':''}</td><td class="acts">${sd>0?ibtn('dollar',`addCobro('${s.id}')`,'Registrar cobro'):''}${ibtn('eye',`viewSale('${s.id}')`,'Ver detalle')}${ibtn('trash',`delSale('${s.id}')`,'Eliminar','del')}</td></tr>`}).join('')}<tr class="tot"><td colspan="2">Totales</td><td class="r">${money(fact)}</td><td class="r">${money(cob)}</td><td class="r">${money(fact-cob)}</td><td class="r">${money(gan)}</td><td></td></tr></tbody></table></div>`;
  const days={};a.forEach(s=>{days[s.fecha]=(days[s.fecha]||0)+saleTotal(s)});const dk=Object.keys(days).sort();
  if(dk.length>1){const mx=Math.max(...Object.values(days));h+=`<div class="card mt"><h3>Ventas por día</h3><div class="minichart">${dk.map(d=>`<i class="now" style="height:${days[d]/mx*100}%" title="${fdate(d)}: ${money(days[d])}"></i>`).join('')}</div><div class="list-row muted xs" style="border:0"><span>${fdate(dk[0])}</span><span>${fdate(dk[dk.length-1])}</span></div></div>`}
  return h;
};
function editSale(){
  if(!S.products.length){toast('Primero creá un producto','warn');go('productos');return}
  D={fecha:todayStr(),clienteId:'',items:[{prodId:'',cant:1,precio:''}],descuento:'',medio:'Efectivo',cobrado:'',com:S.profile.comisionDef||0,pack:true,cobradoTodo:true};mSale();
}
function mSale(){
  const po=[['','Elegí un producto…'],...S.products.filter(p=>p.activo!==false).map(p=>[p.id,p.nombre])];
  const body=`<div class="grid2">${fld('Fecha',`<input type="date" value="${esc(D.fecha)}" onchange="D.fecha=this.value">`)}${fld('Cliente (opcional)',sel('',[['','Sin cliente'],...S.customers.map(c=>[c.id,c.nombre])],D.clienteId,`onchange="D.clienteId=this.value"`))}</div>
  <h4 class="sub">Productos vendidos</h4><div class="lines">${D.items.map((it,i)=>`<div class="line">${sel('',po,it.prodId,`onchange="sLineProd(${i},this.value)" aria-label="Producto"`)}<input type="number" inputmode="numeric" min="1" step="1" placeholder="Cant." value="${esc(it.cant)}" oninput="D.items[${i}].cant=this.value;prevSale()" aria-label="Cantidad"><input type="number" inputmode="decimal" min="0" placeholder="Precio unit." value="${esc(it.precio)}" oninput="D.items[${i}].precio=this.value;prevSale()" aria-label="Precio"><button class="icon-btn del" onclick="D.items.splice(${i},1);mSale()" aria-label="Quitar">${ic('x')}</button></div>`).join('')}</div>
  <button class="btn ghost sm" onclick="D.items.push({prodId:'',cant:1,precio:''});mSale()">${ic('plus')} Agregar producto</button>
  <div class="grid3 mt">${fld('Descuento ($)',`<input type="number" inputmode="decimal" min="0" value="${esc(D.descuento)}" oninput="D.descuento=this.value;prevSale()">`)}${fld('Medio de pago',sel('',MEDIOS,D.medio,`onchange="D.medio=this.value"`))}${fld('Comisión / impuestos (%)',`<input type="number" inputmode="decimal" min="0" max="99" value="${esc(D.com)}" oninput="D.com=this.value;prevSale()">`)}</div>
  <label class="chk"><input type="checkbox" ${D.cobradoTodo?'checked':''} onchange="D.cobradoTodo=this.checked;mSale()"> Se cobró el total en este momento</label>
  ${D.cobradoTodo?'':fld('Importe cobrado ahora',`<input type="number" inputmode="decimal" min="0" value="${esc(D.cobrado)}" oninput="D.cobrado=this.value;prevSale()">`,'El resto queda como saldo pendiente.')}
  <label class="chk"><input type="checkbox" ${D.pack?'checked':''} onchange="D.pack=this.checked"> Descontar el packaging de presentación del inventario</label>
  <div id="salePrev"></div>`;
  modal('Registrar venta',body,`<button class="btn soft" onclick="closeModal()">Cancelar</button><button class="btn" onclick="saveSale()">${ic('check')} Registrar venta</button>`,true);prevSale();
}
function sLineProd(i,v){D.items[i].prodId=v;const p=PROD(v);if(p&&isBlank(D.items[i].precio))D.items[i].precio=num(p.precio)||'';mSale()}
function prevSale(){
  const e=$('#salePrev');if(!e)return;const items=D.items.filter(i=>i.prodId).map(i=>snapItem(i.prodId,i.cant,i.precio));
  const s={items,descuento:num(D.descuento),com:num(D.com)};const t=saleTotal(s),c=saleCost(s),cm=saleCom(s);const cob=D.cobradoTodo?t:num(D.cobrado);
  e.innerHTML=`<div class="calc-prev"><div class="res-rows" style="margin:0"><span class="strong">Total de la venta</span><span class="strong">${money(t)}</span><span>Cobrado ahora</span><span class="okc">${money(cob)}</span><span>Saldo pendiente</span><span>${money(t-cob)}</span><span>Costo de productos (hoy)</span><span>${money(c)}</span><span>Comisiones</span><span>${money(cm)}</span><span class="strong">Ganancia bruta estimada</span><span class="strong ${t-c-cm<0?'badc':'okc'}">${money(t-c-cm)}</span></div></div>${items.some(i=>i.provisional)?note('Algún producto tiene costo provisional: la ganancia se marcará como estimación incompleta.','warn'):''}`;
}
function saveSale(){
  const items=D.items.filter(i=>i.prodId);
  if(!items.length)return err('Agregá al menos un producto.');
  if(items.some(i=>!(num(i.cant)>0)))return err('Las cantidades deben ser mayores que cero.');
  if(items.some(i=>isBlank(i.precio)||num(i.precio)<0))return err('Completá el precio de cada producto.');
  const sub=lineSub(items);if(num(D.descuento)<0||num(D.descuento)>sub)return err('Descuento inválido.');
  if(num(D.com)<0||num(D.com)>=100)return err('Comisión inválida.');
  const total=r2(sub-num(D.descuento));const cob=D.cobradoTodo?total:r2(num(D.cobrado));
  if(cob<0||cob>total)return err('El importe cobrado no puede superar el total.');
  S.seq.sale++;const c=CLI(D.clienteId);
  const s={id:uid(),num:S.seq.sale,fecha:D.fecha||todayStr(),clienteId:D.clienteId,clienteNombre:c?c.nombre:'',items:items.map(i=>snapItem(i.prodId,i.cant,i.precio)),descuento:r2(num(D.descuento)),medio:D.medio,com:num(D.com),cobros:cob>0?[{fecha:D.fecha||todayStr(),monto:cob,medio:D.medio}]:[],pedidoId:null,creado:new Date().toISOString(),packDesc:!!D.pack};
  S.sales.push(s);if(s.packDesc)salePackMovs(s);
  save('Venta #'+s.num+' registrada');closeModal();render();
}
function addCobro(id){const s=byId(S.sales,id);D={id};modal('Registrar cobro · Venta #'+s.num,`<p class="muted mb">Saldo pendiente: <strong>${money(saleSaldo(s))}</strong></p><div class="grid2">${fld('Importe',inp('cb_m',saleSaldo(s),'number','min="0"'))}${fld('Fecha',inp('cb_f',todayStr(),'date'))}</div>${fld('Medio de pago',sel('cb_md',MEDIOS,s.medio||'Efectivo'))}`,`<button class="btn soft" onclick="closeModal()">Cancelar</button><button class="btn" onclick="saveCobro()">${ic('check')} Registrar cobro</button>`)}
function saveCobro(){const s=byId(S.sales,D.id),m=r2(num(V('cb_m')));if(!(m>0))return err('El importe debe ser mayor que cero.');if(m>saleSaldo(s)+0.001)return err('El importe supera el saldo pendiente.');s.cobros=s.cobros||[];s.cobros.push({fecha:V('cb_f')||todayStr(),monto:m,medio:V('cb_md')});save('Cobro registrado');closeModal();render()}
function viewSale(id){const s=byId(S.sales,id);modal('Venta #'+s.num,`<p class="muted mb">${fdate(s.fecha)}${s.clienteNombre?' · '+esc(s.clienteNombre):''}${s.pedidoId?' · Generada desde un pedido':''}</p><div class="tbl"><table style="min-width:0"><thead><tr><th>Producto</th><th class="r">Cant.</th><th class="r">Precio</th><th class="r">Costo guardado</th></tr></thead><tbody>${s.items.map(i=>`<tr><td>${esc(i.nombre)}${i.provisional?' '+badge('Provisional','warn'):''}</td><td class="r">${fnum(i.cant)}</td><td class="r">${money(i.precio)}</td><td class="r">${money(i.costo)}</td></tr>`).join('')}</tbody></table></div>
<div class="res-rows mt"><span>Descuento</span><span>${money(num(s.descuento))}</span><span class="strong">Total</span><span class="strong">${money(saleTotal(s))}</span><span>Costo de productos</span><span>${money(saleCost(s))}</span><span>Comisiones (${fnum(num(s.com),1)}%)</span><span>${money(saleCom(s))}</span><span class="strong">Ganancia bruta estimada</span><span class="strong">${money(saleProfit(s))}</span></div>
<h4 class="sub">Cobros</h4>${(s.cobros||[]).length?s.cobros.map(c=>`<div class="list-row"><span>${fdate(c.fecha)} · ${esc(c.medio||'')}</span><strong class="okc">${money(num(c.monto))}</strong></div>`).join(''):'<p class="muted">Sin cobros registrados.</p>'}<p class="muted xs mt">Los precios y costos de esta venta quedaron guardados al momento de registrarla y no cambian si actualizás precios.</p>`,`<button class="btn soft" onclick="closeModal()">Cerrar</button>`)}
function delSale(id){const s=byId(S.sales,id);confirmDlg(`¿Eliminar la venta <strong>#${s.num}</strong>? Se revertirán sus descuentos de packaging en el inventario${s.pedidoId?' y el pedido volverá a quedar pendiente de convertir':''}.`,()=>{S.sales=S.sales.filter(x=>x.id!==id);removeMovsOf(id);S.orders.forEach(o=>{if(o.ventaId===id)o.ventaId=null});save('Venta eliminada');render()},{danger:true,okText:'Eliminar'})}
