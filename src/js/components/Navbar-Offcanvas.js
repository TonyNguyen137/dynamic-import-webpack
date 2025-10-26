import { select } from '../utils';
import { Tabber } from '../modules';

/**
 * Interface-like definition for Navbar modules.
 *
 * A module can optionally implement the following lifecycle hooks:
 *
 * - onOpen():   Called when the off-canvas menu is opened.
 * - onClose():  Called when the menu is closed.
 * - onExpand(): Called when the "expand" media query breakpoint becomes active.
 *
 * All hooks are optional — the system checks whether a method exists before calling it.
 *
 * To use modules, pass them as an array to the options.modules:
 *
 * new Navbar('.navbar', { modules: [yourModule] });
 */

// eslint-disable-next-line
const MODULE_INTERFACE = {
  onOpen: 'function',
  onClose: 'function',
  onExpand: 'function',
};

const BP_PREFIX = '--bp-';
const CORE_MODULES = [Tabber];
const CLASS_EXPAND_CORE = 'navbar--expand-';
const CLASS_OPEN = 'navbar--open';
const CLASS_TRANSITION = 'showing';
const CLASS_SHOW = 'show';

export class Navbar {
  constructor(blockSelector = '.navbar', options = {}) {
    this._blockSl = blockSelector;
    this._blockEl = typeof blockSelector === 'string' ? select(blockSelector) : blockSelector;
    if (!this._blockEl) return;
    this._openBtnEl = this._blockEl.querySelector(`${this._blockSl}__btn-open`);
    this._closeBtnEl = this._blockEl.querySelector(`${this._blockSl}__btn-close`);
    this._containerEl = this._blockEl.querySelector(`${this._blockSl}__container`);
    this._offcanvasEl = this._blockEl.querySelector(`${this._blockSl}__offcanvas`);
    this._isTransitioning = false;
    this._isExpanded = false;
    this._isPositionFixed = this._blockEl.dataset.fixed === 'true';
    this._breakpointName =
      [...this._blockEl.classList].find((cls) => cls.startsWith(CLASS_EXPAND_CORE))?.replace(CLASS_EXPAND_CORE, '') ?? null;
    this._breakpointValue = getComputedStyle(document.documentElement).getPropertyValue(BP_PREFIX + this._breakpointName) || null;
    this._expandMediaQuery = this._breakpointName ? window.matchMedia(`(min-width: ${this._breakpointValue})`) : null;

    this._boundHandleDocumentClick = this._handleDocumentClick.bind(this);
    this._boundHandleKeydown = this._handleKeydown.bind(this);
    this._options = options;
    this._modules = [...CORE_MODULES, ...(this._options?.modules || [])];
    this._context = {
      blockEl: this._blockEl,
      offcanvasEl: this._offcanvasEl,
      containerEl: this._containerEl,
      isPositionFixed: this._isPositionFixed,
      openBtnEl: this._openBtnEl,
      closeBtnEl: this._closeBtnEl,
    };
    this._moduleInstances = this._modules.map((Mod) => new Mod(this._context));

    this._initEventListener();
  }

  _initEventListener() {
    this._openBtnEl.addEventListener('click', this._handleOpenOffcanvas.bind(this));
    this._closeBtnEl.addEventListener('click', this._handleCloseOffcanvas.bind(this));
    this._offcanvasEl.addEventListener('transitionend', this._handleTransitionEnd.bind(this));

    // Listen for changes
    this._expandMediaQuery && this._expandMediaQuery.addEventListener('change', this._handleExpandMedia.bind(this));
  }

  /* == Event handler == */
  _handleExpandMedia(e) {
    if (e.matches) {
      this._onExpand(false);
    }
  }

  _handleDocumentClick(e) {
    const clickedInside = e.target.closest(`${this._blockSl}__offcanvas`) === this._offcanvasEl;

    if (!this._isExpanded || this._isTransitioning || clickedInside) return;
    this._handleCloseOffcanvas();
  }

  _handleKeydown(e) {
    if (!this._isExpanded || this._isTransitioning) return;

    if (e.key === 'Escape') {
      this._handleCloseOffcanvas();
    }
  }

  _handleOpenOffcanvas() {
    this._toggleOffcanvas(true);
  }

  _handleCloseOffcanvas() {
    this._toggleOffcanvas(false);
  }

  _handleTransitionEnd(e) {
    if (e.target != this._offcanvasEl) return;

    this._toggleOffcanvasClasses(this._isExpanded);
    this._isTransitioning = false;
  }

  /* == helper methods == */
  _setExpandedState(isExpanded) {
    this._openBtnEl.ariaExpanded = isExpanded;
    this._blockEl.classList.toggle(CLASS_OPEN, isExpanded);
    this._isExpanded = isExpanded;
  }
  _setTransitionClass() {
    this._offcanvasEl.classList.add(CLASS_TRANSITION);
  }

  _toggleOffcanvasClasses(isExpanded) {
    this._offcanvasEl.classList.remove(CLASS_TRANSITION);
    const method = isExpanded ? 'add' : 'remove';
    this._offcanvasEl.classList[method](CLASS_SHOW);
  }

  _toggleOffcanvas(isOpen) {
    this._setExpandedState(isOpen);
    this._blockEl.classList.toggle(CLASS_OPEN, isOpen);

    this._setTransitionClass();

    this._isTransitioning = true;

    const ariaAttributes = isOpen ? { 'aria-modal': 'true', role: 'dialog' } : { 'aria-modal': null, role: null };
    this._updateAriaAttributes(ariaAttributes);

    // Focus management
    const focusTarget = isOpen ? this._offcanvasEl : this._openBtnEl;
    focusTarget.focus();

    this._manageEventListeners(isOpen);

    const lifecycleMethod = isOpen ? 'onOpen' : 'onClose';
    this._callModuleLifecycleMethod(lifecycleMethod);
    this._options['onToggle']?.({ ...this._context, isOpen });
  }

  _onExpand(state) {
    this._setExpandedState(state);
    this._blockEl.classList.toggle(CLASS_OPEN, state);
    const ariaAttributes = { 'aria-modal': null, role: null };
    this._updateAriaAttributes(ariaAttributes);
    this._toggleOffcanvasClasses(state);
    this._manageEventListeners(state);
    this._callModuleLifecycleMethod('onExpand');
  }

  _updateAriaAttributes(attributes) {
    Object.entries(attributes).forEach(([attr, value]) => {
      if (value) {
        this._offcanvasEl.setAttribute(attr, value);
      } else {
        this._offcanvasEl.removeAttribute(attr);
      }
    });
  }

  _manageEventListeners(isOpen) {
    const method = isOpen ? 'addEventListener' : 'removeEventListener';
    document[method]('click', this._boundHandleDocumentClick);
    document[method]('keydown', this._boundHandleKeydown);
  }

  _callModuleLifecycleMethod(methodName) {
    this._moduleInstances.forEach((Modul) => Modul[methodName]?.());
  }
}
