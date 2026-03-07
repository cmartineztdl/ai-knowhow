# Walkthrough: Build a Chat Completions Client

## Problem Summary

The chat completions client had three bugs: the system prompt was appended at the end of the messages array instead of the beginning, `max_tokens` was incorrectly divided by 2, and the response extractor read from the wrong property path.

## Approach

Fix each bug independently — they're all straightforward once you understand the OpenAI Chat Completions API structure.

## Step-by-Step

### Step 1: Fix system prompt placement

The system message must be the **first** message in the array. The original code appended it at the end:

```diff
-const messages: ChatMessage[] = [...userMessages];
-messages.push({ role: "system", content: systemPrompt });
+const messages: ChatMessage[] = [
+  { role: "system", content: systemPrompt },
+  ...userMessages,
+];
```

### Step 2: Fix max_tokens

The original code divided `maxTokens` by 2 for no reason:

```diff
-max_tokens: maxTokens / 2,
+max_tokens: maxTokens,
```

### Step 3: Fix response extraction

The original code tried to read `response.message.content` but OpenAI nests the reply inside `choices[0].message.content`:

```diff
-const reply = (response as any).message?.content;
+return response.choices[0]?.message?.content ?? "";
```

### Step 4: Fix truncation detection

A `finish_reason` of `"length"` means the response was cut off, while `"stop"` means it completed naturally:

```diff
-return response.choices[0].finish_reason === "stop";
+return response.choices[0].finish_reason === "length";
```

## Key Learnings

- The **system message** must always be first — it sets the model's behavior
- OpenAI responses use `choices[0].message.content`, not a top-level `message` property
- `finish_reason: "length"` means truncated; `"stop"` means natural completion

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-01/)
- 🏋️ [Exercise](https://github.com/cmartineztdl/ai-knowhow/tree/main/exercises/block-01/ex-01-chat-completions/)
