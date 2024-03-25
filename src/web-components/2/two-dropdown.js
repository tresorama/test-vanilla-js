import { Utils } from '../../utils/global-utils';
const { createTrapFocus, createOnKeyPress, createOnClickOutside } = Utils;

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
  <style>
    two-dropdown {
      position: relative;
      display: inline-block;
    }
    two-dropdown-toggler {
      display: contents;
    }
    two-dropdown-content {
      position: absolute;
      top: 100%;
      left: 0;
      /* Exit Animation */
      visibility: hidden;
      transform-origin: top;
      transform: scaleY(0);
      transition: visibility 0s 0.15s, transform 0.05s 0.1s;
    }
    two-dropdown[open] two-dropdown-content {
      /* Enter Animation */
      visibility: visible;
      transform: none;
      transition: visibility 0s 0s, transform 0.10s 0s;
    }
    
    two-dropdown-content * {
      /* Exit Animation */
      visibility: hidden;
      opacity: 0;
      transition: visibility 0s 0.15s, opacity 0.15s;
    }
    two-dropdown[open] two-dropdown-content * {
      /* Enter Animation */
      visibility: visible;
      opacity: 1;
      transition: visibility 0s 0s, opacity 0.10s 0.10s;
    }
  </style>
`);

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
<div class="py-12 px-8">

    <two-dropdown
      data-open-on-hover
      data-open-on-click
      data-enable-trap-focus
      data-enable-close-on-click-outside
      data-enable-close-on-esc-press
    >
      <two-dropdown-toggler>
        <button class="p-2 border">Open Dropdown</button>
      </two-dropdown-toggler>
      <two-dropdown-content class="bg-lime-200">
        <div class="p-2 flex flex-col gap-6">
          <p>Dropdown Content</p>
          <a href="#">Link 1</a>
          <a href="#">Link 1</a>
        </div>
      </two-dropdown-content>
    </two-dropdown>

</div>
`,
);

// Web Component definition
class TwoDropdown extends HTMLElement {
  // Props
  get options() {
    return {
      enableTrapFocus: this.hasAttribute('data-enable-trap-focus'),
      openOnHover: this.hasAttribute('data-open-on-hover'),
      openOnClick: this.hasAttribute('data-open-on-click'),
      enableCloseOnClickOutside: this.hasAttribute('data-enable-close-on-click-outside'),
      enableCloseOnEscPress: this.hasAttribute('data-enable-close-on-esc-press'),
    };
  }
  // public API
  openDropdown() { this.setState({ name: 'open' }); }
  closeDropdown() { this.setState({ name: 'close' }); }
  toggleDropdown() { this.state.isOpen ? this.closeDropdown() : this.openDropdown(); }

  // Events
  events = {
    toggle: new CustomEvent('toggle'),
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
      this.dispatchEvent(this.events.toggle);
      return;
    }
    if (action.name === 'close') {
      // update state
      this.removeAttribute('open');
      // trigger event
      this.dispatchEvent(this.events.toggle);
      return;
    }
  }
  // Elements
  get elements() {
    return {
      /** @type {HTMLElement?} */
      toggler: this.querySelector('two-dropdown-toggler'),
      /** @type {HTMLElement?} */
      content: this.querySelector('two-dropdown-content'),
    };
  }

  // on mount
  connectedCallback() {
    this.initDOM();
    this.initListeners();
  }
  initDOM() { }
  initListeners() {
    const { toggler, content } = this.elements;
    const { openOnHover, openOnClick, enableTrapFocus, enableCloseOnClickOutside, enableCloseOnEscPress } = this.options;

    // listen toggler click/hover
    if (openOnClick) {
      toggler.addEventListener('click', () => this.toggleDropdown());
    }
    if (openOnHover) {
      this.addEventListener('mouseenter', () => this.openDropdown());
      this.addEventListener('mouseleave', () => this.closeDropdown());
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

    if (enableCloseOnClickOutside) {
      const handleClickOutside = createOnClickOutside(this, (e) => {
        if (!this.state.isOpen) return;
        e.preventDefault();
        e.stopPropagation();
        this.closeDropdown();
      });
      handleClickOutside.enable();
    }

    if (enableCloseOnEscPress) {
      const handleKeyPress = createOnKeyPress(this, (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          this.closeDropdown();
        }
      });
      this.addEventListener('toggle', () => {
        if (this.state.isOpen) handleKeyPress.enable();
        else handleKeyPress.disable();
      });
    }

  }
}
customElements.define("two-dropdown", TwoDropdown);
window.TwoDropdown = TwoDropdown;

customElements.define("two-dropdown-toggler", class extends HTMLElement { });
customElements.define("two-dropdown-content", class extends HTMLElement { });

