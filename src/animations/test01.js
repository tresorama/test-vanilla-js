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
<div id="${SCOPE}"class="py-12 px-8 bg-yellow-200">

<style>
  #${SCOPE} .carousel {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    gap: 1rem;
    overflow: auto;
    background: white;
  }
  #${SCOPE} .carousel-slide {
    flex-shrink: 0;
    width: 90px;
    height: 90px;
    background: black;
    border-radius: 10px;
  }
</style>

  <div class="carousel ONE">
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
  </div>
  
  
  <div class="carousel TWO">
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
    <div class="carousel-slide"></div>
  </div>
  <style>
    #${SCOPE} .carousel.TWO .carousel-slide {
      will-change: width, height;
    }
  </style>

</div>
`);

// motion.one
(() => {
  const carousel = /** @type {HTMLElement} */ (document.querySelector(`#${SCOPE} .carousel.ONE`));
  const carouselSlides = /** @type {HTMLElement[]} */ ([...carousel.querySelectorAll('.carousel-slide')]);

  {
    const s = (m) => (1 * m);
    const kf_scale = [s(0.25), s(1), s(0.25)];
    carousel.style.setProperty('position', 'relative');
    carouselSlides.forEach((slide) => {
      motion.scroll(
        motion.animate(slide, {
          scale: kf_scale,
          x: ["50%", "0%", "-50%"]
        }),
        {
          container: carousel,
          axis: 'x',
          target: slide,
          // offset: ["0 0.1", "0 0.9"]
        }
      );
    });
  }

})();


// motion.one
(() => {
  const carousel = /** @type {HTMLElement} */ (document.querySelector(`#${SCOPE} .carousel.TWO`));
  const carouselSlides = /** @type {HTMLElement[]} */ ([...carousel.querySelectorAll('.carousel-slide')]);

  {
    const w = (m) => (110 * m) + 'px';
    const kf_width = [w(0.25), w(1.8), w(0.25)];
    carousel.style.setProperty('position', 'relative');
    carouselSlides.forEach(slide => {
      motion.scroll(
        motion.animate(slide, {
          width: kf_width,
          height: kf_width,
        }),
        {
          container: carousel,
          axis: 'x',
          target: slide,
          // offset: ["0 0.1", "0 0.9"]
        }
      );
    });
  }

})();
