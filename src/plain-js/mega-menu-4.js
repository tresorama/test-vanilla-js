import anime from "animejs";
import { Utils } from '../global-utils';

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
  .mega-menu-4 ul {
    list-style: none;
    border: solid;
    padding: 0;
    margin: 0;
  }

  /* Layout */
  
  .mega-menu-4 .menu {
    display: flex;
    justify-content: center;
  }

  .mega-menu-4 .menu > .menu-item {
    position: relative;
  }

  .mega-menu-4 .submenu {
    position: absolute;
    top: 100%;
    left: 50%;
    width: max-content;
    max-width: 80vw;
    transform: translateX(-50%) var(--transform);
    transform-origin: bottom left;

    transition: all .4s;
    z-index: 0;
    opacity: 0;
    --transform: scaleY(0.8) translateY(5vh);
    pointer-events: none;
  }
  
  .mega-menu-4 .menu-item:hover > .submenu {
    z-index: 10;
    opacity: 1;
    --transform: scaleY(1) translateY(0);
    pointer-events: all;
  }
  
  .mega-menu-4 .menu-item > .submenu * {
    opacity: 0;
    transition: opacity 0.8s;
    transition-delay: calc(0.05s * var(--item-index, 0));
  }
  
  .mega-menu-4 .menu-item:hover > .submenu * {
    opacity: 1;
  }
  
  /* Color + Internal Layout */

  .mega-menu-4  li {
    border: solid;
  }
  .mega-menu-4 .menu-item {
    display: block;
    background: orange;
  }
  .mega-menu-4 .submenu {
    padding: 2rem;
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    
    background: blue;
    color: white;
  }
  .mega-menu-4 .submenu  > * {
    
  }
  .mega-menu-4 .submenu  > img {
    aspect-ratio: 16/12;
    object-fit: cover;
    min-width: 0;
    width: 20vw;
  }
  .mega-menu-4 .menu-item > span {
    display: block;
    padding: 1em 3em;
  }
  .mega-menu-4 .menu-item.level-2 {
    background: green;
  }

  </style>


  
  <section class="py-6 px-8 bg-gray-100 min-h-[30rem]">
    <nav class="mega-menu-4 relative">

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
    document.querySelector(".mega-menu-4");
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
})();
