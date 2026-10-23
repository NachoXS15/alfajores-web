/* Mi Emprendimiento Dulce · Guía para empezar (conceptos, checklist, test y reflexión) */
'use strict';
/* =========================================================
   GUÍA PARA EMPEZAR (conceptos, checklist, test y reflexión)
   ========================================================= */
const CONCEPTS=[
  ['¿Qué es el costo real de elaboración?','<p>Es todo lo que te cuesta hacer una tanda: <strong>ingredientes</strong>, <strong>tu mano de obra</strong>, los <strong>gastos indirectos</strong> (gas, luz, limpieza) y el <strong>packaging</strong>.</p><p>Si dejás afuera tu tiempo, vas a creer que ganás más de lo que realmente ganás.</p>'],
  ['Costo unitario: el número más importante','<p>Costo por alfajor = costo total de la tanda ÷ cantidad de alfajores que salen.</p><p>Ejemplo: si la tanda cuesta $12.000 y salen 24 alfajores, cada uno cuesta $500. La docena cuesta $6.000 más su caja.</p>'],
  ['Margen y recargo no son lo mismo','<p><strong>Margen</strong>: porcentaje del precio de venta que queda como ganancia. Precio = costo ÷ (1 − margen).</p><p><strong>Recargo</strong>: porcentaje que se suma al costo. Precio = costo × (1 + recargo).</p><p>Con un costo de $600: 40% de margen da $1.000; 40% de recargo da $840. ¡Son $160 de diferencia!</p>'],
  ['Comisiones: el costo que se esconde','<p>Si cobrás con billeteras virtuales o vendés por apps, una parte del precio se queda en el camino. La calculadora las incluye para que tu margen sea real.</p>'],
  ['Punto de equilibrio','<p>Es la cantidad que necesitás vender para cubrir tus gastos fijos del mes (monotributo, internet, publicidad).</p><p>Punto de equilibrio = gastos fijos ÷ (precio − costos variables por unidad). Si ese margen de contribución es cero o negativo, nunca se alcanza.</p>'],
  ['Facturación, cobros, ganancia y caja','<p><strong>Facturación</strong>: lo que vendiste. <strong>Cobros</strong>: lo que efectivamente entró. <strong>Ganancia bruta</strong>: ventas menos costos. <strong>Resultado operativo</strong>: ganancia menos gastos fijos. <strong>Flujo de caja</strong>: entradas y salidas de dinero.</p><p>Una venta sin cobrar no es dinero en tu bolsillo.</p>'],
  ['Actualizá tus costos seguido','<p>Cuando sube un ingrediente, actualizá su precio: la app recalcula tus recetas, te muestra el impacto y conserva el historial. Las ventas ya registradas mantienen su costo original.</p>']
];
const QUIZ=[
  ['¿Cuántos alfajores vendés por semana?',['Todavía ninguno','Menos de 50','Más de 50']],
  ['¿Sabés cuánto te cuesta cada alfajor?',['No','Más o menos','Sí, con precisión']],
  ['¿Cómo definís tus precios?',['Copio a otros','Sumo un porcentaje al costo','Con un margen calculado']],
  ['¿Registrás pedidos y cobros?',['No','En papel o en el celular','Sí, de forma ordenada']],
  ['¿Controlás el stock de ingredientes y cajas?',['No','A veces','Sí']]
];
VIEWS.guia=()=>{
  const L=S.learn;const done=STEPS.filter(s=>s[1]()).length;
  let h=pageHead('Guía para empezar','Conceptos clave explicados simple, tu checklist de configuración y un test para saber por dónde seguir.');
  h+=`<div class="split"><div><div class="card"><div class="card-head"><h3>Tu checklist</h3>${badge(done+' de '+STEPS.length,'acc')}</div><div class="bar mb"><i style="width:${done/STEPS.length*100}%"></i></div>${STEPS.map(s=>{const ok=s[1]();return `<div class="list-row"><label class="chk" style="min-height:40px"><input type="checkbox" ${ok?'checked':''} disabled> <span class="${ok?'muted':''}" style="${ok?'text-decoration:line-through':''}">${s[0]}</span></label>${ok?'':`<button class="btn soft sm" onclick="go('${s[2]}')">Ir</button>`}</div>`}).join('')}<p class="muted xs mt">Se marca solo cuando cargás los datos reales.</p></div>
  <h3 class="mt2 mb">Conceptos clave</h3>${CONCEPTS.map(c=>`<details class="concept"><summary>${c[0]}</summary><div class="cbody">${c[1]}</div></details>`).join('')}</div><div>`;
  h+=`<blockquote>La facturación no es ganancia, y una venta pendiente de cobro no es dinero recibido.</blockquote><blockquote>Tu tiempo también es un costo: incluilo en cada receta.</blockquote>`;
  h+=`<div class="card mt"><h3>Test: ¿en qué etapa está tu emprendimiento?</h3>${L.quiz&&L.quiz.done?quizResult():QUIZ.map((q,i)=>`<div class="mt"><strong class="sm-t">${i+1}. ${q[0]}</strong>${q[1].map((o,j)=>`<button class="quiz-opt ${L.quiz&&L.quiz.a&&L.quiz.a[i]===j?'on':''}" onclick="quizAns(${i},${j})">${o}</button>`).join('')}</div>`).join('')+`<button class="btn block mt" onclick="quizDone()">Ver mi resultado</button>`}</div>`;
  h+=`<div class="card"><h3>Reflexión</h3>${fld('¿Por qué querés emprender con alfajores?',`<textarea rows="3" oninput="S.learn.notes.porque=this.value;saveQuiet()">${esc(L.notes.porque||'')}</textarea>`)}${fld('¿Qué te gustaría lograr en los próximos 3 meses?',`<textarea rows="3" oninput="S.learn.notes.meta=this.value;saveQuiet()">${esc(L.notes.meta||'')}</textarea>`,'Después podés convertirlo en una meta medible.')}${fld('¿Qué te frena hoy?',`<textarea rows="3" oninput="S.learn.notes.freno=this.value;saveQuiet()">${esc(L.notes.freno||'')}</textarea>`)}</div></div></div>`;
  return h;
};
let _sq=null;function saveQuiet(){clearTimeout(_sq);_sq=setTimeout(()=>save(),400)}
function quizAns(i,j){S.learn.quiz=S.learn.quiz||{a:[]};S.learn.quiz.a[i]=j;save();render()}
function quizDone(){const a=(S.learn.quiz||{}).a||[];if(QUIZ.some((_,i)=>a[i]===undefined||a[i]===null))return err('Respondé todas las preguntas.');S.learn.quiz.done=true;save();render()}
function quizResult(){const sc=sum(S.learn.quiz.a);let t,d,steps;
  if(sc<=3){t='Etapa: primeros pasos';d='Estás construyendo las bases. Lo más importante ahora es conocer tu costo real antes de poner precios.';steps=[['Cargá tus ingredientes','ingredientes'],['Creá tu primera receta','recetas'],['Calculá tu precio con margen','productos']]}
  else if(sc<=7){t='Etapa: en crecimiento';d='Ya vendés y tenés intuición. Ordenar pedidos y cobros, y revisar márgenes, te va a dar control.';steps=[['Revisá márgenes por producto','productos'],['Registrá pedidos y señas','pedidos'],['Definí una meta mensual','metas']]}
  else{t='Etapa: emprendimiento en marcha';d='Tenés un negocio funcionando. Usá el simulador y los informes para crecer con datos y cuidar tu rentabilidad.';steps=[['Simulá escenarios y punto de equilibrio','ganancias'],['Planificá la producción','produccion'],['Analizá informes','informes']]}
  return `<div class="calc-prev"><div class="muted xs">Tu resultado (${sc}/10)</div><h3 style="margin:4px 0">${t}</h3><p>${d}</p></div><strong class="sm-t">Próximos pasos recomendados:</strong>${steps.map(s=>`<div class="list-row"><span>${s[0]}</span><button class="btn soft sm" onclick="go('${s[1]}')">Ir</button></div>`).join('')}<button class="btn ghost block mt" onclick="S.learn.quiz=null;save();render()">Repetir test</button>`}
