/* Mi Emprendimiento Dulce · Estado de la aplicación, carga y guardado de datos */
'use strict';
/* ---------- Datos ---------- */
const KEY='med_data_v1';
const DEF=()=>({
  profile:{negocio:'',nombre:'',email:'',moneda:'ARS',valorHora:0,gastosFijosMes:0,comisionDef:0,onboarded:false,lastBackup:null,creado:new Date().toISOString()},
  ingredients:[],materials:[],recipes:[],products:[],customers:[],orders:[],sales:[],movements:[],batches:[],plan:[],goals:[],expenses:[],scenarios:[],
  learn:{checks:{},notes:{},quiz:null},seq:{order:0,sale:0}
});
function load(){
  const d=LS.get(KEY,null),b=DEF();
  if(!d||typeof d!=='object')return b;
  for(const k in b){
    if(d[k]===undefined)continue;
    if(Array.isArray(b[k]))b[k]=Array.isArray(d[k])?d[k]:[];
    else if(b[k]&&typeof b[k]==='object')b[k]=Object.assign(b[k],d[k]||{});
    else b[k]=d[k];
  }
  return b;
}
let S=load();
let D=null;           // borrador del formulario abierto
const F={};           // filtros por vista
const TAB={};         // pestañas por vista
const VIEWS={},LISTS={};

function save(msg){
  const ok=LS.set(KEY,S);
  syncInd(ok);
  if(!ok)toast('No se pudo guardar. Revisá el espacio disponible del navegador.','bad');
  else if(msg)toast(msg,'ok');
  return ok;
}
function syncInd(ok){
  const e=$('#sync');if(!e)return;
  e.className='sync'+(ok?'':' err');
  e.innerHTML=ok?`${ic('check',14)}<span>Guardado en este dispositivo</span>`:`${ic('x',14)}<span>Error al guardar</span>`;
}
