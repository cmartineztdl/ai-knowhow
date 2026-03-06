# Walkthrough: Fix the Token Counter

## Problem Summary

The tokenizer was matching vocabulary entries in the wrong order (shortest first instead of longest first), and the cost calculation multiplied directly by the per-thousand-token price instead of dividing by 1000.

## Approach

Two independent bugs to fix:

1. Sort the vocabulary by token length (descending) before matching
2. Divide the token count by 1000 before multiplying by the price

## Step-by-Step

### Step 1: Identify the tokenization bug

The `VOCABULARY` array contains both "the" and "th". When iterating in original order, "th" might match before "the" because it appears second in the array but the loop would match "the" first since it appears first. However, the real issue is that the loop doesn't guarantee longest-match-first — it depends on array order.

The fix: sort the vocabulary by length (longest first) before matching.

```typescript
const sortedVocab = [...VOCABULARY].sort((a, b) => b.length - a.length);
```

### Step 2: Fix the cost calculation

The price parameter is "per 1000 tokens" but the code was treating it as "per token":

```diff
-const cost = tokens * pricePerThousandTokens;
+const cost = (tokens / 1000) * pricePerThousandTokens;
```

### Step 3: Verify

Run `npx vitest run` — all tokenization tests should show correct greedy matching and cost calculations should be 1000x smaller.

## Key Learnings

- BPE tokenizers are **greedy** — they always match the longest possible token first
- API pricing is always quoted per 1000 (or per million) tokens — always divide accordingly
- The order of iteration matters when doing pattern matching against a vocabulary
