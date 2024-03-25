import { Utils } from '../../utils/global-utils';
const { createTrapFocus, createOnKeyPress } = Utils;

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
  <style>
    two-dialog {
      z-index: 10;
      position: fixed;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
    }
    two-dialog-backdrop,
    [data-two-dialog-content] {
      pointer-events: none;
    }
    two-dialog[open] two-dialog-backdrop,
    two-dialog[open] [data-two-dialog-content] {
      pointer-events: all;
    }
    two-dialog-backdrop {
      z-index: 9;
      position: absolute;
      inset: 0;
      background: hsl(0 0% 0% / 0.5);
      /* Exit Animation */
      visibility: hidden;
      opacity: 0;
      transition: visibility 0s 0.2s, opacity 0.2s;
    }
    two-dialog[open] two-dialog-backdrop {
      /* Enter Animation */
      visibility: visible;
      opacity: 1;
      transition: visibility 0s 0s, opacity 0.2s;
    }
    [data-two-dialog-content] {
      z-index: 10;
      position: absolute;
      /* Exit Animation */
      visibility: hidden;
      opacity: 0;
      transform: scale(0);
      transition: visibility 0s 0.2s, opacity 0.2s, transform 0.2s;
    }
    two-dialog[open] [data-two-dialog-content] {
      /* Enter Animation */
      visibility: visible;
      opacity: 1;
      transform: none;
      transition: visibility 0s 0s, opacity 0.2s, transform 0.2s;
    }
  </style>
`);

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
<div class="py-12 px-8 flex gap-12">

  <div class="flex flex-col gap-2">
    <two-dialog-toggler
      data-dialog-id="demo--two-dialog--modal"
      data-button-type="toggle"
    >
      <button class="border">Toggle two-dialog (Modal)</button>
    </two-dialog-toggler>

    <two-dialog-toggler
      data-dialog-id="demo--two-dialog--modal"
      data-button-type="open"
    >
      <button class="border">Open two-dialog (Modal)</button>
    </two-dialog-toggler>
  
    <two-dialog
      id="demo--two-dialog--modal"
      data-has-modal-behavior
      data-enable-trap-focus
      data-enable-close-on-backdrop-press
      data-enable-close-on-esc-press
      data-disable-body-scroll-when-open
    >
      <div class="p-8 bg-lime-200 flex flex-col gap-6">
        <p>Dialog Content</p>
        <a href="#link1">Link 1</a>
        <a href="#link2">Link 1</a>
        <two-dialog-toggler
          data-dialog-id="demo--two-dialog--modal"
          data-button-type="close"
        >
          <button class="border">Close two-dialog (Modal)</button>
        </two-dialog-toggler>
      </div>
    </two-dialog>

  </div>

  <div class="flex flex-col gap-2">
    
    <two-dialog-toggler
      data-dialog-id="demo--two-dialog--non-modal"
      data-button-type="toggle"
    >
      <button class="border">Toggle two-dialog (Non Modal)</button>
    </two-dialog-toggler>

    <two-dialog-toggler
      data-dialog-id="demo--two-dialog--non-modal"
      data-button-type="open"
    >
      <button class="border">Open two-dialog (Non Modal)</button>
    </two-dialog-toggler>

    <two-dialog
      id="demo--two-dialog--non-modal"
    >
      <div class="p-8 bg-lime-200 flex flex-col gap-6">
        <p>Dialog Content</p>
        <a href="#">Link 1</a>
        <a href="#">Link 1</a>
        <two-dialog-toggler
          data-dialog-id="demo--two-dialog--non-modal"
          data-button-type="close"
        >
          <button class="border">Close two-dialog (Non Modal)</button>
        </two-dialog-toggler>
      </div>
    </two-dialog>

  </div>

</div>
`,
);

