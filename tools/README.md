# AI Know-How Tools

> Reusable CLI utility scripts for working with AI APIs.

## Prerequisites

All tools run with `npx tsx` — no global installs needed.

```bash
npx tsx tools/<tool-name>.ts --help
```

## Available Tools

| Tool                                     | Description                                          | Block | Related Theory                                                                                    |
| ---------------------------------------- | ---------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------- |
| [token-counter.ts](token-counter.ts)     | Estimate token count and API cost for text or files  | 0     | [Tokenization & Embeddings](../docs/block-00/01-tokenization-and-embeddings.md)                   |
| [api-tester.ts](api-tester.ts)           | Quick test calls to OpenAI and Anthropic APIs         | 1     | [OpenAI API](../docs/block-01/01-openai-api.md)                                                  |
| [prompt-tester.ts](prompt-tester.ts)     | Test prompts with different strategies and parameters | 2     | [Zero-Shot, Few-Shot, Chain-of-Thought](../docs/block-02/01-zero-shot-few-shot-chain-of-thought.md) |

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

### Prompt Tester

Test a prompt with different strategies (zero-shot, few-shot, chain-of-thought), models, and parameters.

```bash
# Zero-shot classification
npx tsx tools/prompt-tester.ts -p "Is this positive? 'Great product!'" --strategy zero-shot

# Few-shot with examples
npx tsx tools/prompt-tester.ts -p "Classify: 'It works'" \
  --strategy few-shot \
  -e '["I love it!|positive","Terrible.|negative"]'

# Chain-of-thought for math
npx tsx tools/prompt-tester.ts -p "What is 15% of 80?" --strategy cot

# Dry run to preview messages without calling API
npx tsx tools/prompt-tester.ts -p "Hello" --dry
```
