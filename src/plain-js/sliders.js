import { Utils } from '../global-utils';
const { wrap, sum } = Utils;

const SCOPE = "SECTION-" + Date.now();

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
  <style>
    #${SCOPE} .slider {
      overflow: hidden;
    }
    #${SCOPE} .slider__track {
      display: flex;
      height: 200px;
    }
    #${SCOPE} .slider__slide {
      flex-shrink: 0;
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
    #${SCOPE} .slider__controls {
      display: flex;
      justify-content: space-between;
      padding: 1rem 0;
    }
    #${SCOPE} .slider__controls input:not([type="submit"]) {
      padding: 0 0.5em;
      border: solid;
      width: 4em;
    }
    #${SCOPE} .slider__controls :is(button, input[type="submit"]) {
      padding: 0 0.5em;
      border: solid;
      background: yellow;
    }
    #${SCOPE} .slider__debug {
      padding: 1rem 0;
    }

    /* SLIDER TWO */
    #${SCOPE} .TWO.slider {
      height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    #${SCOPE} .TWO .slider__slide {
      width: 20%;
    }
    #${SCOPE} .TWO .slider__slide img {
      height: 100%;
      width: 100%;
      object-fit: cover;

      transition: transform 0.6s;
      transform: translateX(var(--tx)) scale(var(--s));
      --s: 1;
      --tx: 0;
    }
    #${SCOPE} .TWO .slider__slide.in-view-index-0 img {
      --s: 1;
      --tx: -50%;
    }
    #${SCOPE} .TWO .slider__slide.in-view-index-1 img {
      --s: 1;
      --tx: -50%;
    }
    #${SCOPE} .TWO .slider__slide.in-view-index-2 img {
      --s: 2;
      --tx: 0%;
    }
    #${SCOPE} .TWO .slider__slide.in-view-index-3 img {
      --s: 1;
      --tx: 50%;
    }
    #${SCOPE} .TWO .slider__slide.in-view-index-4 img {
      --s: 1;
      --tx: 50%;
    }
    #${SCOPE} .TWO .slider__slide.in-view-index-2 {
      z-index: 1;
    }
  </style>
  <section id="${SCOPE}" class="py-6 px-8 flex flex-col gap-12">

    <div class="slider__debug-state"></div>

    <div class="slider__controls">
      <button class="slider__prev">Prev</button>
      <form class="slider__goToIndex">
        <input name="index" type="number" value="0">
        <input type="submit" value="Set Index">
      </form>
      <button class="slider__next">Next</button>
    </div>

    <div class="slider ONE">
      <div class="slider__track">
        <div class="slider__slide"><img src="https://source.unsplash.com/random/700x385/?v=8599835921329489&amp;italy="/><span>0</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/1000x385/?v=1455740963839355&amp;italy="/><span>1</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/700x385/?v=11787388690786384&amp;italy="/><span>2</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/1200x385/?v=7360155373301151&amp;italy="/><span>3</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/700x385/?v=9087855707388354&amp;italy="/><span>4</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/700x385/?v=12358683744785669&amp;italy="/><span>5</span></div>
      </div>
    </div>
    
    <div class="slider TWO">
      <div class="slider__track">
        <div class="slider__slide"><img src="https://source.unsplash.com/random/700x385/?v=8599835921329489&amp;italy="/><span>0</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/1000x385/?v=1455740963839355&amp;italy="/><span>1</span></div>
        <div class="slider__slide in-view-center"><img src="https://source.unsplash.com/random/700x385/?v=11787388690786384&amp;italy="/><span>2</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/1200x385/?v=7360155373301151&amp;italy="/><span>3</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/700x385/?v=9087855707388354&amp;italy="/><span>4</span></div>
        <div class="slider__slide"><img src="https://source.unsplash.com/random/700x385/?v=12358683744785669&amp;italy="/><span>5</span></div>
      </div>
    </div>

  </section>
