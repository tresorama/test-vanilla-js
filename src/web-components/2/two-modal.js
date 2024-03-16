import { Utils } from '../../global-utils';
const { createTrapFocus, createOnKeyPress } = Utils;

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
  <style>
    two-modal {
      z-index: 10;
      position: fixed;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      /* Closed State */
      pointer-events: none;
    }
    two-modal[open] {
      /* Open State */
      pointer-events: all;
    }
    two-modal-backdrop {
      position: absolute;
      inset: 0;
      z-index: -1;
      background: hsl(0 0% 0% / 0.5);
      /* Exit Animation */
      opacity: 0;
      transition: opacity 0.2s;
    }
    two-modal[open] two-modal-backdrop {
      /* Enter Animation */
      opacity: 1;
    }
    [data-two-modal-content] {
      position: absolute;
      /* Exit Animation */
      opacity: 0;
      transform: scale(0);
      transition: opacity 0.2s, transform 0.2s;
    }
    two-modal[open] [data-two-modal-content] {
      /* Enter Animation */
      opacity: 1;
      transform: none;
    }
  </style>
`);

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
<div class="py-12 px-8">

    <two-toggle
      data-event-1-type="click"
      data-event-1-cb='document.querySelector("two-modal").openModal()'
    >
      <button>Open two-modal</button>
    </two-toggle>
    
    <two-modal
      data-enable-trap-focus
      data-enable-close-on-backdrop-press
      data-enable-close-on-esc-press
      data-disable-body-scroll-when-open
    >
      <div class="p-8 bg-lime-200 flex flex-col gap-6">
        <p>Modal Content</p>
        <a href="#">Link 1</a>
        <a href="#">Link 1</a>
        <two-toggle
          data-event-1-type="click"
          data-event-1-cb='this.closest("two-modal").closeModal()'
        >
          <button>Close two-modal</button>
        </two-toggle>
      </div>
    </two-modal>

</div>
`,
);

// Web Component definition
class TwoModal extends HTMLElement {
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
      enableCloseOnEscPress: this.hasAttribute('data-enable-close-on-esc-press'),
      enableCloseOnBackdropPress: this.hasAttribute('data-enable-close-on-backdrop-press'),
      disableBodyScrollWhenOpen: this.hasAttribute('data-disable-body-scroll-when-open'),
    };
  }
  setState(/** @type {boolean} */newState) {
    if (newState) this.setAttribute('open', '');
    else this.removeAttribute('open');

    this.dispatchEvent(this.events.toggle);
  }
  // public API
  openModal() {
    this.setState(true);
  }
  closeModal() {
    this.setState(false);
  }
  toggleModal() {
    if (this.state.isOpen) this.closeModal();
    else this.openModal();
  }
  // on mount
  connectedCallback() {
    this.initDOM();
    this.initListeners();
  }
  initDOM() {
    // create backdrop 
    const backdrop = document.createElement('two-modal-backdrop');
    this.prepend(backdrop);
    // add attribute to Modal content
    const content = backdrop.nextElementSibling;
    content.setAttribute('data-two-modal-content', '');
  }
  get elements() {
    return {
      backdrop: this.querySelector('two-modal-backdrop'),
      content: this.querySelector('[data-two-modal-content]'),
    };
  }
  initListeners() {
    const { backdrop, content } = this.elements;
    const { enableTrapFocus, enableCloseOnEscPress, enableCloseOnBackdropPress, disableBodyScrollWhenOpen } = this.options;

    if (enableCloseOnBackdropPress) {
      // on overlay click close modal
      backdrop.addEventListener("click", () => {
        this.closeModal();
      });
    }

    if (enableCloseOnEscPress) {
      // on "Esc" press close modal
      document.addEventListener("keydown", (e) => {
        if (!this.state.isOpen) return;
        if (e.key === "Escape") this.closeModal();
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
}
customElements.define("two-modal", TwoModal);
window.TwoModal = TwoModal;
