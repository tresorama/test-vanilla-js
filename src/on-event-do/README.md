# on-event-do

## Quick example

```html
<button 
  data-event-do='[
    ["click", "$(\\".dropdown\\").toggleClass(\\"animate\\")"],
    ["mouseenter", "alert(100)"]
  ]'
>
  Click me to open dropdown
</button>

<div class="dropdown">
  content
</div>

<style>
  .dropdown {
    display: none;
  }
  .dropdown.animate {
    display: block;
  }
</style>

```

## Initialization

There are 2 ways to initialize lib:

- Init once globally
  
  ```js
  import { OnEventDo_Orchestrator, $ } from 'on-event-do';

  OnEventDo_Orchestrator.setUtilityFunction($) // more on this later
  OnEventDo_Orchestrator.init();
  ```

  `OnEventDo_Orchestrator.init` can be invoked multiple times.  
  On invokation that are not the first one, only DOM element that wasn't previously initialized will be initialized. Already initialized DOM element are ignored.
- Call on element directly
  
  ```js
  import { OnEventDo_Orchestrator, OnEventDo, $ } from 'on-event-do';

  OnEventDo_Orchestrator.setUtilityFunction($)  // more on this later

  const el  = document.querySelector('#my-el');
  new OnEventDo(el);
  ```

### Utility function

The utlity function is the function that can be referenced inside callback string using `$` keyword.

```html
<div data-on-event-do='[
  ["click", "$()"],
]'
></div>
```

We provide a light utilty function at `import { $ } from 'on-event-do'`.  
In case is not enough you can create your own and inject it.  
How?  
Pass your custom function to `OnEventDo_Orchestrator.setUtilityFunction(customFunction)`.  

If you use jQuery:

```js
import $ from 'jquery';
OnEventDo_Orchestrator.setUtilityFunction($);
```

> NOTE:
> or do nothing anfd let JS scope cascade resolve `$` to the global jquery  

If you use other DOM manipulator library (like umbrella.js) you can:

```js
import u from 'umbrella.js';
OnEventDo_Orchestrator.setUtilityFunction(u);
```

## Usage

After initialization in your HTML you can add callback to event like so

```html
<div data-on-event-do='[
  ["click", "alert(45)"],
  ["mouseenter", "alert(20)"],
  ["mouseleave", "this.classList.add(\\"big\\")"],
  ["click", "$(\\"#contact-form\\").toggleAttr(\\"data-is-visible\\", [\\"true\\", \\"false\\"])"]
]'
></div>
```

The downsied is the usage of `\\"` to represent `"`.  
This is required because the whole value of data-on-event-do must be valid JSON (it will be JSON.parse-d).

## Common mistakes

```jsx
<div data-on-event-do='[
  ["click", "alert(45)"],
  ["mouseenter", "alert(20)"], // this comma in invalid because is the last item
]'
></div>
```
