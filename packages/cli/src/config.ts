import { dirname, join } from "node:path";

/**
 * Resolve paths correctly for both dev (tsx) and bundled (CJS) modes.
 * In dev: __dirname = packages/cli/src/commands/
 * In bundle: __dirname = packages/cli/dist/
 */

declare const __dirname: string;

const isBundle = __dirname.includes("dist");
const BASE = isBundle ? __dirname : join(__dirname, "../../..");

export const PLUGINS_DIR = join(BASE, isBundle ? "plugins" : "packages/plugins");
export const TEMPLATE_DIR = join(BASE, isBundle ? "templates/react-vite-ts" : "packages/templates/react-vite-ts");
