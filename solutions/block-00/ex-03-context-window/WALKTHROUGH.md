# Walkthrough: Build a Context Window Manager

## Problem Summary

Three functions needed implementation: token estimation, conversation trimming, and context window assembly.

## Approach

1. Estimate tokens with a simple character-based heuristic (1 token ≈ 4 chars)
2. For trimming, always reserve space for the system prompt and output, then greedily add messages from newest to oldest
3. The assembly function wraps the system prompt as a message and delegates to trimming

## Step-by-Step

### Step 1: Implement estimateTokens

Simple division with ceiling:

```typescript
export function estimateTokens(text: string): number {
  if (text.length === 0) return 0;
  return Math.ceil(text.length / 4);
}
```

### Step 2: Implement trimConversation

The key insight is working backwards from the newest message:

1. Separate the system prompt from history
2. Calculate remaining budget: `maxTokens - systemTokens - outputReserve`
3. Iterate from newest to oldest, adding messages that fit
4. Track selected indices and reconstruct in chronological order

### Step 3: Implement createContextWindow

Wraps the string system prompt as a Message and delegates:

```typescript
const systemMessage: Message = { role: "system", content: systemPrompt };
return trimConversation([systemMessage, ...history], maxTokens, outputReserve);
```

## Key Learnings

- Real applications must actively manage context windows — it's not automatic
- Newest messages are usually more relevant than oldest ones
- The system prompt is non-negotiable — it always stays
- The 1:4 chars-to-tokens ratio is a rough but useful approximation for English text

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-00/)
- 🏋️ [Exercise](https://github.com/cmartineztdl/ai-knowhow/tree/main/exercises/block-00/ex-03-context-window/)
