# Implementation Tasks: EasyBeezy CLI

**Feature**: EasyBeezy CLI
**Generated**: 2026-06-22
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

---

## Dependencies

- **Phase 1 (Setup)**: No dependencies. Must complete before all other phases.
- **Phase 2 (Foundational)**: Depends on Phase 1. Must complete before all user stories.
- **Phase 3 (US1 - Create Project)**: Depends on Phase 2. Core story — all others depend on generated output.
- **Phase 4 (US4 - List Plugins)**: Depends on Phase 2. Independent of US1.
- **Phase 5 (US3 - Add Plugin)**: Depends on Phase 2 and Phase 3 (needs a generated project to add plugins to).
- **Phase 6 (US5 - Remove Plugin)**: Depends on Phase 5 (needs an installed plugin to remove).
- **Phase 7 (US2 - Init Project)**: Depends on Phase 2. Independent of US1/US3/US5.
- **Phase 8 (Polish)**: Depends on all previous phases.

---

## Phase 1: Setup

**Goal**: Initialize the monorepo project structure with build tooling, TypeScript, and testing.

- [x] T001 Initialize monorepo root with package.json, tsconfig.json, and workspace config
- [x] T002 [P] Create `packages/cli/` package with package.json, tsconfig.json, and bin entry point
- [x] T003 [P] Create `packages/core/` package with package.json and tsconfig.json
- [x] T004 [P] Create `packages/templates/` directory with package.json
- [x] T005 [P] Create `packages/plugins/` directory with package.json
- [x] T006 Configure root-level ESLint and Prettier for the repo itself
- [x] T007 [P] Configure Vitest in root and packages for testing
- [x] T008 Add npm scripts to root package.json: build, dev, test, link

---

## Phase 2: Foundational

**Goal**: Build the core infrastructure shared by all commands — CLI framework, prompt system, plugin loader, template copier, and rollback mechanism.

**Independent Test**: All core modules importable and unit-testable.

- [x] T009 Set up Commander.js CLI entry point in `packages/cli/src/index.ts` with global flags (--help, --version, --no-color)
- [x] T010 Create project name validator in `packages/core/src/utils/validate.ts` — regex `/^[a-z0-9-]+$/`, length 1-215
- [x] T011 [P] Create package manager detector in `packages/core/src/utils/detect-pm.ts` — detect from lock files (package-lock.json → npm, yarn.lock → yarn, pnpm-lock.yaml → pnpm)
- [x] T012 [P] Create rollback utility in `packages/core/src/utils/rollback.ts` — track created files, delete directory or revert files on failure
- [x] T013 [P] Create spinner/progress utility in `packages/core/src/utils/spinner.ts` — wrap Ora for consistent step logging
- [x] T014 Create plugin manifest parser in `packages/core/src/manifest/parser.ts` — read and validate `manifest.json` files
- [x] T015 [P] Create plugin registry in `packages/core/src/plugins/registry.ts` — load all plugins from `packages/plugins/`, expose list/get
- [x] T016 [P] Create conflict checker in `packages/core/src/plugins/conflicts.ts` — check `conflictsWith` field against installed plugins
- [x] T017 Create template copier in `packages/core/src/generators/template-copier.ts` — copy template files with variable interpolation (project name, aliases)
- [x] T018 [P] Create project initializer in `packages/core/src/generators/project-init.ts` — orchestrate: create dir → copy template → install deps → configure tooling → apply plugins

---

## Phase 3: User Story 1 — Create New Project (P1)

**Goal**: A developer can run `easybeezy create`, provide a project name, select plugins, and get a fully configured, immediately runnable React project.

**Independent Test**: Run `easybeezy create`, enter a project name, select plugins, verify the generated project starts with `npm run dev`.

- [x] T019 [US1] Create base React + Vite + TypeScript template in `packages/templates/react-vite-ts/` with feature-based folder structure (src/features, src/shared, src/services, src/app)
- [x] T020 [US1] Add ESLint config to base template (`eslint.config.js` or `.eslintrc`)
- [x] T021 [US1] Add Prettier config to base template (`.prettierrc`, `.prettierignore`)
- [x] T022 [US1] Add path aliases to base template (`tsconfig.json` paths: `@/features`, `@/shared`, `@/services`, `@/app`)
- [x] T023 [US1] Add environment variable support to base template (`.env`, `.env.example`, `.env.local`)
- [x] T024 [US1] Create `create` command prompt flow in `packages/core/src/prompts/create.ts` — project name input + plugin checkbox selection
- [x] T025 [US1] Create `create` command handler in `packages/cli/src/commands/create.ts` — orchestrate: validate name → create dir → copy template → install deps → apply plugins → print summary
- [x] T026 [US1] Add directory conflict handling — prompt "Overwrite?" before replacing existing directory
- [x] T027 [US1] Add rollback on npm install failure — delete partially created project on error
- [x] T028 [US1] Add success summary output — project name, directory, framework, architecture, plugins, next steps

---

## Phase 4: User Story 4 — List Plugins (P4)

**Goal**: A developer can run `easybeezy plugins` and see all available plugins with descriptions.

**Independent Test**: Run `easybeezy plugins`, verify output shows all four plugins with descriptions and usage instructions.

- [x] T029 [US4] Create `plugins` command handler in `packages/cli/src/commands/plugins.ts` — list all plugins from registry with descriptions
- [x] T030 [US4] Add usage footer to plugins output — show install/remove instructions

