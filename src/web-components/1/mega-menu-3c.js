import { Utils } from '../../utils/global-utils';
const { traverseDOMTree, injectCss } = Utils;



document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <style>
  /* Consumer CSS */

  mega-menu-3c {
    --anim-time-multiplier: 1;
  }

  mega-menu-3c[data-is-mobile] img {
    display: none;
  }
  mega-menu-3c [data-mega-menu-3c="menu-item"] {
    display: block;
    background: orange;
  }
  mega-menu-3c [data-mega-menu-3c="menu-item"] > span {
    border: solid;
    display: block;
  }
  mega-menu-3c[data-is-desktop]:has([data-mega-menu-3c="menu-item"][open]) {
    background: blue;
    color: white;
  }
  mega-menu-3c[data-is-desktop] [data-mega-menu-3c="submenu"] {
    padding: 2rem;
    display: flex;
    gap: 2rem;
    justify-content: space-between;
    background: blue;
    color: white;
  }
  mega-menu-3c[data-is-desktop] [data-mega-menu-3c="submenu"]  > * {
    flex: 1 1 0;
    min-width: 0;
  }
  mega-menu-3c[data-is-desktop] [data-mega-menu-3c="submenu"]  > img {
    aspect-ratio: 16 / 8;
    object-fit: cover;
  }
  mega-menu-3c[data-is-desktop] [data-mega-menu-3c="menu-item"] > span {
    display: block;
    padding: 0.5em 1em;
  }
  mega-menu-3c[data-is-desktop] [data-mega-menu-3c="menu-item"][data-level="2"] {
    background: green;
  }
  /*
      */

  </style>
  
  <section class="py-6 px-8 bg-gray-100 min-h-[20rem]">

    <div class="h-[100px] relative bg-emerald-300">

      <div class="absolute top-1/2 -translate-y-1/2 left-2 flex ">
        <div>Logo</div>
      </div>
      
      <div class="absolute top-1/2 -translate-y-1/2 right-2 min-[800px]:hidden">
        <mega-menu-3c-mobile-toggler target="DEMO-MEGA-MENU">
          <button>Menu</button>
        </mega-menu-3c-mobile-toggler>
      </div>

      <nav class="h-full">
        <mega-menu-3c
          id="DEMO-MEGA-MENU"
          data-desktop-min-width="800px"
          data-desktop-enable-hover
          data-desktop-enable-click
        >
          <ul data-mega-menu-3c="menu">
              <li data-mega-menu-3c="menu-item">
                  <span>B1</span>
                  <div data-mega-menu-3c="submenu">
                      <ul>
                          <li data-mega-menu-3c="menu-item"><span>B2</span></li>
                          <li data-mega-menu-3c="menu-item"><span>B2</span></li>
                      </ul>
                      <img src="https://source.unsplash.com/random/900×700/?fruit,fun"/>
                      <img src="https://source.unsplash.com/random/900×700/?fun,1"/>
                  </div>
              </li>
              <li data-mega-menu-3c="menu-item">
                  <span>A1</span>
                  <div data-mega-menu-3c="submenu">
                      <ul>
                          <li data-mega-menu-3c="menu-item"><span>A2</span></li>
                          <li data-mega-menu-3c="menu-item"><span>A2</span></li>
                          <li data-mega-menu-3c="menu-item"><span>A2</span></li>
                      </ul>
                      <img src="https://source.unsplash.com/random/900×700/?fruit,fun,4"/>
                      <img src="https://source.unsplash.com/random/900×700/?fun,2"/>
                  </div>
              </li>
          </ul>
        </mega-menu-3c>
      </nav>
      
    </div>
  
  </section>
