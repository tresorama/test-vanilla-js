import anime from "animejs";
const { traverseDOMTree, injectCss, setElementStyle } = Utils;



document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
  <style>
  /* Consumer CSS */

  mega-menu-3 {
    --anim-time-multiplier: 1;
  }

  mega-menu-3[data-is-mobile] img {
    display: none;
  }
  mega-menu-3 [data-mega-menu-3="menu-item"] {
    display: block;
    background: orange;
    border: solid;
  }
  mega-menu-3[data-is-desktop]:has([data-mega-menu-3="menu-item"][open]) {
    background: blue;
    color: white;
  }
  mega-menu-3[data-is-desktop] [data-mega-menu-3="submenu"] {
    padding: 2rem;
    display: flex;
    gap: 2rem;
    justify-content: space-between;
    background: blue;
    color: white;
  }
  mega-menu-3[data-is-desktop] [data-mega-menu-3="submenu"]  > * {
    flex: 1 1 0;
    min-width: 0;
  }
  mega-menu-3[data-is-desktop] [data-mega-menu-3="submenu"]  > img {
    aspect-ratio: 16 / 8;
    object-fit: cover;
  }
  mega-menu-3[data-is-desktop] [data-mega-menu-3="menu-item"] > span {
    display: block;
    padding: 0.5em 1em;
  }
  mega-menu-3[data-is-desktop] [data-mega-menu-3="menu-item"][data-level="2"] {
    background: green;
  }
  /*
      */

  </style>
  
  <section class="py-6 px-8 bg-gray-100 min-h-[20rem]">

    <div class="h-[100px] relative bg-red-100">

      <div class="absolute top-1/2 -translate-y-1/2 left-2 flex ">
        <div>Logo</div>
      </div>
      
      <div class="absolute top-1/2 -translate-y-1/2 right-2 min-[800px]:hidden">
        <mega-menu-3-mobile-toggler target="DEMO-MEGA-MENU">
          <button>Menu</button>
        </mega-menu-3-mobile-toggler>
      </div>

      <nav class="h-full">
        <mega-menu-3
          id="DEMO-MEGA-MENU"
          data-desktop-min-width="800px"
        >
          <ul data-mega-menu-3="menu">
              <li data-mega-menu-3="menu-item">
                  <span>B1</span>
                  <div data-mega-menu-3="submenu">
                      <ul>
                          <li data-mega-menu-3="menu-item"><span>B2</span></li>
                          <li data-mega-menu-3="menu-item"><span>B2</span></li>
                      </ul>
                      <img src="https://source.unsplash.com/random/900×700/?fruit,fun"/>
                      <img src="https://source.unsplash.com/random/900×700/?fun,1"/>
                  </div>
              </li>
              <li data-mega-menu-3="menu-item">
                  <span>A1</span>
                  <div data-mega-menu-3="submenu">
                      <ul>
                          <li data-mega-menu-3="menu-item"><span>A2</span></li>
                          <li data-mega-menu-3="menu-item"><span>A2</span></li>
                          <li data-mega-menu-3="menu-item"><span>A2</span></li>
                      </ul>
                      <img src="https://source.unsplash.com/random/900×700/?fruit,fun,4"/>
                      <img src="https://source.unsplash.com/random/900×700/?fun,2"/>
                  </div>
              </li>
          </ul>
        </mega-menu-3>
      </nav>
      
    </div>
  
  </section>
