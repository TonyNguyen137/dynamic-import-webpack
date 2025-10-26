export class ScrollLocker {
  constructor(context) {
    this._rootEl = context.rootEl;
    this._isPositionFixed = context.isPositionFixed;
    this._handleTransitionEndBound = this._handleTransitionEnd.bind(this);

    this._scrollPosition = 0;
  }

  /* == event Handler == */
  _handleTransitionEnd(e) {
    if (e.srcElement.matches('.show') || e.propertyName != 'transform') return;

    // remove scroll behavior inline style on root Element
    document.documentElement.removeAttribute('style');

    // Remove the event listener
    this._offcanvasEl.removeEventListener('transitionend', this._handleTransitionEnd);
  }

  // Lifecycle hooks used by Navbar to trigger module behavior on expand/open/close

  onExpand() {
    this.onClose();
    document.documentElement.removeAttribute('style');
  }

  onOpen() {
    this._lockScreen();
  }

  onClose() {
    this._unlockScreen();
  }

  //

  _lockScreen() {
    this._scrollPosition = window.scrollY;
    let scrollPositionStyle = this._scrollPosition > 0 ? `top: -${this._scrollPosition}px; ` : '';
    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.setAttribute(
      'style',
      `position:fixed; ${scrollPositionStyle}width:100%; overflow: hidden; padding-right: ${scrollbarWidth}px`
    );

    // Prevents layout shift by adding padding to account for the scrollbar, not needed for position: sticky
    if (this._isPositionFixed) {
      this._rootEl.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Temporarily disable smooth scrolling to prevent scroll animation
    document.documentElement.style.scrollBehavior = 'auto';

    // prevents overscroll on touch devices
    document.documentElement.style.overscrollBehavior = 'none';
  }

  _unlockScreen() {
    document.body.removeAttribute('style');

    if (this._isPositionFixed) {
      this._rootEl.removeAttribute('style');
    }

    // Restore the previous scroll position if the page was scrolled
    if (this._scrollPosition > 0) {
      window.scrollTo(0, this._scrollPosition);
    }
  }
}
