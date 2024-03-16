import { Utils } from '../global-utils';
const { wrap, sum } = Utils;

const SCOPE = "SECTION-" + Date.now() + "-scroll-detector";

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
  <style>
    #${SCOPE} .slider {
    }
    #${SCOPE} .slider__track {
      display: flex;
      height: 200px;
      overflow-x: auto;
    }
    #${SCOPE} .slider__slide {
      flex-shrink: 0;
      width: 40vw;
      height: 100%;
      position: relative;
    }
    #${SCOPE} .slider__slide img {
      height: 100%;
      width: auto;
    }
    #${SCOPE} .slider__slide span {
      position: absolute;
      inset: 0;
      font-size: 7vw;
      color: yellow;
    }
  </style>
  <section id="${SCOPE}" class="py-6 px-8 flex flex-col gap-12 bg-amber-200">

    <div class="debug"></div>

    <div class="slider">
      <div class="slider__track">
        <div class="slider__slide"><img src="https://source.unsplash.com/random/700x385/?v=8599835921329489&amp;italy="/><span>0</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/1000x385/?v=1455740963839355&amp;italy="/><span>1</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/700x385/?v=11787388690786384&amp;italy="/><span>2</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/1200x385/?v=7360155373301151&amp;italy="/><span>3</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/700x385/?v=9087855707388354&amp;italy="/><span>4</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/700x385/?v=12358683744785669&amp;italy="/><span>5</span></div>
      </div>
    </div>

  </section>
`,
);

(() => {
  const slider =/** @type {HTMLElement} */(document.querySelector(`#${SCOPE} .slider .slider__track`));
  const slides = /** @type {(HTMLElement)[]}*/ (Array.from(slider.querySelectorAll('.slider__slide')));

  /**
   * 
   * @param {HTMLElement} el 
   * @param {"x" | "y"} axis
   */
  const getScrollProgress = (el, axis = 'x') => {
    if (axis === 'x') {
      const { scrollWidth, clientWidth, scrollLeft } = el;
      const total = scrollWidth - clientWidth;
      const done = scrollLeft;
      const progress = Number(Number(done / total).toPrecision(4));
    }
    else {
      console.error('TODO');
    }
  };
  slider.addEventListener('scroll', (e) => {
    const scrollProgress = getScrollProgress(slider, 'x');
    console.log({ scrollProgress });
  });
})();