---

## Phase 5: User Story 3 — Add Plugin (P3)

**Goal**: A developer can run `easybeezy add <plugin>` to install a plugin into an existing project.

**Independent Test**: Create a project, add a plugin, verify the plugin's files are generated and dependencies installed. Verify conflicting plugins are rejected.

- [x] T031 [P] [US3] Create axios plugin in `packages/plugins/axios/` — manifest.json + template files (src/services/api.ts, src/shared/http/client.ts)
- [x] T032 [P] [US3] Create zustand plugin in `packages/plugins/zustand/` — manifest.json + template files (src/store/index.ts, src/store/hooks.ts)
- [x] T033 [P] [US3] Create redux-toolkit plugin in `packages/plugins/redux/` — manifest.json + template files (src/store/index.ts, src/store/hooks.ts, src/store/slices/)
- [x] T034 [P] [US3] Create tailwindcss plugin in `packages/plugins/tailwind/` — manifest.json + template files (tailwind.config.js, postcss.config.js, src/index.css)
- [x] T035 [US3] Create `add` command prompt flow in `packages/core/src/prompts/add.ts` — plugin selection (if no argument given)
- [x] T036 [US3] Create `add` command handler in `packages/cli/src/commands/add.ts` — validate project → check conflicts → install deps → generate files → update config → print summary
- [x] T037 [US3] Add plugin conflict prevention — check `conflictsWith` before installing, abort with message if conflict found
- [x] T038 [US3] Add rollback on plugin install failure — revert generated files and config changes on npm install failure
- [x] T039 [US3] Add success summary output — list installed files, dependencies, configuration changes

---

## Phase 6: User Story 5 — Remove Plugin (P5)

**Goal**: A developer can run `easybeezy remove <plugin>` to cleanly uninstall a plugin and revert its changes.

**Independent Test**: Install a plugin, remove it, verify the project runs cleanly without the plugin's files or dependencies.

- [x] T040 [US5] Create plugin uninstaller in `packages/core/src/plugins/uninstaller.ts` — remove generated files, uninstall deps, revert config changes
- [x] T041 [US5] Create `remove` command handler in `packages/cli/src/commands/remove.ts` — validate plugin is installed → uninstall → print summary
- [x] T042 [US5] Add "not installed" error handling — show installed plugins and suggest usage
- [x] T043 [US5] Add no-argument handling — list currently installed plugins with usage instructions

---

## Phase 7: User Story 2 — Init Existing Project (P2)

**Goal**: A developer can run `easybeezy init` to add EasyBeezy configuration to an existing React project.

**Independent Test**: Create a bare React project with Vite, run `easybeezy init`, verify configuration is added without breaking the project.

- [x] T044 [US2] Create React project detector in `packages/core/src/utils/detect-react.ts` — check for React in package.json dependencies
- [x] T045 [US2] Create `init` command prompt flow in `packages/core/src/prompts/init.ts` — plugin selection
- [x] T046 [US2] Create `init` command handler in `packages/cli/src/commands/init.ts` — detect React → analyze structure → add missing config → install plugins → print summary
- [x] T047 [US2] Add non-React project error handling — detect framework, show clear error message

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Final quality pass — ensure all commands work together, error messages are consistent, and the tool is production-ready.

- [x] T048 Verify all commands follow consistent UX: spinner during operations, colored output, consistent error formatting
- [x] T049 [P] Add `--help` output for each command with usage examples
- [x] T050 [P] Verify `--no-color` flag disables colored output across all commands
- [x] T051 Verify exit codes: 0 on success, 1 on failure for all commands
- [x] T052 Run end-to-end validation per quickstart.md scenarios
- [x] T053 Update package.json bin entry and publish preparation (npm link test)

---

## Parallel Execution Opportunities

### Within Phase 2 (Foundational)
T011, T012, T013, T015, T016, T018 can run in parallel (no dependencies on each other).

### Within Phase 3 (US1 - Create)
T019-T023 (template files) can all run in parallel.

### Within Phase 5 (US3 - Add Plugin)
T031-T034 (plugin definitions) can all run in parallel.

### Within Phase 8 (Polish)
T049, T050 can run in parallel.

---

## Implementation Strategy

**MVP**: Phase 1 + Phase 2 + Phase 3 (Setup + Foundational + US1 Create Project)
This delivers the core value: `npx easybeezy` generates a runnable React project.

**Incremental Delivery**:
1. After MVP: `easybeezy create` works
2. Add US4 (plugins listing) — quick win, builds plugin registry
3. Add US3 (add plugin) — requires all four plugin definitions
4. Add US5 (remove plugin) — requires uninstaller
5. Add US2 (init project) — requires React detection
6. Polish pass — UX consistency and validation

---

## Task Summary

| Phase | Tasks | User Story |
|-------|-------|------------|
| Phase 1: Setup | 8 | — |
| Phase 2: Foundational | 10 | — |
| Phase 3: US1 - Create | 10 | P1 |
| Phase 4: US4 - List Plugins | 2 | P4 |
| Phase 5: US3 - Add Plugin | 9 | P3 |
| Phase 6: US5 - Remove Plugin | 4 | P5 |
| Phase 7: US2 - Init Project | 4 | P2 |
| Phase 8: Polish | 6 | — |
| **Total** | **53** | |
