(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const previousButtons = Array.from(document.querySelectorAll('[aria-label="Previous slide"]'));
  const nextButtons = Array.from(document.querySelectorAll('[aria-label="Next slide"]'));
  const slideCount = document.querySelector(".slide-count");
  const progress = document.querySelector(".progress i");
  const overview = document.querySelector(".overview");
  const overviewButtons = Array.from(document.querySelectorAll(".overview-grid [data-slide]"));
  const overviewClose = document.querySelector('[aria-label="Close overview"]');
  const total = slides.length;
  let touchStart = null;
  let previousFocus = null;

  const requested = Number.parseInt(window.location.hash.slice(1), 10);
  let current = Number.isInteger(requested) && requested >= 1 && requested <= total ? requested - 1 : 0;

  function updateHash() {
    window.history.replaceState(null, "", `#${current + 1}`);
  }

  function render({ hash = true } = {}) {
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === current);
      slide.classList.toggle("is-before", index < current);
      slide.classList.toggle("is-after", index > current);
      slide.setAttribute("aria-hidden", String(index !== current));
    });
    previousButtons.forEach((button) => { button.disabled = current === 0; });
    nextButtons.forEach((button) => { button.disabled = current === total - 1; });
    if (slideCount) slideCount.innerHTML = `${String(current + 1).padStart(2, "0")} <span>/ ${String(total).padStart(2, "0")}</span>`;
    if (progress) progress.style.transform = `scaleX(${(current + 1) / total})`;
    overviewButtons.forEach((button, index) => {
      button.classList.toggle("is-current", index === current);
      if (index === current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    if (hash) updateHash();
  }

  function goTo(index) {
    current = Math.max(0, Math.min(total - 1, index));
    render();
  }

  function setOverview(open) {
    if (!overview) return;
    overview.hidden = !open;
    if (open) {
      previousFocus = document.activeElement;
      overviewClose?.focus();
    } else if (previousFocus instanceof HTMLElement) {
      previousFocus.focus();
      previousFocus = null;
    }
  }

  previousButtons.forEach((button) => button.addEventListener("click", () => goTo(current - 1)));
  nextButtons.forEach((button) => button.addEventListener("click", () => goTo(current + 1)));
  slideCount?.addEventListener("click", () => setOverview(true));
  overviewClose?.addEventListener("click", () => setOverview(false));
  overviewButtons.forEach((button) => button.addEventListener("click", () => {
    goTo(Number(button.dataset.slide));
    setOverview(false);
  }));

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === "o") {
      setOverview(overview?.hidden ?? true);
      return;
    }
    if (!overview?.hidden && event.key === "Escape") {
      setOverview(false);
      return;
    }
    if (!overview?.hidden) return;

    const target = event.target instanceof Element ? event.target : null;
    const isInteractive = Boolean(target?.closest("button, a, input, textarea, select, [contenteditable='true']"));
    const activeFrame = document.querySelector(".slide.is-active .slide-frame");

    const scrollWithinSlide = (direction, amount) => {
      if (!activeFrame) return false;
      const maxScroll = activeFrame.scrollHeight - activeFrame.clientHeight;
      const canScroll = direction > 0 ? activeFrame.scrollTop < maxScroll - 2 : activeFrame.scrollTop > 2;
      if (!canScroll) return false;
      activeFrame.scrollBy({ top: direction * amount, behavior: "smooth" });
      return true;
    };

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(current + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(current - 1);
    }
    if (["ArrowDown", "PageDown"].includes(event.key) || (event.key === " " && !isInteractive)) {
      event.preventDefault();
      const amount = event.key === "ArrowDown" ? 90 : (activeFrame?.clientHeight ?? window.innerHeight) * .82;
      if (!scrollWithinSlide(1, amount)) goTo(current + 1);
    }
    if (["ArrowUp", "PageUp"].includes(event.key)) {
      event.preventDefault();
      const amount = event.key === "ArrowUp" ? 90 : (activeFrame?.clientHeight ?? window.innerHeight) * .82;
      if (!scrollWithinSlide(-1, amount)) goTo(current - 1);
    }
    if (event.key === "Home") goTo(0);
    if (event.key === "End") goTo(total - 1);
    if (key === "f") document.documentElement.requestFullscreen?.();
  });

  window.addEventListener("hashchange", () => {
    const value = Number.parseInt(window.location.hash.slice(1), 10);
    if (Number.isInteger(value) && value >= 1 && value <= total) {
      current = value - 1;
      render({ hash: false });
    }
  });

  document.querySelector(".deck")?.addEventListener("touchstart", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const touch = event.changedTouches[0];
    if (!overview?.hidden || target?.closest(".deck-controls, .overview") || !touch) {
      touchStart = null;
      return;
    }
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });

  document.querySelector(".deck")?.addEventListener("touchend", (event) => {
    if (touchStart === null) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      goTo(deltaX < 0 ? current + 1 : current - 1);
    }
    touchStart = null;
  }, { passive: true });

  document.querySelector(".deck")?.addEventListener("touchcancel", () => {
    touchStart = null;
  }, { passive: true });

  render();
})();
