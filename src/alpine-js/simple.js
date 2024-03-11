import Alpine from "alpinejs";

// utils
const generateRandomKey = (partial) => `${partial}_` + Date.now();
const pieces = {
  /** @type {string[]} */
  items: [],
  add(str) { this.items.push(str); },
  render() { return this.items.reverse().join("\n\n"); }
};


//
pieces.add(
  /*html*/`
  <button x-data="{ label: 'Click Here' }" x-text="label"></button>
  <button x-data @click="alert('clicked!')">Click Me</button>
  `);


// 
const dropdown = generateRandomKey('dropdown');
Alpine.data(dropdown, (initialOpen = false) => ({
  open: initialOpen,
  toggle() {
    this.open = !this.open;
  },
}));
pieces.add(
  /*html*/`
  <div x-data="${dropdown}(true)">
    <button @click="toggle">Expand</button>
    <span x-show="open">Content...</span>
  </div>

  <div x-data="${dropdown}">
    <button @click="toggle">Expand</button>
    <span x-show="open">Some Other Content...</span>
  </div>
`);


// 
const accordion = generateRandomKey('accordion');
Alpine.data(accordion, (openedIndex = 0) => ({
  openedIndex,
  open(index) {
    this.openedIndex = index;
  },
  // x-bind directives
  itemHeader(index) {
    return {
      ['@click']() {
        this.open(index);
      }
    };
  },
  itemContent(index) {
    return {
      ['x-show']() {
        return this.openedIndex === index;
      }
    };
  },
}));
pieces.add(/*html*/`
  <div class="${accordion}" x-data="${accordion}(0)">

  <p>Opened Index: <span x-text="openedIndex"></span></p>

  <div class="accordion-wrapper">
    <div class="accordion-item" >
      <div class="accordion-item__header" x-bind="itemHeader(0)">Accordion 1</div>
      <div class="accordion-item__content" x-bind="itemContent(0)">
        <div>Content</div>
      </div>
    </div>
    <div class="accordion-item">
      <div class="accordion-item__header" x-bind="itemHeader(1)">Accordion 2</div>
      <div class="accordion-item__content" x-bind="itemContent(1)">
        <div>Content</div>
      </div>
    </div>
    <div class="accordion-item">
      <div class="accordion-item__header" x-bind="itemHeader(2)">Accordion 3</div>
      <div class="accordion-item__content" x-bind="itemContent(2)">
        <div>Content</div>
      </div>
    </div>
  </div>

  <style>
    .${accordion} .accordion-item__header {
      background: white;
      padding: 0.3em 0.5em;
    }
  </style>

  </div>
`);


// render on page
// 
document.body.insertAdjacentHTML('afterbegin', /*html*/`
<section class="py-12 px-8 bg-red-200 border-b border-current flex flex-col gap-12">
  ${pieces.render()}
</section>
`);