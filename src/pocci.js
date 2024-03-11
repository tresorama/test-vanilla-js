// Progreesive Enhancement of Product Grid Filters
document.addEventListener("DOMContentLoaded", () => {
  return;
  // main
  initForm();
  function initForm() {
    const form = document.querySelector("#filter-bar-form");
    if (!form) return;

    // add ajax to products grid + filters
    const setLoading = (isLoading) =>
      (document.body.style.opacity = isLoading ? 0.4 : 1);
    const updateBrowserHistory = (searchParams) =>
      history.pushState(
        { searchParamsString: searchParams.toString() },
        "",
        `${window.location.pathname}?${searchParams.toString()}`,
      );
    const ajaxCache = {
      items: [],
      save(key, data) {
        this.items.push({ key, data });
      },
      getByKey(key) {
        return this.items.find((x) => x.key === key);
      },
    };
    const restoreOpenedPanel = (/** @type {Event} */ event) => {
      const /** @type {HTMLElement | null} */ eventTrigger = event.target;
      if (!eventTrigger) return;
      const facetGroup = eventTrigger.closest("[data-facet-group]");
      if (!facetGroup) return;
      const facetGroupName = facetGroup.getAttribute("data-facet-group");
      const newFacetGroup = document.querySelector(
        `[data-facet-group="${facetGroupName}"]`,
      );
      if (!newFacetGroup) return;
      if (newFacetGroup.tagName === "DETAILS") {
        newFacetGroup.setAttribute("open", "");
      }
    };
    const refreshWithAjax = async (searchParams) => {
      // @see https://shopify.dev/docs/api/section-rendering#find-section-ids
      const sectionToRefreshIds = [
        document
          .querySelector(".section.aaa-product-grid")
          .id.split("shopify-section-")[1],
      ];

      // for each section fetch the new HTML
      for (const [index, sectionId] of sectionToRefreshIds.entries()) {
        const url = `${window.location.pathname}?section_id=${sectionId}&${searchParams.toString()}`;
        const cachedResult = ajaxCache.getByKey(url);

        if (cachedResult) {
          replaceDOM(cachedResult.data);
        } else {
          try {
            const response = await fetch(url);
            const htmlString = await response.text();
            replaceDOM(htmlString);
            ajaxCache.save(url, htmlString);
          } catch (error) {
            console.error(error);
          }
        }
      }

      function replaceDOM(htmlString) {
        const newNode = new DOMParser().parseFromString(htmlString, "text/html")
          .body.children[0];
        const selector = `#${newNode.id}`;
        document.querySelector(selector).replaceWith(newNode);
      }
    };
    const handleFormSubmit = async (/** @type {Event} */ event) => {
      // get search params from the form
      const searchParams = new URLSearchParams(new FormData(form));
      // set loading state
      setLoading(true);
      // do ajax
      await refreshWithAjax(searchParams);
      // update browser history
      updateBrowserHistory(searchParams);
      // reinit JS script so listeners are readded
      restoreOpenedPanel(event);
      initForm();
      // set loading state
      setLoading(false);
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleFormSubmit();
    });
    form.addEventListener("input", debounce(handleFormSubmit, 200));

    // enchannce details UX
    form.querySelectorAll("details").forEach((node) => {
      const isOpen = () => node.hasAttribute("open");
      const close = () => node.removeAttribute("open");
      const trapFocus = createTrapFocus(node);
      const closeOnClickOutside = createOnClickOutside(node, close);
      const closeOnEscapePress = createOnKeyPress(document, (event) => {
        if (event.key === "Escape") close();
      });

      node.addEventListener("toggle", () => {
        if (isOpen()) {
          trapFocus.enable();
          trapFocus.focusFirstChild();
          closeOnClickOutside.enable();
          closeOnEscapePress.enable();
        } else {
          trapFocus.disable();
          trapFocus.restoreFocus();
          closeOnClickOutside.disable();
          closeOnEscapePress.disable();
        }
      });
    });
  }
});
