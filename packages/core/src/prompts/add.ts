import inquirer from "inquirer";
import { getAllPlugins } from "../plugins/registry.js";

export interface AddAnswers {
  plugin: string;
}

export async function promptSelectPlugin(): Promise<AddAnswers> {
  const plugins = getAllPlugins();

  const answers = await inquirer.prompt<AddAnswers>([
    {
      type: "list",
      name: "plugin",
      message: "Select a plugin to install:",
      choices: plugins.map((p) => ({
        name: `${p.name} — ${p.manifest.description}`,
        value: p.name,
      })),
    },
  ]);

  return answers;
}
