import { Utils } from '../global-utils';
const { wrap, sum } = Utils;

const SCOPE = "SECTION-" + Date.now();

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
  <style>
    /* If no JS */
    #${SCOPE} .marquee.no-js .marquee__track {
      animation: none !important;
    }

    #${SCOPE} .marquee {
      margin: 0 auto;
      width: 80%;
      overflow-x: auto;
      border: 4px solid lime;
      position: relative;
      mask: 
        linear-gradient(to right, rgba(0,0,0,0) 5%, rgba(0,0,0,1) 20%),
        linear-gradient(to left, rgba(0,0,0,0) 5%, rgba(0,0,0,1) 20%);
      mask-size: 50%, 50%;
      mask-position: 0% 0%, 100% 0%;
      mask-repeat: no-repeat;
    }
    
    #${SCOPE} .marquee__track {
      width: max-content;
      display: flex;
      gap: 20px;

      /* Autoscroll Animation */
      --item-count: 10;
      --animation-duration: calc(2s * var(--items-count));
      animation: 
        ${SCOPE}_marquee 
        var(--animation-duration)
        infinite
        linear;
    }
    @keyframes ${SCOPE}_marquee {
      0% { transform: translateX(0);}
      100% { transform: translateX(-50%);}
    }
    #${SCOPE} .marquee__track:hover {
      animation-play-state: paused;
    }
    #${SCOPE} .marquee__slide {
      padding: 0.2em 1em;
      line-height: 1;
      font-weight: 700;
      white-space: nowrap;
      background: hsl(0 0% 80%);
      border: 2px solid;
    }
    
  </style>
  <section id="${SCOPE}" class="py-6 px-8 flex flex-col gap-6 bg-lime-300">

    <div class="marquee no-js">
      <div class="marquee__track">
        <div class="marquee__slide">Brand 1</div>
        <div class="marquee__slide">Brand 2</div>
        <div class="marquee__slide">Brand 3</div>
        <div class="marquee__slide">Brand 4</div>
        <div class="marquee__slide">Brand 5</div>
        <div class="marquee__slide">Brand 6</div>
        <div class="marquee__slide">Brand 7</div>
        <div class="marquee__slide">Brand 8</div>
        <div class="marquee__slide">Brand 9</div>
        <div class="marquee__slide">Brand 10</div>
      </div>
    </div>

  </section>
`,
);

(() => {
  const scope = /** @type {HTMLElement} */(document.querySelector(`#${SCOPE}`));
  const marquee = /** @type {HTMLElement?}*/ (scope.querySelector(`.marquee`));
  const marqueeTrack = /** @type {HTMLElement?}*/ (scope.querySelector(`.marquee__track`));

  // mutate DOM
  marquee.classList.remove('no-js');
  marquee.style.setProperty('--items-count', [...marqueeTrack.children].length);

  [...marqueeTrack.children].forEach(slide => {
    const clone = /** @type {HTMLElement} */ (slide.cloneNode(true));
    clone.classList.add('clone');
    marqueeTrack.append(clone);
  });

})();

