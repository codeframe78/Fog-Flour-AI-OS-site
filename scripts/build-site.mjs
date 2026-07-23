import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist");
const roadmap = JSON.parse(await readFile(join(root, "roadmap.json"), "utf8"));

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const statusTone = (status) => {
  const normalized = String(status).toLowerCase();
  if (normalized === "complete") return "complete";
  if (normalized === "in progress" || normalized === "next") return "active";
  return "planned";
};

const renderMilestone = (milestone, index) => `
          <li class="milestone-card" data-status="${statusTone(milestone.status)}">
            <div class="milestone-card-head">
              <span class="milestone-index">${String(index + 1).padStart(2, "0")}</span>
              <span class="status-pill">${escapeHtml(milestone.status)}</span>
            </div>
            <h3 id="milestone-title-${index + 1}">${escapeHtml(milestone.label)}</h3>
            <p class="milestone-focus">${escapeHtml(milestone.focus)}</p>
            <dl class="milestone-forecast">
              <div>
                <dt>Planning target</dt>
                <dd>${escapeHtml(milestone.forecast?.target ?? "Not forecast")}</dd>
              </div>
              <div>
                <dt>Forecast window</dt>
                <dd>${escapeHtml(milestone.forecast?.window ?? "Not forecast")}</dd>
              </div>
              <div>
                <dt>Confidence</dt>
                <dd>${escapeHtml(milestone.forecast?.confidence ?? "Not rated")}</dd>
              </div>
            </dl>
            <div class="milestone-progress">
              <span id="milestone-progress-${index + 1}">Verified cards</span>
              <span>${milestone.complete}/${milestone.total}</span>
              <progress max="${milestone.total}" value="${milestone.complete}" aria-labelledby="milestone-title-${index + 1} milestone-progress-${index + 1}"></progress>
            </div>
          </li>`;

if (
  !Number.isInteger(roadmap.completeCards) ||
  !Number.isInteger(roadmap.totalCards) ||
  roadmap.completeCards < 0 ||
  roadmap.totalCards <= 0 ||
  roadmap.completeCards > roadmap.totalCards ||
  !Array.isArray(roadmap.milestones) ||
  roadmap.milestones.length === 0
) {
  throw new Error("roadmap.json contains invalid public milestone totals.");
}

const progress = Math.round((roadmap.completeCards / roadmap.totalCards) * 100);
let homepage = await readFile(join(root, "index.html"), "utf8");
const replacements = new Map([
  ["{{COMPLETE_CARDS}}", roadmap.completeCards],
  ["{{TOTAL_CARDS}}", roadmap.totalCards],
  ["{{PROGRESS_PERCENT}}", progress],
  ["{{CURRENT_FOCUS}}", escapeHtml(roadmap.currentFocus)],
  ["{{UPDATED}}", escapeHtml(roadmap.updated)],
  [
    "<!-- BUILD:ROADMAP_CARDS -->",
    roadmap.milestones.map(renderMilestone).join("\n"),
  ],
]);

for (const [token, value] of replacements) {
  if (!homepage.includes(token)) {
    throw new Error(`index.html is missing build token: ${token}`);
  }
  homepage = homepage.replaceAll(token, String(value));
}

homepage = homepage.replace(/[ \t]+$/gm, "");

await rm(output, { recursive: true, force: true });
await mkdir(join(output, "assets"), { recursive: true });

for (const file of [
  ".htaccess",
  "404.html",
  "app.js",
  "favicon.svg",
  "roadmap.json",
  "robots.txt",
  "site.webmanifest",
  "sitemap.xml",
  "styles.css",
]) {
  await copyFile(join(root, file), join(output, file));
}

for (const asset of [
  "apple-touch-icon.png",
  "fog-flour-logo-104.webp",
  "fog-flour-social-card.png",
]) {
  await copyFile(join(root, "assets", asset), join(output, "assets", asset));
}

await writeFile(join(output, "index.html"), homepage);
await writeFile(join(output, ".nojekyll"), "");

console.log(
  `Built ${roadmap.milestones.length} public milestones into dist/ (${roadmap.completeCards}/${roadmap.totalCards} verified cards).`,
);
