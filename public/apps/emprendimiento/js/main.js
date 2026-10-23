/* Mi Emprendimiento Dulce · Inicio */
'use strict';
/* =========================================================
   INICIO
   ========================================================= */
(function init(){
  applyTheme(LS.get('med_theme',null)||((window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'));
  $('#menuBtn').innerHTML=ic('menu',22);$('#modalX').innerHTML=ic('x',20);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#confirmWrap').classList.contains('open'))confirmClose(false);else if($('#modalWrap').classList.contains('open'))closeModal();else closeDrawer()}});
  window.addEventListener('storage',e=>{if(e.key===KEY){S=load();if(!$('#app').classList.contains('hidden'))render();toast('Datos actualizados desde otra pestaña')}});
  let seen=false;try{seen=sessionStorage.getItem('med_welcomed')==='1'}catch(e){}
  if(seen)enterApp();
})();
