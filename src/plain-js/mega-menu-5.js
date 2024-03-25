import anime from "animejs";
import { Utils } from '../utils/global-utils';

const {
  createPortal,
  createRestoreDOMPosition,
  animeFlip,
  debounce,
  traverseDOMTree,
  createListener,
} = Utils;

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
  <style>
  .mega-menu-5 ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  @media (max-width: 799px) {

    .mega-menu-5 {
      position: relative;
    }

    .mega-menu-5 .menu {
      display: none;
    }

    .mega-menu-5:has(.menu-mobile-toggler input:checked) .menu {
      display: block;
      position: absolute;
      left: 0;
      top: 100%;
      width: 100%;
      max-height: 80vh;
      overflow: auto;
    }

    .mega-menu-5 .menu-item {
      display: block;
      
    }
    .mega-menu-5 .menu-item__text {
      display: block;
      border: solid;
    }

    .mega-menu-5 .submenu {
      display: none;
    }
    
    .mega-menu-5 [open] > .submenu {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-left: 3rem;
    }

    
    /** Demo Consumer CSS */

    .mega-menu-5 .menu-item__text {
      padding: 1rem;
      background: orange;
    }

    .mega-menu-5 [open] > .menu-item__text {
      background: blue;
    }
    
    .mega-menu-5 .submenu img {
      aspect-ratio: 16/12;
      object-fit: cover;
    }


  }

  
  @media (min-width: 800px) {

    .mega-menu-5 .menu-mobile-toggler {
      display: none;
    }
    
    /* Layout */

    .mega-menu-5 .menu {
      display: flex;
      justify-content: flex-start;
      position: relative;
    }

    .mega-menu-5 .menu-item[data-level="1"] > .submenu {
      position: absolute;
      top: 100%;
      left: 0%;
      width: 100%;
      height: 80vh;
      
      /* Exit Animation */
      pointer-events: none;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.2s, visibility 0s 0.2s;
    }
    .mega-menu-5 .menu-item[data-level="1"]:hover > .submenu {
      /* Enter Animation */
      pointer-events: all;
      opacity: 1;
      visibility: visible;
      transition: opacity 0.2s, visibility 0s 0s;
    }

    .mega-menu-5 .menu-item[data-level="1"] > .submenu > ul {
      width: 30%;
      height: 100%;
    }

    .mega-menu-5 .menu-item[data-level="2"] > .submenu {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;

      width: 70%;
      height: 100%;
      overflow: auto;

      /* Exit Animation */
      pointer-events: none;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.2s, visibility 0s 0.2s;
    }
    .mega-menu-5 .menu-item[data-level="2"]:hover > .submenu {
      z-index: 20;
      /* Enter Animation */
      pointer-events: all;
      opacity: 1;
      visibility: visible;
      transition: opacity 0.2s, visibility 0s 0s;
    }

    .mega-menu-5 .menu-item__text {
      display: block;
    }
    
    .mega-menu-5 .menu-item[data-level="2"] > .menu-item__text {
      position: relative;
    }
    .mega-menu-5 .menu-item[data-level="2"] > .menu-item__text:after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 30%;
      width: 130%;
      height: 80vh;
      transform-origin: top left;
      transform: rotate(-45deg) translate(-5%, 5%);
      pointer-events: none;
      background: red;
      opacity: 0;
    }
    .mega-menu-5 .menu-item[data-level="2"]:hover > .menu-item__text:after {
      pointer-events: all;
      opacity: 0;
      z-index: 10;
    }
    .mega-menu-5 .menu-item[data-level="1"] {
      z-index: 1;
    }
    
    /* Demo Consumer CSS */

    .mega-menu-5 ul,
    .mega-menu-5 [data-level="2"] > .submenu,
    .mega-menu-5 .menu-item__text {
      border: solid;
    }

    .mega-menu-5 .menu-item {
      background: orange;
    }
    
    .mega-menu-5 .menu-item__text {
      padding: 1em 3em;
    }
    
    .mega-menu-5 .menu-item[data-level="2"] > .submenu:has(img) {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  
  }

  </style>
  
  <section class="py-6 px-8 bg-gray-100 min-h-[80rem]">
    <nav class="mega-menu-5">
        <label class="menu-mobile-toggler">
            Menu
            <input type="checkbox" />
        </label>
        <ul class="menu">
            <li class="menu-item">
                <span class="menu-item__text">C1</span>
                <div class="submenu">
                    <ul>
                        <li class="menu-item">
                          <span class="menu-item__text">C2 - 1</span>
                          <div class="submenu">
                            <img src="https://source.unsplash.com/random/900×700/?fruit,fun"/>
                            <img src="https://source.unsplash.com/random/900×700/?fun,1"/>
                          </div>
                        </li>
                        <li class="menu-item">
                          <span class="menu-item__text">C2 - 2</span>
                          <div class="submenu">
                            <img src="https://source.unsplash.com/random/900×700/?drug"/>
                            <img src="https://source.unsplash.com/random/900×700/?electronic"/>
                          </div>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="menu-item">
                <span class="menu-item__text">B1</span>
                <div class="submenu">
                    <ul>
                        <li class="menu-item">
                          <span class="menu-item__text">B2 - 1</span>
                          <div class="submenu">
                            <ul>
                              <li class="menu-item">
                                <span class="menu-item__text">B3 - 1</span>
                              </li>
                              <li class="menu-item">
                                <span class="menu-item__text">B3 - 2</span>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li class="menu-item">
                          <span class="menu-item__text">B2 - 2</span>
                          <div class="submenu">
                            <img src="https://source.unsplash.com/random/900×700/?drug"/>
                            <img src="https://source.unsplash.com/random/900×700/?electronic"/>
                          </div>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="menu-item">
                <span class="menu-item__text">A1</span>
                <div class="submenu">
                    <ul>
                        <li class="menu-item">
                          <span class="menu-item__text">A2 - 1</span>
                          <div class="submenu">
                            <img src="https://source.unsplash.com/random/900×700/?fruit,fun"/>
                            <img src="https://source.unsplash.com/random/900×700/?fun,1"/>
                          </div>
                        </li>
                        <li class="menu-item">
                          <span class="menu-item__text">A2 - 2</span>
                          <div class="submenu">
                            <img src="https://source.unsplash.com/random/900×700/?drug"/>
                            <img src="https://source.unsplash.com/random/900×700/?electronic"/>
                          </div>
                        </li>
                        <li class="menu-item">
                          <span class="menu-item__text">A2 - 2</span>
                          <div class="submenu">
                            <img src="https://source.unsplash.com/random/900×700/?food"/>
                            <img src="https://source.unsplash.com/random/900×700/?tv"/>
                          </div>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </nav>
  </section>
