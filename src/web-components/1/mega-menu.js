import anime from "animejs";
import { Utils } from '../../global-utils';
const { injectCss, traverseDOMTree, debounce } = Utils;

document.body.insertAdjacentHTML(
  "afterbegin",
  `

<mega-menu>
  <ul class="p-4">
    <li>
      <span>A1</span>
      <ul class="p-1">
        <li>A2</li>
        <li>A2</li>
        <li>A2</li>
      </ul>
    </li>
    <li>
      <span>B1</span>
      <ul class="p-4">
        <li>B2</li>
        <li>B2</li>
        <li>B2</li>
      </ul>
    </li>
    <li>
      <span>C1</span>
      <ul class="p-4">
        <li>C2</li>
        <li>C2</li>
        <li>C2</li>
      </ul>
    </li>
  </ul>
</mega-menu>

`,
);

// Web Component definition
class MegaMenu extends HTMLElement {
  events = {
    itemOpened: (index) => new CustomEvent("item-opened", { detail: index }),
    itemClosed: (index) => new CustomEvent("item-closed", { detail: index }),
  };
  css = `
  mega-menu {
    box-sizing: border-box;
  }
  mega-menu > ul {
    background: orange;
    display: flex;
    gap: 10px;
  }
  /* L1 Item */
  mega-menu > ul > li {
    position: relative;
  }
  mega-menu > ul > li > span {
    color: blue;
    border: solid;
  }
  /* L2 List */
  mega-menu > ul > li > ul {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    /*display: none;*/
    overflow: hidden
  }
  mega-menu > ul > li[open] > ul {
    /*display: block;*/
  }
  /* L2 Items */
  mega-menu > ul > li > ul > span {
    color: blue;
    border: solid;
  }
  `;
  /**
   * @param {"ul"|"li"} tagname
   * @param {number} level
   * @param {number?} [index=undefined]
   * @returns {HTMLElement[]}
   */
  getItems(tagname, level, index = undefined) {
    let selector = `[data-tagname="${tagname}"]`;
    selector += `[data-level="${level}"]`;
    if (index) selector += `[data-index="${index}"]`;
    return Array.from(this.querySelectorAll(selector));
  }

  // on mount
  connectedCallback() {
    this.initDOM();
    this.initListeners();
  }
  initDOM() {
    // add css
    injectCss(this.css, "mega-menu");
    // add data-attribute to the element tree in DOM
    traverseDOMTree({
      rootElement: this.children[0],
      callback: ({ element: el, level, index }) => {
        el.setAttribute("data-tagname", el.tagName.toLowerCase());
        el.setAttribute("data-level", level);
        el.setAttribute("data-index", index);
      },
    });
  }
  initListeners() {
    this.initListener_openPanel();
  }

  // on hover | click of main menu items => open it and close other
  initListener_openPanel() {
    const l1Items = this.getItems("li", 0);

    // dom manipulation + animation
    const isOpen = (/** @type {HTMLElement} */ el) => el.hasAttribute("open");
    const TIME = 2000;
    const open = (/** @type {HTMLElement} */ el) => {
      //   if (isOpen(el)) return;

      /** @type {HTMLUListElement | null} */
      const submenu = [...el.children].find((x) => x.tagName === "UL");
      if (!submenu) return;

      //el.setAttribute("open", "");
      const tl = anime.timeline({
        easing: "easeOutCubic",
        duration: TIME,
      });
      tl.add({
        targets: submenu,
        height: ["0px", submenu.scrollHeight + "px"],
        begin: () => {
          submenu.style.setProperty("overflow", "hidden");
          submenu.style.setProperty("min-height", "0");
        },
        complete: () => {
          submenu.style.removeProperty("overflow");
          submenu.style.removeProperty("min-height");
        },
      });
      tl.add({
        targets: submenu.children,
        opacity: ["0", "1"],
        delay: anime.stagger(TIME * 0.4),
      });
    };
    const close = (/** @type {HTMLElement} */ el) => {
      //   if (!isOpen(el)) return;

      /** @type {HTMLUListElement | null} */
      const submenu = [...el.children].find((x) => x.tagName === "UL");
      if (!submenu) return;

      const tl = anime.timeline({
        easing: "easeOutCubic",
        duration: TIME,
        complete: () => {
          //el.removeAttribute("open");
        },
      });
      tl.add({
        targets: submenu.children,
        opacity: ["1", "0"],
        delay: anime.stagger(TIME * 0.4),
      });
      tl.add({
        targets: submenu,
        height: "0",
        begin: () => {
          submenu.style.setProperty("overflow", "hidden");
          submenu.style.setProperty("min-height", "0");
        },
        complete: () => {
          submenu.style.removeProperty("overflow");
          submenu.style.removeProperty("min-height");
        },
      });
    };

    // orchestration
    const handleMouseEnter = debounce((currentEl) => {
      open(currentEl);
      l1Items.filter((x) => x !== currentEl).forEach(close);
    }, 200);
    const handleMouseLeave = debounce((currentEl) => {
      close(currentEl);
    }, 200);

    // attach listeners
    l1Items.forEach((currentEl, i) => {
      currentEl.addEventListener("mouseenter", () =>
        handleMouseEnter(currentEl),
      );
      currentEl.addEventListener("mouseleave", () =>
        handleMouseLeave(currentEl),
      );
    });
  }
}
customElements.define("mega-menu", MegaMenu);
window.MegaMenu = MegaMenu;
