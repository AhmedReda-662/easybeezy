import { existsSync } from "node:fs";
import { join } from "node:path";

export type PackageManager = "npm" | "yarn" | "pnpm";

export function detectPackageManager(projectDir: string): PackageManager {
  if (existsSync(join(projectDir, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(projectDir, "yarn.lock"))) return "yarn";
  return "npm";
}

export function getInstallCommand(pm: PackageManager): string {
  switch (pm) {
    case "pnpm":
      return "pnpm install";
    case "yarn":
      return "yarn install";
    case "npm":
    default:
      return "npm install";
  }
}
