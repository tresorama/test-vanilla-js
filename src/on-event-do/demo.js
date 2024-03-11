import { OnEventDo_Orchestrator, $ } from './lib';
setTimeout(() => {
  OnEventDo_Orchestrator.setUtilityFunction($);
  OnEventDo_Orchestrator.init();
}, 1);

const SCOPE = "SECTION-" + Date.now();

document.body.insertAdjacentHTML('afterbegin',/*html*/`
<div id="${SCOPE}"class="py-12 px-8 bg-yellow-200 flex gap-12">

<style>
  #${SCOPE} .dropdown {
    --border-radius: 5px;
    --box-shadow: rgba(0, 0, 0, 0.2) 0px 2.5px 5px;
    width: 10rem;
    position: relative;
  }
  #${SCOPE} .dropdown-panel {
    z-index: 10;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: 10px;
    overflow: hidden;
    border-radius: var(--border-radius);
    background: hsl(0 0% 90%);
    color: hsl(0 0% 20%);
    box-shadow: var(--box-shadow);
  }
  #${SCOPE} .dropdown-toggler,
  #${SCOPE} .dropdown-panel > button {
    display: block;
    padding: 0.5em;
    width: 100%;
    text-align: left;
  }
  #${SCOPE} .dropdown-toggler {
    background: hsl(0 0% 20%);
    color: white;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
  }
  #${SCOPE} .dropdown-panel > button:hover {
    background: hsl(0 0% 80%);
  }
  #${SCOPE} .dropdown-panel > button:not(:first-child) {
    border-top: 1px solid hsl(0 0% 80%);
  }
  
  #${SCOPE} .dropdown-panel:not([aria-expanded="true"]) {
    /* Set hidden */
    display: none;
  }
  
</style>
<style>
    #${SCOPE} .dropdown.with-css-transition .dropdown-panel {
      display: block;
      transform-origin: top;
      /* Exit Aniamtino */
      transform: scaleY(0);
      visibility: hidden;
      transition: transform 0.15s, visibility 0s 0.15s;
      }
    #${SCOPE} .dropdown.with-css-transition[aria-expanded="true"] .dropdown-panel {
        /* Enter Animation */
        transform: scaleY(1);
        visibility: visible;
        transition: transform 0.15s, visibility 0s 0s;
    }
    #${SCOPE} .dropdown.with-css-transition .dropdown-panel > * {
      /* Exit Aniamtino */
      opacity: 0;
      transition: opacity 0.05s;
      }
    #${SCOPE} .dropdown.with-css-transition[aria-expanded="true"] .dropdown-panel > *{
        /* Enter Animation */
        opacity: 1;
        transition: opacity 0.15s 0.15s;
    }
  </style>
 
 <!-- css-transition  + (OnEventDo)-->
  <div 
    class="dropdown with-css-transition"
    aria-expanded="false"
    data-on-event-do='[
      ["click", "this.getAttribute(\\"data-hello\\") === \\"john\\" ? this.setAttribute(\\"data-hello\\", \\"luke\\") : this.setAttribute(\\"data-hello\\", \\"john\\")"],
      ["click", "$(this).toggleAttr(\\"aria-expanded\\",[\\"true\\",\\"false\\"])"],
      ["mouseenter", "$(this).toggleAttr(\\"aria-expanded\\",[\\"true\\",\\"false\\"])"],
      ["mouseleave", "$(this).setAttr(\\"aria-expanded\\",\\"false\\")"],
      ["click", "$(this).toggleClass(\\"animated\\",\\"hello\\")"]
    ]'
    >
    <!--
    -->
  <div class="dropdown-toggler">Export</div>
    <div class="dropdown-panel">
      <button>PDF</button>
      <button>SVG</button>
      <button>HTML</button>
    </div>
  </div>

  <button
    class="p-1 leading-none border bg-neutral-50 hover:bg-neutral-200"
    data-on-event-do='[
      ["click", "$(\\"#sdf57dsfbsndfg\\").toggleClass(\\"animate\\")"]
    ]'
  >Toggle class an other element</button>
  <div id="sdf57dsfbsndfg" class="animate size-12 bg-red-300 opacity-0 [&.animate]:opacity-100 transition-opacity duration-1000"></div>

</div>
`);