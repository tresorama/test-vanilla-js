// Compare:
// - anime.js
// - motion.one
import anime from 'animejs';
import * as motion from 'motion';
import * as popmotion from "popmotion";
import easings from 'easings.net';

// init
const SCOPE = "SECTION-" + Date.now();

document.body.insertAdjacentHTML('afterbegin',/*html*/`
<div id="${SCOPE}"class="py-12 px-8 bg-yellow-200 flex gap-12">

<style>
  /** Shared CSS for all dropdown of this comparision */
  #${SCOPE} .dropdown {
    --border-radius: 5px;
    --box-shadow: rgba(0, 0, 0, 0.2) 0px 2.5px 5px;
    width: 10rem;
    position: relative;
  }
  #${SCOPE} .dropdown-panel {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: 10px;
    overflow: hidden;
    border-radius: var(--border-radius);
    background: hsl(0 0% 90%);
    color: hsl(0 0% 20%);
    box-shadow: var(--box-shadow);
  }

  #${SCOPE} .dropdown .button-group {
    display: flex;
    flex-direction: column;
  }

  #${SCOPE} .dropdown-toggler,
  #${SCOPE} .dropdown .button-group > * {
    display: block;
    padding: 0.5em;
    text-align: left;
  }
  
  #${SCOPE} .dropdown-toggler {
    width: 100%;
    background: hsl(0 0% 20%);
    color: white;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
  }
  #${SCOPE} .dropdown .button-group > *:hover {
    background: hsl(0 0% 80%);
  }
  #${SCOPE} .dropdown .button-group > *:not(:first-child) {
    border-top: 1px solid hsl(0 0% 82%);
  }
  
  #${SCOPE} .dropdown:not([aria-expanded="true"]) .dropdown-panel {
    /* Set hidden */
    display: none;
  }
</style>

  <!-- anime.js -->
  <div class="dropdown with-anime-js" aria-expanded="true">
    <div class="dropdown-toggler">Export</div>
    <div class="dropdown-panel">
      <div class="button-group">
        <button>PDF</button>
        <button>SVG</button>
        <button>HTML</button>
      </div>
    </div>
  </div>

  <!-- motion.one -->
  <div class="dropdown with-motion-one" aria-expanded="false">
    <div class="dropdown-toggler">Export</div>
    <div class="dropdown-panel">
      <div class="button-group">
        <button>PDF</button>
        <button>SVG</button>
        <button>HTML</button>
      </div>
    </div>
  </div>
  
  <!-- pop-motion -->
  <div class="dropdown with-pop-motion" aria-expanded="false">
    <div class="dropdown-toggler">Export</div>
    <div class="dropdown-panel">
      <div class="button-group">
        <button>PDF</button>
        <button>SVG</button>
        <button>HTML</button>
      </div>
    </div>
  </div>

  <!-- css-transition -->
  <div class="dropdown with-css-transition" aria-expanded="false">
    <div class="dropdown-toggler">Export</div>
    <div class="dropdown-panel">
      <div class="button-group">
        <button>PDF</button>
        <button>SVG</button>
        <button>HTML</button>
      </div>
    </div>
  </div>
  <style>
    #${SCOPE} .dropdown.with-css-transition .dropdown-panel {
      display: block;
      transform-origin: top;
      /* Exit Aniamtino */
      transform: scaleY(0);
      visibility: hidden;
      transition: transform 0.15s, visibility 0s 0.15s;
      }
    #${SCOPE} .dropdown.with-css-transition[aria-expanded="true"] .dropdown-panel {
        /* Enter Animation */
        transform: scaleY(1);
        visibility: visible;
        transition: transform 0.15s, visibility 0s 0s;
    }
    #${SCOPE} .dropdown.with-css-transition .dropdown-panel > * {
      /* Exit Aniamtino */
      opacity: 0;
      transition: opacity 0.05s;
    }
    #${SCOPE} .dropdown.with-css-transition[aria-expanded="true"] .dropdown-panel > *{
      /* Enter Animation */
      opacity: 1;
      transition: opacity 0.15s 0.15s;
    }
  </style>

</div>
`);

// anime js
(() => {
  const dropdown = /** @type {HTMLElement} */ (document.querySelector(`#${SCOPE} .dropdown.with-anime-js`));
  const dropdownToggler = /** @type {HTMLElement} */ (dropdown.querySelector('.dropdown-toggler'));
  const dropdownPanel = /** @type {HTMLElement} */ (dropdown.querySelector('.dropdown-panel'));


  const handleToggle = () => {
    // state
    const isOpen = () => dropdown.getAttribute('aria-expanded') === 'true';
    const open = () => dropdown.setAttribute('aria-expanded', 'true');
    const close = () => dropdown.setAttribute('aria-expanded', 'false');
    const toggle = () => isOpen() ? close() : open();

    // render animation
    const render = () => {
      const runOpenAnimation = () => {
        dropdownPanel.style.setProperty('display', 'block');
        anime.timeline({
          duration: 150,
          easing: 'easeInCirc',
        })
          .add({
            targets: dropdownPanel,
            height: ['0px', dropdownPanel.scrollHeight + 'px'],
            complete: () => dropdownPanel.style.removeProperty('height'),
          })
          .add({
            targets: dropdownPanel.children,
            opacity: [0, 1],
            delay: anime.stagger(40)
          }, "75");
      };
      const runCloseAnimation = () => {
        dropdownPanel.style.display = 'block';
        anime.timeline({
          duration: 150,
          easing: 'easeInCirc',
        })
          .add({
            targets: dropdownPanel,
            height: [dropdownPanel.scrollHeight + 'px', '0px'],
            complete: () => {
              dropdownPanel.style.removeProperty('height');
              dropdownPanel.style.setProperty('display', 'none');
            }
          })
          .add({
            targets: dropdownPanel.children,
            opacity: [1, 0],
          }, "0");
      };
      if (isOpen()) runOpenAnimation();
      else runCloseAnimation();
    };

    // run
    toggle();
    render();
  };
  dropdownToggler.addEventListener('click', handleToggle);


})();

