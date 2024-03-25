import { Utils } from '../utils/global-utils';
const { debounce, throttleLeading } = Utils;

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
<section class="id-gdjfh py-12 px-8 bg-pink-200">

  <div class="accordion-wrapper">
    <div class="accordion-item" data-is-animatable>
      <div class="accordion-item__header">Accordion 1</div>
      <div class="accordion-item__content">
        <div class="accordion-item__content-inner">
          <div>Content</div>
        </div>
      </div>
    </div>
    <div class="accordion-item" data-is-animatable>
      <div class="accordion-item__header">Accordion 2</div>
      <div class="accordion-item__content">
        <div class="accordion-item__content-inner">
          <div>Content</div>
        </div>
      </div>
    </div>
    <div class="accordion-item" data-is-animatable>
      <div class="accordion-item__header">Accordion 3</div>
      <div class="accordion-item__content">
        <div class="accordion-item__content-inner">
          <div>Content</div>
        </div>
      </div>
    </div>
    <div class="accordion-item" data-is-animatable>
      <div class="accordion-item__header">Accordion 4</div>
      <div class="accordion-item__content">
        <div class="accordion-item__content-inner">
          <div>Content</div>
        </div>
      </div>
    </div>
  </div>

  <style>
  .id-gdjfh .accordion-wrapper {

  }
  .id-gdjfh .accordion-item {

  }
  .id-gdjfh .accordion-item__header {
    border: solid;
    padding: 1em;
    background: yellow;
  }
  .id-gdjfh .accordion-item__content {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows .4s ease-in-out;
    background: white;
  }
  .id-gdjfh .accordion-item__content > * {
    min-height: 0;
    overflow: hidden;
  }
  .id-gdjfh .is-entering > .accordion-item__content {
    grid-template-rows: 1fr;
  }
  .id-gdjfh .is-entered > .accordion-item__content {
    grid-template-rows: 1fr;
  }
  .id-gdjfh .is-leaving > .accordion-item__content {
    grid-template-rows: 0fr;
  }
  .id-gdjfh .accordion-item__content-inner > * {
    border: solid;
    padding: 1em;
  }
  </style>

</section>
`,
);

(() => {

  /** @type {HTMLElement} */
  const scope = document.querySelector('.id-gdjfh');
  /** @type {HTMLElement[]} */
  const animatables = [...scope.querySelectorAll('[data-is-animatable]')];

  // class
  class Animatable {
    get options() {
      const { el } = this;
      const raw = el.getAttribute('data-is-animatable');
      const parsed = JSON.parse(raw === "" ? "{}" : raw);
      return {
        /** @type {keyof HTMLElementEventMap} */
        inEvent: parsed.inEvent ?? 'click',
        /** @type {keyof HTMLElementEventMap} */
        outEvent: parsed.outEvent ?? 'click',
      };
    }

    /** @type {"IDLE"|"IN"|"ENTERED"|"OUT"} */
    state = "IDLE";

    /** @type {null | (() => void)} */
    onAnimationEnd = null;

    /**
     * @param {HTMLElement} el 
     */
    constructor(el) {
      this.el = el;
      const { inEvent, outEvent } = this.options;

      // debounce set state so that when a state hange happens, for a while the state cannot be updated again
      // this prevennt simultatenous state change that cancel each other
      this.setState = debounce(this.setState.bind(this), 300);

      el.addEventListener(inEvent, () => this.requestStateChange('IN'));
      el.addEventListener(outEvent, () => this.requestStateChange('OUT'));

      el.addEventListener('animationend', () => this.handleAnimationEnd());
      el.addEventListener('transitionend', () => this.handleAnimationEnd());
    }

    /** @param {"IDLE"|"IN"|"ENTERED"|"OUT"} newState */
    setState(newState) {
      this.state = newState;
      this.onAnimationEnd = {
        "IN": () => { this.setState("ENTERED"); },
        "OUT": () => { this.setState("IDLE"); },
      }[newState];
      this.render();
    }

    render() {
      const { state, el } = this;

      const CSS_CLASS = {
        IN: 'is-entering',
        OUT: 'is-leaving',
        ENTERED: 'is-entered',
      };

      if (state === 'IDLE') {
        el.classList.remove(CSS_CLASS.ENTERED, CSS_CLASS.IN, CSS_CLASS.OUT);
      }
      else if (state === 'IN') {
        el.classList.remove(CSS_CLASS.ENTERED, CSS_CLASS.IN, CSS_CLASS.OUT);
        el.classList.add(CSS_CLASS.IN);
      }
      else if (state === 'ENTERED') {
        el.classList.remove(CSS_CLASS.ENTERED, CSS_CLASS.IN, CSS_CLASS.OUT);
        el.classList.add(CSS_CLASS.ENTERED);
      }
      else if (state === 'OUT') {
        el.classList.remove(CSS_CLASS.ENTERED, CSS_CLASS.IN, CSS_CLASS.OUT);
        el.classList.add(CSS_CLASS.OUT);
      }

    }

    /**
     * This is a "reducer"  like logic
     * @param {"IN"|"OUT"} requestedStatus 
     * */
    requestStateChange(requestedState) {
      const { state } = this;

      // resolve status to really execute
      /** @type {"IN"| "OUT"} */
      let newState;
      if (state === requestedState) return;
      else if (state === 'IDLE' && requestedState === 'IN') newState = 'IN';
      else if (state === 'IDLE' && requestedState === 'OUT') return;
      else if (state === 'IN' && requestedState === 'OUT') newState = 'OUT';
      else if (state === 'OUT' && requestedState === 'IN') newState = 'IN';
      else if (state === 'ENTERED' && requestedState === 'IN') return;
      else newState = requestedState;

      // update state 
      this.setState(newState);

    }

    handleAnimationEnd() {
      this.onAnimationEnd?.();
    }
  }

  // init animatable
  animatables.forEach(el => new Animatable(el));

})();