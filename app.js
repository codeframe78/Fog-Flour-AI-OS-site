const select = (selector, scope = document) => scope.querySelector(selector);
const selectAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function setText(selector, value) {
  const element = select(selector);
  if (element) element.textContent = String(value);
}

function statusTone(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "complete") return "complete";
  if (normalized === "next") return "next";
  return "planned";
}

function createMilestoneCard(milestone, index) {
  const article = document.createElement("article");
  article.className = "milestone-card reveal";
  article.dataset.status = statusTone(milestone.status);

  const header = document.createElement("div");
  header.className = "milestone-card-head";

  const number = document.createElement("span");
  number.className = "milestone-index";
  number.textContent = String(index + 1).padStart(2, "0");

  const status = document.createElement("span");
  status.className = "status-pill";
  status.textContent = milestone.status;

  header.append(number, status);

  const title = document.createElement("h3");
  title.textContent = milestone.label;

  const focus = document.createElement("p");
  focus.className = "milestone-focus";
  focus.textContent = milestone.focus;

  const forecast = document.createElement("dl");
  forecast.className = "milestone-forecast";

  const forecastTarget = document.createElement("div");
  const targetLabel = document.createElement("dt");
  targetLabel.textContent = "Planning target";
  const targetValue = document.createElement("dd");
  targetValue.textContent = milestone.forecast?.target || "Not forecast";
  forecastTarget.append(targetLabel, targetValue);

  const forecastWindow = document.createElement("div");
  const windowLabel = document.createElement("dt");
  windowLabel.textContent = "Forecast window";
  const windowValue = document.createElement("dd");
  windowValue.textContent = milestone.forecast?.window || "Not forecast";
  forecastWindow.append(windowLabel, windowValue);

  const forecastConfidence = document.createElement("div");
  const confidenceLabel = document.createElement("dt");
  confidenceLabel.textContent = "Confidence";
  const confidenceValue = document.createElement("dd");
  confidenceValue.textContent = milestone.forecast?.confidence || "Not rated";
  forecastConfidence.append(confidenceLabel, confidenceValue);

  forecast.append(forecastTarget, forecastWindow, forecastConfidence);

  const progressWrap = document.createElement("div");
  progressWrap.className = "milestone-progress";

  const progressLabel = document.createElement("span");
  progressLabel.textContent = "Verified cards";

  const count = document.createElement("span");
  count.textContent = `${milestone.complete}/${milestone.total}`;

  const progress = document.createElement("progress");
  progress.max = milestone.total;
  progress.value = milestone.complete;
  progress.setAttribute("aria-label", `${milestone.label}: ${milestone.complete} of ${milestone.total} cards complete`);

  progressWrap.append(progressLabel, count, progress);
  article.append(header, title, focus, forecast, progressWrap);
  return article;
}

function applyRoadmap(data) {
  const percent = Math.round((data.completeCards / data.totalCards) * 100);
  setText("[data-complete-cards]", data.completeCards);
  setText("[data-total-cards]", data.totalCards);
  setText("[data-progress-percent]", `${percent}%`);
  setText("[data-current-focus]", data.currentFocus);
  setText("[data-updated]", data.updated);

  const ring = select("[data-progress-ring]");
  if (ring) ring.style.setProperty("--progress", percent);

  const grid = select("[data-milestone-grid]");
  if (!grid) return;
  grid.replaceChildren(...data.milestones.map(createMilestoneCard));
  observeReveals(grid);
}

function showRoadmapFallback() {
  const grid = select("[data-milestone-grid]");
  if (!grid) return;
  const note = document.createElement("p");
  note.className = "load-note";
  note.textContent = "Roadmap details are temporarily unavailable. The verified baseline is 14 of 42 cards complete.";
  grid.replaceChildren(note);
}

async function loadRoadmap() {
  try {
    const response = await fetch("roadmap.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Roadmap request failed: ${response.status}`);
    applyRoadmap(await response.json());
  } catch (error) {
    console.warn(error);
    showRoadmapFallback();
  }
}

let revealObserver;

function observeReveals(scope = document) {
  const elements = selectAll(".reveal:not([data-reveal-bound])", scope);
  if (!elements.length) return;

  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
  }

  elements.forEach((element) => {
    element.dataset.revealBound = "true";
    revealObserver.observe(element);
  });
}

function bindHeader() {
  const header = select("[data-site-header]");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  bindHeader();
  observeReveals();
  loadRoadmap();
});
