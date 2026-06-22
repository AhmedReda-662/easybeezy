# EasyBeezy Constitution

## Core Principles

### I. CLI Interface

Every core interaction with EasyBeezy MUST be accessible through a CLI command. All operations—project creation, initialization, plugin management—MUST expose a text-based interface. The CLI is the primary and only user-facing interface for v1. Output MUST be human-readable with optional JSON format support for programmatic use.

### II. Feature-Based Architecture

Generated React projects MUST use Feature-Based Architecture by default. Each feature is a self-contained module with its own components, hooks, services, and types. Shared code lives in `shared/`. This structure MUST be enforced in all generated project templates without exception.

### III. Manifest-Driven Plugin System

Plugins MUST be defined by a manifest that declares dependencies, files to generate, and configuration to apply. The plugin system MUST be the only mechanism for adding capabilities like state management, HTTP clients, or CSS frameworks. Adding a plugin MUST NOT require manual file creation by the user. Plugins MUST be independently testable and self-contained.

### IV. Production-Ready Defaults

Every generated project MUST include: TypeScript, ESLint, Prettier, path aliases, and environment variable support. These are non-negotiable defaults—developers MAY override settings after generation, but the initial state MUST be production-ready. No manual configuration is required for a functional development environment.

### V. Focused Scope

Version 1 of EasyBeezy MUST target React + Vite + TypeScript only. No other frameworks, languages, or architectures MAY be added to v1. Every feature request MUST be evaluated against this constraint. Scope expansion requires a new major or minor version with explicit governance approval.

## Technology Stack

| Concern | Choice | Version | Notes |
|---------|--------|---------|-------|
| Runtime | Node.js | >=18 | LTS required |
| Language | TypeScript | 5.x | Strict mode |
| Build | Vite | latest | React plugin |
| Linting | ESLint | latest | React rules |
| Formatting | Prettier | latest | Consistent style |
| Package Manager | npm | >=9 | Default; pnpm optional |

No deviations from this stack are permitted in v1. Alternatives MUST be proposed as amendments before adoption.

## Development Workflow

### Test-First (NON-NEGOTIABLE)

Tests MUST be written before implementation for all plugin integrations, CLI commands, and template generation. TDD cycle: write failing test, implement minimal code to pass, refactor. This applies to:

- Plugin manifest validation
- CLI command parsing and output
- Project template generation
- Dependency installation logic

### Code Quality Gates

- All PRs MUST pass linting and formatting checks before merge
- Generated projects MUST pass their own lint and type-check on creation
- Plugin integrations MUST include at least one integration test

### Versioning Policy

EasyBeezy uses Semantic Versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes to CLI interface or generated project structure
- **MINOR**: New plugins, new CLI commands, new template options
- **PATCH**: Bug fixes, dependency updates, documentation improvements

## Governance

This constitution is the highest-authority document for the EasyBeezy project. All code, templates, and plugin definitions MUST comply with its principles.

### Amendment Process

1. Proposed changes MUST be documented with rationale
2. Major changes require explicit approval from the project owner
3. Version MUST be bumped per the versioning policy above
4. All dependent templates (plan, spec, tasks) MUST be updated for consistency

### Compliance

- Every PR and code review MUST verify adherence to the constitution
- Complexity MUST be justified against the Focused Scope and Simplicity principles
- Violations of Core Principles MUST be resolved before merge

**Version**: 1.0.0 | **Ratified**: 2026-06-22 | **Last Amended**: 2026-06-22