`,
);

(() => {
  const sliderOne = initSliderOne();
  const sliderTwo = initSliderTwo();
  const prev = /** @type {HTMLElement?}*/ (document.querySelector(`#${SCOPE} .slider__prev`));
  const next = /** @type {HTMLElement?}*/ (document.querySelector(`#${SCOPE} .slider__next`));
  const formGoToIndex = /** @type {HTMLFormElement?}*/ (document.querySelector(`#${SCOPE} .slider__goToIndex`));

  // add listenres
  prev.addEventListener('click', () => {
    sliderOne.goPrev();
    sliderTwo.goPrev();
  });
  next.addEventListener('click', () => {
    sliderOne.goNext();
    sliderTwo.goNext();
  });
  formGoToIndex.addEventListener('submit', e => {
    e.preventDefault();
    const newIndex = Number(formGoToIndex.elements["index"].value);
    sliderOne.goToIndex(newIndex);
    sliderTwo.goToIndex(newIndex);
  });

  /* =================================================== 
        SLIDER ONE
  =================================================== */
  function initSliderOne() {
    const slider = document.querySelector(`#${SCOPE} .slider.ONE .slider__track`);
    const slides = /** @type {(HTMLElement)[]}*/ (Array.from(slider.querySelectorAll('.slider__slide')));

    // mutate DOM
    slides.forEach((s, i) => s.classList.add(`i-${i}`));

    // resusable
    const animateTransform = async (/** @type {HTMLElement} */el,/** @type {string} */transformValue) => {
      return new Promise(resolve => {
        const h = () => {
          el.removeEventListener('transitionend', h);
          el.style.transition = '';
          resolve();
        };
        el.addEventListener('transitionend', h);
        el.style.transition = "transform .6s";
        el.style.transform = transformValue;
      }
      );
    };

    // state
    let index = 0;

    // actions
    const goNext = () => {
      goToIndex(index + 1);
    };
    const goPrev = () => {
      goToIndex(index - 1);
    };

    const goToIndex = async (/** @type{Number}*/_newIndex) => {
      const currentIndex = index;
      const newIndex = wrap(_newIndex, 0, slides.length - 1);
      const fromSlide = slides[index];
      const toSlide = slides[newIndex];

      // calculate slides to move for both direction:
      // - left
      // - right 
      // then decide which direction to use based oon which 
      // has a lower distance
      const { direction, slidesRight, slidesLeft } = (() => {
        const slidesRight = [];
        let extractItem = false;
        for (const s of [...slides, ...slides]) {
          if (s === fromSlide) {
            extractItem = true;
            slidesRight.push(s);
            continue;
          }
          if (!extractItem) continue;
          slidesRight.push(s);
          if (s === toSlide) {
            break;
          }
        }

        const slidesLeft = [];
        extractItem = false;
        for (const s of [...slides, ...slides].reverse()) {
          if (s === fromSlide) {
            extractItem = true;
            slidesLeft.push(s);
            continue;
          }
          if (!extractItem) continue;
          slidesLeft.push(s);
          if (s === toSlide) {
            break;
          }
        }

        return {
          slidesLeft,
          slidesRight,
          /** @type {"l" | "r"} */
          direction: slidesLeft.length < slidesRight.length ? 'l' : 'r',
        };
      })();

      if (direction === 'r') {
        const slidesToMove = slidesRight.slice(0, -1);
        const translateX = sum(...slidesToMove.map(s => s.offsetWidth));
        requestAnimationFrame(async () => {
          await animateTransform(slider, `translateX(${-1 * translateX}px)`);
          slidesToMove.forEach(s => slider.append(s));
          slider.style.transform = `translateX(0px)`;
          index = newIndex;
        });
      }
      else /* direction === 'l' */ {
        const slidesToMove = slidesLeft.slice(1);
        const translateX = sum(...slidesToMove.map(s => s.offsetWidth));
        slidesToMove.forEach(s => slider.prepend(s));
        slider.style.transform = `translateX(${-1 * translateX}px)`;
        requestAnimationFrame(async () => {
          await animateTransform(slider, `translateX(0px)`);
          index = newIndex;
        });
      }

    };

    return {
      goNext,
      goPrev,
      goToIndex,
    };
  }
  /* =================================================== 
        SLIDER TWO
  =================================================== */
  function initSliderTwo() {
    const slider = document.querySelector(`#${SCOPE} .slider.TWO .slider__track`);
    const slides = /** @type {(HTMLElement)[]}*/ (Array.from(slider.querySelectorAll('.slider__slide')));

    // mutate DOM
    slides.forEach((s, i) => {
      s.classList.add(`i-${i}`);
      s.setAttribute('data-index', i);
    });

    // resusable
    const animateTransform = async (/** @type {HTMLElement} */el,/** @type {string} */transformValue) => {
      return new Promise(resolve => {
        const h = () => {
          el.removeEventListener('transitionend', h);
          el.style.transition = '';
          debugger;
          resolve();
        };
        el.addEventListener('transitionend', h);
        el.style.transition = "transform .6s";
        el.style.transform = transformValue;
      }
      );
    };

    // state
    let index = 0;

    // events
    const dispatchEvent = (/** @type {Event} */e) => slider.dispatchEvent(e);
    const events = {
      slideChangeBeforeAnimation: () => new CustomEvent('slide-change--before-animation'),
      slideChangeAfterAnimation: () => new CustomEvent('slide-change--after-animation'),
    };

    // actions
    const goNext = () => {
      goToIndex(index + 1);
    };
    const goPrev = () => {
      goToIndex(index - 1);
    };
    const goToIndex = async (/** @type{Number}*/_newIndex) => {
      const currentIndex = index;
      const newIndex = wrap(_newIndex, 0, slides.length - 1);
      const fromSlide = slides[index];
      const toSlide = slides[newIndex];

      // calculate slides to move for both direction:
      // - left
      // - right 
      // then decide which direction to use based oon which 
      // has a lower distance
      const { direction, slidesRight, slidesLeft } = (() => {
        const slidesRight = [];
        let extractItem = false;
        for (const s of [...slides, ...slides]) {
          if (s === fromSlide) {
            extractItem = true;
            slidesRight.push(s);
            continue;
          }
          if (!extractItem) continue;
          slidesRight.push(s);
          if (s === toSlide) {
            break;
          }
        }

        const slidesLeft = [];
        extractItem = false;
        for (const s of [...slides, ...slides].reverse()) {
          if (s === fromSlide) {
            extractItem = true;
            slidesLeft.push(s);
            continue;
          }
          if (!extractItem) continue;
          slidesLeft.push(s);
          if (s === toSlide) {
            break;
          }
        }

        return {
          slidesLeft,
          slidesRight,
          /** @type {"l" | "r"} */
          direction: slidesLeft.length < slidesRight.length ? 'l' : 'r',
        };
      })();

      if (direction === 'r') {
        const slidesToMove = slidesRight.slice(0, -1);
        const translateX = sum(...slidesToMove.map(s => s.offsetWidth));

        // before animation
        slider.style.transform = `translateX(${-1 * translateX}px)`;
        dispatchEvent(events.slideChangeBeforeAnimation());
        slider.style.transform = `translateX(0px)`;

        // animation
        requestAnimationFrame(async () => {
          await animateTransform(slider, `translateX(${-1 * translateX}px)`);
          slidesToMove.forEach(s => slider.append(s));
          slider.style.transform = `translateX(0px)`;
          index = newIndex;
        });
      }
      else /* direction === 'l' */ {
        const slidesToMove = slidesLeft.slice(1);
        const translateX = sum(...slidesToMove.map(s => s.offsetWidth));
        slidesToMove.forEach(s => slider.prepend(s));

        // before animation
        dispatchEvent(events.slideChangeBeforeAnimation());

        // animation
        requestAnimationFrame(() => {
          slider.style.transform = `translateX(${-1 * translateX}px)`;
          requestAnimationFrame(async () => {
            await animateTransform(slider, `translateX(0px)`);
            index = newIndex;
          });
        });

      }

    };

    // effects
    const handleSlideChange = () => {
      const isInViewport = (/** @type {HTMLElement} */el) => {
        const { left, width, right } = el.getBoundingClientRect();
        return right <= window.innerWidth && left >= 0;
      };

      // remoce vclasses
      slides.forEach((s, i) => {
        s.classList.remove('in-view');
        s.classList.remove('in-view-center');
        s.classList.forEach(c => c.startsWith('in-view-index-') && s.classList.remove(c));
      });
      // mark in view slides
      const slidesInView = slides
        .filter(isInViewport)
        .sort((a, b) => {
          const { left: aLeft } = a.getBoundingClientRect();
          const { left: bLeft } = b.getBoundingClientRect();
          return aLeft - bLeft;
        });
      const slideInCenterIndex = (slidesInView.length % 2 === 0)
        ? (slidesInView.length / 2) + 1
        : Math.floor(slidesInView.length / 2);
      slidesInView.forEach((s, i) => {
        s.classList.add('in-view');
        s.classList.add(`in-view-index-${i}`);
        if (i === slideInCenterIndex) s.classList.add('in-view-center');
      });

    };
    slider.addEventListener('slide-change--before-animation', handleSlideChange);

    return {
      goNext,
      goPrev,
      goToIndex,
    };
  }
})();
