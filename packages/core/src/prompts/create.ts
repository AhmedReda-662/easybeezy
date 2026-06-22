import inquirer from "inquirer";
import { getAllPlugins } from "../plugins/registry.js";

export interface CreateAnswers {
  projectName: string;
  plugins: string[];
}

export async function promptCreateProject(): Promise<CreateAnswers> {
  const plugins = getAllPlugins();

  const answers = await inquirer.prompt<CreateAnswers>([
    {
      type: "input",
      name: "projectName",
      message: "Project name:",
      validate: (input: string) => {
        if (!input || input.trim().length === 0) return "Project name cannot be empty.";
        if (input.length > 215) return "Project name must be 215 characters or fewer.";
        if (!/^[a-z0-9-]+$/.test(input))
          return "Project name must contain only lowercase letters, numbers, and hyphens.";
        return true;
      },
    },
    {
      type: "checkbox",
      name: "plugins",
      message: "Select plugins to install:",
      choices: plugins.map((p) => ({
        name: `${p.name} — ${p.manifest.description}`,
        value: p.name,
      })),
      when: plugins.length > 0,
    },
  ]);

  return {
    projectName: answers.projectName,
    plugins: answers.plugins ?? [],
  };
}
