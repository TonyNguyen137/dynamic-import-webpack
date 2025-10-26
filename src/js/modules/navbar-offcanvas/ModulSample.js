/**
 * ModuleSample.js
 *
 * This file serves as a reference/template for creating Navbar Offcanvas modules.
 * Each module is a class that can optionally implement any of the following
 * lifecycle methods. These methods are called by the Navbar at specific times.
 *
 * === Available Lifecycle Hooks ===
 *
 * onExpand():    Called when the viewport changes to the expanded breakpoint.
 *                (e.g. hamburger menu disappears, links shown)
 *
 * onOpen():      Called when the offcanvas menu is opened.
 *
 * onClose():     Called when the offcanvas menu is closed.
 *
 * The module receives a context object in its constructor,
 * which includes references to relevant DOM elements:
 *
 * === context ===
 * {
 *  rootEl:       The root navbar element.
 *  containerEl:  The element that wraps the entire navbar component,
 *                including logo, toggle button, and offcanvas-menu,
 *  offcanvasEl:  The offcanvas menu element.
 *  openBtnEl:  The button element that opens the offcanvas menu.
 *  closeBtnEl: The button element inside the offcanvas to close it.
 *  isPositionFixed: Boolean indicating whether the navbar is fixed or not.
 * }
 *
 * === Registering Modules ===
 *
 * To attach custom modules to the NavbarOffcanvas, pass them into the `modules` option:
 *
 * /index.js
 *
 * import { ModulSample } from 'path-to/ModulSample.js';
 *
 * const options = {
 *   modules: [ModulSample],
 * };
 * new NavbarOffcanvas('.navbar', options);
 *
 * Each module will receive the full context object and lifecycle hooks
 * will be called automatically when appropriate.
 *
 */

export class ModuleSample {
  constructor(context) {}

  onExpand() {
    console.log('Navbar expanded');
  }

  onOpen() {
    console.log('Offcanvas opened');
  }

  onClose() {
    console.log('Offcanvas closed');
  }
}
