import { Utils } from '../../global-utils';
const { createTrapFocus, createOnKeyPress } = Utils;

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
      transform-origin: top;
      transform: scaleY(0);
      transition: transform 0.05s 0.1s;
    }
    two-dropdown-content * {
      /* Exit Animation */
      opacity: 0;
      transition: opacity 0.15s;
    }
    two-dropdown[open] two-dropdown-content {
      /* Enter Animation */
      transform: none;
      transition: transform 0.10s 0s;
    }
    two-dropdown[open] two-dropdown-content * {
      /* Enter Animation */
      opacity: 1;
      transition: opacity 0.10s 0.10s;
    }
  </style>
`);

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
<div class="py-12 px-8">

    <two-dropdown
      open
      data-open-on-hover
      data-open-on-click
      data-enable-trap-focus
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
  events = {
    toggle: new CustomEvent('toggle'),
  };
  get state() {
    return {
      isOpen: this.hasAttribute('open'),
    };
  };
  get options() {
    return {
      enableTrapFocus: this.hasAttribute('data-enable-trap-focus'),
      openOnHover: this.hasAttribute('data-open-on-hover'),
      openOnClick: this.hasAttribute('data-open-on-click'),
    };
  }
  setState(/** @type {boolean} */newState) {
    if (newState) this.setAttribute('open', '');
    else this.removeAttribute('open');

    this.dispatchEvent(this.events.toggle);
  }
  // public API
  openDropdown() {
    this.setState(true);
  }
  closeDropdown() {
    this.setState(false);
  }
  toggleDropdown() {
    if (this.state.isOpen) this.closeDropdown();
    else this.openDropdown();
  }
  // on mount
  connectedCallback() {
    this.initDOM();
    this.initListeners();
  }
  initDOM() {
  }
  get elements() {
    return {
      /** @type {HTMLElement?} */
      toggler: this.querySelector('two-dropdown-toggler'),
      /** @type {HTMLElement?} */
      content: this.querySelector('two-dropdown-content'),
    };
  }
  initListeners() {
    const { toggler, content } = this.elements;
    const { openOnHover, openOnClick, enableTrapFocus } = this.options;

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

  }
}
customElements.define("two-dropdown", TwoDropdown);
window.TwoDropdown = TwoDropdown;

customElements.define("two-dropdown-toggler", class extends HTMLElement { });
customElements.define("two-dropdown-content", class extends HTMLElement { });

