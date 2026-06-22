import chalk from "chalk";
import { loadPlugins, getAllPlugins } from "@easybeezy/core";
import { PLUGINS_DIR } from "../config.js";

export async function listPlugins(): Promise<void> {
  loadPlugins(PLUGINS_DIR);
  const plugins = getAllPlugins();

  if (plugins.length === 0) {
    console.log(chalk.yellow("  No plugins available."));
    return;
  }

  console.log(chalk.green("═".repeat(50)));
  console.log("");
  console.log(chalk.white("  🧩 ") + chalk.bold.white("Available Plugins"));
  console.log("");

  for (const plugin of plugins) {
    const conflicts = plugin.manifest.conflictsWith.length > 0
      ? chalk.dim(` (conflicts: ${plugin.manifest.conflictsWith.join(", ")})`)
      : "";
    console.log(
      `  ${chalk.cyan("●")} ${chalk.white(plugin.name.padEnd(16))} ${chalk.dim(plugin.manifest.description)}${conflicts}`
    );
  }

  console.log("");
  console.log(chalk.green("═".repeat(50)));
  console.log("");
  console.log(`  ${chalk.cyan("📦")} Install: ${chalk.white("easybeezy add <plugin-name>")}`);
  console.log(`  ${chalk.red("🗑️")}  Remove:  ${chalk.white("easybeezy remove <plugin-name>")}`);
  console.log("");
}
