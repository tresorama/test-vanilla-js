document.body.insertAdjacentHTML(
  "afterbegin",
  `
<!-- <accordion-standalone> -->
<div class="p-8">

  <accordion-standalone data-is-exclusive>
    <details>
      <summary>Accordion 1</summary>
      <div>Content 1</div>
    </details>
    <details>
      <summary>Accordion 2</summary>
      <div>Content 2</div>
    </details>
    <details>
      <summary>Accordion 3</summary>
      <div>Content 3</div>
    </details>
    <details>
      <summary>Accordion 4</summary>
      <div>Content 4</div>
    </details>
  </accordion-standalone>

</div>
`,
);

// Web Component definition
class AccordionStandalone extends HTMLElement {
  events = {
    itemOpened: (index) => new CustomEvent("item-opened", { detail: index }),
    itemClosed: (index) => new CustomEvent("item-closed", { detail: index }),
  };

  /**
   * @type {{
   *   details: HTMLDetailsElement;
   *   summary: HTMLElement;
   *   content: HTMLElement;
   * }[]}
   */
  get items() {
    return Array.from(this.querySelectorAll("details")).map((details) => ({
      details,
      summary: details.querySelector("summary"),
      content: details.querySelector("summary + *"),
    }));
  }

  get options() {
    return {
      isExclusive: this.hasAttribute("data-is-exclusive"),
    };
  }

  // on mount
  connectedCallback() {
    // init listeners

    // on summary click open with animation
    this.items.forEach((item, index) => {
      item.summary.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleItemByIndex(index);
      });
    });

    // close other accordion when one is open
    this.addEventListener("item-opened", (e) => {
      const { isExclusive } = this.options;
      const index = e.detail;
      if (!isExclusive) return;
      this.items.forEach((_, i) => {
        if (i == index) return;
        this.closeItemByIndex(i);
      });
    });
  }

  // actions
  toggleItemByIndex(index) {
    const isOpen = this.items[index].details.open;
    isOpen ? this.closeItemByIndex(index) : this.openItemByIndex(index);
  }
  openItemByIndex(index) {
    const { details, content } = this.items[index];
    if (details.open) return;

    // do animation
    details.setAttribute("open", "");
    const height = content.offsetHeight + "px";
    content.style.overflow = "hidden";
    content
      .animate([{ height: "0px" }, { height }], { duration: 100 })
      .finished.then(() => {
        // trigger event
        this.dispatchEvent(this.events.itemOpened(index));
      });
  }
  closeItemByIndex(index) {
    const { details, content } = this.items[index];
    if (!details.open) return;

    // do animation
    const height = content.offsetHeight + "px";
    content.style.overflow = "hidden";
    content
      .animate([{ height }, { height: "0px" }], { duration: 100 })
      .finished.then(() => {
        // trigger event
        details.removeAttribute("open");
        this.dispatchEvent(this.events.itemClosed(index));
      });
  }
}

customElements.define("accordion-standalone", AccordionStandalone);
window.AccordionStandalone = AccordionStandalone;
