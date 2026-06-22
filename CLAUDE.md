# 🐝 EasyBeezy - Claude Code Context

## Project Overview

EasyBeezy is a React-only CLI tool that generates production-ready frontend project structures.

It scaffolds:

* React (Vite)
* TypeScript projects
* Feature-based architecture
* Common frontend tooling (ESLint, Prettier, aliases)
* Optional plugins (axios, zustand, redux, tailwind)

Goal:
**Turn empty folder → production-ready React app in under 2 minutes.**

---

## Core Philosophy

When working in this codebase:

* Prefer simplicity over abstraction
* Avoid over-engineering
* Keep CLI behavior predictable
* Every feature must improve developer onboarding speed
* Plugin system must remain modular and isolated
* Generated output must always be production-ready

---

## Key Commands (for development & testing)

```bash id="c1c0b1"
npm run dev
npm run build
npm run test
node dist/index.js
```

For local CLI testing:

```bash id="c1c0b2"
npm link
easybeezy create
easybeezy init
easybeezy add axios
```

---

## Project Structure

```text id="c1c0b3"
packages/
├── cli/            # Commander + entry point
├── core/           # Generators, prompts, logic
│   ├── prompts/
│   ├── generators/
│   ├── plugins/
│   ├── manifest/
│   └── utils/
├── templates/      # Base React project templates
├── plugins/        # Feature plugins (axios, redux, etc.)
└── tests/
```

---

## CLI Behavior Rules

### Command Design

* `create` → full project generation wizard
* `init` → enhance existing React project
* `add <plugin>` → install feature module
* `plugins` → list available plugins

### UX Principles

* Always interactive (never assume silently)
* Always confirm destructive changes
* Always show progress (spinner / step logs)
* Always summarize final output

---

## Plugin System Rules

Each plugin MUST:

* Be isolated in `/plugins/<name>`
* Declare a manifest file
* Define:

  * dependencies
  * devDependencies
  * generated files
  * configuration updates

### Plugin Interface

```ts id="c1c0b4"
export interface Plugin {
  name: string;

  installDependencies(): Promise<void>;
  generateFiles(): Promise<void>;
  updateConfiguration(): Promise<void>;
}
```

### Plugin Rules

* Never modify unrelated project files
* Never assume framework beyond React (v1 constraint)
* Plugins must be optional and composable
* Plugins must be idempotent (safe to run twice)

---

## Template Rules

All generated projects must follow:

### Required Structure

* Feature-based architecture (default)
* `src/features/*` for domains
* `src/shared/*` for reusable logic
* `src/services/*` for API layer
* `src/app/*` for app bootstrap

### Required Configurations

* ESLint enabled
* Prettier enabled
* Path aliases (`@/features`, `@/shared`, etc.)
* Environment variable support (`.env`, `.env.example`)

---

## Generator Rules

When generating a project:

1. Create Vite React app
2. Apply selected architecture
3. Install dependencies
4. Inject plugin files
5. Configure tooling
6. Ensure project runs immediately

### Hard Constraint

Generated project MUST run with:

```bash id="c1c0b5"
npm install
npm run dev
```

with zero manual fixes.

---

## Safety Rules

* Never overwrite user code in `init` without confirmation
* Never remove existing files unless explicitly asked
* Never install unrelated dependencies
* Never break existing React setup
* Always preserve user modifications

---

## Code Style

* TypeScript preferred
* Functional components only
* No class components
* Minimal dependencies
* Clean modular architecture
* No unnecessary abstraction layers

---

## Testing Rules

* Use Vitest for internal CLI tests
* Test generators separately from CLI logic
* Mock filesystem operations
* Validate plugin installation flows

---

## Common Workflows

### Create New Project

1. Ask framework → React only (v1)
2. Ask TypeScript or JavaScript
3. Ask architecture type
4. Ask optional plugins
5. Generate project
6. Print success summary

---

### Add Plugin

1. Validate React project
2. Install dependency
3. Generate required files
4. Update config safely
5. Confirm completion

---

## Performance Expectations

* CLI should respond fast (< 2–3s per step)
* Project generation should complete < 30s (excluding npm install)
* Plugin addition should be atomic and fast

---

## Development Notes

* Prefer composition over inheritance
* Keep generators isolated
* Avoid coupling CLI with template logic
* Treat plugins as first-class modules
* Keep everything framework-agnostic internally, but React-bound externally (v1 rule)

---

## Future Extension Points (DO NOT IMPLEMENT IN V1)

* Next.js support
* Vue support
* Plugin marketplace
* AI-based project suggestions
* Remote templates

---

## Important Reminder

EasyBeezy is NOT:

* A framework
* A replacement for Vite
* A backend generator
* A deployment tool

It is ONLY:

> A React project bootstrap generator with modular enhancements

---

# End of Context

<!-- SPECKIT START -->
**Active Feature**: `001-easybeezy-cli`
**Plan**: `specs/001-easybeezy-cli/plan.md`
**Spec**: `specs/001-easybeezy-cli/spec.md`
**Constitution**: `.specify/memory/constitution.md`
<!-- SPECKIT END -->
