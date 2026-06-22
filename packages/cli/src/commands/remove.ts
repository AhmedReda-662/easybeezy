import chalk from "chalk";
import { execSync } from "node:child_process";
import inquirer from "inquirer";
import {
  loadPlugins,
  getPluginByName,
  uninstallPlugin,
  detectPackageManager,
  getInstallCommand,
  startSpinner,
  succeedSpinner,
  failSpinner,
  FancySpinner,
  showPluginRemoved,
  showError,
  getAllPlugins,
} from "@easybeezy/core";

import { PLUGINS_DIR } from "../config.js";

export async function removePlugin(pluginName?: string): Promise<void> {
  // Load plugin registry
  loadPlugins(PLUGINS_DIR);

  // If no plugin name given, show installed plugins
  if (!pluginName) {
    console.log(chalk.dim("  Usage: easybeezy remove <plugin-name>"));
    console.log("");
    console.log("  Available plugins:");
    for (const p of getAllPlugins()) {
      console.log(`    ${chalk.cyan(p.name.padEnd(16))} ${chalk.dim(p.manifest.description)}`);
    }
    console.log("");
    process.exit(0);
  }

  // Check plugin exists
  const plugin = getPluginByName(pluginName);
  if (!plugin) {
    showError(`Unknown plugin "${pluginName}".`);
    process.exit(1);
  }

  const projectDir = process.cwd();
  const spinner = new FancySpinner(`Removing plugin "${pluginName}"`, [
    "Removing generated files",
    "Uninstalling dependencies",
    "Reverting configuration",
  ]);
  spinner.start();

  try {
    // Uninstall plugin
    const result = uninstallPlugin(plugin.manifest, plugin.directory, projectDir);

    // Uninstall npm dependencies
    if (result.uninstalledDeps.length > 0) {
      spinner.nextStep();
      const pm = detectPackageManager(projectDir);
      const deps = result.uninstalledDeps.join(" ");
      execSync(`${getInstallCommand(pm)} ${deps}`, { cwd: projectDir, stdio: "pipe" });
    }

    spinner.succeed(`Plugin "${pluginName}" removed!`);

    showPluginRemoved(pluginName);
    if (result.removedFiles.length > 0) {
      console.log(`  ${chalk.red("🗑️")} Removed files:     ${result.removedFiles.join(", ")}`);
    }
    if (result.uninstalledDeps.length > 0) {
      console.log(`  ${chalk.red("📦")} Uninstalled:       ${result.uninstalledDeps.join(", ")}`);
    }
    if (result.revertedConfigs.length > 0) {
      console.log(`  ${chalk.red("⚙️")} Reverted config:   ${result.revertedConfigs.join(", ")}`);
    }
    console.log("");
  } catch (error) {
    spinner.fail(`Failed to remove plugin "${pluginName}".`);
    showError(error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}
