# Data Model: EasyBeezy CLI

**Date**: 2026-06-22

## Entities

### Project

Represents a React project generated or managed by EasyBeezy.

| Field        | Type     | Description                                    |
| ------------ | -------- | ---------------------------------------------- |
| name         | string   | Project directory name (validated, lowercase)  |
| path         | string   | Absolute path to project directory             |
| framework    | string   | Always "react" in v1                           |
| language     | string   | Always "typescript" in v1                      |
| buildTool    | string   | Always "vite" in v1                            |
| architecture | string   | Always "feature-based" in v1                   |
| plugins      | Plugin[] | Currently installed plugins                    |
| packageManager | string | Detected: "npm" / "yarn" / "pnpm"             |
| createdAt    | Date     | Timestamp of creation                          |

**Validation Rules**:
- `name` MUST match `/^[a-z0-9-]+$/` (lowercase, hyphens, numbers only)
- `path` MUST be an absolute directory path
- `name` length MUST be between 1 and 215 characters

### Plugin

Represents a self-contained feature module that can be added to a project.

| Field         | Type     | Description                                    |
| ------------- | -------- | ---------------------------------------------- |
| name          | string   | Unique identifier (e.g., "axios", "zustand")  |
| description   | string   | Human-readable description                     |
| dependencies  | string[] | npm packages to install                        |
| devDependencies | string[] | npm dev packages to install                  |
| generatedFiles | FileMapping[] | Files to create in the project            |
| configUpdates | ConfigUpdate[] | Configuration files to modify             |
| conflictsWith | string[] | Names of incompatible plugins                  |

**Validation Rules**:
- `name` MUST be unique across all plugins
- `dependencies` MUST be valid npm package names

### FileMapping

Describes a file to generate when a plugin is installed.

| Field    | Type     | Description                                  |
| -------- | -------- | -------------------------------------------- |
| source   | string   | Path to template file relative to plugin dir |
| target   | string   | Destination path relative to project root    |
| template | boolean  | Whether to interpolate variables             |

### ConfigUpdate

Describes a modification to an existing configuration file.

| Field    | Type     | Description                                  |
| -------- | -------- | -------------------------------------------- |
| file     | string   | Config file path relative to project root    |
| action   | string   | "merge" or "append"                          |
| content  | string   | Content to merge or append                   |

### State Transitions

#### Project Lifecycle

```
[nonexistent] --create--> [creating] --success--> [ready]
                                          --failure--> [rolled back / nonexistent]

[ready] --init--> [configuring] --success--> [ready]

[ready] --add plugin--> [installing] --success--> [ready]
                                  --failure--> [ready] (rolled back)

[ready] --remove plugin--> [uninstalling] --success--> [ready]
                                      --failure--> [ready] (rolled back)
```

#### Plugin Conflict Check Flow

```
[request add plugin] --check conflicts--> [no conflict] --install--> [success]
                                          --conflict detected--> [abort with message]
```
