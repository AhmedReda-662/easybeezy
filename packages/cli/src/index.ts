import { Command } from "commander";
import chalk from "chalk";
import { showBanner, showJoker, showCompactBanner } from "@easybeezy/core";

const program = new Command();

program
  .name("easybeezy")
  .description(
    chalk.cyan("🐝 EasyBeezy") + chalk.gray(" — ") + chalk.white("React project bootstrap generator with modular enhancements")
  )
  .version("0.1.0");

program
  .command("create")
  .description("Create a new React project from scratch")
  .action(async () => {
    showBanner();
    const { createProject } = await import("./commands/create.js");
    await createProject();
  });

program
  .command("init")
  .description("Initialize an existing React project with EasyBeezy configuration")
  .action(async () => {
    showCompactBanner();
    const { initProject } = await import("./commands/init.js");
    await initProject();
  });

program
  .command("add [plugin]")
  .description("Add a plugin to an existing project")
  .action(async (plugin?: string) => {
    showCompactBanner();
    const { addPlugin } = await import("./commands/add.js");
    await addPlugin(plugin);
  });

program
  .command("remove [plugin]")
  .description("Remove a plugin from an existing project")
  .action(async (plugin?: string) => {
    showCompactBanner();
    const { removePlugin } = await import("./commands/remove.js");
    await removePlugin(plugin);
  });

program
  .command("plugins")
  .description("List available plugins")
  .action(async () => {
    showCompactBanner();
    const { listPlugins } = await import("./commands/plugins.js");
    await listPlugins();
  });

program
  .command("joke")
  .description("Show a joke from the Joker")
  .action(() => {
    showJoker();
  });

if (process.argv.length === 2) {
  showBanner();
  program.help();
}

program.parse(process.argv);
