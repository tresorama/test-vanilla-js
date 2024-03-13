import anime from "animejs";
const { injectCss, createTrapFocus } = Utils;

document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <!-- modal-toggler + modal-wrapper -->
  <div class="py-12 px-8">
    <modal-toggler target="DEMO-MODAL">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Open modal
      </button>
    </modal-toggler>
    
    <modal-wrapper id="DEMO-MODAL">
      <div class="p-8 bg-white w-[40vw]">
        <h1>Modal</h1>
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
      </div>
    </modal-wrapper>
  </div>
`,
);

class ModalWrapper extends HTMLElement {
  /**
   * @type {{
   *   overlay: ModalOverlay;
   *   content: HTMLElement;
   * }}
   */
  get nodes() {
    const nodes = {
      overlay: this.querySelector("modal-overlay"),
      content: Array.from(this.children).find(
        (node) => node.tagName !== "modal-overlay",
      ),
    };
    if (!nodes.content) {
      throw new Error(
        "Missign elemnt insde <modal-wrapper>! Plaes add one Eleent insde",
      );
    }
    return nodes;
  }
  events = {
    toggle: new CustomEvent("toggle"),
  };
  state = {
    isOpen: false,
  };
  css = `
    modal-wrapper {
        display: none;
    }
    modal-wrapper.is-entering,
    modal-wrapper.is-leaving,
    modal-wrapper[open] {
        display: block;
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
    }
    modal-wrapper.is-entering modal-overlay,
    modal-wrapper.is-leaving modal-overlay,
    modal-wrapper[open] modal-overlay {
        z-index: -1;
        position: absolute;
        inset: 0;
        background-color: rgba(0,0,0,0.85);
        /*backdrop-filter: blur(3px);*/
    }
  `;

  // on mount
  connectedCallback() {
    this.initDom();
    this.initListener();
    this.state.isOpen = this.hasAttribute("open");
  }
  initDom() {
    // inject css
    injectCss(this.css, "modal-wrapper");

    // inject dom - backgground overlay
    const overlay = document.createElement("modal-overlay");
    this.appendChild(overlay);
  }
  initListener() {
    const { overlay, content } = this.nodes;

    // on overlay click close modal
    overlay.addEventListener("click", () => this.closeModal());

    // on "Esc" press close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal();
    });

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
  static observedAttributes = ["open"];
  ignoreAttributeChange = false;
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

        this.state.isOpen = true;
        this.dispatchEvent(this.events.toggle);
      } else {
        this.ignoreAttributeChange = true;
        await this.runCloseAnimation();
        this.ignoreAttributeChange = false;

        this.state.isOpen = false;
        this.dispatchEvent(this.events.toggle);
      }
    }
  }

  // animation
  runOpenAnimation() {
    return new Promise((resolve) => {
      const { overlay, content } = this.nodes;

      anime
        .timeline({
          duration: 250,
          easing: "easeOutCubic",
          begin: () => {
            this.classList.add("is-entering");
          },
          complete: () => {
            this.classList.remove("is-entering");
            resolve();
          },
        })
        .add({
          targets: overlay,
          opacity: ["0", "1"],
        })
        .add(
          {
            targets: content,
            scale: ["0", "1"],
            opacity: ["0", "1"],
          },
          "-=200",
        );
    });
  }
  runCloseAnimation() {
    return new Promise((resolve) => {
      const { overlay, content } = this.nodes;
      anime
        .timeline({
          duration: 250 * 0.85,
          easing: "easeOutCubic",
          begin: () => {
            this.classList.add("is-leaving");
          },
          complete: () => {
            this.classList.remove("is-leaving");
            resolve();
          },
        })
        .add({
          targets: overlay,
          opacity: ["1", "0"],
        })
        .add(
          {
            targets: content,
            scale: ["1", "0"],
            opacity: ["1", "0"],
          },
          0,
        );
    });
  }

  // public api
  openModal() {
    if (this.state.isOpen) return;
    this.setAttribute("open", "");
  }
  closeModal() {
    if (!this.state.isOpen) return;
    this.removeAttribute("open");
  }
  toggleModal() {
    if (this.state.isOpen) this.closeModal();
    else this.openModal();
  }
}
customElements.define("modal-wrapper", ModalWrapper);
window.ModalWrapper = ModalWrapper;

class ModalToggler extends HTMLElement {
  /** @type {ModalWrapper} */
  get target() {
    const targetId = this.getAttribute("target");
    if (!targetId) {
      throw new Error("target attribute not found on <modal-toggler>");
    }

    /** @type{ModalWrapper | null} */
    const modal = document.querySelector(`modal-wrapper#${targetId}`);
    if (!modal) {
      console.error("Missing <modal-wrapper> with id: " + targetId);
      return;
    }
    return modal;
  }

  // on mount
  connectedCallback() {
    // on click => toggle the taget modal
    this.addEventListener("click", () => {
      this.target.toggleModal();
    });
  }
}
customElements.define("modal-toggler", ModalToggler);
window.ModalToggler = ModalToggler;

class ModalOverlay extends HTMLElement { }
customElements.define("modal-overlay", ModalOverlay);
window.ModalOverlay = ModalOverlay;
