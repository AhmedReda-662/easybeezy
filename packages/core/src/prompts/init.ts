import inquirer from "inquirer";
import { getAllPlugins } from "../plugins/registry.js";

export interface InitAnswers {
  plugins: string[];
}

export async function promptInitProject(): Promise<InitAnswers> {
  const plugins = getAllPlugins();

  const answers = await inquirer.prompt<InitAnswers>([
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
    plugins: answers.plugins ?? [],
  };
}
