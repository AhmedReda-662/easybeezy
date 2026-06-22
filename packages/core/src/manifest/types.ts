export interface PluginManifest {
  name: string;
  description: string;
  dependencies: string[];
  devDependencies: string[];
  generatedFiles: FileMapping[];
  configUpdates: ConfigUpdate[];
  conflictsWith: string[];
}

export interface FileMapping {
  source: string;
  target: string;
  template: boolean;
}

export interface ConfigUpdate {
  file: string;
  action: "merge" | "append";
  content: string;
}

export interface ProjectConfig {
  name: string;
  path: string;
  framework: "react";
  language: "typescript";
  buildTool: "vite";
  architecture: "feature-based";
  installedPlugins: string[];
  packageManager: "npm" | "yarn" | "pnpm";
}
