import anime from "animejs";
const {
  createPortal,
  createRestoreDOMPosition,
  animeFlip,
  debounce,
  traverseDOMTree,
} = Utils;

document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <style>
  .mega-menu-3 ul {
    list-style: none;
    border: solid;
    padding: 0;
    margin: 0;
  }

  /* Layout */
  
  .mega-menu-3 .menu {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .mega-menu-3 .submenu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;

    pointer-events: none;
    animation: submenu-exit 0.2s 1  both;
  }
  .mega-menu-3 .submenu * {
    pointer-events: none;
    animation: submenu-children-exit 0.4s 1 both;
  }
  
  .mega-menu-3 [open] > .submenu {
    pointer-events: all;
    animation: submenu-enter 0.4s 1 both;
  }
  
  .mega-menu-3 [open] > .submenu * {
    pointer-events: all;
    animation: submenu-children-enter 0.4s 1 both;
    animation-delay: calc(0.1s * var(--item-index, 0));
  }
  
  
  @keyframes submenu-enter {
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
    @keyframes submenu-exit {
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
    @keyframes submenu-children-enter {
      from {
        opacity: 0;
        transform: translateY(5vh);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    @keyframes submenu-children-exit {
      from {
        opacity: 1;
        transform: none;
      }
      to {
        opacity: 0;
        transform: translateY(-5vh);
      }
    }

  /* Color + Internal Layout */

  .mega-menu-3  li {
    border: solid;
  }
  .mega-menu-3 .menu-item {
    display: block;
    background: orange;
  }
  .mega-menu-3:has([open]) {
    background: blue;
    color: white;
  }
  .mega-menu-3 .submenu {
    padding: 2rem;
    display: flex;
    gap: 2rem;
    justify-content: space-between;
    
    background: blue;
    color: white;
  }
  .mega-menu-3 .submenu  > * {
    flex: 1 1 0;
    min-width: 0;
  }
  .mega-menu-3 .submenu  > img {
    aspect-ratio: 16 / 8;
    object-fit: cover;
  }
  .mega-menu-3 .menu-item > span {
    display: block;
    padding: 0.5em 1em;
  }
  .mega-menu-3 .menu-item.level-2 {
    background: green;
  }

  </style>


  
  <section class="py-6 px-8 bg-gray-100 min-h-[30rem]">
    <nav class="mega-menu-3 relative">

        <div class="absolute top-1/2 left-5 -translate-y-1/2">logo</div>
    
        <ul class="menu">
            <li class="menu-item level-1">
                <span>B1</span>
                <div class="submenu level-1">
                    <ul>
                        <li class="menu-item level-2"> <span>B2</span></li>
                        <li class="menu-item level-2"><span>B2</span></li>
                    </ul>
                    <img src="https://source.unsplash.com/random/900×700/?fruit,fun"/>
                    <img src="https://source.unsplash.com/random/900×700/?fun,1"/>
                </div>
            </li>
            <li class="menu-item level-1">
                <span>A1</span>
                <div class="submenu level-1">
                    <ul>
                        <li class="menu-item level-2"><span>A2</span></li>
                        <li class="menu-item level-2"><span>A2</span></li>
                        <li class="menu-item level-2"><span>A2</span></li>
                    </ul>
                    <img src="https://source.unsplash.com/random/900×700/?fruit,fun,4"/>
                    <img src="https://source.unsplash.com/random/900×700/?fun,2"/>
                </div>
            </li>
        </ul>
    </nav>
  </section>
`,
);

(() => {
  const /** @type{HTMLElement} */ scope =
      document.querySelector(".mega-menu-3");
  const /** @type{HTMLElement} */ menu = scope.querySelector(".menu");
  const /** @type{HTMLElement[]} */ menuItemsLevel0 = [
      ...scope.querySelectorAll(".menu > .menu-item"),
    ];

  // add necassary thing to DOM
  menuItemsLevel0.forEach((item) => {
    let i = 0;
    traverseDOMTree({
      rootElement: item,
      callback: ({ element }) => {
        element.style.setProperty("--item-index", i);
        i++;
      },
    });
  });

  // dom updater
  const openItem = (el) => el.setAttribute("open", "");
  const closeItem = (el) => el.removeAttribute("open");

  // actions
  const handleItemSelect = (menuItem) => {
    menuItemsLevel0.forEach((item) => {
      if (item === menuItem) openItem(item);
      else closeItem(item);
    });
  };
  const handleCloseMenu = () => {
    menuItemsLevel0.forEach(closeItem);
  };

  // add listeners
  menu.addEventListener("mouseleave", handleCloseMenu);
  menuItemsLevel0.forEach((el) => {
    el.addEventListener("click", () => handleItemSelect(el));
    el.addEventListener("mouseenter", () => handleItemSelect(el));
  });
})();
