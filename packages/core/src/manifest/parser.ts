import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { PluginManifest } from "./types.js";

export function loadPluginManifest(pluginDir: string): PluginManifest | null {
  const manifestPath = join(pluginDir, "manifest.json");

  if (!existsSync(manifestPath)) {
    return null;
  }

  try {
    const raw = readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(raw) as PluginManifest;

    // Basic validation
    if (!manifest.name || !manifest.description) {
      throw new Error(`Invalid manifest at ${manifestPath}: missing name or description`);
    }

    return {
      name: manifest.name,
      description: manifest.description,
      dependencies: manifest.dependencies ?? [],
      devDependencies: manifest.devDependencies ?? [],
      generatedFiles: manifest.generatedFiles ?? [],
      configUpdates: manifest.configUpdates ?? [],
      conflictsWith: manifest.conflictsWith ?? [],
    };
  } catch {
    return null;
  }
}

export function validateManifest(manifest: PluginManifest): string[] {
  const errors: string[] = [];

  if (!manifest.name || manifest.name.trim().length === 0) {
    errors.push("Manifest must have a non-empty name.");
  }
  if (!manifest.description || manifest.description.trim().length === 0) {
    errors.push("Manifest must have a non-empty description.");
  }
  if (!Array.isArray(manifest.dependencies)) {
    errors.push("Manifest dependencies must be an array.");
  }
  if (!Array.isArray(manifest.generatedFiles)) {
    errors.push("Manifest generatedFiles must be an array.");
  }

  return errors;
}
