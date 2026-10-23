/* Mi Emprendimiento Dulce · Pedidos y clientes */
'use strict';
/* =========================================================
   PEDIDOS Y CLIENTES
   ========================================================= */
const estBadge=e=>badge(esc(e),e==='Entregado'?'ok':e==='Cancelado'?'bad':e==='Listo para entregar'?'acc':e==='Confirmado'||e==='En preparación'?'warn':'');
VIEWS.pedidos=()=>{
  const t=curTab('pedidos','ped');
  return pageHead('Pedidos y clientes','Registrá pedidos, señas y entregas. El saldo pendiente se calcula solo con los pagos confirmados.',t==='ped'?`<button class="btn" onclick="editOrder()">${ic('plus')} Nuevo pedido</button>`:`<button class="btn" onclick="editClient()">${ic('plus')} Nuevo cliente</button>`)+tabs('pedidos',[['ped','Pedidos'],['cli','Clientes']])+(t==='ped'?ordersView():clientsView());
};
function ordersView(){
  if(!S.orders.length)return emptyState('clip','Todavía no hay pedidos',S.products.length?'Cargá el primer pedido con cliente, fecha de entrega, productos y seña.':'Primero creá un producto con precio, así podés agregarlo al pedido.',S.products.length?`<button class="btn" onclick="editOrder()">${ic('plus')} Crear pedido</button>`:`<button class="btn" onclick="go('productos')">Ir a productos</button>`);
  const t=todayStr();const open=S.orders.filter(ORDER_OPEN);
  const prox=open.filter(o=>o.entrega&&o.entrega>=t&&o.entrega<=addDays(t,3)).length,venc=open.filter(o=>o.entrega&&o.entrega<t).length;
  const saldo=sum(S.orders.filter(o=>!o.ventaId&&o.estado!=='Cancelado'),o=>Math.max(0,orderSaldo(o)));
  return `<div class="kpis">${kpi('Pedidos abiertos',open.length)}${kpi('Entregas en 3 días',prox,prox?'acc':'')}${kpi('Entregas vencidas',venc,venc?'neg':'')}${kpi('Saldos pendientes',money(saldo),saldo>0?'neg':'','Sin contar pedidos ya convertidos en venta')}</div>`+
  searchBar('Buscar por cliente o número',fsel('est',[['abiertos','Pedidos abiertos'],['','Todos los estados'],...ESTADOS.map(e=>[e,e])],'abiertos','Estado')+fsel('ord',[['entrega','Próxima entrega'],['fecha','Fecha de pedido'],['saldo','Mayor saldo']],'entrega','Ordenar'))+`<div id="list">${LISTS.pedidos()}</div>`;
}
LISTS.pedidos=()=>{
  if(curTab('pedidos','ped')==='cli')return LISTS_cli();
  const e=fv('est','abiertos'),o=fv('ord','entrega'),t=todayStr();
  let a=S.orders.filter(x=>match([x.clienteNombre,'#'+x.num,x.num])&&(e===''||(e==='abiertos'?ORDER_OPEN(x):x.estado===e)));
  a.sort((x,y)=>o==='fecha'?String(y.fecha).localeCompare(String(x.fecha)):o==='saldo'?orderSaldo(y)-orderSaldo(x):String(x.entrega||'9').localeCompare(String(y.entrega||'9')));
  if(!a.length)return `<p class="muted pad">No hay pedidos con esos filtros.</p>`;
  return `<div class="tbl"><table><thead><tr><th>Pedido</th><th>Entrega</th><th class="r">Total</th><th class="r">Pagado</th><th class="r">Saldo</th><th>Estado</th><th></th></tr></thead><tbody>${a.map(x=>{const sd=orderSaldo(x),late=ORDER_OPEN(x)&&x.entrega&&x.entrega<t,soon=ORDER_OPEN(x)&&x.entrega>=t&&x.entrega<=addDays(t,3);return `<tr><td><strong>#${x.num} · ${esc(x.clienteNombre||'Sin cliente')}</strong><div class="muted xs">${(x.items||[]).map(i=>`${fnum(num(i.cant))}× ${esc(PROD(i.prodId)?.nombre||'Producto')}`).join(', ')}</div></td><td>${fdate(x.entrega)}${late?'<div class="badc xs">Vencido</div>':soon?'<div class="warnc xs">Próximo</div>':''}</td><td class="r">${money(orderTotal(x))}</td><td class="r">${money(orderPaid(x))}${orderUnconfirmed(x)>0?`<div class="warnc xs">+${money(orderUnconfirmed(x))} sin confirmar</div>`:''}</td><td class="r ${sd>0&&!x.ventaId?'badc':''}">${x.ventaId?'<span class="muted xs">En venta #'+(S.sales.find(s=>s.id===x.ventaId)?.num||'')+'</span>':money(sd)}</td><td>${x.ventaId?estBadge(x.estado):sel('',ESTADOS,x.estado,`onchange="setOrderState('${x.id}',this.value)" aria-label="Estado" style="min-width:170px"`)}</td><td class="acts">${!x.ventaId&&x.estado!=='Cancelado'?ibtn('cash',`orderToSale('${x.id}')`,'Convertir en venta'):''}${ibtn('edit',`editOrder('${x.id}')`,'Editar')}${ibtn('trash',`delOrder('${x.id}')`,'Eliminar','del')}</td></tr>`}).join('')}</tbody></table></div>`;
};
function setOrderState(id,v){const o=byId(S.orders,id);o.estado=v;save('Estado actualizado: '+v);if(v==='Entregado'&&!o.ventaId)confirmDlg('El pedido figura como entregado. ¿Querés registrarlo como venta ahora? (Se crea una sola vez.)',()=>orderToSale(id),{okText:'Registrar venta',cancelText:'Más tarde'});else setF('_',0)}
function editOrder(id){
  if(!S.products.length){toast('Primero creá un producto','warn');go('productos');return}
  const o=id?byId(S.orders,id):null;
  if(o&&o.ventaId)toast('Este pedido ya es una venta: los cambios no modifican la venta registrada.','warn');
  D=o?JSON.parse(JSON.stringify(o)):{id:null,clienteId:'',clienteNuevo:'',fecha:todayStr(),entrega:addDays(todayStr(),2),items:[{prodId:'',cant:1,precio:''}],descuento:'',pagos:[],estado:'Confirmado',notas:''};
  mOrder();
}
function mOrder(){
  const po=[['','Elegí un producto…'],...S.products.filter(p=>p.activo!==false||D.items.some(i=>i.prodId===p.id)).map(p=>[p.id,p.nombre])];
  const co=[['','Cliente nuevo o sin cliente'],...S.customers.map(c=>[c.id,c.nombre])];
  const body=`<div class="grid2">${fld('Cliente',sel('',co,D.clienteId,`onchange="D.clienteId=this.value;mOrder()"`))}${D.clienteId?'':fld('Nombre del cliente nuevo',`<input value="${esc(D.clienteNuevo||'')}" oninput="D.clienteNuevo=this.value" placeholder="Opcional">`)}</div>
  ${!D.clienteId?`<div class="grid2">${fld('Teléfono (opcional)',`<input type="tel" value="${esc(D.tel||'')}" oninput="D.tel=this.value">`)}${fld('Email (opcional)',`<input type="email" value="${esc(D.email||'')}" oninput="D.email=this.value">`)}</div>`:''}
  <div class="grid3">${fld('Fecha del pedido',`<input type="date" value="${esc(D.fecha)}" onchange="D.fecha=this.value">`)}${fld('Fecha de entrega',`<input type="date" value="${esc(D.entrega)}" onchange="D.entrega=this.value">`)}${fld('Estado',sel('',ESTADOS,D.estado,`onchange="D.estado=this.value"`))}</div>
  <h4 class="sub">Productos</h4><div class="lines">${D.items.map((it,i)=>`<div class="line">${sel('',po,it.prodId,`onchange="oLineProd(${i},this.value)" aria-label="Producto"`)}<input type="number" inputmode="numeric" min="1" step="1" placeholder="Cant." value="${esc(it.cant)}" oninput="D.items[${i}].cant=this.value;prevOrder()" aria-label="Cantidad"><input type="number" inputmode="decimal" min="0" step="any" placeholder="Precio unit." value="${esc(it.precio)}" oninput="D.items[${i}].precio=this.value;prevOrder()" aria-label="Precio unitario"><button class="icon-btn del" onclick="D.items.splice(${i},1);mOrder()" aria-label="Quitar">${ic('x')}</button></div>`).join('')}</div>
  <button class="btn ghost sm" onclick="D.items.push({prodId:'',cant:1,precio:''});mOrder()">${ic('plus')} Agregar producto</button>
  ${fld('Descuento ($)',`<input type="number" inputmode="decimal" min="0" value="${esc(D.descuento)}" oninput="D.descuento=this.value;prevOrder()">`)}
  <h4 class="sub">Seña y pagos</h4><p class="muted xs mb">Marcá "Recibido" solo cuando el dinero esté efectivamente cobrado.</p>
  <div class="lines">${D.pagos.map((p,i)=>`<div class="line l4p"><input type="date" value="${esc(p.fecha)}" onchange="D.pagos[${i}].fecha=this.value" aria-label="Fecha"><input type="number" inputmode="decimal" min="0" placeholder="Monto" value="${esc(p.monto)}" oninput="D.pagos[${i}].monto=this.value;prevOrder()" aria-label="Monto">${sel('',MEDIOS,p.medio,`onchange="D.pagos[${i}].medio=this.value" aria-label="Medio de pago"`)}<label class="chk"><input type="checkbox" ${p.confirmado?'checked':''} onchange="D.pagos[${i}].confirmado=this.checked;prevOrder()"> Recibido</label><button class="icon-btn del" onclick="D.pagos.splice(${i},1);mOrder()" aria-label="Quitar">${ic('x')}</button></div>`).join('')}</div>
  <button class="btn ghost sm" onclick="D.pagos.push({fecha:todayStr(),monto:'',medio:'Transferencia',confirmado:true});mOrder()">${ic('plus')} Agregar seña o pago</button>
  ${fld('Notas',`<textarea rows="2" oninput="D.notas=this.value" placeholder="Ej: sin TACC, entrega en domicilio">${esc(D.notas)}</textarea>`)}<div id="ordPrev"></div>`;
  modal(D.id?'Editar pedido #'+D.num:'Nuevo pedido',body,`<button class="btn soft" onclick="closeModal()">Cancelar</button><button class="btn" onclick="saveOrder()">${ic('check')} Guardar pedido</button>`,true);
  prevOrder();
}
function oLineProd(i,v){D.items[i].prodId=v;const p=PROD(v);if(p&&isBlank(D.items[i].precio))D.items[i].precio=num(p.precio)||'';mOrder()}
function prevOrder(){const e=$('#ordPrev');if(!e)return;const t=orderTotal(D),p=orderPaid(D),u=orderUnconfirmed(D);e.innerHTML=`<div class="calc-prev"><div class="res-rows" style="margin:0"><span>Subtotal</span><span>${money(lineSub(D.items))}</span><span>Descuento</span><span>− ${money(num(D.descuento))}</span><span class="strong">Total del pedido</span><span class="strong">${money(t)}</span><span>Pagos recibidos</span><span class="okc">${money(p)}</span>${u>0?`<span>Pagos sin confirmar (no se cuentan)</span><span class="warnc">${money(u)}</span>`:''}<span class="strong">Saldo pendiente</span><span class="strong ${t-p>0?'badc':''}">${money(t-p)}</span></div></div>${p>t?note('Los pagos superan el total del pedido.','warn'):''}`}
function saveOrder(){
  const items=D.items.filter(i=>i.prodId);
  if(!items.length)return err('Agregá al menos un producto.');
  if(items.some(i=>!(num(i.cant)>0)))return err('Las cantidades deben ser mayores que cero.');
  if(items.some(i=>isBlank(i.precio)||num(i.precio)<0))return err('Completá el precio unitario de cada producto.');
  if(num(D.descuento)<0||num(D.descuento)>lineSub(items))return err('El descuento no puede ser negativo ni mayor que el subtotal.');
  if(D.pagos.some(p=>num(p.monto)<0))return err('Los pagos no pueden ser negativos.');
  let cid=D.clienteId,cname='';
  if(!cid&&(D.clienteNuevo||'').trim()){const c={id:uid(),nombre:D.clienteNuevo.trim(),tel:D.tel||'',email:D.email||'',notas:'',creado:new Date().toISOString()};S.customers.push(c);cid=c.id}
  if(cid)cname=CLI(cid)?.nombre||'';
  const data={clienteId:cid,clienteNombre:cname,fecha:D.fecha||todayStr(),entrega:D.entrega||'',items:items.map(i=>({prodId:i.prodId,cant:num(i.cant),precio:r2(num(i.precio))})),descuento:r2(num(D.descuento)),pagos:D.pagos.filter(p=>num(p.monto)>0).map(p=>({fecha:p.fecha||todayStr(),monto:r2(num(p.monto)),medio:p.medio,confirmado:!!p.confirmado})),estado:D.estado,notas:D.notas||''};
  if(D.id)Object.assign(byId(S.orders,D.id),data);
  else{S.seq.order++;S.orders.push({id:uid(),num:S.seq.order,ventaId:null,creado:new Date().toISOString(),...data})}
  save('Pedido guardado');closeModal();render();
}
function orderToSale(id){
  const o=byId(S.orders,id);if(!o)return;
  if(o.ventaId&&S.sales.some(s=>s.id===o.ventaId))return toast('Este pedido ya fue registrado como venta.','warn');
  const u=orderUnconfirmed(o);
  modal('Registrar venta del pedido #'+o.num,`<p>Se creará <strong>una sola venta</strong> con los productos, precios y descuento del pedido. Los costos se guardan con los valores de hoy para que cambios futuros no alteren el resultado.</p>
  <div class="res-rows"><span>Total</span><span>${money(orderTotal(o))}</span><span>Pagos confirmados que pasan como cobros</span><span class="okc">${money(orderPaid(o))}</span><span>Saldo que queda por cobrar</span><span>${money(orderSaldo(o))}</span></div>
  ${u>0?note(`Hay ${money(u)} en pagos sin confirmar: no se registran como cobrados. Confirmalos antes si ya los recibiste.`,'warn'):''}
  ${fld('Fecha de la venta',inp('ov_f',todayStr(),'date'))}
  ${fld('Comisiones e impuestos sobre la venta (%)',inp('ov_c',S.profile.comisionDef||0,'number','min="0" max="99"'))}
  <label class="chk"><input type="checkbox" id="ov_pk" checked> Descontar el packaging de presentación del inventario</label>`,
  `<button class="btn soft" onclick="closeModal()">Cancelar</button><button class="btn" onclick="doOrderToSale('${id}')">${ic('check')} Registrar venta</button>`);
}
function doOrderToSale(id){
  const o=byId(S.orders,id);if(o.ventaId&&S.sales.some(s=>s.id===o.ventaId)){closeModal();return toast('Ya registrada.','warn')}
  const c=num(V('ov_c'));if(c<0||c>=100)return err('Comisión inválida.');
  S.seq.sale++;
  const s={id:uid(),num:S.seq.sale,fecha:V('ov_f')||todayStr(),clienteId:o.clienteId,clienteNombre:o.clienteNombre,items:o.items.map(i=>snapItem(i.prodId,i.cant,i.precio)),descuento:o.descuento,medio:(o.pagos.find(p=>p.confirmado)||{}).medio||'',com:c,cobros:o.pagos.filter(p=>p.confirmado).map(p=>({fecha:p.fecha,monto:p.monto,medio:p.medio})),pedidoId:o.id,creado:new Date().toISOString(),packDesc:CK('ov_pk')};
  S.sales.push(s);o.ventaId=s.id;if(o.estado!=='Entregado')o.estado='Entregado';
  if(s.packDesc)salePackMovs(s);
  save('Venta #'+s.num+' registrada');closeModal();render();
}
function delOrder(id){const o=byId(S.orders,id);confirmDlg(`¿Eliminar el pedido <strong>#${o.num}</strong>?${o.ventaId?' La venta asociada se conserva.':''}`,()=>{S.orders=S.orders.filter(x=>x.id!==id);S.plan=S.plan.filter(l=>l.orderId!==id);save('Pedido eliminado');render()},{danger:true,okText:'Eliminar'})}
function clientsView(){
  if(!S.customers.length)return emptyState('user','Todavía no hay clientes','Se crean automáticamente al cargar un pedido, o podés agregarlos acá.',`<button class="btn" onclick="editClient()">${ic('plus')} Agregar cliente</button>`);
  return searchBar('Buscar cliente')+`<div id="list">${LISTS_cli()}</div>`;
}
function LISTS_cli(){
  const a=S.customers.filter(c=>match([c.nombre,c.tel,c.email])).sort((x,y)=>x.nombre.localeCompare(y.nombre));
  if(!a.length)return `<p class="muted pad">Sin resultados.</p>`;
  return `<div class="tbl"><table><thead><tr><th>Cliente</th><th>Contacto</th><th class="r">Pedidos</th><th class="r">Compras registradas</th><th class="r">Saldo</th><th></th></tr></thead><tbody>${a.map(c=>{const os=S.orders.filter(o=>o.clienteId===c.id),ss=S.sales.filter(s=>s.clienteId===c.id);const saldo=sum(os.filter(o=>!o.ventaId&&o.estado!=='Cancelado'),o=>Math.max(0,orderSaldo(o)))+sum(ss,s=>Math.max(0,saleSaldo(s)));return `<tr><td><strong>${esc(c.nombre)}</strong>${c.notas?`<div class="muted xs">${esc(c.notas)}</div>`:''}</td><td class="sm-t">${esc([c.tel,c.email].filter(Boolean).join(' · '))||'—'}</td><td class="r">${os.length}</td><td class="r">${money(sum(ss,saleTotal))}</td><td class="r ${saldo>0?'badc':''}">${money(saldo)}</td><td class="acts">${ibtn('edit',`editClient('${c.id}')`,'Editar')}${ibtn('trash',`delClient('${c.id}')`,'Eliminar','del')}</td></tr>`}).join('')}</tbody></table></div>`;
}
function editClient(id){const c=id?CLI(id):{nombre:'',tel:'',email:'',notas:''};D={id};modal(id?'Editar cliente':'Nuevo cliente',`${fld('Nombre *',inp('c_n',c.nombre))}<div class="grid2">${fld('Teléfono',inp('c_t',c.tel,'tel'))}${fld('Email',inp('c_e',c.email,'email'))}</div>${fld('Notas',`<textarea id="c_no" rows="2">${esc(c.notas)}</textarea>`)}<p class="muted xs">Guardá solo los datos de contacto necesarios. La información de tus clientes es privada.</p>`,`<button class="btn soft" onclick="closeModal()">Cancelar</button><button class="btn" onclick="saveClient()">${ic('check')} Guardar</button>`)}
function saveClient(){const n=V('c_n').trim();if(!n)return err('Ingresá el nombre.');const data={nombre:n,tel:V('c_t').trim(),email:V('c_e').trim(),notas:V('c_no').trim()};if(D.id){Object.assign(CLI(D.id),data);S.orders.forEach(o=>{if(o.clienteId===D.id)o.clienteNombre=n})}else S.customers.push({id:uid(),creado:new Date().toISOString(),...data});save('Cliente guardado');closeModal();render()}
function delClient(id){const c=CLI(id);confirmDlg(`¿Eliminar a <strong>${esc(c.nombre)}</strong>? Sus pedidos y ventas se conservan con el nombre registrado.`,()=>{S.customers=S.customers.filter(x=>x.id!==id);S.orders.forEach(o=>{if(o.clienteId===id)o.clienteId=''});S.sales.forEach(s=>{if(s.clienteId===id)s.clienteId=''});save('Cliente eliminado');render()},{danger:true,okText:'Eliminar'})}
