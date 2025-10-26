import { toArray } from '../utils';
export class Accordion {
  constructor(rootElSelector = '.accordion') {
    this._rootEls = typeof rootElSelector === 'string' ? toArray(rootElSelector) : [rootElSelector];
    if (!this._rootEls.length) return;
    this._rootEls.forEach((rootEl) => this._initRootEl(rootEl));
  }

  _initRootEl(rootEl) {
    rootEl._itemEls = toArray('.accordion__item', rootEl);
    rootEl._isTransitioning = false;
    rootEl._currentActiveItem = rootEl.querySelector('[aria-expanded=true]') || null;
    rootEl.addEventListener('click', this._handleClick.bind(this));
    rootEl.addEventListener('transitionend', this._handleTransitionEnd.bind(this));
  }

  /* == Event Handler == */
  _handleClick(e) {
    const togglerEl = e.target.closest('.accordion__toggler');
    const rootEl = e.currentTarget;

    if (!togglerEl || rootEl._isTransitioning) return;

    const isSameToggler = rootEl._currentActiveItem === togglerEl;
    const isExpanded = togglerEl.ariaExpanded === 'true';

    rootEl._isTransitioning = true;

    if (isSameToggler) {
      // Collapse current

      this._toggleAccordionItem(togglerEl, false);
      rootEl._currentActiveItem = null;
    } else {
      // expand new
      this._toggleAccordionItem(togglerEl, !isExpanded);

      // Collapse previous if exists
      if (rootEl._currentActiveItem) {
        this._toggleAccordionItem(rootEl._currentActiveItem, false);
      }

      // Update reference to the currently expanded toggler
      rootEl._currentActiveItem = togglerEl;
    }
  }

  _handleTransitionEnd(e) {
    if (e.propertyName !== 'height') return;

    const collapseEl = e.target;
    collapseEl.classList.remove('collapsing');

    if (collapseEl.style.height) {
      collapseEl.classList.add('show');
    } else {
      collapseEl.classList.add('collapse');
    }
    collapseEl.style.height = '';

    e.currentTarget._isTransitioning = false;
  }

  /* == helper methods == */

  _toggleAccordionItem(togglerEl, expand) {
    const itemEl = togglerEl.closest('.accordion__item');
    const collapseEl = itemEl.querySelector('.accordion__collapse');

    togglerEl.ariaExpanded = expand;

    if (expand) {
      // Opening
      this._prepareCollapseTransition(collapseEl, 'collapse');
      this._setCollapseHeight(collapseEl);
    } else {
      // Closing
      this._setCollapseHeight(collapseEl);

      // Force reflow
      collapseEl.offsetHeight;

      this._prepareCollapseTransition(collapseEl, 'show');

      collapseEl.style.height = '';
    }
  }

  _prepareCollapseTransition(el, classToRemove) {
    el.classList.remove(classToRemove);
    el.classList.add('collapsing');
  }

  _setCollapseHeight(el) {
    el.style.height = `${el.scrollHeight}px`;
  }
}
