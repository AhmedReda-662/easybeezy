# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-06-22

### Added

- `easybeezy create` — Full project generation wizard with interactive prompts
- `easybeezy init` — Add EasyBeezy configuration to existing React projects
- `easybeezy add <plugin>` — Install feature plugins
- `easybeezy remove <plugin>` — Remove feature plugins and revert changes
- `easybeezy plugins` — List available plugins
- `easybeezy joke` — Show a joke from the Joker

- React + TypeScript + Vite project template
- Feature-based architecture (src/features, src/shared, src/services, src/app)
- ESLint configuration
- Prettier configuration
- Path aliases (@/features, @/shared, @/services, @/app)
- Environment variable support (.env, .env.example)

- Plugin system with manifest-driven architecture
- Plugin conflict detection (Redux Toolkit vs Zustand)
- Plugin installation and removal with rollback support

- Four official plugins:
  - axios — HTTP client with interceptors
  - zustand — Lightweight state management
  - redux-toolkit — Predictable state container
  - tailwindcss — Utility-first CSS framework

- Cross-platform support (macOS, Linux, Windows)
- Failure rollback — no partial projects left behind
- Directory overwrite confirmation
- Package manager detection (npm, yarn, pnpm)

- ASCII art banner with package name on all commands
- Animated spinners with step labels during operations
- Fancy progress display with colored steps
- Preflight checks (Node version, network connectivity, disk space)
- Joker ASCII art with developer joke (`easybeezy joke`)
- Plugin conflict indicators in plugin list

### Changed

- N/A (initial release)

### Deprecated

- N/A (initial release)

### Removed

- N/A (initial release)

### Fixed

- N/A (initial release)

### Security

- N/A (initial release)
