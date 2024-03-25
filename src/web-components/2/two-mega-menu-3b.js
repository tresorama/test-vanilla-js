import "./two-mega-menu-3b.style.css";
import { Utils } from "../../utils/global-utils";

const { traverseDOMTree } = Utils;


document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
<section class="py-6 px-8 bg-gray-100 min-h-[20rem]">

  <div class="h-[100px] relative bg-yellow-300">

    <div class="absolute top-1/2 -translate-y-1/2 left-2 flex">
      <div>Logo</div>
    </div>
    
    <div class="absolute top-1/2 -translate-y-1/2 right-2 min-[800px]:hidden">
      <mega-menu-3b-mobile-toggler target="DEMO-MEGA-MENU">
        <button>Menu</button>
      </mega-menu-3b-mobile-toggler>
    </div>

    <nav class="h-full">
      <mega-menu-3b
        id="DEMO-MEGA-MENU"
        data-desktop-min-width="800px"
      >
        <ul data-mega-menu-3b="menu">
            <li data-mega-menu-3b="menu-item">
                <span>B1</span>
                <div data-mega-menu-3b="submenu">
                    <ul>
                        <li data-mega-menu-3b="menu-item"><span>B2</span></li>
                        <li data-mega-menu-3b="menu-item"><span>B2</span></li>
                    </ul>
                    <img src="https://source.unsplash.com/random/900×700/?fruit,fun"/>
                    <img src="https://source.unsplash.com/random/900×700/?fun,1"/>
                </div>
            </li>
            <li data-mega-menu-3b="menu-item">
                <span>A1</span>
                <div data-mega-menu-3b="submenu">
                    <ul>
                        <li data-mega-menu-3b="menu-item"><span>A2</span></li>
                        <li data-mega-menu-3b="menu-item"><span>A2</span></li>
                        <li data-mega-menu-3b="menu-item"><span>A2</span></li>
                    </ul>
                    <img src="https://source.unsplash.com/random/900×700/?fruit,fun,4"/>
                    <img src="https://source.unsplash.com/random/900×700/?fun,2"/>
                </div>
            </li>
        </ul>
      </mega-menu-3b>
    </nav>
    
  </div>

