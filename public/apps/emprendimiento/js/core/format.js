/* Mi Emprendimiento Dulce · Formatos de moneda y fecha, períodos, unidades y búsquedas */
'use strict';
/* ---------- Formatos y fechas ---------- */
function money(x){
  if(x===null||x===undefined||!isFinite(x))return '—';
  try{return new Intl.NumberFormat('es-AR',{style:'currency',currency:S.profile.moneda||'ARS',minimumFractionDigits:2,maximumFractionDigits:2}).format(x)}
  catch(e){return '$ '+Number(x).toFixed(2)}
}
const fnum=(x,d=2)=>(x===null||x===undefined||!isFinite(x))?'—':new Intl.NumberFormat('es-AR',{maximumFractionDigits:d}).format(x);
const pct=x=>(x===null||x===undefined||!isFinite(x))?'—':fnum(x*100,1)+'%';
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const todayStr=()=>ymd(new Date());
function addDays(s,n){const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return ymd(d)}
function fdate(s){if(!s)return '—';const p=String(s).slice(0,10).split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:s}
function periodRange(p){
  const t=todayStr();
  if(p==='dia'||p==='hoy')return[t,t];
  if(p==='semana'){const d=new Date(t+'T12:00:00');const wd=(d.getDay()+6)%7;const s=addDays(t,-wd);return[s,addDays(s,6)]}
  if(p==='anio'){const y=t.slice(0,4);return[`${y}-01-01`,`${y}-12-31`]}
  if(p==='todo')return['0000-01-01','9999-12-31'];
  const [y,m]=t.split('-');const last=new Date(+y,+m,0).getDate();
  return[`${y}-${m}-01`,`${y}-${m}-${String(last).padStart(2,'0')}`];
}
const inR=(d,R)=>!!d&&String(d).slice(0,10)>=R[0]&&String(d).slice(0,10)<=R[1];
const PER_LBL={dia:'Hoy',hoy:'Hoy',semana:'Esta semana',mes:'Este mes',anio:'Este año',todo:'Todo el historial'};

/* ---------- Unidades ---------- */
const UNITS={g:{f:1,d:'m',l:'g'},kg:{f:1000,d:'m',l:'kg'},ml:{f:1,d:'v',l:'ml'},l:{f:1000,d:'v',l:'l'},u:{f:1,d:'u',l:'unid.'}};
const compatUnits=u=>Object.keys(UNITS).filter(k=>UNITS[u]&&UNITS[k].d===UNITS[u].d);
const compat=(a,b)=>!!(UNITS[a]&&UNITS[b]&&UNITS[a].d===UNITS[b].d);
const toBase=(q,u)=>num(q)*(UNITS[u]?UNITS[u].f:NaN);
const fromBase=(q,u)=>q/(UNITS[u]?UNITS[u].f:1);
const usoU=g=>g&&g.unidadUso&&compat(g.unidadUso,g.unidadCompra)?g.unidadUso:(g?g.unidadCompra:'g');
const fq=(base,u)=>fnum(fromBase(base,u),3)+' '+(UNITS[u]?UNITS[u].l:u);

/* ---------- Búsquedas ---------- */
const byId=(a,id)=>a.find(x=>x.id===id);
const ING=id=>byId(S.ingredients,id),MAT=id=>byId(S.materials,id),REC=id=>byId(S.recipes,id),PROD=id=>byId(S.products,id),CLI=id=>byId(S.customers,id);
