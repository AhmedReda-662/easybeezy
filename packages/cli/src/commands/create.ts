import chalk from "chalk";
import { join } from "node:path";
import { existsSync } from "node:fs";
import inquirer from "inquirer";
import {
  loadPlugins,
  promptCreateProject,
  validateProjectName,
  initProject,
  runPreFlightChecks,
  FancySpinner,
  showCompletionBanner,
  showError,
} from "@easybeezy/core";
import { TEMPLATE_DIR, PLUGINS_DIR } from "../config.js";

export async function createProject(): Promise<void> {
  // Preflight checks
  console.log(chalk.dim("  Running preflight checks..."));
  const preflight = await runPreFlightChecks();
  if (!preflight) {
    process.exit(1);
  }
  console.log(chalk.green("  ✔ All checks passed\n"));

  // Load plugin registry
  loadPlugins(PLUGINS_DIR);

  // Prompt for project details
  const { projectName, plugins } = await promptCreateProject();

  // Validate project name
  const validation = validateProjectName(projectName);
  if (!validation.valid) {
    showError(validation.error);
    process.exit(1);
  }

  // Check for directory conflict
  const targetDir = process.cwd();
  const projectDir = join(targetDir, projectName);

  if (existsSync(projectDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `Directory "${projectName}" already exists. Overwrite?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow("\n  Operation cancelled."));
      process.exit(0);
    }
  }

  // Show progress steps
  const steps = [
    "Creating project directory",
    "Copying template files",
    "Installing plugins",
    "Installing dependencies",
    "Configuring project",
  ];
  const spinner = new FancySpinner("Setting up project", steps);
  spinner.start();

  // Initialize project
  const result = await initProject({
    projectName,
    targetDir,
    templateDir: TEMPLATE_DIR,
    pluginsDir: PLUGINS_DIR,
    selectedPlugins: plugins,
  });

  if (!result.success) {
    spinner.fail("Project creation failed");
    showError(result.error);
    process.exit(1);
  }

  spinner.succeed(`Project "${projectName}" created!`);

  // Show completion banner
  showCompletionBanner(projectName, result.installedPlugins);
}
