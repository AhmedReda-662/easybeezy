import ora, { type Ora } from "ora";
import chalk from "chalk";

let spinner: Ora | null = null;

export function startSpinner(text: string): void {
  spinner = ora({ text, color: "yellow" }).start();
}

export function updateSpinner(text: string): void {
  if (spinner) {
    spinner.text = text;
  }
}

export function succeedSpinner(text: string): void {
  if (spinner) {
    spinner.succeed(chalk.green(text));
    spinner = null;
  }
}

export function failSpinner(text: string): void {
  if (spinner) {
    spinner.fail(chalk.red(text));
    spinner = null;
  }
}

export function stopSpinner(): void {
  if (spinner) {
    spinner.stop();
    spinner = null;
  }
}
