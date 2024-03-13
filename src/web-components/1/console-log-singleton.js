//
document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <!-- Console-log singleton -->
  <console-log-singleton>
    <div class="p-8 bg-gray-400">
      <p>Console Log</p>
      <div console-log-singleton="messages"></div>
    </div>
  </console-log-singleton>
`,
);

class ConsoleLogSingleton extends HTMLElement {
  static instances = [];
  constructor() {
    if (ConsoleLogSingleton.instances.length >= 1) {
      console.error(
        "You cannot have more that 1 <console-log-singleton> in page!!!",
      );
      return;
    }
    super();
    ConsoleLogSingleton.instances.push(this);
  }
  // on mount
  connectedCallback() {
    console.log("mounted");
  }
  // on unmount
  disconnectedCallback() {
    console.log("unmounted");
  }

  static log(text) {
    const node = ConsoleLogSingleton.instances[0];
    if (!node) {
      console.error("Missing <console-log-singleton> elment in page!!!");
      return;
    }
    const p = document.createElement("p");
    p.innerHTML = text;
    node.querySelector("[console-log-singleton=messages]").prepend(p);
  }
  static testUsage() {
    // usage in your app
    ConsoleLogSingleton.log("start");
    ConsoleLogSingleton.log("start 2");
    ConsoleLogSingleton.log("start 3");
  }
}
customElements.define("console-log-singleton", ConsoleLogSingleton);
window.ConsoleLogSingleton = ConsoleLogSingleton;

// demo
ConsoleLogSingleton.testUsage();
