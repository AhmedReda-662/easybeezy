# EasyBeezy

<img width="1254" height="1254" alt="ChatGPT Image Jun 23, 2026, 08_16_08 PM" src="https://github.com/user-attachments/assets/1d92e5f1-30eb-4cc0-ac80-5a801c5fcc42" />

[![npm version](https://img.shields.io/npm/v/easybeezy)](https://www.npmjs.com/package/easybeezy)
[![npm downloads](https://img.shields.io/npm/dm/easybeezy)](https://www.npmjs.com/package/easybeezy)
[![license](https://img.shields.io/npm/l/easybeezy)](https://github.com/AhmedReda-662/easybeezy/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/easybeezy)](https://www.npmjs.com/package/easybeezy)

> Skip the boilerplate. Build the product.

A React CLI tool that generates production-ready frontend projects in minutes.

Instead of spending hours configuring project structures, tooling, state management, API layers, aliases, linting, formatting, and common development dependencies, run a single command to generate a scalable React application following industry best practices.

---

## Why EasyBeezy?

Starting a new React project today means fighting with configuration before writing a single line of business logic. EasyBeezy eliminates that friction:

- **Zero-config setup** — React + TypeScript + Vite, ready to go
- **36+ plugins** — state management, UI libraries, testing, DevOps, and more
- **Feature-based architecture** — domain-driven folder structure from day one
- **Conflict detection** — prevents incompatible plugin combinations
- **Instant rollback** — if something fails, nothing gets left behind
- **Works everywhere** — macOS, Linux, and Windows

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

Follow the interactive prompts:

```
? Project name: my-app
? Select plugins: Axios, Tailwind CSS

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

---

## Commands

### `easybeezy create`

Create a new React project from scratch. An interactive wizard walks you through naming your project and selecting optional plugins.

```bash
easybeezy create
```

**What it does:**
1. Scaffolds a React + Vite + TypeScript project
2. Applies feature-based architecture
3. Configures ESLint, Prettier, and path aliases
4. Sets up environment variable support
5. Installs all dependencies
6. Optionally installs selected plugins

### `easybeezy init`

Enhance an existing React project with EasyBeezy's tooling and architecture.

```bash
cd my-existing-project
easybeezy init
```

**What it adds:**
- ESLint and Prettier configuration
- Path aliases (`@/features`, `@/shared`, `@/services`, `@/app`)
- Environment variable support (`.env`, `.env.example`)
- Feature-based folder structure (`src/features`, `src/shared`, `src/services`, `src/app`)
- Optional plugins

### `easybeezy add <plugin>`

Install a plugin into an existing project. If no plugin name is given, an interactive selection menu appears.

```bash
easybeezy add axios
easybeezy add tailwindcss
```

### `easybeezy remove <plugin>`

Remove a plugin and cleanly revert all its changes — dependencies, generated files, and configuration.

```bash
easybeezy remove zustand
```

### `easybeezy plugins`

List all available plugins with descriptions and conflict information.

```bash
easybeezy plugins
```

### `easybeezy joke`

Because every CLI needs a little personality.

```bash
easybeezy joke
```

---

## Plugin System

EasyBeezy's plugin system is the core differentiator. Each plugin is a self-contained module with a manifest that declares its dependencies, generated files, and configuration updates.

### How It Works

1. **Manifest-driven** — every plugin declares `dependencies`, `devDependencies`, `generatedFiles`, `configUpdates`, and `conflictsWith`
2. **Atomic installation** — plugins install dependencies, generate files, and update config in one operation
3. **Safe removal** — `easybeezy remove` reverts all plugin changes cleanly
4. **Conflict detection** — incompatible plugins are blocked before installation
5. **Rollback on failure** — if `npm install` fails, all changes are undone automatically

### Conflict Detection

EasyBeezy prevents incompatible plugin combinations:

| Plugin A | Plugin B | Reason |
|----------|----------|--------|
| Redux Toolkit | Zustand | Both are state management solutions |
| Firebase | Supabase | Both are backend service platforms |
| Cypress | Playwright | Both are browser testing frameworks |
| MUI | Ant Design | Both are UI component libraries |
| MUI | Chakra UI | Both are UI component libraries |

If you try to install a conflicting plugin, EasyBeezy shows a clear error:

```
✖ Cannot install "redux-toolkit".

  Already using "zustand". Remove it first?
  Run: easybeezy remove zustand
```

---

## Available Plugins

### State Management

| Plugin | Description |
|--------|-------------|
| `zustand` | Lightweight state management |
| `redux-toolkit` | Predictable state container with Redux Toolkit |
| `jotai` | Primitive and flexible state management |

### Data Fetching

| Plugin | Description |
|--------|-------------|
| `axios` | HTTP client with interceptors |
| `tanstack-query` | Powerful data synchronization for React |

### Styling

| Plugin | Description |
|--------|-------------|
| `tailwindcss` | Utility-first CSS framework |
| `emotion` | CSS-in-JS library with label speed |
| `styled-components` | Visual primitives for component-level styling |

### UI Libraries

| Plugin | Description |
|--------|-------------|
| `mui` | Material UI — comprehensive React component library |
| `antd` | Ant Design — enterprise-level UI components |
| `chakra-ui` | Simple, modular, and accessible component library |
| `mantine` | Full-featured React components and hooks library |

### Forms

| Plugin | Description |
|--------|-------------|
| `formik` | Build forms in React, without the tears |
| `react-hook-form` | Performant, flexible forms with easy validation |

### Validation

| Plugin | Description |
|--------|-------------|
| `zod` | TypeScript-first schema validation |
| `yup` | Schema-based value parsing and validation |

### Routing

| Plugin | Description |
|--------|-------------|
| `react-router` | Declarative routing for React |

### Backend Services

| Plugin | Description |
|--------|-------------|
| `firebase` | Firebase backend services |
| `supabase` | Open source Firebase alternative |
| `appwrite` | Open source backend-as-a-service |
| `sentry` | Application monitoring and error tracking |

### Testing

| Plugin | Description |
|--------|-------------|
| `vitest` | Blazing fast unit test framework powered by Vite |
| `cypress` | Fast, easy and reliable testing for anything that runs in a browser |
| `playwright` | reliable end-to-end testing for modern web apps |

### Code Quality

| Plugin | Description |
|--------|-------------|
| `husky` | Git hooks made easy |
| `lint-staged` | Run linters on git staged files |
| `commitlint` | Lint commit messages |
| `storybook` | The UI component explorer |

### Internationalization

| Plugin | Description |
|--------|-------------|
| `i18next` | Internationalization framework for React |

### Notifications

| Plugin | Description |
|--------|-------------|
| `react-toastify` | Toast notifications for React |
| `sonner` | An opinionated toast notification for React |

### Charts & Visualization

| Plugin | Description |
|--------|-------------|
| `chartjs` | Simple yet flexible JavaScript charting |
| `recharts` | Composable charting library built on React components |
| `apexcharts` | Modern interactive SVG charts |

### File Handling

| Plugin | Description |
|--------|-------------|
| `react-dropzone` | Simple HTML5 drag-and-drop dropzone for React |

### DevOps

| Plugin | Description |
|--------|-------------|
| `docker` | Containerized development and deployment |

---

## Generated Project Structure

Every generated project follows a consistent, feature-based architecture:

```
my-project/
├── src/
│   ├── app/              # App bootstrap (App.tsx, main.tsx)
│   ├── features/         # Feature modules (domain-specific)
│   ├── shared/           # Reusable components, hooks, utilities
│   └── services/         # API layer and external integrations
├── .env                  # Environment variables
├── .env.example          # Environment variable template
├── .prettierrc           # Prettier config
├── eslint.config.js      # ESLint config
├── tsconfig.json         # TypeScript config with path aliases
├── vite.config.ts        # Vite config
└── package.json
```

### Path Aliases

No more ugly relative imports:

```typescript
// Before
import { Button } from "../../../shared/components/Button";

// After
import { Button } from "@/shared/components/Button";
```

Available aliases:
- `@/features/*` → `src/features/*`
- `@/shared/*` → `src/shared/*`
- `@/services/*` → `src/services/*`
- `@/app/*` → `src/app/*`

---

## Safety Features

### Rollback on Failure

If `npm install` fails during project creation or plugin installation, EasyBeezy automatically rolls back all changes. No partial projects left behind.

### Input Validation

Project names are validated against `/^[a-z0-9-]+$/`. Invalid names show a clear error with retry guidance.

### Directory Conflict Handling

If you try to create a project in a directory that already exists:

```
Directory "my-app" already exists. Overwrite? (y/N)
```

### Preflight Checks

EasyBeezy verifies:
- Node.js version (>= 18)
- Network connectivity
- Available disk space

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

### Project Structure

```
packages/
├── cli/            # Commander.js + entry point
├── core/           # Generators, prompts, logic
│   ├── generators/
│   ├── prompts/
│   ├── plugins/
│   ├── manifest/
│   └── utils/
├── templates/      # Base React project templates
└── plugins/        # Feature plugins (36+ available)
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Development setup
- Adding new plugins
- Code style
- Pull request process

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
