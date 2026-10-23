/* Mi Emprendimiento Dulce · Metas */
'use strict';
/* =========================================================
   METAS
   ========================================================= */
VIEWS.metas=()=>pageHead('Metas del emprendimiento','Definí objetivos por día, semana o mes y seguí tu avance con datos reales. Sirven para organizarte, no garantizan resultados.',`<button class="btn" onclick="editGoal()">${ic('plus')} Nueva meta</button>`)+
  (S.goals.length?`<div class="cards">${S.goals.map(goalCard).join('')}</div>`:emptyState('target','Todavía no tenés metas','Por ejemplo: vender 120 alfajores esta semana o cobrar $300.000 este mes.',`<button class="btn" onclick="editGoal()">${ic('plus')} Crear meta</button>`));
function goalCard(g){
  const R=periodRange(g.periodo);const T=GOAL_T[g.tipo];const a=metricIn(g.tipo,R),o=num(g.objetivo);const p=o>0?a/o:0;const fm=v=>T[2]?money(v):fnum(v,0);
  let chart='';if(g.periodo!=='dia'){const days=[];let d=R[0];while(d<=R[1]){days.push(d);d=addDays(d,1)}const t=todayStr();const vals=days.map(x=>x<=t?metricIn(g.tipo,[R[0],x]):null);const mx=Math.max(o,...vals.filter(v=>v!=null),1);chart=`<div class="minichart" aria-label="Evolución acumulada">${days.map((x,i)=>`<i class="${vals[i]!=null&&vals[i]>=o?'hit':x===t?'now':''}" style="height:${vals[i]==null?0:Math.max(0,vals[i])/mx*100}%" title="${fdate(x)}: ${vals[i]==null?'—':fm(vals[i])}"></i>`).join('')}</div><div class="muted xs">Evolución acumulada · ${fdate(R[0])} al ${fdate(R[1])}</div>`}
  return `<div class="item-card"><div class="ic-top"><div><h3>${esc(g.nombre||T[0])}</h3><div class="muted xs">${T[0]} · ${PER_LBL[g.periodo]}</div></div>${p>=1?badge('Cumplida','ok'):badge(pct(Math.min(p,9.99)),'acc')}</div>
  <div class="ic-big">${fm(a)} <span class="muted sm-t">de ${fm(o)}</span></div><div class="bar ${p>=1?'ok':''}"><i style="width:${Math.min(1,Math.max(0,p))*100}%"></i></div>
  <div class="ic-rows"><span>Restante</span><span>${p>=1?'¡Alcanzada!':fm(Math.max(0,o-a))}</span></div><p class="muted xs">${T[1]}</p>${chart}
  <div class="ic-acts">${ibtn('edit',`editGoal('${g.id}')`,'Editar')}${ibtn('trash',`delGoal('${g.id}')`,'Eliminar','del')}</div></div>`;
}
function editGoal(id){const g=id?byId(S.goals,id):{tipo:'facturacion',periodo:'mes',objetivo:'',nombre:''};D={id};modal(id?'Editar meta':'Nueva meta',`${fld('Tipo de meta',sel('go_t',Object.entries(GOAL_T).map(([k,v])=>[k,v[0]]),g.tipo,'onchange="$(\'#go_h\').textContent=GOAL_T[this.value][1]"'))}<p class="muted xs mb" id="go_h">${GOAL_T[g.tipo][1]}</p><div class="grid2">${fld('Período',sel('go_p',[['dia','Diaria'],['semana','Semanal'],['mes','Mensual']],g.periodo))}${fld('Objetivo *',inp('go_o',g.objetivo,'number','min="0"'))}</div>${fld('Nombre (opcional)',inp('go_n',g.nombre,'text','placeholder="Ej: Meta de Día de la Madre"'))}`,`<button class="btn soft" onclick="closeModal()">Cancelar</button><button class="btn" onclick="saveGoal()">${ic('check')} Guardar</button>`)}
function saveGoal(){const o=num(V('go_o'));if(!(o>0))return err('El objetivo debe ser mayor que cero.');const data={tipo:V('go_t'),periodo:V('go_p'),objetivo:o,nombre:V('go_n').trim()};if(D.id)Object.assign(byId(S.goals,D.id),data);else S.goals.push({id:uid(),creado:new Date().toISOString(),...data});save('Meta guardada');closeModal();render()}
function delGoal(id){confirmDlg('¿Eliminar esta meta?',()=>{S.goals=S.goals.filter(g=>g.id!==id);save('Meta eliminada');render()},{danger:true,okText:'Eliminar'})}
