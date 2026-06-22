import { execSync } from "node:child_process";

const NETWORK_TIMEOUT_MS = 10000;

export interface NetworkCheckResult {
  available: boolean;
  error?: string;
}

export async function checkNetwork(): Promise<NetworkCheckResult> {
  try {
    execSync("npm ping", {
      timeout: NETWORK_TIMEOUT_MS,
      stdio: "pipe",
    });
    return { available: true };
  } catch {
    return {
      available: false,
      error:
        "Cannot reach npm registry. Check your internet connection and try again.",
    };
  }
}

export function checkDiskSpace(requiredMB: number = 100): { sufficient: boolean; error?: string } {
  try {
    const output = execSync("df -m .", { encoding: "utf-8", stdio: "pipe" });
    const lines = output.trim().split("\n");
    if (lines.length < 2) return { sufficient: true };

    const parts = lines[1].split(/\s+/);
    const availableMB = parseInt(parts[3], 10);

    if (!isNaN(availableMB) && availableMB < requiredMB) {
      return {
        sufficient: false,
        error: `Insufficient disk space. Need ~${requiredMB}MB, only ${availableMB}MB available.`,
      };
    }
  } catch {
    // If we can't check, assume sufficient
  }
  return { sufficient: true };
}

export function validateNodeVersion(): { valid: boolean; error?: string } {
  const version = process.version;
  const major = parseInt(version.replace("v", "").split(".")[0], 10);

  if (major < 18) {
    return {
      valid: false,
      error: `Node.js >= 18 is required. Current version: ${version}`,
    };
  }
  return { valid: true };
}

export async function runPreFlightChecks(): Promise<boolean> {
  // Node version
  const nodeCheck = validateNodeVersion();
  if (!nodeCheck.valid) {
    console.error(`\n  ❌ ${nodeCheck.error}\n`);
    return false;
  }

  // Network
  const networkCheck = await checkNetwork();
  if (!networkCheck.available) {
    console.error(`\n  ❌ ${networkCheck.error}\n`);
    return false;
  }

  return true;
}
