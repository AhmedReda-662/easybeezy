# CLI Command Contracts: EasyBeezy

**Date**: 2026-06-22

## Command: `easybeezy create` (alias: `npx easybeezy`)

**Purpose**: Create a new React project from scratch.

**Arguments**: None (uses interactive prompts).

**Prompts**:
1. Project name (input, validated against `/^[a-z0-9-]+$/`)
2. Plugins (checkbox, optional): Axios, Zustand, Redux Toolkit, Tailwind CSS

**Output on success**:
```
✔ Project "my-app" created successfully!

  Directory:    ./my-app
  Framework:    React + TypeScript + Vite
  Architecture: Feature-based
  Plugins:      axios, tailwindcss

  Next steps:
    cd my-app
    npm install
    npm run dev
```

**Output on failure**:
```
✖ Project creation failed: <error message>

  Suggested fix: <actionable suggestion>
  The project directory has been cleaned up.
```

**Output on directory conflict**:
```
Directory "my-app" already exists. Overwrite? (y/N)
```

---

## Command: `easybeezy init`

**Purpose**: Initialize an existing React project with EasyBeezy configuration.

**Arguments**: None (uses current directory).

**Prompts**:
1. Plugins (checkbox, optional)

**Output on success**:
```
✔ Project initialized!

  Added:       ESLint, Prettier, path aliases, env vars
  Plugins:     zustand

  Next steps:
    npm install
    npm run dev
```

**Output on non-React project**:
```
✖ Not a React project.

  EasyBeezy init only supports React projects.
  Detected: <framework or "No package.json found">
```

---

## Command: `easybeezy add <plugin>`

**Purpose**: Add a plugin to an existing project.

**Arguments**:
- `<plugin>` (optional): Plugin name. If omitted, shows interactive selection.

**Output on success**:
```
✔ Plugin "axios" installed!

  Added files:    src/services/api.ts, src/shared/http/client.ts
  Dependencies:   axios
  Configuration:  Added path alias @/services
```

**Output on conflict**:
```
✖ Cannot install "redux-toolkit".

  Already using "zustand". Remove it first?
  Run: easybeezy remove zustand
```

**Output on unknown plugin**:
```
✖ Unknown plugin "foo".

  Available plugins: axios, zustand, redux-toolkit, tailwindcss
```

**Output on no argument**:
```
? Select plugins to install:
  ◉ Axios — HTTP client with interceptors
  ◯ Zustand — Lightweight state management
  ◯ Redux Toolkit — Predictable state container
  ◯ Tailwind CSS — Utility-first CSS framework
```

---

## Command: `easybeezy remove <plugin>`

**Purpose**: Remove a plugin and revert its changes.

**Arguments**:
- `<plugin>` (optional): Plugin name. If omitted, shows installed plugins.

**Output on success**:
```
✔ Plugin "zustand" removed!

  Removed files:     src/store/
  Uninstalled:       zustand
  Reverted config:   Removed store imports
```

**Output on not installed**:
```
✖ Plugin "axios" is not installed.

  Installed plugins: zustand
```

**Output on no argument**:
```
Installed plugins:
  • zustand — Lightweight state management

  Usage: easybeezy remove <plugin-name>
```

---

## Command: `easybeezy plugins`

**Purpose**: List all available plugins.

**Arguments**: None.

**Output**:
```
Available plugins:

  axios          HTTP client with interceptors
  zustand        Lightweight state management
  redux-toolkit  Predictable state container
  tailwindcss    Utility-first CSS framework

  Install: easybeezy add <plugin-name>
  Remove:  easybeezy remove <plugin-name>
```

---

## Global Behavior

- All commands MUST display a spinner during long operations (npm install, file generation).
- All commands MUST exit with code 0 on success, code 1 on failure.
- `--help` and `--version` flags MUST work on all commands.
- `--no-color` flag MUST disable colored output.
