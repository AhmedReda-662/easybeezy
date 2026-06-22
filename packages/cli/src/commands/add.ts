import chalk from "chalk";
import { join } from "node:path";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import {
  loadPlugins,
  getPluginByName,
  checkPluginConflicts,
  detectPackageManager,
  getInstallCommand,
  startSpinner,
  updateSpinner,
  succeedSpinner,
  failSpinner,
  promptSelectPlugin,
  FancySpinner,
  showPluginAdded,
  showError,
  getAllPlugins,
} from "@easybeezy/core";

import { PLUGINS_DIR } from "../config.js";

export async function addPlugin(pluginName?: string): Promise<void> {
  // Load plugin registry
  loadPlugins(PLUGINS_DIR);

  // If no plugin name given, prompt for selection
  if (!pluginName) {
    const answer = await promptSelectPlugin();
    pluginName = answer.plugin;
  }

  // Check plugin exists
  const plugin = getPluginByName(pluginName);
  if (!plugin) {
    showError(`Unknown plugin "${pluginName}".`);
    console.log("");
    console.log("  Available plugins:");
    for (const p of getAllPlugins()) {
      console.log(`    ${chalk.cyan(p.name.padEnd(16))} ${chalk.dim(p.manifest.description)}`);
    }
    console.log("");
    process.exit(1);
  }

  // Check for conflicts
  const conflict = checkPluginConflicts(pluginName, []);
  if (conflict.hasConflict) {
    showError(conflict.message);
    process.exit(1);
  }

  const projectDir = process.cwd();
  const spinner = new FancySpinner(`Installing plugin "${pluginName}"`, [
    "Installing dependencies",
    "Generating files",
    "Updating configuration",
  ]);
  spinner.start();

  try {
    // Install dependencies
    if (plugin.manifest.dependencies.length > 0 || plugin.manifest.devDependencies.length > 0) {
      spinner.nextStep();
      const pm = detectPackageManager(projectDir);
      const deps = plugin.manifest.dependencies.join(" ");
      const devDeps = plugin.manifest.devDependencies.join(" ");

      if (deps) {
        execSync(`${getInstallCommand(pm)} ${deps}`, { cwd: projectDir, stdio: "pipe", env: { ...process.env, npm_config_workspaces: undefined, npm_config_workspace_root: undefined } });
      }
      if (devDeps) {
        execSync(`${getInstallCommand(pm)} ${devDeps} --save-dev`, {
          cwd: projectDir,
          stdio: "pipe",
          env: { ...process.env, npm_config_workspaces: undefined, npm_config_workspace_root: undefined },
        });
      }
    }

    // Generate files
    spinner.nextStep();
    const generatedFiles: string[] = [];

    for (const fileMapping of plugin.manifest.generatedFiles) {
      const srcFile = join(plugin.directory, fileMapping.source);
      const destFile = join(projectDir, fileMapping.target);

      if (existsSync(srcFile)) {
        const content = readFileSync(srcFile, "utf-8");
        const destDir = destFile.substring(0, destFile.lastIndexOf("/"));
        if (destDir && !existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true });
        }
        writeFileSync(destFile, content, "utf-8");
        generatedFiles.push(fileMapping.target);
      }
    }

    // Apply config updates
    spinner.nextStep();
    for (const cfg of plugin.manifest.configUpdates) {
      const configPath = join(projectDir, cfg.file);
      if (cfg.action === "append") {
        const existing = existsSync(configPath) ? readFileSync(configPath, "utf-8") : "";
        writeFileSync(configPath, existing + cfg.content, "utf-8");
      }
    }

    spinner.succeed(`Plugin "${pluginName}" installed!`);

    showPluginAdded(pluginName);
    if (generatedFiles.length > 0) {
      console.log(`  ${chalk.cyan("📁")} Added files:    ${generatedFiles.join(", ")}`);
    }
    if (plugin.manifest.dependencies.length > 0) {
      console.log(`  ${chalk.cyan("📦")} Dependencies:   ${plugin.manifest.dependencies.join(", ")}`);
    }
    if (plugin.manifest.configUpdates.length > 0) {
      console.log(`  ${chalk.cyan("⚙️")} Configuration:  Updated ${plugin.manifest.configUpdates.map((c) => c.file).join(", ")}`);
    }
    console.log("");
  } catch (error) {
    spinner.fail(`Failed to install plugin "${pluginName}".`);
    showError(error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}
