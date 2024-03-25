import anime from "animejs";
import { Utils } from '../utils/global-utils';
const { createPortal, createRestoreDOMPosition, animeFlip, debounce } = Utils;

document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <style>
  .mega-menu-2 ul {
    list-style: none;
    border: solid;
    padding: 0;
    margin: 0;
  }
  .mega-menu-2  li {
    border: solid;
  }
  
  .mega-menu-2 .menu-wrapper {
    
  }

  .mega-menu-2  .menu-item.level-1 {
    position: relative;
  }
  .mega-menu-2  .menu-item .submenu {
    display: none;
  }
  .mega-menu-2 .portal-wrapper .submenu {
    position: relative;
  }

  /* consumer add the CSS */
  .mega-menu-2 .menu-wrapper {
    border-radius: 10px;
    background: gray;
  }
  .mega-menu-2 .menu-inner-wrapper {
    padding: 1rem;
  }
  .mega-menu-2 .menu {
    display: flex;
  }
  .mega-menu-2 .menu-item {
      display: block;
      background: orange;
  }
  .mega-menu-2 .menu-item > span {
    display: block;
    padding: 0.5em 1em;
  }
  .mega-menu-2 .menu-item.level-2 {
      background: green;
  }
  </style>

  <section class="py-6 px-8 relative h-[10rem]">
    <nav class="mega-menu-2 absolute left-1/2 top-[2rem] -translate-x-1/2">
      <div class="menu-wrapper">
        <div class="menu-inner-wrapper">
            <ul class="menu">
            <li class="menu-item level-1">
                <span>B1</span>
                <ul class="submenu level-1">
                    <li class="menu-item level-2"><span>B2</span></li>
                    <li class="menu-item level-2"><span>B2</span></li>
                </ul>
            </li>
            <li class="menu-item level-1">
                <span>A1</span>
                <ul class="submenu level-1">
                <li class="menu-item level-2"><span>A2</span></li>
                <li class="menu-item level-2"><span>A2</span></li>
                <li class="menu-item level-2"><span>A2</span></li>
                </ul>
            </li>
            </ul>
        </div>
      </div>
    </nav>
  </section>
`,
);

(() => {
  const scope = document.querySelector(".mega-menu-2");
  const menuWrapper = scope.querySelector(".menu-wrapper");
  const menuInnerWrapper = scope.querySelector(".menu-inner-wrapper");
  const menuItems = scope.querySelectorAll(".menu-item.level-1");

  // create portal
  const visibleZonePortal = createPortal();
  menuInnerWrapper.append(visibleZonePortal.portalWrapper);

  // init state + actions
  const state = {
    isOpen: false,
    /** @type{null | HTMLElement} */
    openedMenuItem: null,
    /** @type{null | HTMLElement} */
    openedSubmenu: null,
  };

  const actions = {
    /** @type {null | (() => void)} */
    restorePositionOfActiveMenuItem: null,
    /** Open the menu and show to passed menuItem */
    openItem: (/** @type {HTMLElement?} */ menuItem) => {
      const submenu = menuItem.querySelector(".submenu");
      if (!submenu) return;

      // do animation
      animeFlip({
        savePreAndPost: () => ({ height: menuWrapper.scrollHeight }),
        mutateDOM: () => {
          // this function is truthy if the menu is already open
          // on a menu item different from the requested menu item
          actions.restorePositionOfActiveMenuItem?.();

          //
          actions.restorePositionOfActiveMenuItem =
            createRestoreDOMPosition(submenu);
          visibleZonePortal.putElementInsidePortal(submenu);
        },
        animate: (pre, post) => {
          return anime
            .timeline({
              duration: 300,
              easing: "easeInOutSine",
              complete: () => {
                // set state
                state.isOpen = true;
                state.openedMenuItem = menuItem;
                state.openedSubmenu = submenu;
              },
            })
            .add({
              targets: menuWrapper,
              height: [pre.height + "px", post.height + "px"],
              complete: () => {
                // clean
                menuWrapper.style.height = "";
              },
            })
            .add({
              targets: [submenu, ...submenu.children],
              opacity: ["0", "1"],
              delay: anime.stagger(40),
            });
        },
      });
    },
    /** Close the menu */
    closeMenu: () => {
      const submenu = state.openedSubmenu;
      if (!submenu) return;

      animeFlip({
        savePreAndPost: () => ({ height: menuWrapper.scrollHeight }),
        mutateDOM: () => {
          actions.restorePositionOfActiveMenuItem?.();
        },
        animate: (pre, post) => {
          return anime
            .timeline({
              duration: 300,
              easing: "easeInOutSine",
              complete: () => {
                // set state
                state.isOpen = false;
                state.openedMenuItem = null;
              },
            })
            .add({
              targets: menuWrapper,
              height: [pre.height + "px", post.height + "px"],
              complete: () => {
                // clean
                menuWrapper.style.height = "";
              },
            })
            .add({
              targets: [...submenu.children, submenu],
              opacity: [1, 0],
              delay: anime.stagger(40),
            });
        },
      });
    },
  };

  // init event listeners
  const globalDebounced = debounce((cb) => cb(), 300);
  menuWrapper.addEventListener("mouseleave", () =>
    globalDebounced(actions.closeMenu),
  );
  menuItems.forEach((el) => {
    const openItem = () => globalDebounced(() => actions.openItem(el));
    el.addEventListener("click", openItem);
    el.addEventListener("mouseenter", openItem);
  });
})();
