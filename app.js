const select = (selector) => document.querySelector(selector);

function bindHeader() {
  const header = select("[data-site-header]");
  if (!header) return;
  const update = () =>
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  bindHeader();
});
