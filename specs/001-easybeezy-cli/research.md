# Research: EasyBeezy CLI

**Date**: 2026-06-22

## R1: CLI Framework Selection

**Decision**: Commander.js

**Rationale**: Industry standard for Node.js CLIs. Lightweight, well-documented, supports subcommands, built-in help generation, and versioning. Used by tools like ESLint, Mocha, and PM2.

**Alternatives considered**:
- Yargs: More verbose API, better for complex argument parsing. Overkill for this use case.
- oclif: Full-featured but heavy, Salesforce-oriented. Too opinionated.
- Meow: Minimal, lacks subcommand support out of the box.

## R2: Interactive Prompt Library

**Decision**: Inquirer.js (v9+)

**Rationale**: Most mature prompt library for Node.js. Supports checkbox, list, input, confirm prompts. Used by Yeoman, Angular CLI, and many scaffolding tools. v9+ is ESM-native and works well with TypeScript.

**Alternatives considered**:
- prompts: Smaller, but less feature-complete. Lacks some validation patterns.
- enquirer: Fast, but less community adoption.

## R3: Project Template Strategy

**Decision**: Embedded file templates in `packages/templates/react-vite-ts/`

**Rationale**: Templates are bundled with the CLI for offline use. No network dependency for template resolution. Templates use simple file copying with variable interpolation (project name, aliases).

**Alternatives considered**:
- Remote templates (GitHub): Adds network dependency, latency, and maintenance burden. Deferred to v3.
- Dynamic generation (write files from code): Harder to maintain, harder for community contributions.

## R4: Plugin Manifest Format

**Decision**: JSON manifest files (`manifest.json`) per plugin directory

**Rationale**: JSON is simple, parseable, and universally supported. Each manifest declares: name, description, dependencies, devDependencies, generatedFiles, configUpdates, conflictsWith.

**Alternatives considered**:
- YAML: Less standard in Node.js tooling, adds parsing dependency.
- TypeScript/JS exports: Requires execution to read, slower, security concerns.

## R5: Rollback Strategy

**Decision**: Snapshot-based rollback — track created files, delete on failure

**Rationale**: For project creation: delete the entire target directory on failure. For plugin installation: track which files were created/modified, revert on failure.

**Alternatives considered**:
- Transactional filesystem (undo log): Over-engineered for this use case.
- No rollback: Unacceptable user experience with partially created projects.

## R6: Plugin Conflict Detection

**Decision**: Manifest-declared conflict groups — each plugin declares `conflictsWith` array in its manifest

**Rationale**: Conflict rules live with the plugin definition, not hardcoded in core. Makes it extensible for future plugins. Conflict check runs before any file generation or npm install.

**Alternatives considered**:
- Hardcoded conflict matrix in core: Not extensible, violates modularity.
- Runtime detection (detect both installed): Would need to check package.json, less reliable.

## R7: Package Manager Detection

**Decision**: Detect from lock files (package-lock.json → npm, yarn.lock → yarn, pnpm-lock.yaml → pnpm). Default to npm if none found.

**Rationale**: Lock file detection is reliable and requires no user configuration. Most developers have a preferred package manager with an existing lock file.

**Alternatives considered**:
- Always use npm: Simpler but ignores developer preference.
- Prompt for package manager: Extra step, friction for no value.

## R8: Testing Framework

**Decision**: Vitest

**Rationale**: Fast, TypeScript-native, Jest-compatible API. Good for unit and integration testing of CLI tools. No configuration overhead.

**Alternatives considered**:
- Jest: Slower, requires ts-node configuration. Works but more setup.
- Node.js built-in test runner: Less feature-complete, fewer assertion patterns.