// Web Component definition
class TwoDialog extends HTMLElement {
  // Props
  get options() {
    return {
      hasModalBehavior: this.hasAttribute('data-has-modal-behavior'),
      enableTrapFocus: this.hasAttribute('data-enable-trap-focus'),
      enableCloseOnEscPress: this.hasAttribute('data-enable-close-on-esc-press'),
      enableCloseOnBackdropPress: this.hasAttribute('data-enable-close-on-backdrop-press'),
      disableBodyScrollWhenOpen: this.hasAttribute('data-disable-body-scroll-when-open'),
    };
  }
  // public API
  openDialog() { this.setState({ name: 'open' }); }
  closeDialog() { this.setState({ name: 'close' }); }
  toggleDialog() { this.state.isOpen ? this.closeDialog() : this.openDialog(); }

  // Events
  events = {
    toggle: new CustomEvent('toggle'),
  };
  // State
  get elements() {
    const id = this.id;
    return {
      backdrop: this.querySelector('two-dialog-backdrop'),
      content: this.querySelector('[data-two-dialog-content]'),
      buttons: {
        toggler: [...document.querySelectorAll(`[data-dialog-id="${id}"][data-button-type="toggle"]`)],
        opener: [...document.querySelectorAll(`[data-dialog-id="${id}"][data-button-type="open"]`)],
        closer: [...document.querySelectorAll(`[data-dialog-id="${id}"][data-button-type="close"]`)],
      }
    };
  }
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
      // update a11y
      [
        ...this.elements.buttons.closer,
        ...this.elements.buttons.opener,
        ...this.elements.buttons.toggler
      ].forEach(el => {
        el.setAttribute('aria-expanded', 'true');
      });
      // trigger event
      this.dispatchEvent(this.events.toggle);
      return;
    }
    if (action.name === 'close') {
      // update state
      this.removeAttribute('open');
      // update a11y
      [
        ...this.elements.buttons.closer,
        ...this.elements.buttons.opener,
        ...this.elements.buttons.toggler
      ].forEach(el => {
        el.setAttribute('aria-expanded', 'false');
      });
      // trigger event
      this.dispatchEvent(this.events.toggle);
      return;
    }
  }
  // on mount
  connectedCallback() {
    this.initDOM();
    this.initListeners();
    this.initA11y();
  }
  initDOM() {
    const { hasModalBehavior } = this.options;

    // add attribute to Modal content
    const content = this.firstElementChild;
    content.setAttribute('data-two-dialog-content', '');

    // create backdrop 
    if (hasModalBehavior) {
      const backdrop = document.createElement('two-dialog-backdrop');
      this.prepend(backdrop);
    }
  }
  initListeners() {
    const { backdrop, content, buttons } = this.elements;
    const { enableTrapFocus, enableCloseOnEscPress, enableCloseOnBackdropPress, disableBodyScrollWhenOpen } = this.options;

    buttons.opener.forEach(el => el.addEventListener('click', () => this.openDialog()));
    buttons.closer.forEach(el => el.addEventListener('click', () => this.closeDialog()));
    buttons.toggler.forEach(el => el.addEventListener('click', () => this.toggleDialog()));

    if (enableCloseOnBackdropPress) {
      // on overlay click close modal
      backdrop.addEventListener("click", () => {
        this.closeDialog();
      });
    }

    if (enableCloseOnEscPress) {
      // on "Esc" press close modal
      document.addEventListener("keydown", (e) => {
        if (!this.state.isOpen) return;
        if (e.key === "Escape") this.closeDialog();
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
      // disable body scroll when Modal is opened
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
  initA11y() {
    const { backdrop, content, buttons } = this.elements;
    const { hasModalBehavior } = this.options;

    // content
    content.role = "dialog";
    if (hasModalBehavior) content.ariaModal = "true";

    // buttons
    [
      ...this.elements.buttons.closer,
      ...this.elements.buttons.opener,
      ...this.elements.buttons.toggler
    ].forEach(el => {
      el.setAttribute('aria-haspopup', 'dialog');
      el.setAttribute('aria-controls', this.id);
      el.setAttribute('aria-expanded', 'false');
    });

  }
}
customElements.define("two-dialog", TwoDialog);
window.TwoDialog = TwoDialog;

customElements.define("two-dialog-toggler", class extends HTMLElement { });



