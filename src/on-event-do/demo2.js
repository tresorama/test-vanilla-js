import { OnEventDo_Orchestrator, $ } from './lib';
setTimeout(() => {
  OnEventDo_Orchestrator.setUtilityFunction($);
  OnEventDo_Orchestrator.init();
}, 1);

const SCOPE = "SECTION-" + Date.now();

document.body.insertAdjacentHTML('afterbegin',/*html*/`
<div id="${SCOPE}"class="py-12 px-8 bg-yellow-200 flex justify-center gap-12">

<style>
  #${SCOPE} .drawer {
    z-index: 10;
    position: fixed;
    inset: 0;
    pointer-events: none;
  }
  #${SCOPE} .drawer.is-opened {
    pointer-events: all;
  }
  
  #${SCOPE} .drawer__backdrop {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: hsl(0 0% 0% / 0.5);
    /* Exit Animation */
    opacity: 0;
    transition: opacity 0.2s;
  }
  #${SCOPE} .drawer.is-opened .drawer__backdrop {
    opacity: 1;
    transition: opacity 0.2s;
  }
  #${SCOPE} .drawer__panel {
    /* Exit Animation */
    transition: transform 0.2s;
  }
  #${SCOPE} .drawer.is-opened .drawer__panel {
    /* Enter Animation */
    transform: none;
    transition: transform 0.2s;
  }
  #${SCOPE} .drawer--left .drawer__panel {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    /* Exit Animation */
    transform: translateX(-100%);
  }

  #${SCOPE} .drawer--right .drawer__panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    /* Exit Animation */
    transform: translateX(100%);
  }
  #${SCOPE} .drawer--top .drawer__panel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    /* Exit Animation */
    transform: translateY(-100%);
  }
  #${SCOPE} .drawer--bottom .drawer__panel {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    /* Exit Animation */
    transform: translateY(100%);
  }

</style>

  <div class="drawer drawer--left" id="drawer-left" >
    <div 
      class="drawer__backdrop"
      data-on-event-do='[ ["click", "$(\\"#${SCOPE} #drawer-left\\").removeClass(\\"is-opened\\")"] ]'
    ></div>
    <div class="drawer__panel bg-white w-[20rem] max-w-full h-full p-4">Panel</div>
  </div>
  <button
    class="p-1 leading-none border bg-neutral-50 hover:bg-neutral-200"
    data-on-event-do='[["click", "$(\\"#${SCOPE} #drawer-left\\").toggleClass(\\"is-opened\\")"] ]'
  >Open Drawer - Left</button>
  
  
  <div class="drawer drawer--right" id="drawer-right" >
    <div 
      class="drawer__backdrop"
      data-on-event-do='[ ["click", "$(\\"#${SCOPE} #drawer-right\\").removeClass(\\"is-opened\\")"] ]'
    ></div>
    <div class="drawer__panel bg-white w-[20rem] max-w-full h-full p-4">Panel</div>
  </div>
  <button
    class="p-1 leading-none border bg-neutral-50 hover:bg-neutral-200"
    data-on-event-do='[["click", "$(\\"#${SCOPE} #drawer-right\\").toggleClass(\\"is-opened\\")"] ]'
  >Open Drawer - Right</button>
  
  <div class="drawer drawer--top" id="drawer-top" >
    <div 
      class="drawer__backdrop"
      data-on-event-do='[ ["click", "$(\\"#${SCOPE} #drawer-top\\").removeClass(\\"is-opened\\")"] ]'
    ></div>
    <div class="drawer__panel bg-white h-[50vh] p-4">Panel</div>
  </div>
  <button
    class="p-1 leading-none border bg-neutral-50 hover:bg-neutral-200"
    data-on-event-do='[["click", "$(\\"#${SCOPE} #drawer-top\\").toggleClass(\\"is-opened\\")"] ]'
  >Open Drawer - Top</button>
 
  <div class="drawer drawer--bottom" id="drawer-bottom" >
    <div 
      class="drawer__backdrop"
      data-on-event-do='[ ["click", "$(\\"#${SCOPE} #drawer-bottom\\").removeClass(\\"is-opened\\")"] ]'
    ></div>
    <div class="drawer__panel bg-white h-[50vh] p-4">Panel</div>
  </div>
  <button
    class="p-1 leading-none border bg-neutral-50 hover:bg-neutral-200"
    data-on-event-do='[["click", "$(\\"#${SCOPE} #drawer-bottom\\").toggleClass(\\"is-opened\\")"] ]'
  >Open Drawer - Bottom</button>

</div>
`);