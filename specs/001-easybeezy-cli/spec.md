# Feature Specification: EasyBeezy CLI

**Feature Branch**: `001-easybeezy-cli`

**Created**: 2026-06-22

**Status**: Draft

**Input**: User description: "A React-focused CLI tool that enables developers to create production-ready frontend projects in minutes. Instead of spending hours configuring project structures, tooling, state management, API layers, aliases, linting, formatting, and common development dependencies, developers can use a single command to generate a scalable React application following industry best practices."

## User Scenarios & Testing

### User Story 1 - Create New Project (Priority: P1)

A developer runs `npx easybeezy` and is guided through creating a new React project. They provide a project name, select optional plugins, and receive a fully configured, immediately runnable project.

**Why this priority**: This is the core value proposition. Without project creation, the tool has no purpose.

**Independent Test**: Run `npx easybeezy` with a project name, verify the generated project starts without errors and contains expected files.

**Acceptance Scenarios**:

1. **Given** a developer runs `npx easybeezy`, **When** they enter a valid project name, **Then** a new React + TypeScript + Vite project is created with the correct folder structure.
2. **Given** the project generation completes, **When** the developer runs `npm run dev`, **Then** the development server starts successfully.
3. **Given** the developer is prompted for plugins, **When** they select one or more plugins, **Then** the selected plugins are configured and their dependencies installed.
4. **Given** the developer selects no plugins, **When** project generation completes, **Then** a clean React project with only the defaults is created.
5. **Given** the developer provides an invalid project name (e.g., empty, special characters), **When** they submit it, **Then** a clear error message is shown and they can retry.
6. **Given** the developer enters a project name that already exists as a directory, **When** they submit it, **Then** the tool prompts "Directory exists. Overwrite?" — if no, abort; if yes, replace contents.

---

### User Story 2 - Initialize Existing Project (Priority: P2)

A developer with an existing React project runs `easybeezy init`. The tool detects the project, analyzes its structure, and adds missing configuration without breaking existing code.

**Why this priority**: Extends value to developers who already have projects but want consistent tooling.

**Independent Test**: Create a bare React project, run `easybeezy init`, verify configuration is added and the project still works.

**Acceptance Scenarios**:

1. **Given** a developer runs `easybeezy init` in a React project directory, **When** the tool analyzes the project, **Then** it detects the existing framework and structure.
2. **Given** the project is detected, **When** configuration is missing, **Then** the tool adds the missing configuration files (ESLint, Prettier, aliases, env vars) without overwriting existing ones.
3. **Given** the developer is prompted for plugins, **When** they select plugins, **Then** those plugins are installed and configured.
4. **Given** the project is not a React project, **When** the developer runs `easybeezy init`, **Then** a clear error message is shown explaining the tool only supports React projects.

---

### User Story 3 - Add Plugin to Existing Project (Priority: P3)

A developer runs `easybeezy add axios` (or another plugin name) to add a specific plugin to an existing EasyBeezy-managed project.

**Why this priority**: Allows incremental adoption of capabilities after initial project creation.

**Independent Test**: Run `easybeezy add axios` in an existing project, verify the plugin files are generated and dependencies installed.

**Acceptance Scenarios**:

1. **Given** a developer runs `easybeezy add <plugin-name>`, **When** the plugin exists, **Then** the tool installs the plugin dependencies and generates the required files.
2. **Given** the plugin is installed, **When** the developer checks the project, **Then** the plugin is immediately usable without manual configuration.
3. **Given** a developer runs `easybeezy add` with no arguments, **When** the command executes, **Then** a list of available plugins is displayed.
4. **Given** a developer runs `easybeezy add <invalid-plugin>`, **When** the plugin does not exist, **Then** a clear error message lists available plugins.

---

### User Story 4 - List Available Plugins (Priority: P4)

A developer runs `easybeezy plugins` to see all available plugins with descriptions.

**Why this priority**: Helps users discover available plugins before installation.

**Independent Test**: Run `easybeezy plugins`, verify output lists all four plugins (Axios, Zustand, Redux Toolkit, Tailwind CSS) with descriptions.

**Acceptance Scenarios**:

1. **Given** a developer runs `easybeezy plugins`, **When** the command executes, **Then** a list of all available plugins is displayed with names and brief descriptions.
2. **Given** plugins are listed, **When** the developer views the output, **Then** installation instructions are shown.

---

### User Story 5 - Remove Plugin from Project (Priority: P4)

A developer runs `easybeezy remove zustand` to cleanly uninstall a plugin and revert its changes.

**Why this priority**: Completes the plugin lifecycle and prevents manual cleanup errors.

**Independent Test**: Install a plugin, then remove it, verify the project returns to a clean state without the plugin.

