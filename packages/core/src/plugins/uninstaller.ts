import { rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { PluginManifest } from "../manifest/types.js";

export interface UninstallResult {
  removedFiles: string[];
  uninstalledDeps: string[];
  revertedConfigs: string[];
}

export function uninstallPlugin(
  pluginManifest: PluginManifest,
  pluginDir: string,
  projectDir: string,
): UninstallResult {
  const result: UninstallResult = {
    removedFiles: [],
    uninstalledDeps: [],
    revertedConfigs: [],
  };

  // Remove generated files
  for (const fileMapping of pluginManifest.generatedFiles) {
    const targetPath = join(projectDir, fileMapping.target);
    if (existsSync(targetPath)) {
      rmSync(targetPath, { recursive: true, force: true });
      result.removedFiles.push(fileMapping.target);
    }
  }

  // Revert config updates (remove added content)
  for (const configUpdate of pluginManifest.configUpdates) {
    const configPath = join(projectDir, configUpdate.file);
    if (existsSync(configPath)) {
      try {
        const content = readFileSync(configPath, "utf-8");
        // For append-type updates, remove the appended content
        if (configUpdate.action === "append" && content.includes(configUpdate.content)) {
          const reverted = content.replace(configUpdate.content, "");
          writeFileSync(configPath, reverted, "utf-8");
          result.revertedConfigs.push(configUpdate.file);
        }
      } catch {
        // If file can't be read, skip gracefully
      }
    }
  }

  // Collect dependencies to uninstall
  result.uninstalledDeps = [...pluginManifest.dependencies, ...pluginManifest.devDependencies];

  return result;
}
