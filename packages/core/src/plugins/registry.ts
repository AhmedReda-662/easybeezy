import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { loadPluginManifest } from "../manifest/parser.js";
import type { PluginManifest } from "../manifest/types.js";

export interface PluginRegistryEntry {
  name: string;
  manifest: PluginManifest;
  directory: string;
}

let registry: PluginRegistryEntry[] = [];

export function loadPlugins(pluginsBaseDir: string): void {
  registry = [];

  if (!existsSync(pluginsBaseDir)) {
    return;
  }

  const entries = readdirSync(pluginsBaseDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const pluginDir = join(pluginsBaseDir, entry.name);
    const manifest = loadPluginManifest(pluginDir);

    if (manifest) {
      registry.push({
        name: manifest.name,
        manifest,
        directory: pluginDir,
      });
    }
  }
}

export function getAllPlugins(): PluginRegistryEntry[] {
  return [...registry];
}

export function getPluginByName(name: string): PluginRegistryEntry | undefined {
  return registry.find((p) => p.name === name);
}

export function getAvailablePluginNames(): string[] {
  return registry.map((p) => p.name);
}

export function getPluginsByCategory(category: string): PluginRegistryEntry[] {
  return registry.filter((p) => p.manifest.category === category);
}

export function getCategories(): string[] {
  const categories = new Set(registry.map((p) => p.manifest.category));
  return [...categories].sort();
}
