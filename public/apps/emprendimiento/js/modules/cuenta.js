/* Mi Emprendimiento Dulce · Mi cuenta y configuración */
'use strict';
/* =========================================================
   MI CUENTA Y CONFIGURACIÓN
   ========================================================= */
VIEWS.cuenta=()=>{
  const P=S.profile;
  const sz=(()=>{try{return(localStorage.getItem(KEY)||'').length}catch(e){return 0}})();
  return pageHead('Mi cuenta y configuración','Perfil del emprendimiento, preferencias de cálculo y gestión de tus datos.')+`<div class="split"><div class="card"><h3>Perfil del emprendimiento</h3>
  <div class="grid2">${fld('Nombre del emprendimiento',inp('a_neg',P.negocio))}${fld('Tu nombre',inp('a_nom',P.nombre))}</div>${fld('Email de contacto (opcional)',inp('a_em',P.email,'email'))}
  <h4 class="sub">Preferencias de cálculo</h4>
  <div class="grid2">${fld('Moneda',sel('a_mon',[['ARS','Peso argentino (ARS)'],['USD','Dólar (USD)'],['UYU','Peso uruguayo (UYU)'],['CLP','Peso chileno (CLP)'],['MXN','Peso mexicano (MXN)'],['EUR','Euro (EUR)']],P.moneda))}${fld('Valor de tu hora de trabajo',inp('a_vh',P.valorHora,'number','min="0"'),'Se usa en la mano de obra de las recetas.')}</div>
  <div class="grid2">${fld('Gastos fijos mensuales',inp('a_gf',P.gastosFijosMes,'number','min="0"'),'Valor por defecto del simulador.')}${fld('Comisión por defecto (%)',inp('a_com',P.comisionDef,'number','min="0" max="99"'),'Ej: comisión de tu billetera virtual.')}</div>
  <button class="btn block" onclick="saveProfile()">${ic('check')} Guardar cambios</button></div>
  <div><div class="card"><h3>Apariencia</h3><div class="seg"><button class="${document.documentElement.getAttribute('data-theme')!=='dark'?'on':''}" onclick="LS.set('med_theme','light');applyTheme('light');render()">${ic('sun',18)} Modo día</button><button class="${document.documentElement.getAttribute('data-theme')==='dark'?'on':''}" onclick="LS.set('med_theme','dark');applyTheme('dark');render()">${ic('moon',18)} Modo noche</button></div></div>
  <div class="card"><h3>Dónde se guardan tus datos</h3><p class="sm-t">Esta versión guarda todo <strong>en este navegador y dispositivo</strong> (${fnum(sz/1024,0)} KB). No necesita conexión ni cuenta, pero:</p><ul class="sm-t" style="margin:8px 0 0 18px"><li>Si borrás los datos del navegador, se pierden.</li><li>No se sincroniza sola con otros dispositivos.</li><li>Para pasar tus datos a otro equipo, descargá una copia y restaurala allí.</li></ul>
  ${P.lastBackup?`<p class="muted xs mt">Última copia descargada: ${fdate(P.lastBackup)}</p>`:note('Todavía no descargaste ninguna copia de seguridad. Te recomendamos hacerlo una vez por semana.','warn')}
  <div class="actions mt"><button class="btn" onclick="backup()">${ic('down')} Descargar copia (.json)</button><button class="btn ghost" onclick="$('#restoreFile').click()">${ic('up')} Restaurar copia</button><input type="file" id="restoreFile" accept=".json,application/json" class="hidden" onchange="restore(this)"></div></div>
  <div class="card"><h3>Exportar a planillas</h3><p class="muted sm-t mb">Archivos CSV compatibles con Excel y Google Sheets.</p><div class="actions"><button class="btn soft sm" onclick="exportTable('ingredientes')">Ingredientes</button><button class="btn soft sm" onclick="exportTable('recetas')">Recetas</button><button class="btn soft sm" onclick="exportCosts()">Productos</button><button class="btn soft sm" onclick="exportTable('pedidos')">Pedidos</button><button class="btn soft sm" onclick="exportTable('ventas')">Ventas</button><button class="btn soft sm" onclick="exportTable('clientes')">Clientes</button><button class="btn soft sm" onclick="exportTable('movimientos')">Movimientos</button></div></div>
  <div class="card"><h3>Privacidad</h3><p class="sm-t">Los datos de tus clientes quedan solo en tu dispositivo y en las copias que descargues. Guardá únicamente la información de contacto necesaria y protegé los archivos exportados.</p>
  <div class="actions mt"><button class="btn soft sm" onclick="restartWizard()">Volver a abrir el asistente</button><button class="btn danger sm" onclick="wipeAll()">${ic('trash',18)} Borrar todos mis datos</button></div></div></div></div>`;
};
function saveProfile(){
  const n=V('a_neg').trim();if(!n)return err('Ingresá el nombre del emprendimiento.');
  const vh=num(V('a_vh')),gf=num(V('a_gf')),cm=num(V('a_com'));if(vh<0||gf<0||cm<0||cm>=100)return err('Revisá los valores: no pueden ser negativos y la comisión debe ser menor a 100%.');
  Object.assign(S.profile,{negocio:n,nombre:V('a_nom').trim(),email:V('a_em').trim(),moneda:V('a_mon'),valorHora:vh,gastosFijosMes:gf,comisionDef:cm});save('Perfil guardado');render();
}
function backup(){S.profile.lastBackup=todayStr();save();downloadFile(`mi-emprendimiento-dulce_copia_${todayStr()}.json`,JSON.stringify({app:'Mi Emprendimiento Dulce',version:1,exportado:new Date().toISOString(),data:S},null,1),'application/json');render()}
function restore(input){
  const f=input.files&&input.files[0];if(!f)return;const rd=new FileReader();
  rd.onload=()=>{try{const j=JSON.parse(rd.result);const d=j&&j.data?j.data:j;if(!d||typeof d!=='object'||!d.profile||!Array.isArray(d.ingredients)||!Array.isArray(d.recipes))throw new Error('formato');
    confirmDlg('Restaurar esta copia <strong>reemplazará todos los datos actuales</strong> de este dispositivo. ¿Continuar?',()=>{LS.set(KEY,d);S=load();save('Copia restaurada correctamente');render()},{danger:true,okText:'Restaurar'});
  }catch(e){toast('El archivo no es una copia válida de Mi Emprendimiento Dulce.','bad')}input.value=''};
  rd.onerror=()=>toast('No se pudo leer el archivo.','bad');rd.readAsText(f);
}
function exportTable(t){
  if(t==='ingredientes')downloadCSV('ingredientes',['Nombre','Categoría','Marca','Proveedor','Cantidad compra','Unidad compra','Precio total','Costo por unidad de uso','Unidad de uso','Stock','Actualizado'],S.ingredients.map(g=>{const u=usoU(g),cb=ingCostBase(g);return[g.nombre,g.categoria,g.marca,g.proveedor,num(g.cantidadCompra),g.unidadCompra,num(g.precioTotal),cb==null?'':r4(cb*UNITS[u].f),u,r4(fromBase(stockOf('ing',g.id),u)),g.fecha]}));
  if(t==='recetas')downloadCSV('recetas',['Receta','Rendimiento','Costo ingredientes','Mano de obra','Indirectos','Packaging','Costo tanda','Costo por alfajor','Provisional'],S.recipes.map(r=>{const c=recipeCost(r);return[r.nombre,num(r.rendimiento),c.ing,c.mo,c.ind,c.pack,c.total,c.unit??'',c.provisional?'Sí':'No']}));
  if(t==='pedidos')downloadCSV('pedidos',['Número','Cliente','Fecha','Entrega','Estado','Total','Pagado confirmado','Saldo','Convertido en venta'],S.orders.map(o=>[o.num,o.clienteNombre,o.fecha,o.entrega,o.estado,orderTotal(o),orderPaid(o),orderSaldo(o),o.ventaId?'Sí':'No']));
  if(t==='ventas')exportAll(['0000-01-01','9999-12-31']);
  if(t==='clientes')downloadCSV('clientes',['Nombre','Teléfono','Email','Notas'],S.customers.map(c=>[c.nombre,c.tel,c.email,c.notas]));
  if(t==='movimientos')downloadCSV('movimientos_inventario',['Fecha','Recurso','Tipo','Cantidad','Unidad','Motivo'],S.movements.map(m=>{const it=m.kind==='ing'?ING(m.refId):MAT(m.refId);const u=m.kind==='ing'&&it?usoU(it):(it?.unidad||'');return[m.fecha,it?it.nombre:'(eliminado)',(MOV_T[m.tipo]||[m.tipo])[0],m.kind==='ing'&&it?r4(fromBase(m.cantidad,u)):m.cantidad,u,m.motivo]}));
}
function wipeAll(){
  modal('Borrar todos mis datos',`<p>Se eliminarán <strong>todas</strong> tus recetas, ingredientes, productos, pedidos, ventas, inventario y metas de este dispositivo. No se puede deshacer.</p>${note('Antes de continuar, descargá una copia de seguridad si querés conservar algo.','warn')}${fld('Escribí BORRAR para confirmar',inp('wipe_t',''))}`,`<button class="btn soft" onclick="closeModal()">Cancelar</button><button class="btn danger" onclick="if(V('wipe_t').trim().toUpperCase()!=='BORRAR')return err('Escribí BORRAR para confirmar.');LS.del(KEY);LS.del('med_calc');LS.del('med_sim');LS.del('med_cust');LS.del('med_wiz');S=DEF();save();closeModal();toast('Datos eliminados','ok');startWizard()">Borrar definitivamente</button>`);
}