**Acceptance Scenarios**:

1. **Given** a developer runs `easybeezy remove <installed-plugin>`, **When** the plugin exists, **Then** the tool uninstalls the plugin's dependencies, removes generated files, and reverts configuration changes.
2. **Given** the plugin is removed, **When** the developer runs `npm run dev`, **Then** the project still starts successfully without errors.
3. **Given** a developer runs `easybeezy remove <not-installed-plugin>`, **When** the plugin is not installed, **Then** a clear error message is shown: "Plugin '{name}' is not installed."
4. **Given** a developer runs `easybeezy remove` with no arguments, **When** the command executes, **Then** a list of currently installed plugins is displayed.

---

## Functional Requirements

### Project Generation

- The tool MUST create a React project with Vite as the build tool and TypeScript as the language.
- The generated project MUST use feature-based architecture with a predefined folder structure.
- The generated project MUST include path aliases for common imports.
- The generated project MUST include environment variable support (.env file structure).
- The generated project MUST include ESLint and Prettier configuration.
- The tool MUST install all required dependencies during project creation.
- The generated project MUST be immediately runnable with `npm run dev`.

### CLI Commands

- `easybeezy create` or `npx easybeezy` MUST create a new project.
- `easybeezy init` MUST initialize an existing React project.
- `easybeezy add <plugin>` MUST add a plugin to an existing project.
- `easybeezy remove <plugin>` MUST remove a plugin from an existing project — uninstall dependencies, remove generated files, and revert configuration changes.
- `easybeezy plugins` MUST list available plugins.
- All commands MUST provide clear, human-readable output.
- All commands MUST handle errors gracefully with helpful messages.

### Plugin System

- The tool MUST support four plugins in v1: Axios, Zustand, Redux Toolkit, Tailwind CSS.
- Each plugin MUST be self-contained and independently installable.
- Plugin installation MUST include dependency installation, file generation, and configuration updates.
- Plugins MUST NOT conflict with each other or with the base project configuration.
- The tool MUST prevent installation of conflicting plugins. Conflict group: {Redux Toolkit, Zustand} — both are state management solutions and are mutually exclusive.
- If a developer attempts to install a conflicting plugin, the tool MUST show: "Already using {existing-plugin}. Remove it first?" and abort the install.

### Failure Handling

- If `npm install` fails during project creation (network error, disk full, etc.), the tool MUST roll back by deleting the partially created project directory and show a clear error message with a suggested fix.
- If `npm install` fails during plugin installation, the tool MUST roll back the plugin changes (remove generated files, revert config) and show a clear error message.
- The tool MUST NOT leave a partially generated project in an unusable state.

### Prompt System

- The tool MUST prompt the user for a project name during creation.
- The tool MUST prompt the user for optional plugin selection.
- The tool MUST allow the user to skip plugin selection.
- The tool MUST validate user input and show clear error messages for invalid input.

## Success Criteria

1. A developer can generate a new React project in under 30 seconds.
2. The generated project starts without errors on the first run.
3. The generated project requires zero manual configuration before development begins.
4. Plugin installation completes successfully and the plugin is immediately usable.
5. The tool provides clear error messages for all failure cases.
6. The generated project follows consistent architecture across all generations.

## Key Entities

- **Project**: A React application generated or managed by EasyBeezy
- **Plugin**: A self-contained module that adds specific capabilities to a project
- **Configuration**: Tool settings (ESLint, Prettier, aliases, env vars) applied to projects
- **Command**: A CLI action that performs a specific task (create, init, add, plugins)

## Clarifications

### Session 2026-06-22

- Q: What should happen when the target project directory already exists during `easybeezy create`? → A: Prompt "Directory exists. Overwrite?" — if no, abort; if yes, replace contents.
- Q: Can incompatible plugins (e.g., Redux Toolkit + Zustand) be installed together? → A: Prevent: reject install if conflicting plugin already exists, show "Already using X. Remove it first?" Conflict group: {Redux Toolkit, Zustand} — both are state management and are mutually exclusive. Axios and Tailwind have no conflicts.
- Q: What happens when `npm install` fails during project creation or plugin installation? → A: Rollback — delete the partially created project directory and show a clear error message with a suggested fix.
- Q: Does `easybeezy remove <plugin>` exist in v1? → A: Yes — include `easybeezy remove <plugin>` in v1. Uninstalls dependencies, removes generated files, reverts config.

## Assumptions

- The developer has Node.js >= 18 installed.
- The developer has npm >= 9 available.
- The target platform is local development environments (not cloud-based).
- Projects are created on the local filesystem.
- The tool assumes the developer wants the latest stable versions of all dependencies.
- Feature-based architecture is the preferred project structure for v1.
