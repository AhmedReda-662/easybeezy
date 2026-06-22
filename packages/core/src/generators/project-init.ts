import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { copyTemplateFiles } from "./template-copier.js";
import { loadPlugins, getPluginByName } from "../plugins/registry.js";
import { checkPluginConflicts } from "../plugins/conflicts.js";
import { createRollbackTracker, type RollbackTracker } from "../utils/rollback.js";
import { startSpinner, updateSpinner, succeedSpinner, failSpinner } from "../utils/spinner.js";
import { detectPackageManager, getInstallCommand } from "../utils/detect-pm.js";
import type { TemplateVariables } from "./template-copier.js";

export interface ProjectInitOptions {
  projectName: string;
  targetDir: string;
  templateDir: string;
  pluginsDir: string;
  selectedPlugins: string[];
}

export interface ProjectInitResult {
  success: boolean;
  projectDir: string;
  installedPlugins: string[];
  error?: string;
}

export async function initProject(options: ProjectInitOptions): Promise<ProjectInitResult> {
  const { projectName, targetDir, templateDir, pluginsDir, selectedPlugins } = options;

  const projectDir = join(targetDir, projectName);
  const tracker: RollbackTracker = createRollbackTracker();
  tracker.setDirectory(projectDir);

  try {
    // 1. Create project directory
    startSpinner(`Creating project "${projectName}"...`);
    mkdirSync(projectDir, { recursive: true });

    // 2. Copy base template
    updateSpinner("Copying template files...");
    const templateVars: TemplateVariables = { projectName };
    const copiedFiles = copyTemplateFiles(templateDir, projectDir, templateVars, true);
    copiedFiles.forEach((f) => tracker.addFile(f));

    // 2b. Add .npmrc to disable workspace inheritance from parent
    writeFileSync(join(projectDir, ".npmrc"), "workspaces=false\n", "utf-8");
    tracker.addFile(join(projectDir, ".npmrc"));

    // 3. Load plugins and check conflicts
    loadPlugins(pluginsDir);
    for (const pluginName of selectedPlugins) {
      const conflict = checkPluginConflicts(pluginName, []);
      if (conflict.hasConflict) {
        tracker.rollback();
        return { success: false, projectDir, installedPlugins: [], error: conflict.message };
      }
    }

    // 4. Install plugin files
    updateSpinner("Installing plugins...");
    const installedPlugins: string[] = [];

    for (const pluginName of selectedPlugins) {
      const plugin = getPluginByName(pluginName);
      if (!plugin) continue;

      for (const fileMapping of plugin.manifest.generatedFiles) {
        const srcBase = join(plugin.directory, fileMapping.source);
        const destBase = join(projectDir, fileMapping.target);

        if (existsSync(srcBase)) {
          const destDir = destBase.substring(0, destBase.lastIndexOf("/"));
          if (destDir && !existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true });
          }
          if (existsSync(srcBase) && !existsSync(destBase)) {
            const content = fileMapping.template
              ? applyVars(readFileSync(srcBase, "utf-8"), templateVars)
              : readFileSync(srcBase, "utf-8");
            writeFileSync(destBase, content, "utf-8");
            tracker.addFile(destBase);
          }
        }
      }

      for (const cfg of plugin.manifest.configUpdates) {
        const configPath = join(projectDir, cfg.file);
        if (cfg.action === "append") {
          const existing = existsSync(configPath) ? readFileSync(configPath, "utf-8") : "";
          writeFileSync(configPath, existing + cfg.content, "utf-8");
          tracker.addModifiedFile(configPath);
        }
      }

      installedPlugins.push(pluginName);
    }

    // 5. Install npm dependencies
    updateSpinner("Installing dependencies...");
    const pm = detectPackageManager(projectDir);
    const installCmd = getInstallCommand(pm);

    try {
      execSync(installCmd, { cwd: projectDir, stdio: "pipe", env: { ...process.env, npm_config_workspaces: undefined, npm_config_workspace_root: undefined } });
    } catch {
      tracker.rollback();
      return {
        success: false,
        projectDir,
        installedPlugins: [],
        error: "Failed to install dependencies. The project directory has been cleaned up.\n  Suggested fix: Check your network connection and try again.",
      };
    }

    succeedSpinner(`Project "${projectName}" created successfully!`);
    return { success: true, projectDir, installedPlugins };
  } catch (error) {
    failSpinner("Project creation failed.");
    tracker.rollback();
    return {
      success: false,
      projectDir,
      installedPlugins: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

function applyVars(content: string, vars: TemplateVariables): string {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), value);
  }
  return result;
}
