# AI Know-How Tools

> Reusable CLI utility scripts for working with AI APIs.

## Prerequisites

All tools run with `npx tsx` — no global installs needed.

```bash
npx tsx tools/<tool-name>.ts --help
```

## Available Tools

| Tool                                 | Description                                         | Block | Related Theory                                                                  |
| ------------------------------------ | --------------------------------------------------- | ----- | ------------------------------------------------------------------------------- |
| [token-counter.ts](token-counter.ts) | Estimate token count and API cost for text or files | 0     | [Tokenization & Embeddings](../docs/block-00/01-tokenization-and-embeddings.md) |
| [api-tester.ts](api-tester.ts)       | Quick test calls to OpenAI and Anthropic APIs        | 1     | [OpenAI API](../docs/block-01/01-openai-api.md)                                |

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

### API Tester

Quick test calls to OpenAI or Anthropic APIs with token usage reporting and optional streaming.

```bash
# Test OpenAI
npx tsx tools/api-tester.ts --provider openai --prompt "Explain closures"

# Test Anthropic
npx tsx tools/api-tester.ts --provider anthropic --prompt "What is REST?"

# Use a specific model with streaming
npx tsx tools/api-tester.ts -p openai -q "Hello" -m gpt-4o-mini --stream
```
