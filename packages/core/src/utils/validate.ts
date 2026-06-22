const PROJECT_NAME_REGEX = /^[a-z0-9-]+$/;
const MAX_NAME_LENGTH = 215;

export function validateProjectName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Project name cannot be empty." };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: `Project name must be ${MAX_NAME_LENGTH} characters or fewer.` };
  }
  if (!PROJECT_NAME_REGEX.test(name)) {
    return {
      valid: false,
      error: "Project name must contain only lowercase letters, numbers, and hyphens.",
    };
  }
  return { valid: true };
}
