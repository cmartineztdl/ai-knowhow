---
title: Anthropic API Guide
description: Learn how to interact with Claude models via the Anthropic Messages API, shape behavior with system prompts, and use tool calling.
keywords: [ai, artificial intelligence, course, free, anthropic, api, claude, messages api, system prompts, tool use, typescript]
---

import Quiz from '@site/src/components/Quiz';

# Anthropic API

> Learn how to interact with Claude models via the Anthropic Messages API, shape behavior with system prompts, and use tool calling.

## Introduction

Anthropic's Claude models (Claude 3.5 Sonnet, Claude 3.5 Haiku, etc.) offer a different flavor of LLM interaction. While the core idea is the same — send messages, get replies — the API design has some meaningful differences from OpenAI. Anthropic separates the system prompt from messages, uses a slightly different tool-calling pattern, and has its own SDK conventions.

Understanding both APIs makes you API-agnostic: you can pick the best model for each task without being locked into a single provider. Think of it like knowing both PostgreSQL and MySQL — the concepts transfer, but the syntax matters when shipping code.

## Core Concepts

### Installing the SDK

Anthropic provides an official TypeScript SDK:

```typescript
// npm install @anthropic-ai/sdk
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

### The Messages API

Anthropic's core endpoint is the **Messages API**. Unlike OpenAI, the `system` prompt is a top-level parameter, not a message in the array:

```typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  system: "You are a helpful coding assistant specialized in TypeScript.",
  messages: [
    { role: "user", content: "Explain the difference between type and interface." },
  ],
});

// Response structure differs from OpenAI
const reply = response.content[0]; // ContentBlock
if (reply.type === "text") {
  console.log(reply.text);
}
```

Key differences from OpenAI:
- `system` is a **separate parameter**, not a message with `role: "system"`
- `max_tokens` is **required** (OpenAI defaults it)
- The response uses `content` (array of content blocks), not `choices`

### System Prompts in Depth

Anthropic's system prompt separation reflects their design philosophy — it's a first-class instruction set, not just the first message. This makes it particularly effective for:

```typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  system: `You are a senior TypeScript code reviewer.
Rules:
- Only point out actual bugs, not style preferences
- Rate severity: low / medium / high / critical
- Always suggest a fix, never just complain
- Respond in JSON format: { "issues": [{ "severity", "line", "description", "fix" }] }`,
  messages: [
    { role: "user", content: "Review this code:\n\n```typescript\nconst data = fetch('/api');\nconsole.log(data.json());\n```" },
  ],
});
```

### Multi-turn Conversations

Like OpenAI, you accumulate messages for multi-turn chats. Anthropic enforces strict **alternating roles** — `user` and `assistant` must alternate:

```typescript
const messages: Anthropic.MessageParam[] = [];

async function chat(userMessage: string): Promise<string> {
  messages.push({ role: "user", content: userMessage });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: "You are a concise TypeScript tutor.",
    messages,
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  messages.push({ role: "assistant", content: text });
  return text;
}
```

### Tool Use

Anthropic calls function calling **"tool use"**. The concept is the same — you define tools, the model decides when to call them — but the API shape differs:

```typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: "What's the weather in Barcelona?" }],
  tools: [
    {
      name: "get_weather",
      description: "Get current weather for a city",
      input_schema: {
        type: "object",
        properties: {
          city: { type: "string", description: "The city name" },
          units: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "Temperature units",
          },
        },
        required: ["city"],
      },
    },
  ],
});

// Check for tool use in response
for (const block of response.content) {
  if (block.type === "tool_use") {
    console.log(`Call ${block.name} with`, block.input);
    // { city: "Barcelona", units: "celsius" }
  }
}
```

![Diagram comparing OpenAI and Anthropic API request structures side by side, showing how system prompts, messages, and tool definitions differ between the two](images/02-anthropic-vs-openai.webp)

Notice: Anthropic uses `input_schema` (not `parameters`), and tool calls come as content blocks with `type: "tool_use"` (not a separate `tool_calls` array).

## Key Takeaways

- Anthropic's **Messages API** separates the `system` prompt from the message array
- `max_tokens` is **required** — there's no default
- Responses use `content[]` blocks instead of `choices[]`
- **Tool use** follows the same pattern as OpenAI's function calling but with different field names
- Multi-turn conversations **must alternate** between `user` and `assistant` roles
- Learning both APIs makes you provider-agnostic and lets you pick the best model per task

## Further Reading

- [Anthropic API Reference — Messages](https://docs.anthropic.com/en/api/messages)
- [Anthropic Tool Use Guide](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Anthropic SDK for TypeScript](https://github.com/anthropics/anthropic-sdk-typescript)
- [Claude Model Comparison](https://docs.anthropic.com/en/docs/about-claude/models)

## Knowledge Check

<Quiz 
  questions={[
    {
      text: "How does the placement of the 'system prompt' in the Anthropic Messages API differ from the OpenAI Chat Completions API?",
      options: [
        "Anthropic puts the system prompt inside the messages array with a special role.",
        "Anthropic uses a separate top-level 'system' parameter instead of including it in the messages array.",
        "Anthropic does not support system prompts at all.",
        "Anthropic requires system prompts to be sent as a separate HTTP header."
      ],
      correctAnswerIndex: 1,
      explanation: "In the Anthropic SDK, the system prompt is a dedicated parameter at the top level of the request object, not a message role within the 'messages' array."
    },
    {
      text: "Which parameter is strictly REQUIRED when making a request to the Anthropic Messages API?",
      options: [
        "temperature",
        "stop_sequences",
        "max_tokens",
        "top_p"
      ],
      correctAnswerIndex: 2,
      explanation: "Unlike some other providers that provide a default, Anthropic requires you to explicitly specify a 'max_tokens' value for every request."
    },
    {
      text: "What restriction does Anthropic place on the order of messages in a conversation history?",
      options: [
        "There are no restrictions on message order.",
        "Messages must always start and end with an assistant role.",
        "Messages must strictly alternate between 'user' and 'assistant' roles.",
        "All user messages must come before all assistant messages."
      ],
      correctAnswerIndex: 2,
      explanation: "Anthropic's API enforces that the roles in the messages array must alternate: user, then assistant, then user, etc."
    },
    {
      text: "What is Anthropic's term for 'Function Calling', and how are these calls returned?",
      options: [
        "They call it 'Smart Actions' and return them in a separate array.",
        "They call it 'Tool Use' and return them as blocks within the same content array as text.",
        "They call it 'External Plugins' and return them as a JSON-only response.",
        "They call it 'Logic Blocks' and return them via a separate webhook."
      ],
      correctAnswerIndex: 1,
      explanation: "Anthropic calls the feature 'tool use' and integrates the model's call directly into the response's content array as a block with `type: 'tool_use'`."
    },
    {
      text: "What is a key benefit of learning multiple provider APIs like OpenAI and Anthropic?",
      options: [
        "It is required by law for AI developers.",
        "It makes you provider-agnostic, allowing you to choose the best model for a specific task without being locked in.",
        "It automatically reduces your API billing costs by 50%.",
        "It allows you to combine models from different companies into a single neural network."
      ],
      correctAnswerIndex: 1,
      explanation: "Mastering different APIs gives you the flexibility to switch models based on performance, cost, or specific features (like context window size) as your application's needs evolve."
    }
  ]}
/>

