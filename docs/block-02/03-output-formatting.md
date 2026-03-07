# Output Formatting

> Learn how to get LLMs to return structured, machine-readable output every time.

## Introduction

Getting free-text answers from an LLM is easy. Getting a perfectly formatted JSON object that your code can actually parse? That's where things get interesting. Unstructured output is fine for chatbots, but the moment you need to feed model output into another system — a database, a UI component, an API — you need structure.

The good news: modern LLMs and APIs now offer built-in tools for structured output. Between JSON mode, response schemas, and good old-fashioned prompt engineering, you can get machine-readable output reliably. The trick is knowing which tool to reach for and when.

Think of it as the difference between asking a colleague to "describe the bug" versus asking them to "fill out this bug report template." Same information, wildly different usability.

## Core Concepts

### JSON Mode

Both OpenAI and Anthropic offer a **JSON mode** that guarantees the output is valid JSON (though not necessarily the JSON you want):

```typescript
// OpenAI JSON mode
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  response_format: { type: "json_object" },
  messages: [
    {
      role: "system",
      content:
        'Analyze the sentiment of the given text. Respond with JSON: {"sentiment": "positive"|"negative"|"neutral", "confidence": 0-1}',
    },
    {
      role: "user",
      content: "This product changed my life. Absolutely incredible.",
    },
  ],
});

const result = JSON.parse(response.choices[0].message.content);
// { sentiment: "positive", confidence: 0.95 }
```

JSON mode ensures valid JSON but doesn't enforce a specific schema. You need to describe the shape in your prompt.

### Structured Output with Schemas

OpenAI's **Structured Outputs** go further — you define a JSON Schema and the model is guaranteed to match it:

```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "sentiment_analysis",
      strict: true,
      schema: {
        type: "object",
        properties: {
          sentiment: {
            type: "string",
            enum: ["positive", "negative", "neutral"],
          },
          confidence: { type: "number" },
          keywords: { type: "array", items: { type: "string" } },
        },
        required: ["sentiment", "confidence", "keywords"],
        additionalProperties: false,
      },
    },
  },
  messages: [
    { role: "user", content: "Analyze: 'The food was good but the service was slow.'" },
  ],
});
```

With `strict: true`, the output is **guaranteed** to conform to your schema. No parsing errors, no missing fields, no surprises.

### Prompt-Based Formatting

When API-level features aren't available (or you want provider-agnostic code), use the prompt itself to enforce format:

```typescript
const systemPrompt = `You are a data extraction assistant.

IMPORTANT: Always respond with ONLY valid JSON, no markdown, no prose.
Use this exact schema:
{
  "entities": [
    {
      "name": "<string>",
      "type": "person" | "company" | "location",
      "confidence": <number 0-1>
    }
  ]
}

If no entities are found, return: {"entities": []}`;
```

Combine this with few-shot examples (from topic 01) for even more reliable formatting.

### Parsing and Validation in Code

Never trust model output blindly — even with JSON mode. Always validate:

```typescript
import { z } from "zod";

// Define your schema with Zod
const SentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  confidence: z.number().min(0).max(1),
  keywords: z.array(z.string()),
});

type SentimentResult = z.infer<typeof SentimentSchema>;

function parseSentiment(raw: string): SentimentResult {
  const parsed = JSON.parse(raw);
  return SentimentSchema.parse(parsed); // throws ZodError if invalid
}
```

**Zod** is the go-to library for runtime schema validation in TypeScript. It gives you type safety and runtime validation in one place.

### Markdown and Custom Formats

Not everything needs to be JSON. Sometimes you want the model to output markdown tables, XML, YAML, or custom delimited formats:

```typescript
const systemPrompt = `Respond using this exact format:

SUMMARY: <one sentence>
CATEGORY: <bug|feature|question>
PRIORITY: <low|medium|high>
TAGS: <comma-separated list>`;
```

For custom formats, parse them with simple string operations or regex. The key is being extremely explicit about the format in the prompt and validating the output in code.

## Visual Aids

![Diagram showing the spectrum of output formatting approaches: from prompt-based hints on the left through JSON mode in the middle to strict schema enforcement on the right, with reliability increasing left to right](images/03-output-formatting-spectrum.webp)

## Key Takeaways

- **JSON mode** ensures valid JSON but doesn't enforce a specific structure
- **Structured Outputs** (with JSON Schema) guarantee the exact shape you need
- **Prompt-based formatting** works across providers but is less reliable on its own
- Always **validate** model output with a runtime library like Zod
- Mix strategies: use API features when available, fall back to prompt-based when not

## Further Reading

- [OpenAI — Structured Outputs Guide](https://platform.openai.com/docs/guides/structured-outputs)
- [OpenAI — JSON Mode](https://platform.openai.com/docs/guides/text-generation/json-mode)
- [Zod — TypeScript Schema Validation](https://zod.dev/)
- [Anthropic — Tool Use for Structured Output](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)

---

## 🧭 Navigation

### Practice This

- 🏋️ [Exercise: Enforce Structured Output](pathname:///exercises/block-02/ex-03-structured-output/)

### Continue Reading

- ⬅️ Previous: [System vs User vs Assistant Roles](02-system-vs-user-vs-assistant-roles.md)
- ➡️ Next: [Prompt Templates & Variables](04-prompt-templates-and-variables.md)
- 📚 [Back to Block Index](README.md)
