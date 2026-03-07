# Walkthrough: Normalize Multi-Provider Responses

## Problem Summary

The normalizer functions were reading response data using the wrong provider's format — OpenAI's normalizer tried to access a top-level `content` property (Anthropic style), and Anthropic's normalizer tried to access `choices` (OpenAI style). Additionally, OpenAI's token counts were swapped.

## Approach

Map each provider's unique response structure to the shared `NormalizedResponse` type, being careful about field names that differ.

## Step-by-Step

### Step 1: Fix OpenAI response text extraction

```diff
-text: (response as any).content ?? "",
+text: response.choices[0].message.content,
```

### Step 2: Fix OpenAI token mapping

`prompt_tokens` = input, `completion_tokens` = output:

```diff
-inputTokens: response.usage.completion_tokens,
-outputTokens: response.usage.prompt_tokens,
+inputTokens: response.usage.prompt_tokens,
+outputTokens: response.usage.completion_tokens,
```

### Step 3: Fix Anthropic text extraction

Anthropic returns `content[]` with typed blocks — filter for `type: "text"` and join:

```diff
-text: (response as any).choices?.[0]?.message?.content ?? "",
+text: response.content
+  .filter((block) => block.type === "text")
+  .map((block) => block.text)
+  .join(""),
```

### Step 4: Fix Anthropic finish reason

```diff
-finishReason: (response as any).finish_reason ?? "",
+finishReason: response.stop_reason,
```

## Key Learnings

- OpenAI uses `choices[0].message.content`; Anthropic uses `content[]` blocks
- Token field names differ: `prompt_tokens`/`completion_tokens` vs `input_tokens`/`output_tokens`
- Anthropic uses `stop_reason` not `finish_reason`
- Building adapter layers early saves pain when switching providers

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-01/)
- 🏋️ [Exercise](https://github.com/cmartineztdl/ai-knowhow/tree/main/exercises/block-01/ex-02-multi-provider/)
