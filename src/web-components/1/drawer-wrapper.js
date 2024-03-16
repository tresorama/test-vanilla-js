import anime from "animejs";
import { Utils } from '../../global-utils';
const { injectCss, createTrapFocus } = Utils;

document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <!-- Drawer wrapper -->
  <div class="py-12 px-8">
    <drawer-toggler target="DEMO-DRAWER">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Open Drawer
      </button>
    </drawer-toggler>
    <drawer-wrapper id="DEMO-DRAWER">
      <div class="w-[30vw] h-full grid place-items-center bg-white">
        <h1>Drawer</h1>
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
      </div>
    </drawer-wrapper>
  </div>
`,
);

class DrawerWrapper extends HTMLElement {
  /**
   * @type {{
   *   overlay: DrawerOverlay;
   *   content: Element;
   * }}
   */
  nodes = {
    overlay: null,
    content: null,
  };
  events = {
    toggle: new CustomEvent("toggle"),
  };
  state = {
    isOpen: false,
  };
  css = `
    drawer-wrapper {
        display: none;
    }
    drawer-wrapper.is-entering,
    drawer-wrapper.is-leaving,
    drawer-wrapper[open] {
        display: block;
        position: fixed;
        inset: 0;
    }
    drawer-wrapper.is-entering drawer-overlay,
    drawer-wrapper.is-leaving drawer-overlay,
    drawer-wrapper[open] drawer-overlay {
        z-index: -1;
        position: absolute;
        inset: 0;
        background-color: rgba(0,0,0,0.85);
        /*backdrop-filter: blur(3px);*/
    }
  `;
  // on mount
  connectedCallback() {
    this.initDOM();
    this.initListeners();
  }
  initDOM() {
    // inject css
    injectCss(this.css, "drawer-wrapper");

    // inject dom - background overlay
    const overlay = document.createElement("drawer-overlay");
    this.appendChild(overlay);

    // get all nodes
    const content = Array.from(this.children).find(
      (node) => node.tagName !== "drawer-overlay",
    );
    if (!content) {
      throw new Error(
        "Missign elemnt insde <drawer-wrapper>! Plaes add one Eleent insde",
      );
    }
    this.nodes = {
      overlay,
      content,
    };
  }
  initListeners() {
    const { overlay, content } = this.nodes;

    // on overlay click close modal
    overlay.addEventListener("click", () => {
      this.closeDrawer();
    });

    // on "Esc" press close modal
    document.addEventListener("keydown", (e) => {
      if (!this.state.isOpen) return;
      if (e.key === "Escape") this.closeDrawer();
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
  // public api
  openDrawer() {
    const { content, overlay } = this.nodes;

    const tl = anime.timeline({
      easing: "easeOutCubic",
      duration: 250,
      begin: () => {
        this.classList.add("is-entering");
      },
      complete: () => {
        this.classList.remove("is-entering");
        this.setAttribute("open", "");
        this.state.isOpen = true;
        this.dispatchEvent(this.events.toggle);
      },
    });

    tl.add({
      targets: content,
      translateX: ["-100%", "0%"],
    });
    tl.add(
      {
        targets: overlay,
        opacity: ["0", "0.85"],
      },
      "-=200",
    );

    // const anim = content.animate(
    //   [{ transform: "translateX(-80%)" }, { transform: "translateX(0%)" }],
    //   { duration: 300 },
    // );
    // anim.finished.then(() => {
    //   this.classList.remove("is-entering");
    //   this.setAttribute("open", "");
    //   this.state.isOpen = true;
    //   this.dispatchEvent(this.events.toggle);
    // });
  }
  closeDrawer() {
    const { content, overlay } = this.nodes;

    const tl = anime.timeline({
      easing: "easeOutCubic",
      duration: 250,
      begin: () => {
        this.classList.add("is-leaving");
      },
      complete: () => {
        this.classList.remove("is-leaving");
        this.removeAttribute("open");
        this.state.isOpen = false;
        this.dispatchEvent(this.events.toggle);
      },
    });

    tl.add({
      targets: overlay,
      opacity: ["0.85", "0"],
    });
    tl.add(
      {
        targets: content,
        translateX: ["0%", "-100%"],
      },
      0,
    );

    // this.classList.add("is-leaving");
    // const anim = content.animate(
    //   [{ transform: "translateX(0%)" }, { transform: "translateX(-100%)" }],
    //   { duration: 300 },
    // );
    // anim.finished.then(() => {
    //   this.classList.remove("is-leaving");
    //   this.removeAttribute("open");
    //   this.state.isOpen = false;
    //   this.dispatchEvent(this.events.toggle);
    // });
  }
}
customElements.define("drawer-wrapper", DrawerWrapper);
window.DrawerWrapper = DrawerWrapper;

class DrawerToggler extends HTMLElement {
  /** @type {DrawerWrapper} */
  target = null;
  // on mount
  connectedCallback() {
    this.initDOM();
    this.initListener();
  }
  initDOM() {
    // get corresponding <drawer-wrapper>
    const targetId = this.getAttribute("target");
    if (!targetId) {
      throw new Error("target attribute not found on <drawer-toggler>");
    }
    const /** @type{DrawerWrapper | null} */ drawer = document.querySelector(
      `drawer-wrapper#${targetId}`,
    );
    if (!drawer) {
      console.error("Missing <drawer-wrapper> with id: " + targetId);
    }
    this.target = drawer;
  }
  initListener() {
    if (!this.target) return;
    this.addEventListener("click", () => {
      this.target.openDrawer();
    });
  }
}
customElements.define("drawer-toggler", DrawerToggler);
window.DrawerToggler = DrawerToggler;

class DrawerOverlay extends HTMLElement { }
customElements.define("drawer-overlay", DrawerOverlay);
window.DrawerOverlay = DrawerOverlay;
