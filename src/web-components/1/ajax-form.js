import { Utils } from "../../global-utils";
const { onDomReady, debounce } = Utils;

// on load
onDomReady(() => {
  // intercept form submitted without JS
  // and console log something!
  // Because we want to seee when a form
  // is used with or without JS progressive enhancement
  window.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Form submitted without JS");
    ConsoleLogSingleton?.log("Form submitted without JS");
  });
});


// utils
const fakeFetch = (url, requestPayload) => {
  const DELAY = 300;
  return new Promise((resolve, reject) => {
    const data = [
      {
        selector: ".results",
        html: `
                <div class="results mt-5 py-8 bg-red-100">
                  ${new Date().toLocaleString()}
                </div>
                `,
      },
      {
        selector: ".debug",
        html: `
                <pre class="debug">
                ${requestPayload}
                </pre>
                `,
      },
    ];
    setTimeout(() => resolve(data), DELAY);
  });
};

document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <!-- AjaxForm -->
  <div class="bg-red-200 py-12 px-8 space-y-6">

    <div class="py-8 bg-red-100">
      <pre class="debug"></pre>
    </div>
  
    <ajax-form>
      <form class="flex gap-4">
        <details open class="bg-red-300">
          <summary>Product Color</summary>
          <label>
            <input type="checkbox" name="color" value="red" />red
          </label>
          <label>
            <input type="checkbox" name="color" value="blue" />blue
          </label>
        </details>
        <details open class="bg-red-300">
          <summary>Product Size</summary>
          <label>
            <input type="checkbox" name="size" value="sm" />sm
          </label>
          <label>
            <input type="checkbox" name="size" value="lg" />lg
          </label>
        </details>
        <input type="submit" />
      </form>
    </ajax-form>
  
    <div class="results py-8 bg-red-100">
    </div>
  </div>
`,
);

// Web Componet definition
class AjaxForm extends HTMLElement {
  /**
   * @type {Array<{
   *   url: string,
   *   data: Array<{
   *     selector: string,
   *     html: string
   *   }>
   * }>
   * } */
  cache = [];

  getForm() {
    const form = this.querySelector("form");
    if (!form) throw new Error("Form not found");
    return form;
  }

  connectedCallback() {
    // bind methods
    this.handleSubmit = this.handleSubmit.bind(this);

    // add listener
    const form = this.getForm();

    // submit form on input change
    form.addEventListener("input", debounce(this.handleSubmit, 300));

    // do ajax instead of form submit
    this.cache = [];
    form.addEventListener("submit", this.handleSubmit);
  }

  async handleSubmit(/** @type {SubmitEvent | Event} */ e) {
    debugger;
    e.preventDefault();
    const form = this.getForm();

    // get params from the form
    const queryParams = new URLSearchParams(new FormData(form));
    const queryString = queryParams.toString();

    // create the url to fetch
    const url = `${window.location.pathname}?${queryString}`;

    // fetch (or get from cache) and replace html
    const replaceDomNode = (
      /** @type {string} */ selector,
      /** @type {string} */ htmlString,
    ) => {
      const oldNode = document.querySelector(selector);
      if (!oldNode) return;
      const newNode = new DOMParser().parseFromString(htmlString, "text/html")
        .body.children[0];
      oldNode.replaceWith(newNode);
    };
    const cachedResult = this.cache.find((x) => x.url === url);
    if (cachedResult) {
      const data = cachedResult.data;
      data.forEach(({ selector, html }) => replaceDomNode(selector, html));
    } else {
      const response = await fakeFetch(url, queryString);
      const data = response;
      data.forEach(({ selector, html }) => replaceDomNode(selector, html));
      this.cache.push({ url, data });
    }
  }
}
customElements.define("ajax-form", AjaxForm);
window.AjaxForm = AjaxForm;