`,
);

class MegaMenu3c extends HTMLElement {
  css = `
      mega-menu-3c ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      mega-menu-3c {
        display: block;
        height: 100%;
        width: 100%;
      }

      mega-menu-3c {
        --anim-time-multiplier: 1;
      }

      /* ==========================================
      Mobile 
      ============================================== */

      mega-menu-3c[data-is-mobile] {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: auto;

        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.4s;
      }
      mega-menu-3c[data-is-mobile] > * {
        overflow: hidden;
      }
      
      mega-menu-3c[data-is-mobile][data-is-opened-mobile] {
        grid-template-rows: 1fr;
      }

      mega-menu-3c[data-is-mobile] [data-mega-menu-3c="menu-item"][data-level="1"] {
        opacity: 0;
        transition: opacity 0.4s;
      }
      mega-menu-3c[data-is-mobile][data-is-opened-mobile] [data-mega-menu-3c="menu-item"][data-level="1"] {
        opacity: 1;
        transition-delay: calc(0.4s * var(--item-index--mobile));
      }

      mega-menu-3c[data-is-mobile] [data-mega-menu-3c="submenu"] {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.4s;
      }
      
      mega-menu-3c[data-is-mobile] [data-mega-menu-3c="submenu"] > * {
        overflow: hidden;
        z-index: 1;
      }
      
      mega-menu-3c[data-is-mobile] [data-mega-menu-3c="menu-item"][open] > [data-mega-menu-3c="submenu"] {
        grid-template-rows: 1fr;
      }

      /* ==========================================
      Desktop 
      ============================================== */

      mega-menu-3c[data-is-desktop] {
        display: block;
      }
      mega-menu-3c[data-is-desktop] [data-mega-menu-3c="menu"] {
        position: relative;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      mega-menu-3c[data-is-desktop] [data-mega-menu-3c="menu-item"][data-level="1"] {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      mega-menu-3c[data-is-desktop] [data-mega-menu-3c="submenu"] {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        pointer-events: none;
        animation: mega-menu-3c--desktop--submenu-exit 1  both;
        animation-duration: calc(var(--anim-time-multiplier) * 0.2s);
      }
      mega-menu-3c[data-is-desktop] [data-mega-menu-3c="submenu"] * {
        pointer-events: none;
        animation: mega-menu-3c--desktop--submenu-children-exit 1 both;
        animation-duration: calc(var(--anim-time-multiplier) * 0.3s);
      }
      mega-menu-3c[data-is-desktop] [open] > [data-mega-menu-3c="submenu"] {
        pointer-events: all;
        animation: mega-menu-3c--desktop--submenu-enter 1 both;
        animation-duration: calc(var(--anim-time-multiplier) * 0.3s);
      }
      mega-menu-3c[data-is-desktop] [open] > [data-mega-menu-3c="submenu"] * {
        pointer-events: all;
        animation: mega-menu-3c--desktop--submenu-children-enter 1 both;
        animation-duration: calc(var(--anim-time-multiplier) * 0.3s);
        animation-delay: calc(var(--item-index--desktop, 0) * 0.05s * var(--anim-time-multiplier));
      }
      
      @keyframes mega-menu-3c--desktop--submenu-enter {
        from {
          opacity: 0;
          transform: scaleY(0);
          transform-origin: top;
        }
        to {
          opacity: 1;
          transform: none;
          transform-origin: top;
        }
      }
      @keyframes mega-menu-3c--desktop--submenu-exit {
        from {
          opacity: 1;
          transform: scaleY(1);
          transform-origin: top;
        }
        to {
          opacity: 0;
          transform: scaleY(0);
          transform-origin: top;
        }
      }
      @keyframes mega-menu-3c--desktop--submenu-children-enter {
        from {
          opacity: 0;
          transform: translateY(5vh);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      @keyframes mega-menu-3c--desktop--submenu-children-exit {
        from {
          opacity: 1;
          transform: none;
        }
        to {
          opacity: 0;
          transform: translateY(-5vh);
        }
      }

    `;

  get options() {
    return {
      desktopMinWidth: this.getAttribute("data-desktop-min-width") ?? "0px",
      desktopEnableHover: this.hasAttribute('data-desktop-enable-hover'),
      desktopEnableClick: this.hasAttribute('data-desktop-enable-click'),
    };
  }

  // on mount
  connectedCallback() {
    this.initDOM();
    this.initMobileAndDesktop();
  }
  initDOM() {

    // add CSS
    injectCss(this.css);

    // add "data-attributes" attribute to items
    traverseDOMTree({
      rootElement: this,
      filter: (el) => el.getAttribute('data-mega-menu-3c') === 'menu-item',
      callback: ({ element, level }) => {
        element.setAttribute("data-level", level + 1);
        const hasSubmenu = Boolean(element.querySelector('[data-mega-menu-3c="submenu"]'));
        if (hasSubmenu) {
          element.setAttribute("data-has-children", "");
        }
      },
    });

    // save elements

    /** @type{HTMLElement} */
    const menu = this.querySelector('[data-mega-menu-3c="menu"]');
    /** @type{HTMLElement[]} */
    const menuItems = [...this.querySelectorAll('[data-mega-menu-3c="menu-item"]')];
    /** @type{HTMLElement[]} */
    const menuItemsL1 = [...this.querySelectorAll('[data-mega-menu-3c="menu-item"][data-level="1"]')];
    /** @type{HTMLElement[]} */
    const menuItemsWithChildren = [...this.querySelectorAll('[data-mega-menu-3c="menu-item"][data-has-children]')];
    /** @type{HTMLElement[]} */
    const submenus = [...this.querySelectorAll('[data-mega-menu-3c="submenu"]')];
    this.elements = {
      menu,
      menuItems,
      menuItemsL1,
      menuItemsWithChildren,
      submenus,
    };


  }
  initMobileAndDesktop() {
    if (!this.elements) throw new Error('this shlud not happen!');
    const { menu, menuItems, menuItemsL1, menuItemsWithChildren } = this.elements;

    const mobile = (() => {

      // add "--item-index" custom property for animation stagger
      [menu].forEach((el) => {
        let i = 0;
        traverseDOMTree({
          strategy: 'breadth-first-search',
          rootElement: el,
          filter: (el) => el.getAttribute('data-mega-menu-3c') === "menu-item",
          callback: ({ element }) => {
            element.style.setProperty("--item-index--mobile", i);
            i++;
          },
        });
      });

      // init dom updater
      const itemIsOpen = (el) => el.hasAttribute('open');
      const openItem = (el) => el.setAttribute("open", "");
      const closeItem = (el) => el.removeAttribute("open");

      // actions

      // on item click => open me and close sibilings
      const handleItemClick = (/** @type{Event}*/ e) => {
        /** @type{HTMLElement} */
        const menuItem = e.currentTarget;

        // prevent bubble
        e.preventDefault();
        e.stopPropagation();

        // if trigger is not a menu item with children do nothing
        if (!menuItemsWithChildren.includes(menuItem)) return;

        // if is open => close
        if (itemIsOpen(menuItem)) {
          closeItem(menuItem);
          return;
        }

        // if is close => open me + close sibiling
        const menuItemsSibiling = [...menuItem.parentElement.children].filter((x) => x !== menuItem);
        menuItemsSibiling.forEach(closeItem);
        openItem(menuItem);
      };

      return {
        enable: () => {
          this.setAttribute("data-is-mobile", "");
          menuItems.forEach((el) => {
            el.addEventListener("click", handleItemClick);
          });
        },
        disable: () => {
          this.removeAttribute("data-is-mobile");
          menuItems.forEach((el) => {
            el.removeEventListener("click", handleItemClick);
          });
        },
      };
    })();
    this.cleanUpFunctions.push(mobile.disable);

    const desktop = (() => {

      // add "--item-index" custom property for animation stagger
      menuItemsL1.forEach((el) => {
        let i = 0;
        traverseDOMTree({
          rootElement: el,
          callback: ({ element }) => {
            element.style.setProperty("--item-index--desktop", i);
            i++;
          },
        });
      });

      // init dom updater
      const isOpenItem = (menuItem) => menuItem.hasAttribute("open");
      const openItem = (menuItem) => menuItem.setAttribute("open", "");
      const closeItem = (menuItem) => menuItem.removeAttribute("open");

      // handlers
      const handleItemSelect = (/** @type {Event} */e) => {
        const /** @type {HTMLElement} */ menuItem = e.currentTarget;
        menuItemsL1.forEach((item) => {
          if (item === menuItem) openItem(item);
          else closeItem(item);
        });
      };
      const handleItemDeselect = (/** @type {Event} */e) => {
        const /** @type {HTMLElement} */ menuItem = e.currentTarget;
        closeItem(menuItem);
      };
      const handleItemToggle = (/** @type {Event} */e) => {
        const /** @type {HTMLElement} */ menuItem = e.currentTarget;
        if (isOpenItem(menuItem)) handleItemDeselect(e);
        else handleItemSelect(e);
      };
      const handleDeselectAllItems = () => {
        menuItemsL1.forEach(closeItem);
      };

      return {
        enable: () => {
          this.setAttribute("data-is-desktop", "");

          if (this.options.desktopEnableClick) {
            menuItemsL1.forEach((el) => {
              el.addEventListener("click", handleItemToggle);
            });
          }

          if (this.options.desktopEnableHover) {
            menuItemsL1.forEach((el) => {
              el.addEventListener("mouseenter", handleItemSelect);
            });
            menu.addEventListener("mouseleave", handleDeselectAllItems);
          }
        },
        disable: () => {
          this.removeAttribute("data-is-desktop");

          if (this.options.desktopEnableClick) {
            menuItemsL1.forEach((el) => {
              el.removeEventListener("click", handleItemSelect);
            });
          }

          if (this.options.desktopEnableHover) {
            menuItemsL1.forEach((el) => {
              el.removeEventListener("mouseenter", handleItemSelect);
            });
            menu.addEventListener('mouseleave', handleDeselectAllItems);
          }

        },
      };
    })();
    this.cleanUpFunctions.push(desktop.disable);

    // listen to medua query change and toggle between mobile and desktop
    const mq = window.matchMedia(`(min-width: ${this.options.desktopMinWidth})`);
    const isMobile = () => !mq.matches;
    const handleMediaQueryChange = () => {
      if (isMobile()) {
        mobile.enable();
        desktop.disable();
      } else {
        mobile.disable();
        desktop.enable();
      }
    };
    handleMediaQueryChange();
    mq.addEventListener("change", handleMediaQueryChange);
    this.cleanUpFunctions.push(
      () => mq.removeEventListener('change', handleMediaQueryChange)
    );
  }

  // on unmount
  /** @type {(() => void)[]} */
  cleanUpFunctions = [];
  disconnectedCallback() {
    this.cleanUpFunctions.forEach(cleanupFunction => cleanupFunction());
  }

}
customElements.define("mega-menu-3c", MegaMenu3c);
window.MegaMenu3c = MegaMenu3c;


class MegaMenu3cMobileToggler extends HTMLElement {
  /** @type {MegaMenu3c} */
  get target() {
    const targetId = this.getAttribute("target");
    if (!targetId) {
      throw new Error('<mega-menu-3c-mobile-toggler> requires "target" attribute but is not present!!');
    }
    const megaMenu = document.querySelector(`mega-menu-3c#${targetId}`);
    if (!megaMenu) {
      console.error("Missing <mega-menu-3c> with id: " + targetId);
      return;
    }
    return megaMenu;
  }

  // on mount
  connectedCallback() {
    // on click => toggle the taget mega-menu
    this.addEventListener("click", () => {
      const { target } = this;
      const isOpened = target.hasAttribute('data-is-opened-mobile');
      if (isOpened) {
        this.target.removeAttribute('data-is-opened-mobile');
      }
      else {
        this.target.setAttribute('data-is-opened-mobile', '');
      }
    });
  }

}
customElements.define("mega-menu-3c-mobile-toggler", MegaMenu3cMobileToggler);
window.MegaMenu3cMobileToggler = MegaMenu3cMobileToggler;


