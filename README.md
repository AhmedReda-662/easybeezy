# EasyBeezy

> Skip the boilerplate. Build the product.

A React CLI tool that generates production-ready frontend projects in minutes.

Instead of spending hours configuring project structures, tooling, state management, API layers, aliases, linting, formatting, and common development dependencies, run a single command to generate a scalable React application following industry best practices.

---

## Quick Start

```bash
npx easybeezy create
```

Or install globally:

```bash
npm install -g @easybeezy/cli
easybeezy create
```

---

## Features

- **React + TypeScript + Vite** — Modern stack, zero config
- **Feature-based architecture** — Organized by domain, not file type
- **ESLint + Prettier** — Code quality out of the box
- **Path aliases** — Clean imports with `@/features`, `@/shared`, etc.
- **Environment variables** — `.env` and `.env.example` included
- **Plugin system** — Add features without manual setup
- **Cross-platform** — Works on macOS, Linux, and Windows

---

## Commands

### `easybeezy create`

Create a new React project from scratch.

```bash
easybeezy create
```

You'll be prompted for:
1. Project name (lowercase, hyphens, numbers only)
2. Plugins to install (optional)

The generated project is immediately runnable:

```bash
cd my-project
npm install
npm run dev
```

### `easybeezy init`

Add EasyBeezy configuration to an existing React project.

```bash
cd my-existing-project
easybeezy init
```

This adds:
- ESLint configuration
- Prettier configuration
- Path aliases (tsconfig.json)
- Environment variable support
- Feature-based folder structure (src/features, src/shared, src/services, src/app)
- Selected plugins

### `easybeezy add <plugin>`

Add a feature plugin to your project.

```bash
easybeezy add axios
```

If no plugin name is given, you'll be prompted to select one.

### `easybeezy remove <plugin>`

Remove a plugin and revert its changes.

```bash
easybeezy remove zustand
```

### `easybeezy plugins`

List all available plugins.

```bash
easybeezy plugins
```

---

## Plugins

EasyBeezy v1 includes four official plugins:

| Plugin | Description | Conflicts With |
|--------|-------------|----------------|
| **axios** | HTTP client with interceptors | — |
| **zustand** | Lightweight state management | redux-toolkit |
| **redux-toolkit** | Predictable state container | zustand |
| **tailwindcss** | Utility-first CSS framework | — |

### Plugin Conflict Prevention

Redux Toolkit and Zustand cannot be installed together since they are both state management solutions. If you try to install one while the other is present, the tool will show an error and suggest removing the existing one first.

---

## Project Structure

Generated projects follow a feature-based architecture:

```
my-project/
├── src/
│   ├── app/          # App bootstrap (App.tsx, main.tsx)
│   ├── features/     # Feature modules
│   ├── shared/       # Reusable logic
│   └── services/     # API layer
├── .env.example      # Environment variable template
├── .prettierrc       # Prettier config
├── eslint.config.js  # ESLint config
├── tsconfig.json     # TypeScript config with path aliases
├── vite.config.ts    # Vite config
└── package.json
```

### Path Aliases

```typescript
// Instead of:
import { Button } from "../../../shared/components/Button";

// Use:
import { Button } from "@/shared/components/Button";
```

Available aliases:
- `@/features/*` → `src/features/*`
- `@/shared/*` → `src/shared/*`
- `@/services/*` → `src/services/*`
- `@/app/*` → `src/app/*`

---

## Requirements

- Node.js >= 18
- npm >= 9 (or yarn/pnpm)

---

## Development

### Setup

```bash
git clone https://github.com/AhmedReda-662/easybeezy.git
cd easybeezy
npm install
```

### Build

```bash
npx tsc --project packages/core/tsconfig.json
npx tsc --project packages/cli/tsconfig.json
```

### Link for Local Testing

```bash
cd packages/cli
npm link
easybeezy --help
```

### Run Tests

```bash
npm test
```

---

## How It Works

1. **Project creation**: `easybeezy create` scaffolds a React + Vite + TypeScript project with feature-based architecture, then runs `npm install` to set up dependencies.

2. **Plugin system**: Each plugin has a `manifest.json` declaring its dependencies, files to generate, and configuration updates. Plugins are self-contained and isolated.

3. **Failure handling**: If `npm install` fails during creation or plugin installation, the tool rolls back all changes and shows a clear error message.

4. **Conflict detection**: Before installing a plugin, the tool checks for conflicts with already-installed plugins and prevents incompatible combinations.

---

## License

MIT

---

## Acknowledgments

Built with:
- [Commander.js](https://github.com/tj/commander.js/) — CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) — Interactive prompts
- [Chalk](https://github.com/chalk/chalk) — Terminal colors
- [Ora](https://github.com/sindresorhus/ora) — Spinners

---

*EasyBeezy — Skip the boilerplate. Build the product.*
