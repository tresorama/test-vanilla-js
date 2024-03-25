document.body.insertAdjacentHTML("afterbegin", /*html*/`
<div class="py-12 px-8">

    <two-switch>
      <label>
      <input type="checkbox"/>
      Show Notification
      </label>
    </two-switch>

</div>
`);

class TwoSwitch extends HTMLElement {
  // Props
  get options() {
    return {};
  }
  // State / Attributes
  get checked() { return this.elements.inputCheckbox.hasAttribute('checked'); }
  set checked(/** @type{boolean} */value) { this.elements.inputCheckbox.checked = value; }

  // Events
  events = {
    toggle: () => new CustomEvent('toggle')
  };

  // Init
  get elements() {
    return {
      /** @type {HTMLInputElement} */
      inputCheckbox: this.querySelector('input[type="checkbox"]'),
      /** @type {HTMLLabelElement} */
      label: this.querySelector('label'),
    };
  }

  // on mount
  connectedCallback() {
    this.initDOM();
    this.initListeners();
    this.initA11y();
  }
  initDOM() { }
  initListeners() {
    const { inputCheckbox } = this.elements;

    inputCheckbox.addEventListener('change', () => {
      this.dispatchEvent(this.events.toggle());
    });
  }
  initA11y() {
    const { inputCheckbox, label } = this.elements;
    inputCheckbox.role = "switch";
  }

}
customElements.define('two-switch', TwoSwitch);
window.TwoSwitch = TwoSwitch;