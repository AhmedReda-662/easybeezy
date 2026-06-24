# EasyBeezy

> React project bootstrap generator with modular enhancements. Turn an empty folder into a production-ready React app in under 2 minutes.

## Installation

```bash
npm install -g easybeezy
```

## Usage

### Create a new project

```bash
easybeezy create
```

This launches an interactive wizard that:
1. Sets up a React + Vite + TypeScript project
2. Applies feature-based architecture
3. Installs and configures ESLint, Prettier, and path aliases
4. Optionally adds plugins (axios, zustand, redux, tailwind)

### Initialize in an existing project

```bash
easybeezy init
```

Enhances an existing React project with EasyBeezy's architecture and tooling.

### Add a plugin

```bash
easybeezy add axios
```

Installs a feature module into your project.

### List available plugins

```bash
easybeezy plugins
```

## Available Plugins

| Plugin | Description |
|--------|-------------|
| `axios` | HTTP client with interceptors and request configuration |
| `zustand` | Lightweight state management |
| `redux` | Predictable state container with Redux Toolkit |
| `tailwind` | Utility-first CSS framework |

## Generated Project Structure

```
src/
├── features/       # Domain-specific modules
├── shared/         # Reusable logic and components
├── services/       # API layer
└── app/            # App bootstrap and configuration
```

## Requirements

- Node.js >= 18

## License

MIT
