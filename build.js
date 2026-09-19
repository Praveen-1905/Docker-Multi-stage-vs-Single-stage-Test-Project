// build.js
// A minimal "build" step: copies src/ -> dist/ and stamps a build time
// into the HTML. Stands in for whatever real bundler/minifier you'd use
// (webpack, vite, esbuild, etc.) — the point is that build-time tooling
// (like eslint, listed in devDependencies) is only needed HERE, not at
// runtime, which is exactly what multi-stage builds let you discard.

const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "src");
const DIST = path.join(__dirname, "dist");

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean previous build
fs.rmSync(DIST, { recursive: true, force: true });
copyRecursive(SRC, DIST);

// Stamp a build timestamp into index.html so you can visually confirm
// which build produced the running container
const indexPath = path.join(DIST, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
html = html.replace("__BUILD_TIME__", new Date().toISOString());
fs.writeFileSync(indexPath, html);

console.log("Build complete ->", DIST);
