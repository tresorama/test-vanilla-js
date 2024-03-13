export class OnEventDo {
  /** @param {HTMLElement} el */
  constructor(el) {
    this.el = el;
    this.initEvents();
  }
  get eventsConfig() {
    const rawConfig = this.el.getAttribute('data-on-event-do');
    const parsedConfig = /** @type {[eventType:string, callbackString:string][]} */(JSON.parse(rawConfig ?? "[]"));
    return parsedConfig;
  }
  initEvents() {
    this.eventsConfig.forEach(([eventType, callbackString]) => {
      function callback() {
        // here the cosumer can use "$" obtained from the orchestrator
        const $ = OnEventDo_Orchestrator.utilityFunction;
        eval(callbackString);
      };
      // the callback in "binded" to the element where the event is attached
      this.el.addEventListener(eventType, callback.bind(this.el));
    });

  }
}

export class OnEventDo_Orchestrator {

  /** @type {[HTMLElement,OnEventDo][]} */
  static instances = [];

  static utilityFunction = () => { console.error('Missign utility function. Did you called OnEventDo_Orchestrator.setUtilityFunction'); };

  static init() {
    // this function can be invoked multiple times
    // so that lazy added DOM element can be initialized in different moment
    document.querySelectorAll('[data-on-event-do]').forEach(el => {
      if (OnEventDo_Orchestrator.isElementAlreadyInitialized(el)) return;
      const instance = [el, new OnEventDo(el)];
      OnEventDo_Orchestrator.instances.push(instance);
    });
  }

  static isElementAlreadyInitialized(/** @type {HTMLElement} */el) {
    return OnEventDo_Orchestrator.instances.some((tupla) => tupla[0] === el);
  }

  static setUtilityFunction(fn) {
    OnEventDo_Orchestrator.utilityFunction = fn;
  }
}

// create a small jquery like utility functions
// that can be used inside the callbackString
export const $ = (elementOrSelector) => {
  /** @type {HTMLElement} */
  const el = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector;
  return {
    /**
     * @param {string} attrName - i.e. `aria-expanded`
     * @param {(string|number)[]} attrValues - `["true", "false"]`
     */
    toggleAttr(attrName, attrValues) {
      if (el.getAttribute(attrName) === attrValues[0]) el.setAttribute(attrName, attrValues[1]);
      else if (el.getAttribute(attrName) === attrValues[1]) el.setAttribute(attrName, attrValues[0]);
    },
    /**
     * @param {string} attrName - i.e. `aria-expanded`
     * @param {(string|number)} attrValue - `"true"`
     */
    setAttr(attrName, attrValue) {
      el.setAttribute(attrName, attrValue);
    },
    /**
     * @param {string} attrName - i.e. `aria-expanded`
     * @param {(string|number)} attrValue - `"true"`
     */
    removeAttr(attrName, attrValue) {
      el.removeAttribute(attrName, attrValue);
    },
    /**
     * @param  {...string} cssClasses
     */
    toggleClass(...cssClasses) {
      cssClasses.forEach((c) => el.classList.toggle(c));
    },
    /**
     * @param  {...string} cssClasses
     */
    setClass(...cssClasses) {
      cssClasses.forEach((c) => el.classList.add(c));
    },
    /**
     * @param  {...string} cssClasses
     */
    removeClass(...cssClasses) {
      cssClasses.forEach((c) => el.classList.remove(c));
    }
  };
};