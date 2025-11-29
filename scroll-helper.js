// Generic horizontal scroll enhancer for chip/button rows on desktop.
(function () {
  function shouldEnhance(el) {
    if (!el) return false;
    const styles = window.getComputedStyle(el);
    const overflowX = styles.overflowX || "";
    return (
      (el.classList.contains("chips") || el.classList.contains("bar")) &&
      (overflowX.includes("auto") || overflowX.includes("scroll")) &&
      el.scrollWidth > el.clientWidth
    );
  }

  function enhance(el) {
    if (!el || el.dataset.scrollEnhanced) return;
    if (!shouldEnhance(el)) return;
    el.dataset.scrollEnhanced = "1";

    // Wheel: turn vertical scroll into horizontal scroll.
    el.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      },
      { passive: false }
    );

    // Drag-to-scroll for mouse users.
    let isDown = false;
    let startX = 0;
    let startLeft = 0;

    el.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      isDown = true;
      startX = e.pageX;
      startLeft = el.scrollLeft;
      el.classList.add("dragging");
    });

    window.addEventListener("mouseup", () => {
      isDown = false;
      el.classList.remove("dragging");
    });

    el.addEventListener("mouseleave", () => {
      isDown = false;
      el.classList.remove("dragging");
    });

    el.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const dx = e.pageX - startX;
      el.scrollLeft = startLeft - dx;
    });
  }

  function init() {
    const targets = document.querySelectorAll(".chips, .bar");
    targets.forEach(enhance);

    // Observe DOM changes for dynamically rendered rows
    const observer = new MutationObserver(() => {
      document.querySelectorAll(".chips, .bar").forEach(enhance);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
