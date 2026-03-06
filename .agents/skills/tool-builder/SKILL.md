---
name: tool-builder
description: Generates reusable CLI utility scripts for interacting with AI models
---

# Tool Builder Skill

## Purpose

Create standalone TypeScript CLI utilities in `/tools/` that serve as both learning aids and practical tools for working with AI APIs.

## Inputs

- **Tool idea** or **block context** — either a specific utility to build, or a block number to derive useful tools from the course content.

## Output

Files written to `/tools/`:

```
tools/
├── README.md                         # Index of all tools with descriptions
├── <tool-name>.ts                    # Standalone CLI script
├── lib/
│   └── shared.ts                     # Shared utilities (API clients, formatters)
└── tsconfig.json                     # TypeScript config for tools
```

## Instructions

1. **Determine** which tools are useful based on the block content.
2. **Create** each tool as a standalone `.ts` file runnable with `npx tsx tools/<name>.ts`.
3. **Update** `/tools/README.md` with the new tool entry.
4. **Ensure** shared utilities go in `/tools/lib/shared.ts`.

### CLI Pattern

Every tool must follow this pattern:

```typescript
#!/usr/bin/env npx tsx

/**
 * Tool: <Name>
 * Description: <What it does>
 * Usage: npx tsx tools/<name>.ts [options]
 *
 * Examples:
 *   npx tsx tools/<name>.ts --input "hello world"
 *   npx tsx tools/<name>.ts --help
 */

import { parseArgs } from "node:util";

// --- Configuration ---
const config = {
  apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY,
  // ... other env-based config
};

// --- Argument Parsing ---
const { values } = parseArgs({
  options: {
    help: { type: "boolean", short: "h" },
    input: { type: "string", short: "i" },
    // ... tool-specific args
  },
});

if (values.help) {
  console.log(`Usage: npx tsx tools/<name>.ts [options]
  
Options:
  -h, --help     Show this help message
  -i, --input    Input value
  `);
  process.exit(0);
}

// --- Main Logic ---
async function main() {
  // Validate config
  if (!config.apiKey) {
    console.error(
      "Error: Set OPENAI_API_KEY or ANTHROPIC_API_KEY env variable",
    );
    process.exit(1);
  }

  // Tool logic here
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
```

### Tool Ideas per Block

| Block | Potential tools                                           |
| ----- | --------------------------------------------------------- |
| 0     | `token-counter.ts` — count tokens in a text/file          |
| 1     | `api-tester.ts` — quick test calls to OpenAI/Anthropic    |
| 2     | `prompt-tester.ts` — test a prompt with different params  |
| 3     | `cost-estimator.ts` — estimate API cost for a prompt      |
| 4     | `tool-schema-gen.ts` — generate JSON Schema for functions |
| 6     | `embed-search.ts` — embed and search over local files     |

## Design Principles

- **Zero global installs**: Everything runs via `npx tsx`
- **Env-var config**: API keys via environment variables, never hardcoded
- **Graceful errors**: Clear error messages for missing keys, bad input, network failures
- **Minimal dependencies**: Use Node.js built-ins where possible, import AI SDKs only when needed
- **Self-documenting**: `--help` flag always works, file header explains usage

## Quality Checklist

- [ ] Tool runs with `npx tsx tools/<name>.ts --help`
- [ ] Proper error handling for missing env vars and bad input
- [ ] README.md is updated with the new tool
- [ ] No hardcoded API keys or secrets
- [ ] TypeScript compiles without errors
