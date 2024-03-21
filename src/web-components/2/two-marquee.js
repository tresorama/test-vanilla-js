
const CSS = /*html*/`
<style>
  two-marquee {
    width: 100%;
    overflow: hidden;
    
    /* Private Props */
    --items-count: 20;
    --animation-play-state: running;
    
    /* Public Props */
    --gap: 0px;
    --animation-duration: 4s;
  }
  two-marquee-track {
    width: max-content;
    display: flex;
    gap: var(--gap);
    
    /* Autoscroll Animation */
    animation: marquee-animation linear infinite;
    animation-duration: calc(var(--animation-duration) * var(--items-count));
    animation-play-state: var(--animation-play-state);
  }
  @keyframes marquee-animation {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }

  two-marquee[data-mask-edges] {
    mask: 
      linear-gradient(to right, rgba(0,0,0,0) 5%, rgba(0,0,0,1) 20%),
      linear-gradient(to left, rgba(0,0,0,0) 5%, rgba(0,0,0,1) 20%);
    mask-size: 50%, 50%;
    mask-position: 0% 0%, 100% 0%;
    mask-repeat: no-repeat;
  }
</style>
`;

document.body.insertAdjacentHTML(
  "afterbegin",
  /*html*/`
<section class="py-6 px-8 flex flex-col gap-6 bg-lime-300">

  ${CSS}

  <two-marquee
    data-pause-on-hover
    data-mask-edges
    style="
    --gap: 1rem;
    --animation-duration: 2s;
    "
  >
    <div class="p-2 rounded bg-red-200">Brand 1</div>
    <div class="p-2 rounded bg-red-200">Brand 2</div>
    <div class="p-2 rounded bg-red-200">Brand 3</div>
    <div class="p-2 rounded bg-red-200">Brand 4</div>
    <div class="p-2 rounded bg-red-200">Brand 5</div>
    <div class="p-2 rounded bg-red-200">Brand 6</div>
    <div class="p-2 rounded bg-red-200">Brand 7</div>
    <div class="p-2 rounded bg-red-200">Brand 8</div>
    <div class="p-2 rounded bg-red-200">Brand 9</div>
    <div class="p-2 rounded bg-red-200">Brand 10</div>
  </two-marquee>

</section>
`,
);

class TwoMarquee extends HTMLElement {

  get options() {
    return {
      pauseOnHover: this.hasAttribute('data-pause-on-hover'),
    };
  }

  // public API

  pauseAnimation() {
    this.style.setProperty('--animation-play-state', 'paused');
  }
  resumeAnimation() {
    this.style.setProperty('--animation-play-state', 'running');
  }

  // on mount

  connectedCallback() {
    this.initDOM();
    this.initListeners();
  }
  initDOM() {
    // duplicate slides
    const originalSlides = [...this.children];
    const clonedSlides = originalSlides.map(slide => {
      const clone = /** @type {HTMLElement} */(slide.cloneNode(true));
      clone.setAttribute('data-two-marquee', 'clone-slide');
      return clone;
    });

    // create track
    const track = document.createElement('two-marquee-track');

    // add to DOM
    [...originalSlides, ...clonedSlides].forEach(s => track.append(s));
    this.append(track);

    // add CSS variables (for animation)
    this.style.setProperty('--items-count', originalSlides.length);
  }
  initListeners() {
    const { pauseOnHover } = this.options;

    if (pauseOnHover) {
      this.addEventListener('mouseenter', () => this.pauseAnimation());
      this.addEventListener('mouseleave', () => this.resumeAnimation());
    }
  }

}
customElements.define('two-marquee', TwoMarquee);
window.TwoMarquee = TwoMarquee;

customElements.define('two-marquee-track', class extends HTMLElement { });