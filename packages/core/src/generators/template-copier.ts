import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from "node:fs";
import { join, relative } from "node:path";

export interface TemplateVariables {
  projectName: string;
  [key: string]: string;
}

export function copyTemplateFiles(
  sourceDir: string,
  targetDir: string,
  variables: TemplateVariables,
  isTemplate = false,
): string[] {
  const copiedFiles: string[] = [];

  if (!existsSync(sourceDir)) {
    throw new Error(`Template source directory not found: ${sourceDir}`);
  }

  const entries = readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(sourceDir, entry.name);
    const destPath = join(targetDir, entry.name);

    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      const subFiles = copyTemplateFiles(srcPath, destPath, variables, isTemplate);
      copiedFiles.push(...subFiles);
    } else if (isTemplate) {
      // Interpolate template variables
      let content = readFileSync(srcPath, "utf-8");
      for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
        content = content.replace(regex, value);
      }
      mkdirSync(join(destPath, ".."), { recursive: true });
      writeFileSync(destPath, content, "utf-8");
      copiedFiles.push(destPath);
    } else {
      // Direct copy (no interpolation)
      cpSync(srcPath, destPath);
      copiedFiles.push(destPath);
    }
  }

  return copiedFiles;
}

export function applyTemplateInterpolation(
  content: string,
  variables: TemplateVariables,
): string {
  let result = content;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regex, value);
  }
  return result;
}