`,
);

(() => {
  const /** @type{HTMLElement} */ scope = document.querySelector(".mega-menu-5");
  const /** @type{HTMLElement} */ menu = scope.querySelector(".menu");
  const /** @type{HTMLElement[]} */ menuItemsL1 = [...scope.querySelectorAll(".menu > .menu-item")];
  const /** @type{HTMLElement[]} */ menuItems = [...scope.querySelectorAll(".menu .menu-item")];

  // add necassary thing to DOM
  traverseDOMTree({
    rootElement: menu,
    filter: (el) => el.classList.contains("menu-item"),
    callback: ({ element: menuItem, level }) => {
      menuItem.setAttribute("data-level", level + 1);
      const submenu = menuItem.querySelector(".submenu");
      if (submenu) {
        menuItem.setAttribute("data-has-children", "");
      }
    },
  });

  // this menu has two distinct behavior: mobile and desktop

  // mobile
  const mobile = (() => {
    // dom updater
    const openItem = (menuItem) => menuItem.setAttribute("open", "");
    const closeItem = (menuItem) => menuItem.removeAttribute("open");

    // actions
    const handleItemClick = (/** @type{Event} */ event) => {
      const /** @type {HTMLElement} */ menuItem = event.currentTarget;
      const submenu = menuItem.querySelector(".submenu");

      // if has no children do nothing...
      if (!submenu) return;

      // if has children...
      event.preventDefault();
      event.stopPropagation();

      // if already open
      if (menuItem.hasAttribute("open")) {
        closeItem(menuItem);
        return;
      }

      // if not open open =>  close sibiling + open me
      const sibilingMenuItems = [...menuItem.parentElement.children]
        .filter((x) => x !== menuItem)
        .filter((x) => x.classList.contains("menu-item"));
      sibilingMenuItems.forEach(closeItem);
      openItem(menuItem);
    };
    const handleCloseMenu = () => {
      menuItems.forEach(closeItem);
    };

    // add event listeners
    const cleanUpFunctions = [];
    const initListeners = () => {
      // on menu item level 1click => show it
      menuItems.forEach((el) => {
        el.addEventListener("click", handleItemClick);
        cleanUpFunctions.push(() => {
          el.removeEventListener("click", handleItemClick);
        });
      });
    };

    return {
      enable: () => {
        menu.setAttribute("data-is-mobile", "");
        initListeners();
      },
      disable: () => {
        menu.removeAttribute("data-is-mobile");
        cleanUpFunctions.forEach((cleanup) => cleanup());
      }
    };
  })();

  // desktop
  const desktop = (() => {
    return {
      enable: () => {
        menu.setAttribute("data-is-desktop", "");
      },
      disable: () => {
        menu.removeAttribute("data-is-desktop");
      }
    };
  })();

  // run
  const mq = matchMedia("(max-width: 799px");
  const isMobile = () => mq.matches;
  const init = () => {
    if (isMobile()) {
      mobile.enable();
      desktop.disable();
    }
    else {
      mobile.disable();
      desktop.enable();
    }
  };
  init();
  mq.addEventListener('change', init);
})();
