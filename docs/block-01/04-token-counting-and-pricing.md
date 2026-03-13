---
title: Token Counting & Pricing
description: Learn how to count tokens before calling APIs and estimate costs to keep your AI spending predictable.
keywords: [ai, artificial intelligence, course, free, tokens, pricing, cost estimation, tiktoken, openai, anthropic]
---

import Quiz from '@site/src/components/Quiz';

# Token Counting & Pricing

> Learn how to count tokens before calling APIs and estimate costs to keep your AI spending predictable.

## Introduction

Every API call to an LLM costs money, and the bill is measured in **tokens** — the same tokens you learned about in Block 0. The tricky part is that you pay for both the tokens you _send_ (input/prompt tokens) and the tokens the model _generates_ (output/completion tokens), and these often have different prices.

Estimating costs _before_ making a call lets you build features like "this will cost approximately $0.03 — proceed?" or simply catch runaway costs before they hit your billing dashboard. Think of it like checking a restaurant menu before ordering — you want to know what you're signing up for.

## Core Concepts

### How Pricing Works

LLM APIs charge per token, usually quoted as a **price per million tokens** (or per thousand for older references). Input and output tokens have different rates:

```typescript
// Pricing table (as of early 2025 — always check current prices)
const PRICING = {
  "gpt-4o": { inputPerMillion: 2.50, outputPerMillion: 10.00 },
  "gpt-4o-mini": { inputPerMillion: 0.15, outputPerMillion: 0.60 },
  "claude-3.5-sonnet": { inputPerMillion: 3.00, outputPerMillion: 15.00 },
  "claude-3.5-haiku": { inputPerMillion: 0.80, outputPerMillion: 4.00 },
};

function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: keyof typeof PRICING,
): number {
  const price = PRICING[model];
  const inputCost = (inputTokens / 1_000_000) * price.inputPerMillion;
  const outputCost = (outputTokens / 1_000_000) * price.outputPerMillion;
  return inputCost + outputCost;
}
```

### Counting Tokens with tiktoken

OpenAI's **tiktoken** library gives you exact token counts for OpenAI models. It's the same tokenizer the API uses internally:

```typescript
// npm install tiktoken
import { encoding_for_model } from "tiktoken";

function countTokens(text: string, model: string = "gpt-4o"): number {
  const encoder = encoding_for_model(model as Parameters<typeof encoding_for_model>[0]);
  const tokens = encoder.encode(text);
  const count = tokens.length;
  encoder.free(); // Clean up WASM resources
  return count;
}

const prompt = "Explain the difference between REST and GraphQL.";
console.log(`Tokens: ${countTokens(prompt)}`); // e.g., 9
```

**Important**: `tiktoken` uses WebAssembly, so you must call `encoder.free()` to avoid memory leaks. In production, consider reusing a single encoder instance.

### Counting Message Tokens

A common gotcha: the token count for a chat completion isn't just the text of your messages. Each message has overhead for role markers and formatting:

```typescript
import { encoding_for_model } from "tiktoken";

interface Message {
  role: string;
  content: string;
}

function countMessageTokens(messages: Message[], model: string = "gpt-4o"): number {
  const encoder = encoding_for_model(model as Parameters<typeof encoding_for_model>[0]);
  let totalTokens = 0;

  for (const message of messages) {
    totalTokens += 4; // overhead per message: <|role|>, content, \n, etc.
    totalTokens += encoder.encode(message.role).length;
    totalTokens += encoder.encode(message.content).length;
  }
  totalTokens += 2; // every reply is primed with <|start|>assistant<|message|>

  encoder.free();
  return totalTokens;
}
```

### Quick Estimation without tiktoken

When you don't need exact counts, a quick estimation works:

```typescript
function quickEstimate(text: string): number {
  // Rule of thumb: ~4 characters per token for English
  return Math.ceil(text.length / 4);
}

function wordBasedEstimate(text: string): number {
  // Alternative: ~1.33 tokens per word
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  return Math.ceil(words.length * 1.33);
}
```

