import { Utils } from '../../utils/global-utils';
const { createTrapFocus, createOnKeyPress } = Utils;

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
  <style>
    two-drawer {
      z-index: 10;
      position: fixed;
      inset: 0;
      /* Closed State */
      pointer-events: none;
    }
    two-drawer[open] {
      /* Open State */
      pointer-events: all;
    }
    two-drawer-backdrop {
      position: absolute;
      inset: 0;
      z-index: -1;
      background: hsl(0 0% 0% / 0.5);
      /* Exit Animation */
      opacity: 0;
      transition: opacity 0.2s;
    }
    two-drawer[open] two-drawer-backdrop {
      /* Enter Animation */
      opacity: 1;
    }
    [data-two-drawer-content] {
      /* Exit Animation */
      transition: transform 0.2s;
    }
    two-drawer[open] [data-two-drawer-content] {
      /* Enter Animation */
      transform: none;
      transition: transform 0.2s;
    }
    [data-position="left"] [data-two-drawer-content] {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      /* Exit Animation */
      transform: translateX(-100%);
    }

    [data-position="right"] [data-two-drawer-content] {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      /* Exit Animation */
      transform: translateX(100%);
    }
    [data-position="top"] [data-two-drawer-content] {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      /* Exit Animation */
      transform: translateY(-100%);
    }
    [data-position="bottom"] [data-two-drawer-content] {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      /* Exit Animation */
      transform: translateY(100%);
    }
    </style>
`);

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
<div class="py-12 px-8">

    <two-toggle
      data-event-1-type="click"
      data-event-1-cb='document.querySelector("two-drawer").openDrawer()'
    >
      <button>Open two-drawer</button>
    </two-toggle>
    
    <two-drawer
      data-position="right"
      data-enable-trap-focus
      data-enable-close-on-backdrop-press
      data-enable-close-on-esc-press
      data-disable-body-scroll-when-open
    >
      <div class="p-8 bg-lime-200 flex flex-col gap-6">
        <p>Drawer Content</p>
        <a href="#">Link 1</a>
        <a href="#">Link 1</a>
        <two-toggle
          data-event-1-type="click"
          data-event-1-cb='this.closest("two-drawer").closeDrawer()'
        >
          <button>Close two-drawer</button>
        </two-toggle>
      </div>
    </two-drawer>

</div>
`,
);

// Web Component definition
class TwoDrawer extends HTMLElement {
  // Props
  get options() {
    return {
      enableTrapFocus: this.hasAttribute('data-enable-trap-focus'),
      enableCloseOnEscPress: this.hasAttribute('data-enable-close-on-esc-press'),
      enableCloseOnBackdropPress: this.hasAttribute('data-enable-close-on-backdrop-press'),
      disableBodyScrollWhenOpen: this.hasAttribute('data-disable-body-scroll-when-open'),
    };
  }
  // public API
  openDrawer() { this.setState({ name: 'open' }); }
  closeDrawer() { this.setState({ name: 'close' }); }
  toggleDrawer() { this.state.isOpen ? this.closeDrawer() : this.openDrawer(); }

  // Events
  events = {
    toggle: () => new CustomEvent('toggle'),
  };
  // State
  get state() {
    return {
      isOpen: this.hasAttribute('open'),
    };
  };
  /**
   * @param {{
  *   name: "open" | "close"
  * }} action 
  */
  setState(action) {
    if (action.name === 'open') {
      // update state
      this.setAttribute('open', '');
      // trigger event
      this.dispatchEvent(this.events.toggle());
      return;
    }
    if (action.name === 'close') {
      // update state
      this.removeAttribute('open');
      // trigger event
      this.dispatchEvent(this.events.toggle());
      return;
    }
  }

  // Elements
  get elements() {
    return {
      backdrop: this.querySelector('two-drawer-backdrop'),
      content: this.querySelector('[data-two-drawer-content]'),
    };
  }

  // on mount
  connectedCallback() {
    this.initDOM();
    this.initListeners();
  }
  initDOM() {
    // create backdrop 
    const backdrop = document.createElement('two-drawer-backdrop');
    this.prepend(backdrop);
    // add attribute to drawer content
    const content = backdrop.nextElementSibling;
    content.setAttribute('data-two-drawer-content', '');
  }

  initListeners() {
    const { backdrop, content } = this.elements;
    const { enableTrapFocus, enableCloseOnEscPress, enableCloseOnBackdropPress, disableBodyScrollWhenOpen } = this.options;

    if (enableCloseOnBackdropPress) {
      // on overlay click => close modal
      backdrop.addEventListener("click", () => {
        this.closeDrawer();
      });
    }

    if (enableCloseOnEscPress) {
      // on "Esc" press => close modal
      document.addEventListener("keydown", (e) => {
        if (!this.state.isOpen) return;
        if (e.key === "Escape") this.closeDrawer();
      });
    }

    if (enableTrapFocus) {
      // trap focus when opened
      const trapFocus = createTrapFocus(content);
      this.addEventListener("toggle", () => {
        if (this.state.isOpen) {
          trapFocus.enable();
          trapFocus.focusFirstChild();
        } else {
          trapFocus.disable();
          trapFocus.restoreFocus();
        }
      });
    }

    if (disableBodyScrollWhenOpen) {
      // disable body scroll when drawer is opened
      this.addEventListener('toggle', () => {
        if (this.state.isOpen) {
          document.body.style.width = "100vw";
          document.body.style.height = "100vh";
          document.body.style.overflow = 'hidden';
        }
        else {
          document.body.style.width = "";
          document.body.style.height = "";
          document.body.style.overflow = '';
        }
      });
    }
  }
}
customElements.define("two-drawer", TwoDrawer);
window.TwoDrawer = TwoDrawer;
