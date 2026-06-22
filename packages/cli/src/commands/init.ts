import chalk from "chalk";
import { join } from "node:path";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  appendFileSync,
} from "node:fs";
import {
  loadPlugins,
  getPluginByName,
  promptInitProject,
  startSpinner,
  updateSpinner,
  succeedSpinner,
  failSpinner,
} from "@easybeezy/core";

import { PLUGINS_DIR } from "../config.js";

const ESLINT_CONFIG = `import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist/"],
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "off",
    },
  },
];
`;

const PRETTIER_CONFIG = `{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
`;

const PRETTIER_IGNORE = `node_modules/
dist/
build/
coverage/
package-lock.json
yarn.lock
pnpm-lock.yaml
`;

const ENV_EXAMPLE = `# Application
VITE_APP_TITLE=my-app

# API
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=30000
`;

const GITIGNORE_APPEND = `
# Environment
.env
.env.*
!.env.example
`;

function ensureFile(dir: string, filename: string, content: string): boolean {
  const filePath = join(dir, filename);
  if (!existsSync(filePath)) {
    writeFileSync(filePath, content, "utf-8");
    return true; // created
  }
  return false; // already exists
}

function ensureDir(dir: string, sub: string): boolean {
  const fullPath = join(dir, sub);
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true });
    return true;
  }
  return false;
}

function appendToGitignore(dir: string): boolean {
  const gitignorePath = join(dir, ".gitignore");
  if (!existsSync(gitignorePath)) return false;

  const content = readFileSync(gitignorePath, "utf-8");
  if (content.includes(".env")) return false;

  appendFileSync(gitignorePath, GITIGNORE_APPEND, "utf-8");
  return true;
}

function addPathAliasesToTsconfig(projectDir: string): boolean {
  const tsconfigPath = join(projectDir, "tsconfig.json");
  if (!existsSync(tsconfigPath)) return false;

  try {
    const raw = readFileSync(tsconfigPath, "utf-8");
    const config = JSON.parse(raw);

    if (!config.compilerOptions) config.compilerOptions = {};
    if (!config.compilerOptions.paths) {
      config.compilerOptions.paths = {
        "@/features/*": ["./src/features/*"],
        "@/shared/*": ["./src/shared/*"],
        "@/services/*": ["./src/services/*"],
        "@/app/*": ["./src/app/*"],
      };
      config.compilerOptions.baseUrl = ".";

      writeFileSync(tsconfigPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
      return true;
    }
  } catch {
    // If tsconfig is malformed, skip
  }
  return false;
}

export async function initProject(): Promise<void> {
  const projectDir = process.cwd();

  // Check if this is a React project
  startSpinner("Detecting project type...");

  const packageJsonPath = join(projectDir, "package.json");
  if (!existsSync(packageJsonPath)) {
    failSpinner("Not a React project.");
    console.log("");
    console.log("  No package.json found in the current directory.");
    console.log("  Run this command from a React project root.");
    console.log("");
    process.exit(1);
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (!allDeps.react) {
      failSpinner("Not a React project.");
      console.log("");
      console.log("  EasyBeezy init only supports React projects.");
      console.log(`  Detected: ${packageJson.name || "Unknown project"}`);
      console.log("");
      process.exit(1);
    }
  } catch {
    failSpinner("Could not read package.json.");
    process.exit(1);
  }

  succeedSpinner("React project detected.");

  // Load plugins
  loadPlugins(PLUGINS_DIR);

  // Prompt for plugins
  const { plugins } = await promptInitProject();

  // Apply configuration
  startSpinner("Adding configuration...");

  const added: string[] = [];

  // ESLint
  updateSpinner("Adding ESLint...");
  if (ensureFile(projectDir, "eslint.config.js", ESLINT_CONFIG)) {
    added.push("ESLint");
  }

  // Prettier
  updateSpinner("Adding Prettier...");
  if (ensureFile(projectDir, ".prettierrc", PRETTIER_CONFIG)) {
    added.push("Prettier");
  }
  ensureFile(projectDir, ".prettierignore", PRETTIER_IGNORE);

  // Path aliases
  updateSpinner("Adding path aliases...");
  if (addPathAliasesToTsconfig(projectDir)) {
    added.push("path aliases");
  }

  // Env vars
  updateSpinner("Adding environment variable support...");
  if (ensureFile(projectDir, ".env.example", ENV_EXAMPLE)) {
    added.push("env vars");
  }
  appendToGitignore(projectDir);

  // Feature-based folder structure
  updateSpinner("Creating folder structure...");
  const dirs = ["src/features", "src/shared", "src/services", "src/app"];
  const createdDirs: string[] = [];
  for (const dir of dirs) {
    if (ensureDir(projectDir, dir)) {
      createdDirs.push(dir);
    }
  }
  if (createdDirs.length > 0) {
    added.push("feature-based folders");
  }

  // Install plugins
  if (plugins.length > 0) {
    updateSpinner("Installing plugins...");

    for (const pluginName of plugins) {
      const plugin = getPluginByName(pluginName);
      if (!plugin) continue;

      // Generate plugin files
      for (const fileMapping of plugin.manifest.generatedFiles) {
        const srcFile = join(plugin.directory, fileMapping.source);
        const destFile = join(projectDir, fileMapping.target);

        if (existsSync(srcFile) && !existsSync(destFile)) {
          const destDir = destFile.substring(0, destFile.lastIndexOf("/"));
          if (destDir && !existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true });
          }
          const content = readFileSync(srcFile, "utf-8");
          writeFileSync(destFile, content, "utf-8");
        }
      }

      // Apply config updates
      for (const cfg of plugin.manifest.configUpdates) {
        const configPath = join(projectDir, cfg.file);
        if (cfg.action === "append") {
          const existing = existsSync(configPath) ? readFileSync(configPath, "utf-8") : "";
          if (!existing.includes(cfg.content.trim())) {
            writeFileSync(configPath, existing + cfg.content, "utf-8");
          }
        }
      }
    }
  }

  succeedSpinner("Project initialized!");

  console.log("");
  if (added.length > 0) {
    console.log(`  Added:       ${added.join(", ")}`);
  }
  if (plugins.length > 0) {
    console.log(`  Plugins:     ${plugins.join(", ")}`);
  }
  if (createdDirs.length > 0) {
    console.log(`  Folders:     ${createdDirs.join(", ")}`);
  }
  console.log("");
  console.log("  Next steps:");
  console.log(chalk.cyan("    npm install"));
  console.log(chalk.cyan("    npm run dev"));
  console.log("");
}