These estimates are ballpark — fine for cost alerts, not for hard budgets.

### Reading Usage from API Responses

Both OpenAI and Anthropic return actual token usage in their responses:

```typescript
// OpenAI
const response = await openai.chat.completions.create({ /* ... */ });
console.log(response.usage);
// { prompt_tokens: 25, completion_tokens: 143, total_tokens: 168 }

// Anthropic
const response = await anthropic.messages.create({ /* ... */ });
console.log(response.usage);
// { input_tokens: 20, output_tokens: 130 }
```

![Breakdown diagram showing how input tokens and output tokens contribute to total API cost, with example calculations for different models](images/04-token-pricing-breakdown.webp)

Track these after each call to build your own cost monitoring — don't rely solely on the provider's dashboard.

## Key Takeaways

- You pay for **both input and output tokens** — output is usually more expensive
- Use **tiktoken** for exact OpenAI token counts before calling the API
- Each message in a chat has **~4 tokens of overhead** beyond its text content
- Quick estimates (~4 chars/token or ~1.33 tokens/word) work for ballpark budgeting
- Always **read `usage` from API responses** to track actual costs
- Build cost estimation into your app before expensive calls to avoid bill shock

## Further Reading

- [OpenAI Pricing](https://openai.com/pricing)
- [Anthropic Pricing](https://www.anthropic.com/pricing)
- [tiktoken on npm](https://www.npmjs.com/package/tiktoken)
- [OpenAI Tokenizer tool](https://platform.openai.com/tokenizer)

## Knowledge Check

<Quiz 
  questions={[
    {
      text: "Which statement best describes how most LLM providers charge for API usage?",
      options: [
        "A flat monthly fee for unlimited messages.",
        "You pay based on the time it takes the model to respond.",
        "You are billed for both the tokens you send (input) and the tokens the model generates (output).",
        "Input tokens are free; you only pay for output tokens."
      ],
      correctAnswerIndex: 2,
      explanation: "LLM pricing is almost always consumption-based, charging per token for both the prompt and the completion, often at different rates."
    },
    {
      text: "If you need to calculate the exact number of tokens OpenAI's models will use for a piece of text, which library should you use?",
      options: [
        "lodash",
        "tiktoken",
        "count-tokens-js",
        "dotenv"
      ],
      correctAnswerIndex: 1,
      explanation: "tiktoken is OpenAI's official library for counting tokens exactly as their models do."
    },
    {
      text: "When using the `tiktoken` library in Node.js, what is a crucial step to avoid memory leaks?",
      options: [
        "Reinstalling the package after 1000 calls.",
        "Calling `encoder.free()` after you are done with an encoder instance.",
        "Only using it in small files under 1KB.",
        "Running the script as a root user."
      ],
      correctAnswerIndex: 1,
      explanation: "Because tiktoken uses WebAssembly (WASM), it manages its own memory and requires an explicit `free()` call to release those resources."
    },
    {
      text: "Approximately how much token 'overhead' is added per message in a chat completion beyond just the text of the message?",
      options: [
        "0 tokens",
        "~4 tokens",
        "exactly 10 tokens",
        "100 tokens"
      ],
      correctAnswerIndex: 1,
      explanation: "Chat models use special delimiters to separate roles; for OpenAI models, this typically adds about 3-4 tokens of overhead for every message in the array."
    },
    {
      text: "What is a common 'rule of thumb' for quickly estimating token counts for English text without using a tokenizer library?",
      options: [
        "1 token per character.",
        "10 tokens per word.",
        "About 4 characters per token (or ~1.33 tokens per word).",
        "1 token for every 10 sentences."
      ],
      correctAnswerIndex: 2,
      explanation: "While not exact, the '4 chars per token' rule is a reliable way to get a ballpark estimate for English text."
    }
  ]}
/>


