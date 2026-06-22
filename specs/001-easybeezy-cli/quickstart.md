# Quickstart Validation Guide: EasyBeezy CLI

**Date**: 2026-06-22

## Prerequisites

- Node.js >= 18
- npm >= 9

## Setup

```bash
# Clone the repo
git clone <repo-url>
cd easybeezy

# Install dependencies
npm install

# Link CLI for local testing
npm link
```

---

## Scenario 1: Create New Project (US1)

**What it proves**: Core project generation works end-to-end.

```bash
easybeezy create
# Enter project name: test-project
# Select plugins: Axios, Tailwind CSS
cd test-project
npm install
npm run dev
```

**Expected outcome**:
- Project directory `test-project/` created with feature-based structure
- `npm run dev` starts Vite dev server on localhost
- ESLint, Prettier, path aliases pre-configured
- Axios and Tailwind CSS installed and configured

**Verify**:
- `src/features/` directory exists
- `src/shared/` directory exists
- `tsconfig.json` has path aliases
- `.eslintrc` and `.prettierrc` exist
- `.env.example` exists
- `package.json` lists axios and tailwindcss as dependencies

---

## Scenario 2: Create with No Plugins

**What it proves**: Clean project generation without plugins works.

```bash
easybeezy create
# Enter project name: clean-project
# Select plugins: (none)
cd clean-project
npm install
npm run dev
```

**Expected outcome**:
- Clean React + TypeScript + Vite project
- No plugin-related files or dependencies

---

## Scenario 3: Directory Conflict Handling (US1, Scenario 6)

**What it proves**: Overwrite confirmation works.

```bash
mkdir existing-project
easybeezy create
# Enter project name: existing-project
```

**Expected outcome**:
- Prompt: "Directory exists. Overwrite?"
- If "No" → project creation aborted, directory unchanged
- If "Yes" → directory replaced with new project

---

## Scenario 4: Add Plugin (US3)

**What it proves**: Plugin installation works independently.

```bash
cd test-project
easybeezy add zustand
```

**Expected outcome**:
- Zustand installed as dependency
- Store files generated in `src/store/`
- Project still runs with `npm run dev`

---

## Scenario 5: Plugin Conflict Prevention (US3)

**What it proves**: Conflicting plugins are blocked.

```bash
cd test-project
# Assume zustand is already installed
easybeezy add redux-toolkit
```

**Expected outcome**:
- Error message: "Already using zustand. Remove it first?"
- No files modified

---

## Scenario 6: Remove Plugin (US5)

**What it proves**: Plugin removal reverts changes cleanly.

```bash
cd test-project
easybeezy remove zustand
npm run dev
```

**Expected outcome**:
- Zustand dependency removed
- Generated store files removed
- Project runs without errors

---

## Scenario 7: Init Existing Project (US2)

**What it proves**: `init` adds configuration to existing React project.

```bash
# Create bare React project
npm create vite@latest bare-project -- --template react-ts
cd bare-project
npm install
easybeezy init
```

**Expected outcome**:
- ESLint, Prettier, aliases, env vars added
- Existing files not overwritten
- Project still runs

---

## Scenario 8: List Plugins (US4)

**What it proves**: Plugin listing works.

```bash
easybeezy plugins
```

**Expected outcome**:
- Lists all four plugins with descriptions
- Shows install/remove instructions

---

## Scenario 9: Error Handling

**What it proves**: Failure cases are handled gracefully.

```bash
# Invalid project name
easybeezy create
# Enter project name: "my project!" (with space and special chars)
```

**Expected outcome**:
- Error: "Project name must contain only lowercase letters, numbers, and hyphens."

```bash
# Non-React project init
mkdir not-react && cd not-react
echo '{}' > package.json
easybeezy init
```

**Expected outcome**:
- Error: "Not a React project."
