import { Utils } from '../../global-utils';
const { createTrapFocus, createOnKeyPress } = Utils;

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
  <style>
    two-accordion {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  </style>
  <style>
    two-accordion-item {
      display: inline-block;
    }
    two-accordion-toggler {
      display: block;
    }
    two-accordion-content {
      display: block;
      overflow: hidden;
    }
    two-accordion-item:not([open]) two-accordion-content {
      display: none;
      animation: accordion-close .2s;
    }
    two-accordion-item[open] two-accordion-content {
      animation: accordion-open .2s;
    }
    @keyframes accordion-open {
      0% {height: 0px;}
      100% {height: var(--accordion-content-height);}
    }
    @keyframes accordion-close {
      0% {height: var(--accordion-content-height);}
      100% {height: 0px;}
    }
  </style>
`);

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
<div class="py-12 px-8">


  <two-accordion
    data-is-exclusive
  >

    <two-accordion-item>
      <two-accordion-toggler>
        <button class="p-2 border">Open Accordion</button>
      </two-accordion-toggler>
      <two-accordion-content class="bg-lime-200">
        <div class="p-2 flex flex-col gap-6">
          <p>Accordion Content</p>
          <a href="#">Link 1</a>
          <a href="#">Link 1</a>
        </div>
      </two-accordion-content>
    </two-accordion-item>

    <two-accordion-item>
      <two-accordion-toggler>
        <button class="p-2 border">Open Accordion</button>
      </two-accordion-toggler>
      <two-accordion-content class="bg-lime-200">
        <div class="p-2 flex flex-col gap-6">
          <p>Accordion Content</p>
          <a href="#">Link 1</a>
          <a href="#">Link 1</a>
        </div>
      </two-accordion-content>
    </two-accordion-item>

    <two-accordion-item>
      <two-accordion-toggler>
        <button class="p-2 border">Open Accordion</button>
      </two-accordion-toggler>
      <two-accordion-content class="bg-lime-200">
        <div class="p-2 flex flex-col gap-6">
          <p>Accordion Content</p>
          <a href="#">Link 1</a>
          <a href="#">Link 1</a>
        </div>
      </two-accordion-content>
    </two-accordion-item>
    

  </two-accordion>

</div>
`,
);

// Web Component definition
class TwoAccordion extends HTMLElement {
  get options() {
    return {
      isExclusive: this.hasAttribute('data-is-exclusive'),
    };
  }
  get elements() {
    return {
      /** @type {TwoAccordionItem[]} */
      items: [...this.querySelectorAll('two-accordion-item')],
    };
  }
  // on mount
  connectedCallback() {
    // this.initDOM();
    this.initListeners();
  }
  initDOM() {
  }
  initListeners() {
    const { items } = this.elements;
    const { isExclusive } = this.options;

    if (isExclusive) {
      items.forEach(item => {
        item.addEventListener('after-open', () => {
          const otherItems = items.filter(x => x !== item);
          otherItems.forEach(x => x.closeAccordion());
        });
      });
    }
  }
}
customElements.define("two-accordion", TwoAccordion);
window.TwoAccordion = TwoAccordion;


class TwoAccordionItem extends HTMLElement {

  events = {
    toggle: () => new CustomEvent('toggle'),
    afterOpen: () => new CustomEvent('after-open'),
    afterClose: () => new CustomEvent('after-close'),
  };

  get state() {
    return {
      isOpen: this.hasAttribute('open'),
    };
  }

  get elements() {
    return {
      /** @type {HTMLElement?} */
      toggler: this.querySelector('two-accordion-toggler'),
      /** @type {HTMLElement?} */
      content: this.querySelector('two-accordion-content'),
    };
  }

  /** @type {null | () => void} */
  onAnimationEnd = null;
  handleAnimationEnd() {
    this.onAnimationEnd?.();
    this.onAnimationEnd = null;
  }

  /**
   * Reducer like set state
   * @param {{ name: "open-accordion" | "close-accordion"}} action 
   */
  setState(action) {
    if (action.name === 'open-accordion') {
      const { content } = this.elements;
      // update state
      this.setAttribute('open', '');
      // animate
      content.style.display = 'block';
      this.style.setProperty('--accordion-content-height', content.scrollHeight + 'px');
      // trigger event
      this.onAnimationEnd = () => {
        this.dispatchEvent(this.events.toggle());
        this.dispatchEvent(this.events.afterOpen());
      };
      return;
    }
    if (action.name === 'close-accordion') {
      const { content } = this.elements;
      // update state
      this.removeAttribute('open');
      // animate
      this.style.setProperty('--accordion-content-height', content.scrollHeight + 'px');
      // trigger event
      this.onAnimationEnd = () => {
        content.style.display = 'none';
        this.dispatchEvent(this.events.toggle());
        this.dispatchEvent(this.events.afterClose());
      };
      return;
    }
  }

  // public API

  openAccordion() {
    this.setState({ name: 'open-accordion' });
  }
  closeAccordion() {
    this.setState({ name: 'close-accordion' });
  }
  toggleAccordion() {
    if (this.state.isOpen) this.closeAccordion();
    else this.openAccordion();
  }

  // on mount

  connectedCallback() {
    this.initListeners();
  }
  initListeners() {
    const { toggler, content } = this.elements;
    content.addEventListener('animationend', () => this.handleAnimationEnd());
    toggler.addEventListener('click', () => this.toggleAccordion());
  }
}
customElements.define("two-accordion-item", TwoAccordionItem);
window.TwoAccordionItem = TwoAccordionItem;

customElements.define("two-accordion-toggler", class extends HTMLElement { });
customElements.define("two-accordion-content", class extends HTMLElement { });