</section>
`,
);





class TwoMegaMenu3b extends HTMLElement {
  events = {
    eventName: () => new CustomEvent('untitled')
  };

  get state() {
    return {
      mobileIsOpen: this.hasAttribute('data-is-opened-mobile'),
    };
  }

  get options() {
    return {
      desktopMinWidth: this.getAttribute("data-desktop-min-width") ?? "0px",
      desktopOpenOnHover: this.hasAttribute('data-desktop-open-on-hover'),
      desktopOpenOnClick: this.hasAttribute('data-desktop-open-on-click'),
    };
  }

  get elements() {
    /** @type{HTMLElement} */
    const menu = this.querySelector('[data-mega-menu-3b="menu"]');
    /** @type{HTMLElement[]} */
    const menuItems = [...this.querySelectorAll('[data-mega-menu-3b="menu-item"]')];
    /** @type{HTMLElement[]} */
    const menuItemsL1 = [...this.querySelectorAll('[data-mega-menu-3b="menu-item"][data-level="1"]')];
    /** @type{HTMLElement[]} */
    const menuItemsWithChildren = [...this.querySelectorAll('[data-mega-menu-3b="menu-item"][data-has-children]')];
    /** @type{HTMLElement[]} */
    const submenus = [...this.querySelectorAll('[data-mega-menu-3b="submenu"]')];

    return {
      menu,
      menuItems,
      menuItemsL1,
      menuItemsWithChildren,
      submenus,
    };
  }

  // public API
  openMobileMenu() {
    this.setAttribute('data-is-opened-mobile', '');
  }
  closeMobileMenu() {
    this.removeAttribute('data-is-opened-mobile');
  }
  toggleMobileMenu() {
    if (this.state.mobileIsOpen) this.closeMobileMenu();
    else this.openMobileMenu();
  }

  // on mount

  connectedCallback() {
    this.initDOM();
    this.initMobileAndDesktop();
  }


  // on unmount

  /** @type {() => {}[]} */
  cleanUpFunctions = [];

  disconnectedCallback() {
    this.cleanUpFunctions.forEach(fn => fn());
  }

  // 
  initDOM() {
    // add "data-attributes" attribute to items
    traverseDOMTree({
      rootElement: this,
      filter: (el) => el.getAttribute('data-mega-menu-3b') === 'menu-item',
      callback: ({ element, level }) => {
        element.setAttribute("data-level", level + 1);
        const hasSubmenu = Boolean(element.querySelector('[data-mega-menu-3b="submenu"]'));
        if (hasSubmenu) {
          element.setAttribute("data-has-children", "");
        }
      },
    });

  }
  initMobileAndDesktop() {
    const mobile = this.initMobile();
    const desktop = this.initDesktop();

    const mq = window.matchMedia(`(min-width: ${this.options.desktopMinWidth})`);
    const handleChangeMediaQuery = () => {
      const isDesktop = () => mq.matches;
      if (isDesktop()) {
        desktop.enable();
        mobile.disable();
      }
      else {
        desktop.disable();
        mobile.enable();
      }
    };
    handleChangeMediaQuery();
    mq.addEventListener('change', handleChangeMediaQuery);
    this.cleanUpFunctions.push(
      () => mq.removeEventListener('change', handleMediaQueryChange)
    );
  }
  initMobile() {
    const { menu, menuItems, menuItemsL1, menuItemsWithChildren } = this.elements;

    // add "--item-index" custom property for animation stagger
    [menu].forEach((el) => {
      let i = 0;
      traverseDOMTree({
        strategy: 'breadth-first-search',
        rootElement: el,
        filter: (el) => el.getAttribute('data-mega-menu-3b') === "menu-item",
        callback: ({ element, index }) => {
          element.style.setProperty("--item-index--mobile", i);
          i++;
        },
      });
    });

    // init dom updater
    const itemIsOpen = (el) => el.hasAttribute('open');
    const openItem = async (/** @type {HTMLElement} */menuItem) => {
      if (itemIsOpen(menuItem)) return;
      const submenu = this.elements.submenus.find(submenu => menuItem.contains(submenu));
      if (!submenu) return;
      menuItem.setAttribute("open", "");
      // await this.runAnimation.mobileOpenSubmenu(submenu);
    };
    const closeItem = async (/** @type {HTMLElement} */menuItem) => {
      if (!itemIsOpen(menuItem)) return;
      const submenu = this.elements.submenus.find(submenu => menuItem.contains(submenu));
      if (!submenu) return;
      menuItem.removeAttribute("open");
      // await this.runAnimation.mobileCloseSubmenu(submenu);
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

    // API
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

  }
  initDesktop() {
    const { menu, menuItems, menuItemsL1, menuItemsWithChildren } = this.elements;

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
    const openItem = (el) => el.setAttribute("open", "");
    const closeItem = (el) => el.removeAttribute("open");

    // actions
    const handleItemSelect = (/** @type {Event} */e) => {
      const menuItem = /** @type {HTMLElement} */(e.currentTarget);
      menuItemsL1.forEach((item) => {
        if (item === menuItem) openItem(item);
        else closeItem(item);
      });
    };
    const handleCloseMenu = () => {
      menuItemsL1.forEach(closeItem);
    };
    const handleItemDeselect = (/** @type {Event} */e) => {
      const menuItem = /** @type {HTMLElement} */(e.currentTarget);
      closeItem(menuItem);
    };

    return {
      enable: () => {
        this.setAttribute("data-is-desktop", "");
        // menu.addEventListener("mouseleave", handleCloseMenu);
        menuItemsL1.forEach((el) => {
          if (this.options.desktopOpenOnClick) {
            el.addEventListener("click", handleItemSelect);
          }
          if (this.options.desktopOpenOnHover) {
            el.addEventListener("mouseenter", handleItemSelect);
            el.addEventListener("mouseleave", handleItemDeselect);
          }
        });
      },
      disable: () => {
        this.removeAttribute("data-is-desktop");
        // menu.removeEventListener("mouseleave", handleCloseMenu);
        menuItemsL1.forEach((el) => {
          if (this.options.desktopOpenOnClick) {
            el.removeEventListener("click", handleItemSelect);
          }
          if (this.options.desktopOpenOnHover) {
            el.removeEventListener("mouseenter", handleItemSelect);
            el.removeEventListener("mouseleave", handleItemDeselect);
          }
        });
      },
    };

  }
}
customElements.define('two-mega-menu-3b', TwoMegaMenu3b);
window.TwoMegaMenu3b = TwoMegaMenu3b;

class MegaMenu3bMobileToggler extends HTMLElement {
  /** @type {TwoMegaMenu3b} */
  get target() {
    const targetId = this.getAttribute("target");
    if (!targetId) {
      throw new Error('<mega-menu-3b-mobile-toggler> requires "target" attribute but is not present!!');
    }
    const megaMenu = document.querySelector(`mega-menu-3b#${targetId}`);
    if (!megaMenu) {
      console.error("Missing <mega-menu-3b> with id: " + targetId);
      return;
    }
    return megaMenu;
  }

  // on mount
  connectedCallback() {
    // on click => toggle the taget mega-menu
    this.addEventListener("click", () => this.target.toggleMobileMenu());
  }

}
customElements.define("mega-menu-3b-mobile-toggler", MegaMenu3bMobileToggler);
window.MegaMenu3bMobileToggler = MegaMenu3bMobileToggler;


