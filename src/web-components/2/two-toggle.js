const SCOPE = "SECTION-" + Date.now();

document.body.insertAdjacentHTML('afterbegin', /*html*/`
<div id="${SCOPE}" class="py-12 px-8 bg-lime-300 flex justify-around">

  <div 
    id="box"
    class="
    size-12 bg-yellow-400 border border-black transition-transform
    [&.big]:scale-125 
    [&.move-x]:translate-x-9 
    [&.move-y]:translate-y-9 
    "
  ></div>


  <two-toggle
    data-event-types='["click"]'
    data-selector="#${SCOPE} #box"
    data-callback="this.classList.toggle('big')"
    class="p-2 border bg-lime-500 text-white hover:bg-lime-600"
  >Toggle (Pattern One)</two-toggle>


  <two-toggle
    data-on-event-do='[
      ["click", "document.querySelector(\\"#${SCOPE} #box\\").classList.toggle(\\"move-x\\")"],
      ["mouseenter", "const box = document.querySelector(\\"#${SCOPE} #box\\");box.style.opacity = Math.random();"]
    ]'
    class="p-2 border bg-lime-500 text-white hover:bg-lime-600"
  >Toggle (Pattern Two)</two-toggle>


  <two-toggle
    data-event-1-type="click"
    data-event-1-cb='
      const box = document.querySelector("#${SCOPE} #box");
      box.classList.toggle("move-y");
    '
    data-event-2-type="mouseenter"
    data-event-2-cb='
      const box = document.querySelector("#${SCOPE} #box");
      const colors = ["red","blue"];
      const foundIndex = colors.findIndex(c => c=== box.style.background);
      if (foundIndex === -1) box.style.background = colors[0];
      else box.style.background = colors[(foundIndex+1)%colors.length];
    '
    class="p-2 border bg-lime-500 text-white hover:bg-lime-600"
  >Toggle (Pattern Three)</two-toggle>

</div>
`);

class TwoToggle extends HTMLElement {
  connectedCallback() {
    this.initPatternOne();
    this.initPatternTwo();
    this.initPatternThree();
  }
  get optionsPatternOne() {
    return {
      /** @type {(keyof HTMLElementEventMap)[]} */
      eventTypes: JSON.parse(this.dataset.eventTypes ?? "[]"),
      selector: this.dataset.selector ?? '',
      callback: this.dataset.callback ?? '',
    };
  }
  initPatternOne() {
    // parse attribute
    const { eventTypes, selector, callback } = this.optionsPatternOne;

    const handleEvent = () => {
      debugger;
      // get target elemeents
      const targets = [...document.querySelectorAll(selector)];
      targets.forEach(target => {
        let cb = function () { eval(callback); };
        cb = cb.bind(target);
        cb();
      });
    };

    // add event listeners
    eventTypes.forEach(eventType => this.addEventListener(eventType, handleEvent));
  }
  get optionsPatterTwo() {
    return {
      /** @type {[eventType: keyof HTMLElementEventMap, callbackString:string][]} */
      onEventDo: JSON.parse(this.dataset.onEventDo ?? "[]"),
    };
  }
  initPatternTwo() {
    // parse attribute
    const { onEventDo } = this.optionsPatterTwo;

    // define event handler
    const handleEvent = (/** @type {string} */ callbackString) => () => {
      let cb = function () { eval(callbackString); };
      cb = cb.bind(this);
      cb();
    };

    // add event listeners
    onEventDo.forEach(([eventType, callbackString]) => {
      this.addEventListener(eventType, handleEvent(callbackString));
    });
  }
  get optionsPatterThree() {
    /** @type {[eventType: keyof HTMLElementEventMap, callbackString:string][]} */
    const eventsConfig = [];

    for (const key in this.dataset) {
      if (key.startsWith("event-") && key.endsWith('Type')) {
        const eventType = this.dataset[key];
        const callbackString = this.dataset[key.replace('Type', "Cb")];
        eventsConfig.push([eventType, callbackString]);
      }
    }

    return {
      eventsConfig,
    };
  }
  initPatternThree() {
    // parse attribute
    const { eventsConfig } = this.optionsPatterThree;

    // define event handler
    const handleEvent = (/** @type {string} */ callbackString) => () => {
      let cb = function () { eval(callbackString); };
      cb = cb.bind(this);
      cb();
    };

    // add event listeners
    eventsConfig.forEach(([eventType, callbackString]) => {
      this.addEventListener(eventType, handleEvent(callbackString));
    });
  }
}
customElements.define("two-toggle", TwoToggle);
window.TwoToggle = TwoToggle;