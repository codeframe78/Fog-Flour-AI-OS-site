import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist");

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else files.push(absolute);
  }
  return files;
};

const files = await walk(output);
const relativeFiles = files.map((file) =>
  file.slice(output.length + 1).replaceAll("\\", "/"),
);
const expectedFiles = [
  ".htaccess",
  ".nojekyll",
  "404.html",
  "app.js",
  "assets/apple-touch-icon.png",
  "assets/fog-flour-logo-104.webp",
  "assets/fog-flour-social-card.png",
  "favicon.svg",
  "index.html",
  "roadmap.json",
  "robots.txt",
  "site.webmanifest",
  "sitemap.xml",
  "styles.css",
].sort();

if (JSON.stringify(relativeFiles.sort()) !== JSON.stringify(expectedFiles)) {
  throw new Error(
    "dist/ does not match the explicit public artifact allowlist.",
  );
}

const homepage = await readFile(join(output, "index.html"), "utf8");
const errorPage = await readFile(join(output, "404.html"), "utf8");
const styles = await readFile(join(output, "styles.css"), "utf8");
const policy = await readFile(join(output, ".htaccess"), "utf8");
const robots = await readFile(join(output, "robots.txt"), "utf8");
const sitemap = await readFile(join(output, "sitemap.xml"), "utf8");
const roadmap = JSON.parse(
  await readFile(join(output, "roadmap.json"), "utf8"),
);

for (const forbidden of [
  "codeframe78",
  "github.com/users/",
  "Fog-Flour-AI-OS.git",
  "Fog-And-Flour",
  "Fog-and-Flour-Storefront",
  "BEGIN PRIVATE KEY",
  "cfut_",
  "/home/",
  "209.94.",
  "95.111.",
]) {
  for (const [name, content] of [
    ["homepage", homepage],
    ["error page", errorPage],
    ["stylesheet", styles],
  ]) {
    if (content.includes(forbidden)) {
      throw new Error(
        `${name} contains forbidden public content: ${forbidden}`,
      );
    }
  }
}

for (const required of [
  "https://fog-flour.jamesjennison.net/assets/fog-flour-social-card.png",
  'href="https://jamesjennison.net"',
  'href="https://status.jamesjennison.net"',
  `${roadmap.completeCards}/${roadmap.totalCards}`,
  roadmap.currentFocus,
  roadmap.updated,
]) {
  if (!homepage.includes(required)) {
    throw new Error(`Homepage is missing required public content: ${required}`);
  }
}

for (const [name, pattern] of [
  [
    "canonical URL",
    /<link\s+rel="canonical"\s+href="https:\/\/fog-flour\.jamesjennison\.net\/"\s*\/?>/,
  ],
  [
    "Open Graph URL",
    /<meta\s+property="og:url"\s+content="https:\/\/fog-flour\.jamesjennison\.net\/"\s*\/?>/,
  ],
]) {
  if (!pattern.test(homepage)) {
    throw new Error(`Homepage is missing its ${name}.`);
  }
}

if ((homepage.match(/<h1(?:\s|>)/g) ?? []).length !== 1) {
  throw new Error("Homepage must contain exactly one h1.");
}
if ((homepage.match(/class="milestone-card"/g) ?? []).length !== 8) {
  throw new Error("Homepage must contain eight static roadmap milestones.");
}
if (homepage.includes("{{") || homepage.includes("BUILD:ROADMAP")) {
  throw new Error("Homepage contains an unresolved build token.");
}
if (
  /<style\b[^>]*>[\s\S]*?<\/style>/i.test(homepage) ||
  /<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/i.test(homepage)
) {
  throw new Error("Homepage contains inline script or style content.");
}
if (/\sstyle=/i.test(homepage)) {
  throw new Error("Homepage contains an inline style attribute.");
}
if (styles.includes(".js .reveal") || styles.includes("opacity: 0;")) {
  throw new Error(
    "Essential content may not be hidden for entrance animation.",
  );
}

for (const reference of homepage.matchAll(
  /(?:href|src)="(?!https?:|#|mailto:|tel:)([^"]+)"/g,
)) {
  const referencePath = reference[1].split(/[?#]/)[0];
  if (!referencePath || referencePath === "/") continue;
  const candidate = join(output, normalize(referencePath.replace(/^\/+/, "")));
  const target = await stat(candidate).catch(() => null);
  if (!target) throw new Error(`Missing local asset: ${reference[1]}`);
}

for (const required of [
  "Options -Indexes -MultiViews",
  "fog-flour\\.jamesjennison\\.net",
  "Content-Security-Policy",
  "Strict-Transport-Security",
  "no-transform",
  "ErrorDocument 404 /404.html",
]) {
  if (!policy.includes(required)) {
    throw new Error(`.htaccess is missing required policy: ${required}`);
  }
}

if (
  !robots.includes(
    "Sitemap: https://fog-flour.jamesjennison.net/sitemap.xml",
  ) ||
  !sitemap.includes("<loc>https://fog-flour.jamesjennison.net/</loc>")
) {
  throw new Error("Search discovery files do not use the approved hostname.");
}

for (const file of files) {
  if ([".env", ".map", ".pem", ".key"].includes(extname(file))) {
    throw new Error(`Forbidden deployment file: ${file}`);
  }
}

const totalBytes = (
  await Promise.all(files.map(async (file) => (await stat(file)).size))
).reduce((sum, size) => sum + size, 0);

console.log(
  `Validated ${files.length} deployment files (${(totalBytes / 1024).toFixed(1)} KiB): static roadmap, privacy boundary, links, metadata, and Webuzo policy pass.`,
);
