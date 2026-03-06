# AI Know-How Tools

> Reusable CLI utility scripts for working with AI APIs.

## Prerequisites

All tools run with `npx tsx` — no global installs needed.

```bash
npx tsx tools/<tool-name>.ts --help
```

## Available Tools

| Tool                                 | Description                                         | Block |
| ------------------------------------ | --------------------------------------------------- | ----- |
| [token-counter.ts](token-counter.ts) | Estimate token count and API cost for text or files | 0     |

## Usage

### Token Counter

Estimate how many tokens a text or file contains, and what it would cost to process with different models.

```bash
# Count tokens in a string
npx tsx tools/token-counter.ts --text "Hello, how are you?"

# Count tokens in a file
npx tsx tools/token-counter.ts --file README.md

# Specify a model for cost estimation
npx tsx tools/token-counter.ts --file src/index.ts --model gpt-4o-mini
```
