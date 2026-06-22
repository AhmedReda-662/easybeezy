import inquirer from "inquirer";
import { getAllPlugins } from "../plugins/registry.js";

export interface CreateAnswers {
  projectName: string;
  plugins: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  "core-react": "Core React",
  "state-management": "State Management",
  "data-fetching": "Data Fetching",
  "forms-validation": "Forms & Validation",
  "styling": "Styling",
  "ui-libraries": "UI Libraries",
  "notifications": "Notifications",
  "internationalization": "Internationalization",
  "charts": "Charts",
  "testing": "Testing",
  "code-quality": "Code Quality",
  "monitoring": "Monitoring",
  "backend-services": "Backend Services",
  "devops": "DevOps",
};

export async function promptCreateProject(): Promise<CreateAnswers> {
  const plugins = getAllPlugins();

  // Group plugins by category
  const grouped = new Map<string, typeof plugins>();
  for (const plugin of plugins) {
    const cat = plugin.manifest.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(plugin);
  }

  // Build choices with category separators
  const choices: (inquirer.Separator | { name: string; value: string })[] = [];
  for (const [category, categoryPlugins] of grouped) {
    choices.push(new inquirer.Separator(`── ${CATEGORY_LABELS[category] ?? category} ──`));
    for (const p of categoryPlugins) {
      choices.push({
        name: `  ${p.name} — ${p.manifest.description}`,
        value: p.name,
      });
    }
  }

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
      choices,
      when: plugins.length > 0,
    },
  ]);

  return {
    projectName: answers.projectName,
    plugins: answers.plugins ?? [],
  };
}
