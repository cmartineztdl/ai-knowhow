# Walkthrough: Build a Prompt Strategy Selector

## Problem Summary

Three functions for building prompts using different strategies had bugs: wrong message ordering, incorrect role assignments, and missing content.

## Approach

Fix each function independently — they all deal with constructing the `messages` array correctly.

## Step-by-Step

### Step 1: Fix zero-shot — system first, no empty assistant

The original code put the user message first and added an empty assistant message:

```diff
-return [
-  { role: "user", content: userQuery },
-  { role: "system", content: systemPrompt },
-  { role: "assistant", content: "" },
-];
+return [
+  { role: "system", content: systemPrompt },
+  { role: "user", content: userQuery },
+];
```

### Step 2: Fix few-shot — user/assistant pairs + query

Examples were added as system messages and the user query was missing:

```diff
-messages.push({ role: "system", content: `Input: ${example.input}\nOutput: ${example.output}` });
+messages.push({ role: "user", content: example.input });
+messages.push({ role: "assistant", content: example.output });
 ...
+messages.push({ role: "user", content: userQuery });
```

### Step 3: Fix CoT — reasoning instruction in system prompt

The reasoning instruction was a separate user message with the wrong text:

```diff
-{ role: "user", content: "Answer directly without explanation." },
-{ role: "user", content: userQuery },
+{ role: "system", content: `${systemPrompt}\n\nThink step by step before giving your final answer.` },
+{ role: "user", content: userQuery },
```

## Key Learnings

- System message must always be **first** in the messages array
- Few-shot examples use **user/assistant** pairs, never system messages
- CoT instructions belong in the **system prompt**, not as user messages

---

## 🧭 Related Materials

- 📖 [Theory: Zero-Shot, Few-Shot, Chain-of-Thought](../../../docs/block-02/01-zero-shot-few-shot-chain-of-thought.md)
- 🏋️ [Exercise](../../../exercises/block-02/ex-01-prompt-strategies/)
