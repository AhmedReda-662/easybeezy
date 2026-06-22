#!/usr/bin/env node

/**
 * Build script for publishing easybeezy CLI as a single bundle.
 * Bundles only @easybeezy/core (internal) into the CLI.
 * External npm deps (commander, chalk, inquirer, ora) stay as regular imports.
 */

import { buildSync } from "esbuild";
import { existsSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CLI_DIR = join(__dirname, "../packages/cli");
const CORE_DIR = join(__dirname, "../packages/core");
const PLUGINS_DIR = join(__dirname, "../packages/plugins");
const TEMPLATES_DIR = join(__dirname, "../packages/templates");
const OUT_DIR = join(CLI_DIR, "dist");

console.log("Building easybeezy CLI bundle...");

// Ensure dist directory is clean
if (existsSync(OUT_DIR)) {
  rmSync(OUT_DIR, { recursive: true, force: true });
}
mkdirSync(OUT_DIR, { recursive: true });

// Bundle as CJS — only internal packages, external npm deps
try {
  buildSync({
    entryPoints: [join(CLI_DIR, "src/index.ts")],
    bundle: true,
    platform: "node",
    target: "node18",
    format: "cjs",
    outfile: join(OUT_DIR, "cli.js"),
    banner: {
      js: "#!/usr/bin/env node",
    },
    banner: {
      js: "#!/usr/bin/env node",
    },
    // Externalize all npm dependencies — they'll be installed by user
    external: [
      "node:*",
      "commander",
      "chalk",
      "inquirer",
      "ora",
    ],
    resolveExtensions: [".ts", ".js", ".json"],
    nodePaths: [
      join(CLI_DIR, "src"),
      join(CORE_DIR, "src"),
      join(__dirname, "../node_modules"),
    ],
    loader: {
      ".json": "json",
    },
    // Mock import.meta for CJS
    define: {
      "import.meta.dirname": "__dirname",
    },
  });

  console.log("  ✔ Bundle created: dist/index.js");

  // Copy plugins directory into dist
  const pluginsOut = join(OUT_DIR, "plugins");
  cpSync(PLUGINS_DIR, pluginsOut, { recursive: true });
  console.log("  ✔ Plugins copied to dist/plugins/");

  // Copy templates directory into dist
  const templatesOut = join(OUT_DIR, "templates");
  cpSync(TEMPLATES_DIR, templatesOut, { recursive: true });
  console.log("  ✔ Templates copied to dist/templates/");

  console.log("\nBuild complete! Ready to publish.\n");
  console.log("Run: cd packages/cli && npm publish --access public");
} catch (error) {
  console.error("Build failed:", error);
  process.exit(1);
}
