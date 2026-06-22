# Contributing to EasyBeezy

Thanks for your interest in contributing! Here's how to get started.

---

## Development Setup

```bash
git clone <repo-url>
cd easybeezy
npm install
```

### Build All Packages

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

## Project Structure

```
packages/
├── cli/            # CLI entry point (Commander.js)
├── core/           # Shared logic (generators, prompts, plugins)
├── templates/      # Project templates
└── plugins/        # Feature plugins
```

---

## Adding a New Plugin

1. Create a directory in `packages/plugins/<plugin-name>/`
2. Add a `manifest.json` following the schema:

```json
{
  "name": "my-plugin",
  "description": "What it does",
  "dependencies": ["some-package"],
  "devDependencies": [],
  "generatedFiles": [
    {
      "source": "src/file.ts",
      "target": "src/destination/file.ts",
      "template": false
    }
  ],
  "configUpdates": [
    {
      "file": "config.json",
      "action": "append",
      "content": "..."
    }
  ],
  "conflictsWith": []
}
```

3. Add template files in `src/` relative to the plugin directory
4. The plugin will be automatically discovered by the registry

---

## Code Style

- TypeScript preferred
- No class components in generated code
- Minimal dependencies
- Functional components only
- Clean modular architecture

---

## Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## Reporting Issues

Open an issue on GitHub with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Node.js version
- Operating system

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