`,
);

class MegaMenu3 extends HTMLElement {
  css = `
      mega-menu-3 ul {
        list-style: none;
        border: solid;
        padding: 0;
        margin: 0;
      }

      mega-menu-3 {
        display: block;
        height: 100%;
        width: 100%;
      }

      mega-menu-3 {
        --anim-time-multiplier: 1;
      }

      /* Mobile */

      mega-menu-3[data-is-mobile] [data-mega-menu-3="menu"] {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
      }

      mega-menu-3[data-is-mobile][data-is-opened-mobile] [data-mega-menu-3="menu"] {
        display: block;
      }

      mega-menu-3[data-is-mobile] [data-mega-menu-3="submenu"] {
        display: none;
      }
      
      mega-menu-3[data-is-mobile] [data-mega-menu-3="menu-item"][open] > [data-mega-menu-3="submenu"] {
        display: block;
      }

      /* Desktop */

      mega-menu-3[data-is-desktop] {
        display: block;
      }
      mega-menu-3[data-is-desktop] [data-mega-menu-3="menu"] {
        position: relative;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      mega-menu-3[data-is-desktop] [data-mega-menu-3="menu-item"][data-level="1"] {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      mega-menu-3[data-is-desktop] [data-mega-menu-3="submenu"] {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        pointer-events: none;
        animation: mega-menu-3--desktop--submenu-exit 1  both;
        animation-duration: calc(var(--anim-time-multiplier) * 0.2s);
      }
      mega-menu-3[data-is-desktop] [data-mega-menu-3="submenu"] * {
        pointer-events: none;
        animation: mega-menu-3--desktop--submenu-children-exit 1 both;
        animation-duration: calc(var(--anim-time-multiplier) * 0.3s);
      }
      mega-menu-3[data-is-desktop] [open] > [data-mega-menu-3="submenu"] {
        pointer-events: all;
        animation: mega-menu-3--desktop--submenu-enter 1 both;
        animation-duration: calc(var(--anim-time-multiplier) * 0.3s);
      }
      mega-menu-3[data-is-desktop] [open] > [data-mega-menu-3="submenu"] * {
        pointer-events: all;
        animation: mega-menu-3--desktop--submenu-children-enter 1 both;
        animation-duration: calc(var(--anim-time-multiplier) * 0.3s);
        animation-delay: calc(var(--item-index, 0) * 0.05s * var(--anim-time-multiplier));
      }
      
      @keyframes mega-menu-3--desktop--submenu-enter {
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
      @keyframes mega-menu-3--desktop--submenu-exit {
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
      @keyframes mega-menu-3--desktop--submenu-children-enter {
        from {
          opacity: 0;
          transform: translateY(5vh);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      @keyframes mega-menu-3--desktop--submenu-children-exit {
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
      filter: (el) => el.getAttribute('data-mega-menu-3') === 'menu-item',
      callback: ({ element, level }) => {
        element.setAttribute("data-level", level + 1);
        const hasSubmenu = Boolean(
          element.querySelector('[data-mega-menu-3="submenu"]'),
        );
        if (hasSubmenu) {
          element.setAttribute("data-has-children", "");
        }
      },
    });

    // save elements

    /** @type{HTMLElement} */
    const menu = this.querySelector('[data-mega-menu-3="menu"]');
    /** @type{HTMLElement[]} */
    const menuItems = [...this.querySelectorAll('[data-mega-menu-3="menu-item"]')];
    /** @type{HTMLElement[]} */
    const menuItemsL1 = [...this.querySelectorAll('[data-mega-menu-3="menu-item"][data-level="1"]')];
    /** @type{HTMLElement[]} */
    const menuItemsWithChildren = [...this.querySelectorAll('[data-mega-menu-3="menu-item"][data-has-children]')];
    /** @type{HTMLElement[]} */
    const submenus = [...this.querySelectorAll('[data-mega-menu-3="submenu"]')];
    this.elements = {
      menu,
      menuItems,
      menuItemsL1,
      menuItemsWithChildren,
      submenus,
    };


    // add "--item-index" custom property for animation stagger
    menuItemsL1.forEach((el) => {
      let i = 0;
      traverseDOMTree({
        rootElement: el,
        callback: ({ element }) => {
          element.style.setProperty("--item-index", i);
          i++;
        },
      });
    });
  }
  initMobileAndDesktop() {
    if (!this.elements) throw new Error('this shlud not happen!');
    const { menu, menuItems, menuItemsL1, menuItemsWithChildren } = this.elements;

    // init mobile

    const mobile = (() => {
      // init dom updater
      const itemIsOpen = (el) => el.hasAttribute('open');
      const openItem = async (/** @type {HTMLElement} */menuItem) => {
        if (itemIsOpen(menuItem)) return;
        const submenu = this.elements.submenus.find(submenu => menuItem.contains(submenu));
        if (!submenu) return;
        menuItem.setAttribute("open", "");
        await this.runAnimation.mobileOpenSubmenu(submenu);
      };
      const closeItem = async (/** @type {HTMLElement} */menuItem) => {
        if (!itemIsOpen(menuItem)) return;
        const submenu = this.elements.submenus.find(submenu => menuItem.contains(submenu));
        if (!submenu) return;
        menuItem.removeAttribute("open");
        await this.runAnimation.mobileCloseSubmenu(submenu);
      };

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

    // init desktop

    const desktop = (() => {
      // init dom updater
      const openItem = (el) => el.setAttribute("open", "");
      const closeItem = (el) => el.removeAttribute("open");

      // actions
      const handleItemSelect = (/** @type {Event} */e) => {
        /** @type {HTMLElement} */
        const menuItem = e.currentTarget;
        menuItemsL1.forEach((item) => {
          if (item === menuItem) openItem(item);
          else closeItem(item);
        });
      };
      const handleCloseMenu = () => {
        menuItemsL1.forEach(closeItem);
      };
      const handleItemDeselect = (/** @type {Event} */e) => {
        /** @type {HTMLElement} */
        const menuItem = e.currentTarget;
        closeItem(menuItem);
      };

      return {
        enable: () => {
          this.setAttribute("data-is-desktop", "");
          // menu.addEventListener("mouseleave", handleCloseMenu);
          menuItemsL1.forEach((el) => {
            el.addEventListener("click", handleItemSelect);
            el.addEventListener("mouseenter", handleItemSelect);
            el.addEventListener("mouseleave", handleItemDeselect);
          });
        },
        disable: () => {
          this.removeAttribute("data-is-desktop");
          // menu.removeEventListener("mouseleave", handleCloseMenu);
          menuItemsL1.forEach((el) => {
            el.removeEventListener("click", handleItemSelect);
            el.removeEventListener("mouseenter", handleItemSelect);
            el.removeEventListener("mouseleave", handleItemDeselect);
          });
        },
      };
    })();

    // listen to media query change and toggle between mobile and desktop
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

  // on attribute change
  static observedAttributes = ["data-is-opened-mobile"];
  async attributeChangedCallback(name, oldValue, newValue) {

    if (name === "data-is-opened-mobile") {
      const action =
        newValue === true || (oldValue === null && newValue === "")
          ? "opening"
          : "closing";
      if (action === "opening") {
        await this.runAnimation.mobileOpenMenu();
      } else {
        await this.runAnimation.mobileCloseMenu();
      }
    }
  }

  // animation

  runAnimation = {
    mobileOpenMenu: () => {
      return new Promise(resolve => {
        const menu = this.elements.menu;
        menu.style.display = 'block';
        menu.style.overflow = 'hidden';
        anime({
          targets: menu,
          height: ['0', menu.scrollHeight + 'px'],
          duration: 200,
          easing: 'easeOutCirc',
          complete: () => {
            menu.style.display = '';
            menu.style.overflow = '';
            menu.style.height = '';
            resolve();
          }
        });
      });
    },
    mobileCloseMenu: () => {
      return new Promise(resolve => {
        const { menu } = this.elements;
        menu.style.display = 'block';
        menu.style.overflow = 'hidden';
        anime({
          targets: menu,
          height: [menu.scrollHeight + 'px', '0px'],
          duration: 200,
          easing: 'easeOutCirc',
          complete: () => {
            menu.style.display = '';
            menu.style.overflow = '';
            menu.style.height = '';
            resolve();
          }
        });
      });
    },
    mobileOpenSubmenu: (/** @type {HTMLElement} */submenu) => {
      return new Promise(resolve => {
        submenu.style.display = 'block';
        submenu.style.overflow = 'hidden';
        submenu.style.height = 'auto';
        anime({
          targets: submenu,
          height: ['0px', submenu.scrollHeight + 'px'],
          duration: 200,
          easing: 'easeOutCirc',
          complete: () => {
            submenu.style.display = '';
            submenu.style.overflow = '';
            submenu.style.height = '';
            resolve();
          }
        });
      });
    },
    mobileCloseSubmenu: (/** @type {HTMLElement} */submenu) => {
      return new Promise(resolve => {
        submenu.style.display = 'block';
        submenu.style.overflow = 'hidden';
        anime({
          targets: submenu,
          height: [submenu.scrollHeight + 'px', '0px'],
          duration: 200,
          easing: 'easeOutCirc',
          complete: () => {
            submenu.style.display = '';
            submenu.style.overflow = '';
            submenu.style.height = '';
            resolve();
          }
        });
      });
    },
  };
}
customElements.define("mega-menu-3", MegaMenu3);
window.MegaMenu3 = MegaMenu3;


class MegaMenu3MobileToggler extends HTMLElement {
  /** @type {MegaMenu3} */
  get target() {
    const targetId = this.getAttribute("target");
    if (!targetId) {
      throw new Error('<mega-menu-3-mobile-toggler> requires "target" attribute but is not present!!');
    }
    const megaMenu = document.querySelector(`mega-menu-3#${targetId}`);
    if (!megaMenu) {
      console.error("Missing <mega-menu-3> with id: " + targetId);
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
customElements.define("mega-menu-3-mobile-toggler", MegaMenu3MobileToggler);
window.MegaMenu3MobileToggler = MegaMenu3MobileToggler;


