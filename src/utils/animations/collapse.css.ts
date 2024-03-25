/*

Example of CSS

.animate-collapse--open {
  animation: animate-collapse--open 2s;
} 
.animate-collapse--close {
  animation: animate-collapse--close 2s;
} 
@keyframes animate-collapse--open {
  from { height: var(--animation-from--height); }
  to { height: var(--animation-to--height); }
}
@keyframes animate-collapse--close {
  from { height: var(--animation-from--height); }
  to { height: var(--animation-to--height); }
}

*/

export class AnimationCollapse {
  el: HTMLElement;
  constructor(el: HTMLElement) {
    this.el = el;
  }
  async open() {
    return new Promise<void>(resolve => {
      const { el } = this;
      el.style.setProperty('--animation--content-height', el.scrollHeight + 'px');
      const handleAnimationEnd = () => {
        resolve();
      };
      el.addEventListener('animationend', handleAnimationEnd, { once: true });
    });
  }
  async close() {
    return new Promise<void>(resolve => {
      debugger;
      const { el } = this;
      el.style.setProperty('--animation--content-height', el.scrollHeight + 'px');
      const handleAnimationEnd = () => {
        resolve();
      };
      el.addEventListener('animationend', handleAnimationEnd, { once: true });
    });
  }
}
