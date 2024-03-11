import "./global.css";
import "./global-utils.js";

import "./web-components/console-log-singleton.js";
import "./web-components/accordion-standalone.js";
import "./web-components/ajax-form.js";
import "./web-components/modal-wrapper.js";
import "./web-components/drawer-wrapper.js";
import "./web-components/mega-menu.js";
import "./plain-js/mega-menu-2.js";
import "./plain-js/mega-menu-3.js";
import "./web-components/mega-menu-3.js";
import "./web-components/mega-menu-3b.js";
import "./web-components/mega-menu-3c.js";
import "./plain-js/mega-menu-4.js";
import "./plain-js/mega-menu-stripe.js";
import "./plain-js/mega-menu-5.js";
import "./web-components/details-expandable.js";
import "./web-components/accordion-details-wrapper.js";
import "./plain-js/experiment--element-behavior.js";
import "./plain-js/class-based-css-animation.js";
import "./alpine-js/init.js";
import "./alpine-js/simple.js";
import "./animations/compare.js";
import "./animations/test01.js";
import "./on-event-do/demo.js";

const { onDomReady } = Utils;

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
