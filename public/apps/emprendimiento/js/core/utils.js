/* Mi Emprendimiento Dulce · Utilidades generales: selectores, almacenamiento local, números y texto */
'use strict';
/* =========================================================
   MI EMPRENDIMIENTO DULCE · EMPRENDE DULCE
   Capa base: almacenamiento, utilidades y lógica de negocio
   ========================================================= */
const $=s=>document.querySelector(s);
const LS={
  get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}},
  del(k){try{localStorage.removeItem(k)}catch(e){}}
};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>{if(v===null||v===undefined||v==='')return 0;const n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:0};
const isBlank=v=>v===null||v===undefined||String(v).trim()==='';
const r2=x=>Math.round((x+Number.EPSILON)*100)/100;
const r4=x=>Math.round((x+Number.EPSILON)*10000)/10000;
const sum=(arr,fn)=>arr.reduce((a,x)=>a+(fn?fn(x):x),0);
