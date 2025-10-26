export function select(selector, scope = document) {
  return scope.querySelector(selector);
}

export function toArray(input, scope = document) {
  if (typeof input === "string") {
    const elements = Array.from(scope.querySelectorAll(input));
    return elements.length ? elements : false;
  }

  return Array.from(input);
}

export function wrap(min, max, index) {
  // Handle array input
  if (Array.isArray(min)) {
    return this.wrapArray(min, max);
  }

  // Handle numeric range input
  return this.wrapRange(min, max, index);
}

export function dynamicImportScriptsOnClick(arr) {
  arr.forEach((object) => {
    const { triggerSelector, fileName, className, args } = object;

    document.querySelector(triggerSelector).addEventListener(
      "click",
      (event) => {
        import(`../components/${fileName}.js`)
          .then((module) => {
            const Component = module[className || fileName];
            console.log("Compoent", Component);

            new Component(...(args || []));
            event.target.dispatchEvent(
              new MouseEvent("click", { bubbles: true })
            );
          })
          .catch((e) => {
            console.log("error: ", e);
          });
      },
      { once: true }
    );
  });
}
