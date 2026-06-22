import { rmSync, existsSync } from "node:fs";

export interface RollbackTracker {
  createdFiles: string[];
  modifiedFiles: string[];
  directory?: string;
  addFile(path: string): void;
  addModifiedFile(path: string): void;
  setDirectory(dir: string): void;
  rollback(): void;
}

export function createRollbackTracker(): RollbackTracker {
  const tracker: RollbackTracker = {
    createdFiles: [],
    modifiedFiles: [],
    directory: undefined,
    addFile(path: string) {
      tracker.createdFiles.push(path);
    },
    addModifiedFile(path: string) {
      tracker.modifiedFiles.push(path);
    },
    setDirectory(dir: string) {
      tracker.directory = dir;
    },
    rollback() {
      // If a full directory was created, remove it entirely
      if (tracker.directory && existsSync(tracker.directory)) {
        rmSync(tracker.directory, { recursive: true, force: true });
        return;
      }
      // Otherwise, remove individual created files (in reverse order)
      for (const file of tracker.createdFiles.reverse()) {
        if (existsSync(file)) {
          rmSync(file, { force: true });
        }
      }
    },
  };
  return tracker;
}
