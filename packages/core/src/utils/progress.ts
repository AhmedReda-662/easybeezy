import chalk from "chalk";

export class ProgressBar {
  private total: number;
  private current: number = 0;
  private label: string;
  private width: number;

  constructor(label: string, total: number, width: number = 30) {
    this.label = label;
    this.total = total;
    this.width = width;
  }

  update(current: number, sublabel?: string): void {
    this.current = current;
    const pct = Math.min(1, current / this.total);
    const filled = Math.round(pct * this.width);
    const empty = this.width - filled;

    const bar =
      chalk.green("█".repeat(filled)) +
      chalk.gray("░".repeat(empty));

    const pctStr = chalk.cyan(`${Math.round(pct * 100)}%`);
    const labelStr = sublabel ? ` ${chalk.dim(sublabel)}` : "";

    process.stdout.write(
      `\r  ${chalk.yellow("▶")} ${bar} ${pctStr} ${chalk.white(this.label)}${labelStr}  `
    );

    if (current >= this.total) {
      console.log("");
    }
  }

  increment(sublabel?: string): void {
    this.update(this.current + 1, sublabel);
  }

  done(): void {
    this.update(this.total);
  }
}

const SPINNING_CHARS = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export class FancySpinner {
  private label: string;
  private sublabel: string = "";
  private frame: number = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private steps: string[] = [];
  private currentStep: number = 0;

  constructor(label: string, steps?: string[]) {
    this.label = label;
    if (steps) this.steps = steps;
  }

  start(): void {
    this.interval = setInterval(() => {
      this.frame = (this.frame + 1) % SPINNING_CHARS.length;
      const char = chalk.yellow(SPINNING_CHARS[this.frame]);
      const step =
        this.steps.length > 0 && this.currentStep < this.steps.length
          ? chalk.dim(` → ${this.steps[this.currentStep]}`)
          : "";
      process.stdout.write(
        `\r  ${char} ${chalk.white(this.label)}${step}  `
      );
    }, 80);
  }

  nextStep(): void {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    }
  }

  succeed(message?: string): void {
    if (this.interval) clearInterval(this.interval);
    process.stdout.write("\r" + " ".repeat(80) + "\r");
    console.log(
      `  ${chalk.green("✔")} ${chalk.white(message || this.label)}`
    );
  }

  fail(message?: string): void {
    if (this.interval) clearInterval(this.interval);
    process.stdout.write("\r" + " ".repeat(80) + "\r");
    console.log(
      `  ${chalk.red("✖")} ${chalk.white(message || this.label)}`
    );
  }

  info(message: string): void {
    if (this.interval) clearInterval(this.interval);
    process.stdout.write("\r" + " ".repeat(80) + "\r");
    console.log(`  ${chalk.blue("ℹ")} ${chalk.white(message)}`);
  }

  stop(): void {
    if (this.interval) clearInterval(this.interval);
    process.stdout.write("\r" + " ".repeat(80) + "\r");
  }
}

export function showStepComplete(step: number, total: number, message: string): void {
  const pct = Math.round((step / total) * 100);
  const check = chalk.green("✔");
  console.log(
    `  ${check} ${chalk.dim(`[${step}/${total}]`)} ${chalk.white(message)} ${chalk.dim(`(${pct}%)`)}`
  );
}

export function showStepPending(step: number, total: number, message: string): void {
  const arrow = chalk.yellow("→");
  console.log(
    `  ${arrow} ${chalk.dim(`[${step}/${total}]`)} ${chalk.dim(message)}`
  );
}

export function showCompletionBanner(projectName: string, plugins: string[]): void {
  console.log("");
  console.log(chalk.green("═".repeat(50)));
  console.log("");
  console.log(chalk.green("  🎉 ") + chalk.bold.white("Project created successfully!"));
  console.log("");
  console.log(chalk.cyan("  📁 ") + chalk.white(projectName + "/"));
  console.log(chalk.cyan("  ⚙️  ") + chalk.white("React + TypeScript + Vite"));
  console.log(chalk.cyan("  📂 ") + chalk.white("Feature-based architecture"));
  if (plugins.length > 0) {
    console.log(chalk.cyan("  🧩 ") + chalk.white(plugins.join(", ")));
  }
  console.log("");
  console.log(chalk.green("═".repeat(50)));
  console.log("");
  console.log(chalk.white("  Next steps:"));
  console.log(chalk.cyan(`    cd ${projectName}`));
  console.log(chalk.cyan("    npm install"));
  console.log(chalk.cyan("    npm run dev"));
  console.log("");
}

export function showInitBanner(): void {
  console.log("");
  console.log(chalk.green("═".repeat(50)));
  console.log("");
  console.log(chalk.green("  ✨ ") + chalk.bold.white("Project initialized!"));
  console.log("");
}

export function showPluginAdded(pluginName: string): void {
  console.log("");
  console.log(chalk.green("═".repeat(50)));
  console.log("");
  console.log(chalk.green("  🧩 ") + chalk.bold.white(`Plugin "${pluginName}" installed!`));
  console.log("");
}

export function showPluginRemoved(pluginName: string): void {
  console.log("");
  console.log(chalk.green("═".repeat(50)));
  console.log("");
  console.log(chalk.green("  🧩 ") + chalk.bold.white(`Plugin "${pluginName}" removed!`));
  console.log("");
}

export function showWarning(message: string): void {
  console.log(chalk.yellow(`  ⚠️  ${message}`));
}

export function showError(message: string): void {
  console.log(chalk.red(`  ❌ ${message}`));
}
