export class Backdrop {
  constructor(context) {
    this._offcanvasEl = context.offcanvasEl;
    this._containerEl = context.containerEl;
    this._backdropEl = document.createElement("div");
    this._backdropEl.classList.add("backdrop", "fade");

    this._initEventListener();
  }

  _initEventListener() {
    this._backdropEl.addEventListener(
      "transitionend",
      this._handleTransitionEnd.bind(this)
    );
  }

  onExpand() {
    this._backdropEl.remove();
  }

  onOpen() {
    this._containerEl.append(this._backdropEl);
    requestAnimationFrame(() => {
      this._backdropEl.classList.add("show");
    });
  }

  onClose() {
    this._backdropEl.classList.remove("show");
  }

  _handleTransitionEnd(e) {
    // once the the fade-out is complete, remove the backdrop from the DOM
    if (!e.target.classList.contains("show")) {
      // Remove BackdropEl from the DOM
      this._backdropEl.remove();
    }
  }
}
