import { Utils } from '../global-utils';
const { wrap, clamp, lerpInverse } = Utils;

const SCOPE = "SECTION-" + Date.now();

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
  <style>
    /* Base */
    #${SCOPE} .slider {
    }
    #${SCOPE} .slider__track {
      overflow-x: scroll;
      display: flex;
      gap: 20px;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
    }
    #${SCOPE} .slider__slide {
      flex-shrink: 0;
      height: 20vh;
      max-width: 60vw;
      scroll-snap-align: start;
      position: relative;
    }
    #${SCOPE} .slider__slide::last-child {
      scroll-snap-align: end;
    }
    #${SCOPE} .slider__slide img {
      height: 100%;
      width: auto;
      object-fit: cover;
    }
    #${SCOPE} .slider__slide span {
      position: absolute;
      inset: 0;
      padding: 10px 20px;
      font-size: 7vw;
      color: yellow;
    }
    /* Controls */
    #${SCOPE} .slider__controls {
      display: flex;
      justify-content: space-between;
      padding: 1rem 0;
    }
    /* Controls - Set Index Input */
    #${SCOPE} .slider__controls :is(
      .slider__goToIndex input:not([type="submit"])
    ) {
      padding: 0 0.5em;
      border: solid;
      width: 4em;
    }
    /* Controls - Prev / Next / Set Index Submit */
    #${SCOPE} .slider__controls :is(
      .slider__prev, 
      .slider__next, 
      .slider__goToIndex input[type="submit"]
    ) {
      padding: 0 0.5em;
      border: solid;
      background: yellow;
    }
    /* Controls - Dots */
    #${SCOPE} .slider__dots {
      display: flex;
      justify-content: center;
      gap: 1em;
    }
    #${SCOPE} .slider__dot {
      --bg-color: gray;
      --bg-color--active: black;
      width: 1em;
      height: 1em;
      border-radius: 50%;
      background-color: var(--bg-color);
    }
    #${SCOPE} .slider__dot--active {
      background-color: var(--bg-color--active);
    }
    /* Addons - Progress Bar */
    #${SCOPE} .slider__progress-bar {
      width: 100%;
      height: 6px;
      background: currentColor;

      transition: transform 0.8s var(--easing);
      transform-origin: left;
      transform: scaleX(var(--sx));
      --sx: max(var(--progress), 0.05);
      --progress: 0.0; /* Update this with JS */
      --easing-easeOutSine: cubic-bezier(0.61, 1, 0.88, 1); /* https://easings.net/#easeOutSine */
      --easing-easeOutQuart: cubic-bezier(0.25, 1, 0.5, 1); /* https://easings.net/#easeOutQuart */
      --easing: var(--easing-easeOutQuart);
    }
  </style>
  <section id="${SCOPE}" class="py-6 px-8 flex flex-col gap-12">

    <div class="slider__controls">
      <button class="slider__prev">Prev</button>
      <form class="slider__goToIndex">
        <input name="index" type="number" value="0">
        <input type="submit" value="Set Index">
      </form>
      <button class="slider__next">Next</button>
    </div>
    
    <div class="slider__dots">
      <div class="slider__dot slider__dot--active"></div>
      <div class="slider__dot"></div>
      <div class="slider__dot"></div>
      <div class="slider__dot"></div>
      <div class="slider__dot"></div>
      <div class="slider__dot"></div>
    </div>

    <div class="slider__progress-bar"></div>

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
  const scope =/** @type {HTMLElement?} */ (document.querySelector(`#${SCOPE}`));
  const slider =/** @type {HTMLElement?} */ (scope.querySelector('.slider'));
  const sliderTrack =/** @type {HTMLElement?} */ (scope.querySelector('.slider__track'));
  const sliderSlides =/** @type {HTMLElement[]} */ ([...scope.querySelectorAll('.slider__slide')]);
  const buttonPrev =/** @type {HTMLElement?} */ (scope.querySelector('.slider__prev'));
  const buttonNext =/** @type {HTMLElement?} */ (scope.querySelector('.slider__next'));
  const formGoToIndex =/** @type {HTMLFormElement?} */ (scope.querySelector('form.slider__goToIndex'));
  const dots =/** @type {HTMLElement[]} */ ([...scope.querySelectorAll('.slider__dot')]);

  // config
  const config = {
    enableLoop: true,
  };

  // events
  const dispatchEvent = (
    /** 
     * @type {"slide-change--before-animation" | "slide-change--after-animation"}
     * */
    eventType,
    /** @type {object?} */
    payload
  ) => {
    const detail = {
      state: {
        index,
        slides: sliderSlides,
      },
      payload,
    };
    slider.dispatchEvent(new CustomEvent(eventType, { detail }));
  };

  // state + render
  let index = 0;
  const setIndex = (/** @type {typeof index} */_newIndex) => {
    // calculate change
    const oldIndex = index;
    const newIndex = (config.enableLoop)
      ? wrap(_newIndex, 0, sliderSlides.length - 1)
      : clamp(_newIndex, 0, sliderSlides.length - 1);
    // update state
    index = newIndex;
    // notify subscribers
    dispatchEvent('slide-change--before-animation', { oldIndex, newIndex });
    // render animation
    render();
    // notify subscribers
    dispatchEvent('slide-change--after-animation', { oldIndex, newIndex });
  };
  const render = () => {
    const scrollSliderToSlide = (/** @type {sliderSlides[number]}*/slide) => {
      sliderTrack.scrollLeft = slide.offsetLeft;
    };
    const setActiveDot = (/** @type {typeof index} */index) => {
      dots.forEach((dot, i) => dot.classList.toggle('slider__dot--active', i === index));
    };
    // run
    const slide = sliderSlides[index];
    scrollSliderToSlide(slide);
    setActiveDot(index);
  };

  // actions
  const goPrev = () => setIndex(index - 1);
  const goNext = () => setIndex(index + 1);
  const goToIndex = (/** @type {typeof index} */_newIndex) => setIndex(_newIndex);

  // listeneres
  buttonPrev.addEventListener('click', goPrev);
  buttonNext.addEventListener('click', goNext);
  formGoToIndex.addEventListener('submit', (e) => {
    e.preventDefault();
    const newIndex = Number(formGoToIndex.elements['index'].value);
    goToIndex(newIndex);
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToIndex(i));
  });

  // on load
  setTimeout(() => {
    setIndex(0);
  }, 2000);

})();



// addons
(() => {
  const scope =/** @type {HTMLElement?} */ (document.querySelector(`#${SCOPE}`));
  const slider =/** @type {HTMLElement?} */ (scope.querySelector('.slider'));
  const progressBar = /** @type {HTMLElement?} */ (document.querySelector(`#${SCOPE} .slider__progress-bar`));

  // state + render
  let progress = 0;
  const setProgress = (/** @type {typeof progress} */newProgress) => {
    progress = newProgress;
    render();
  };
  const render = () => {
    progressBar.style.setProperty('--progress', progress);
  };

  // listeners
  slider.addEventListener('slide-change--after-animation', (e) => {
    const { slides } = e.detail.state;
    const { newIndex } = e.detail.payload;
    const newProgress = lerpInverse(0, (slides.length - 1), newIndex);
    setProgress(newProgress);
  });
})();