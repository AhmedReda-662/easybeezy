import type { PluginRegistryEntry } from "./registry.js";
import { getPluginByName } from "./registry.js";

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingPlugin?: string;
  message?: string;
}

export function checkPluginConflicts(
  pluginName: string,
  installedPlugins: string[],
): ConflictCheckResult {
  const targetPlugin = getPluginByName(pluginName);
  if (!targetPlugin) {
    return { hasConflict: false };
  }

  // Check if any installed plugin conflicts with the target
  for (const installed of installedPlugins) {
    if (installed === pluginName) {
      return {
        hasConflict: false,
      };
    }

    const installedPlugin = getPluginByName(installed);
    if (!installedPlugin) continue;

    // Check if the installed plugin is in the target's conflictsWith list
    if (targetPlugin.manifest.conflictsWith.includes(installed)) {
      return {
        hasConflict: true,
        conflictingPlugin: installed,
        message: `Already using "${installed}". Remove it first?\n  Run: easybeezy remove ${installed}`,
      };
    }

    // Check if the installed plugin's conflictsWith list includes the target
    if (installedPlugin.manifest.conflictsWith.includes(pluginName)) {
      return {
        hasConflict: true,
        conflictingPlugin: installed,
        message: `Cannot install "${pluginName}". It conflicts with "${installed}" which is already installed.\n  Run: easybeezy remove ${installed}`,
      };
    }
  }

  return { hasConflict: false };
}
