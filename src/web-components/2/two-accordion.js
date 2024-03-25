import { AnimationCollapse } from '../../utils/animations/collapse.css';
import { Utils } from '../../utils/global-utils';
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
    two-accordion-header {
      display: block;
    }
    two-accordion-content {
      display: block;
      overflow: hidden;
    }
    two-accordion-item:not([open]) two-accordion-content {
      display: none;
      animation: accordion-close 0.3s cubic-bezier(0.87, 0, 0.13, 1) 1 none;
    }
    two-accordion-item[open] two-accordion-content {
      display: block;
      animation: accordion-open 0.3s cubic-bezier(0.87, 0, 0.13, 1) 1 none ;
    }
    @keyframes accordion-open {
      from { height: 0px; }
      to { height: var(--animation--content-height);}
    }
    @keyframes accordion-close {
      from { height: var(--animation--content-height); display: block; }
      to { height: 0px; display: block; }
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
      <two-accordion-header>
        <h3>
          <button class="p-2 border">FAQ Question #1</button>
        </h3>
      </two-accordion-header>
      <two-accordion-content class="bg-lime-200">
        <div class="p-2 flex flex-col gap-6">
          <p>Accordion Content</p>
          <a href="#">Link 1</a>
          <a href="#">Link 1</a>
        </div>
      </two-accordion-content>
    </two-accordion-item>

    <two-accordion-item>
      <two-accordion-header>
        <h3>
          <button class="p-2 border">FAQ Question #2</button>
        </h3>
      </two-accordion-header>
      <two-accordion-content class="bg-lime-200">
        <div class="p-2 flex flex-col gap-6">
          <p>Accordion Content</p>
          <a href="#">Link 1</a>
          <a href="#">Link 1</a>
        </div>
      </two-accordion-content>
    </two-accordion-item>

    <two-accordion-item>
      <two-accordion-header>
        <h3>
          <button class="p-2 border">FAQ Question #3</button>
        </h3>
      </two-accordion-header>
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
  // Props
  get options() {
    return {
      isExclusive: this.hasAttribute('data-is-exclusive'),
    };
  }
  // Elements
  get elements() {
    return {
      /** @type {TwoAccordionItem[]} */
      items: [...this.querySelectorAll('two-accordion-item')],
    };
  }
  // on mount
  connectedCallback() {
    this.initDOM();
    this.initListeners();
  }
  initDOM() { }
  initListeners() {
    const { items } = this.elements;
    const { isExclusive } = this.options;

    if (isExclusive) {
      items.forEach(item => {
        item.addEventListener('before-open', () => {
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
  // public API
  openAccordion() { this.setState({ name: 'open-accordion' }); }
  closeAccordion() { this.setState({ name: 'close-accordion' }); }
  toggleAccordion() { this.state.isOpen ? this.closeAccordion() : this.openAccordion(); }

  // Events
  events = {
    toggle: () => new CustomEvent('toggle'),
    beforeOpen: () => new CustomEvent('before-open'),
    afterOpen: () => new CustomEvent('after-open'),
    beforeClose: () => new CustomEvent('before-close'),
    afterClose: () => new CustomEvent('after-close'),
  };

  // State
  get state() {
    return {
      isOpen: this.hasAttribute('open'),
    };
  }

  // Elements
  get elements() {
    return {
      /** @type {HTMLElement?} */
      header: this.querySelector('two-accordion-header'),
      /** @type {HTMLElement?} */
      headerButton: this.querySelector('two-accordion-header button'),
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
   * @param {{ 
   *   name: "open-accordion" | "close-accordion"
   * }} action 
   */
  setState(action) {
    if (action.name === 'open-accordion') {
      const { content, headerButton } = this.elements;
      // update state
      this.setAttribute('open', '');
      this.dispatchEvent(this.events.beforeOpen());
      // animate
      const a = new AnimationCollapse(content);
      a.open();
      // after animate
      this.onAnimationEnd = () => {
        // update a11y
        content.removeAttribute('hidden');
        headerButton.setAttribute('aria-expanded', 'true');
        // trigger event
        this.dispatchEvent(this.events.afterOpen());
        this.dispatchEvent(this.events.toggle());
      };
      return;
    }
    if (action.name === 'close-accordion') {
      const { content, headerButton } = this.elements;
      // update state
      this.removeAttribute('open');
      this.dispatchEvent(this.events.beforeClose());
      // animate
      const a = new AnimationCollapse(content);
      a.close();
      // after animate
      this.onAnimationEnd = () => {
        // update a11y
        content.setAttribute('hidden', '');
        headerButton.setAttribute('aria-expanded', 'false');
        // trigger event
        this.dispatchEvent(this.events.afterClose());
        this.dispatchEvent(this.events.toggle());
      };
      return;
    }
  }

  // on mount

  connectedCallback() {
    this.initListeners();
    this.initA11y();
  }
  initListeners() {
    const { header, content } = this.elements;
    content.addEventListener('animationend', () => this.handleAnimationEnd());
    header.addEventListener('click', () => this.toggleAccordion());
  }
  initA11y() {
    const { headerButton, content } = this.elements;

    // generate an "id" attribute if not present
    if (!content.id) content.id = "accordion-item--content--" + Date.now();
    if (!headerButton.id) headerButton.id = "accordion-item--headerButton--" + Date.now();

    // content
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', headerButton.id);
    this.state.isOpen ? content.removeAttribute('hidden') : content.setAttribute('hidden', '');

    // headerButton
    headerButton.setAttribute('aria-expanded', this.state.isOpen ? 'true' : 'false');
    headerButton.setAttribute('aria-controls', content.id);
  }
}
customElements.define("two-accordion-item", TwoAccordionItem);
window.TwoAccordionItem = TwoAccordionItem;

customElements.define("two-accordion-header", class extends HTMLElement { });
customElements.define("two-accordion-content", class extends HTMLElement { });
