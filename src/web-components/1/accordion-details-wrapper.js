document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <!-- Accordion Details wrapper -->
  <div class="p-8">

    <accordion-details-wrapper data-is-exclusive>
      <details is="details-expandable">
        <summary>Accordion 1</summary>
        <div>Content 1</div>
      </details>
      <details is="details-expandable">
        <summary>Accordion 2</summary>
        <div>Content 2</div>
      </details>
      <details is="details-expandable">
        <summary>Accordion 3</summary>
        <div>Content 3</div>
      </details>
      <details is="details-expandable">
        <summary>Accordion 4</summary>
        <div>Content 4</div>
      </details>
    </accordion-details-wrapper>

  </div>
  `,
);

// Web Component definition
class AccordionDetailsWrapper extends HTMLElement {
  /** @type {Set<"toggle">} */
  ignoredEvent = new Set();

  /**
   * @type {{
   *   details: HTMLDetailsElement;
   *   summary: HTMLElement;
   *   content: Element;
   * }[]}
   */
  items = [];

  get options() {
    return {
      isExclusive: this.hasAttribute("data-is-exclusive"),
    };
  }

  // on mount
  connectedCallback() {
    this.initDOM();
    this.initListeners();
  }

  initDOM() {
    // get items from dom
    const rootNodes = Array.from(this.querySelectorAll("details"));
    this.items = rootNodes.map((details) => {
      const summary = details.querySelector("summary");
      const content = details.querySelector("summary + *");
      return {
        details,
        summary,
        content,
      };
    });
  }

  initListeners() {
    const { items } = this;

    items.forEach((item) => {
      const { details } = item;

      details.addEventListener("toggle", (e) => {
        if (!this.options.isExclusive) return;
        if (this.ignoredEvent.has("toggle")) return;

        // we process only "opened" event
        const actionType = details.open ? "opened" : "closed";
        if (actionType === "closed") return;

        // close all other accordion item
        setTimeout(() => {
          this.ignoredEvent.add("toggle");
          this.items
            .filter((x) => x.details !== details)
            .forEach((item) => (item.details.open = false));
          setTimeout(() => {
            this.ignoredEvent.delete("toggle");
          }, 200);
        }, 200);
      });
    });
  }
}
customElements.define("accordion-details-wrapper", AccordionDetailsWrapper);
window.AccordionDetailsWrapper = AccordionDetailsWrapper;
