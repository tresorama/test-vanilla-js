import { Utils } from '../../global-utils';
const { createTrapFocus, createOnKeyPress } = Utils;

document.body.insertAdjacentHTML(
  "afterbegin",
  `
<!-- <details is="details-expandable"> -->
<div class="py-12 px-8">
    
    <details 
      is="details-expandable"
      data-enable-trap-focus
    >
      <summary class="border">More Actions 1</summary>
      <div class="flex flex-col gap-2 border">
        <a href="#">Action 1</a>
        <a href="#">Action 2</a>
        <a href="#">Action 3</a>
        <a href="#">Action 4</a>
      </div>
    </details>

</div>
`,
);

// Web Component definition
class DetailsExpandable extends HTMLDetailsElement {
  static observedAttributes = ["open"];

  ignoreAttributeChange = false;

  get items() {
    return {
      /** @type {HTMLElement} */
      summary: this.querySelector("summary"),
      /** @type {HTMLElement} */
      content: this.querySelector("summary + *"),
    };
  }
  get options() {
    return {
      enableTrapFocus: this.hasAttribute("data-enable-trap-focus"),
    };
  }

  // on mount
  connectedCallback() {
    const { summary, content } = this.items;

    if (this.options.enableTrapFocus) {
      // trap focus when opened
      const trapFocus = createTrapFocus(content);
      this.addEventListener("toggle", () => {
        if (this.open) {
          trapFocus.enable();
          trapFocus.focusFirstChild();
        } else {
          trapFocus.disable();
          trapFocus.restoreFocus();
        }
      });

      // on key press while opened ...
      const onEscapePress = createOnKeyPress(window, (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          this.open = false;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          trapFocus.focusPrevChild();
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          trapFocus.focusNextChild();
        }
      });
      this.addEventListener("toggle", () => {
        if (this.open) {
          onEscapePress.enable();
        } else {
          onEscapePress.disable();
        }
      });
    }
  }
  async attributeChangedCallback(name, oldValue, newValue) {
    if (this.ignoreAttributeChange) return;

    if (name === "open") {
      const action =
        newValue === true || (oldValue === null && newValue === "")
          ? "opening"
          : "closing";
      if (action === "opening") {
        this.ignoreAttributeChange = true;
        await this.runOpenAnimation();
        this.ignoreAttributeChange = false;
      } else {
        this.ignoreAttributeChange = true;
        await this.runCloseAnimation();
        this.ignoreAttributeChange = false;
      }
    }
  }

  // animation
  runOpenAnimation() {
    const { summary, content } = this.items;

    return new Promise((resolve) => {
      this.open = true;
      content.style.overflow = "hidden";
      content
        .animate([{ height: "0" }, { height: content.scrollHeight + "px" }], {
          duration: 200,
        })
        .finished.then(() => {
          content.style.overflow = "";
          resolve();
        });
    });
  }
  runCloseAnimation() {
    const { summary, content } = this.items;

    return new Promise((resolve) => {
      this.open = true;
      content.style.overflow = "hidden";
      content
        .animate([{ height: content.scrollHeight + "px" }, { height: "0" }], {
          duration: 200,
        })
        .finished.then(() => {
          this.open = false;
          content.style.overflow = "";
          resolve();
        });
    });
  }
}
customElements.define("details-expandable", DetailsExpandable, {
  extends: "details",
});
window.DetailsExpandable = DetailsExpandable;
