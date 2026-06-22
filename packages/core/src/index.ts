// Utils
export { validateProjectName } from "./utils/validate.js";
export { detectPackageManager, getInstallCommand } from "./utils/detect-pm.js";
export { createRollbackTracker } from "./utils/rollback.js";
export type { RollbackTracker } from "./utils/rollback.js";
export { startSpinner, updateSpinner, succeedSpinner, failSpinner, stopSpinner } from "./utils/spinner.js";

// Manifest
export { loadPluginManifest, validateManifest } from "./manifest/parser.js";
export type { PluginManifest, FileMapping, ConfigUpdate, ProjectConfig } from "./manifest/types.js";

// Plugins
export { loadPlugins, getAllPlugins, getPluginByName, getAvailablePluginNames } from "./plugins/registry.js";
export type { PluginRegistryEntry } from "./plugins/registry.js";
export { checkPluginConflicts } from "./plugins/conflicts.js";
export { uninstallPlugin } from "./plugins/uninstaller.js";

// Generators
export { copyTemplateFiles, applyTemplateInterpolation } from "./generators/template-copier.js";
export type { TemplateVariables } from "./generators/template-copier.js";
export { initProject } from "./generators/project-init.js";
export type { ProjectInitOptions, ProjectInitResult } from "./generators/project-init.js";

// Prompts
export { promptCreateProject } from "./prompts/create.js";
export { promptSelectPlugin } from "./prompts/add.js";
export { promptInitProject } from "./prompts/init.js";

// Utils
export { showBanner, showJoker, showCompactBanner } from "./utils/banner.js";
export { checkNetwork, checkDiskSpace, validateNodeVersion, runPreFlightChecks } from "./utils/edge-cases.js";
export { ProgressBar, FancySpinner, showStepComplete, showStepPending, showCompletionBanner, showInitBanner, showPluginAdded, showPluginRemoved, showWarning, showError } from "./utils/progress.js";