// motion.one
(() => {
  const dropdown = /** @type {HTMLElement} */ (document.querySelector(`#${SCOPE} .dropdown.with-motion-one`));
  const dropdownToggler = /** @type {HTMLElement} */ (dropdown.querySelector('.dropdown-toggler'));
  const dropdownPanel = /** @type {HTMLElement} */ (dropdown.querySelector('.dropdown-panel'));


  const handleToggle = () => {
    // state
    const isOpen = () => dropdown.getAttribute('aria-expanded') === 'true';
    const open = () => dropdown.setAttribute('aria-expanded', 'true');
    const close = () => dropdown.setAttribute('aria-expanded', 'false');
    const toggle = () => isOpen() ? close() : open();

    // render animation
    const render = () => {
      const runOpenAnimation = () => {
        dropdownPanel.style.setProperty('display', 'block');
        motion.timeline([
          [
            dropdownPanel,
            { height: ['0', dropdownPanel.scrollHeight + 'px'] }
          ],
          [
            dropdownPanel.children,
            { opacity: [0, 1] },
            { delay: motion.stagger(0.040), at: 0.075 }
          ]
        ],
          { defaultOptions: { duration: 0.150, easing: easings.easeInCirc } },
        ).finished.then(() => {
          dropdownPanel.style.removeProperty('height');
        });
      };
      const runCloseAnimation = () => {
        dropdownPanel.style.display = 'block';
        motion.timeline([
          [
            dropdownPanel,
            { height: 0 },
          ],
          [
            dropdownPanel.children,
            { opacity: 0 },
            { at: 0 }
          ]
        ],
          { defaultOptions: { duration: 0.150, easing: easings.easeInCirc } }
        ).finished.then(() => {
          dropdownPanel.style.removeProperty('height');
          dropdownPanel.style.setProperty('display', 'none');
        });
      };
      if (isOpen()) runOpenAnimation();
      else runCloseAnimation();
    };

    // run
    toggle();
    render();
  };
  dropdownToggler.addEventListener('click', handleToggle);


})();

// pop-motion
(() => {
  const dropdown = /** @type {HTMLElement} */ (document.querySelector(`#${SCOPE} .dropdown.with-pop-motion`));
  const dropdownToggler = /** @type {HTMLElement} */ (dropdown.querySelector('.dropdown-toggler'));
  const dropdownPanel = /** @type {HTMLElement} */ (dropdown.querySelector('.dropdown-panel'));


  const handleToggle = () => {
    // state
    const isOpen = () => dropdown.getAttribute('aria-expanded') === 'true';
    const open = () => dropdown.setAttribute('aria-expanded', 'true');
    const close = () => dropdown.setAttribute('aria-expanded', 'false');
    const toggle = () => isOpen() ? close() : open();

    // render animation
    const render = () => {
      const runOpenAnimation = () => {
        dropdownPanel.style.setProperty('display', 'block');
        popmotion.animate({
          to: [0, dropdownPanel.scrollHeight],
          duration: 150,
          onUpdate: (v) => dropdownPanel.style.setProperty('height', v + 'px'),
          onComplete: () => dropdownPanel.style.removeProperty('height'),
        });

        // Popmotion has no timeline

      };
      const runCloseAnimation = () => {
        dropdownPanel.style.display = 'block';
        popmotion.animate({
          to: [dropdownPanel.scrollHeight, 0],
          duration: 150,
          onUpdate: (v) => dropdownPanel.style.setProperty('height', v + 'px'),
          onComplete: () => {
            dropdownPanel.style.removeProperty('height');
            dropdownPanel.style.setProperty('display', 'none');
          }
        });
        // Popmotion has no timeline
      };
      if (isOpen()) runOpenAnimation();
      else runCloseAnimation();
    };

    // run
    toggle();
    render();
  };
  dropdownToggler.addEventListener('click', handleToggle);


})();

// css-transition
(() => {
  const dropdown = /** @type {HTMLElement} */ (document.querySelector(`#${SCOPE} .dropdown.with-css-transition`));
  const dropdownToggler = /** @type {HTMLElement} */ (dropdown.querySelector('.dropdown-toggler'));
  // const dropdownPanel = /** @type {HTMLElement} */ (dropdown.querySelector('.dropdown-panel'));


  const handleToggle = () => {
    // state
    const isOpen = () => dropdown.getAttribute('aria-expanded') === 'true';
    const open = () => dropdown.setAttribute('aria-expanded', 'true');
    const close = () => dropdown.setAttribute('aria-expanded', 'false');
    const toggle = () => isOpen() ? close() : open();

    // run
    toggle();
    // render(); // rendering is made on CSS
  };
  dropdownToggler.addEventListener('click', handleToggle);

})();

