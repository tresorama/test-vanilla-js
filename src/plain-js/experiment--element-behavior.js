import { Utils } from '../utils/global-utils';

const { createOnClickOutside } = Utils;

// document.body.insertAdjacentHTML(
//   "afterbegin",
//   `
// <section class="py-12 px-8 flex flex-col gap-4 bg-red-200">

// <ux-on-click data-callback="console.log(this.tagName)">
//   <button>click me</button>
// </ux-on-click>

// <ux-on-click-outside data-callback="console.log(this.tagName)">
//   <button>click outside me</button>
// </ux-on-click-outside>

// <ux-on-click-outside data-callback="this.open = false">
//   <details>
//     <summary>head</summary>
//     <div>content</div>
//   </details>
// </ux-on-click-outside>

// </section>
// `,
// );

class UxOnClick extends HTMLElement {
  connectedCallback() {
    const callbackCode = this.getAttribute("data-callback") ?? "";
    const callback = function () {
      eval(callbackCode);
    };
    this.firstElementChild.addEventListener("click", callback);
  }
}
customElements.define("ux-on-click", UxOnClick);

class UxOnClickOutside extends HTMLElement {
  connectedCallback() {
    const callbackCode = this.getAttribute("data-callback") ?? "";
    let callback = function () {
      eval(callbackCode);
    };
    callback = callback.bind(this.firstElementChild);

    this.onClickOutside = createOnClickOutside(
      this.firstElementChild,
      callback,
    );
    this.onClickOutside.enable();
  }
  disconnectedCallback() {
    this.onClickOutside.disable();
  }
}
customElements.define("ux-on-click-outside", UxOnClickOutside);

document.body.insertAdjacentHTML(
  "afterbegin",
  `
<section class="py-12 px-8 flex flex-col gap-6 bg-red-200">
  <button 
    data-behavior="
      on-click-log-tagname 
      on-click-outside
    "
  >Yo</button>

</section>
`,
);

class ElementBehavior {
  /**
   * @param {string} key - i.e. `on-click-log-tagname`
   * @param {(el:HTMLElement) => void} initiator
   */
  constructor(key, initiator) {
    const selector = `*[data-behavior*="${key}"]`;
    document.querySelectorAll(selector).forEach(initiator);
  }
}

new ElementBehavior("on-click-log-tagname", (el) => {
  el.addEventListener("click", () => console.log(el.tagName));
});
new ElementBehavior("on-click-outside", (el) => {
  const onClickOutside = createOnClickOutside(el, () => {
    const h = Math.round(Math.random() * 255);
    el.style.background = `hsl(${h} 100% 50%)`;
  });
  onClickOutside.enable();
});
