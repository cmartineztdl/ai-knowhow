# Walkthrough: Estimate API Costs

## Problem Summary

The cost estimator had three bugs: it divided by 1,000 instead of 1,000,000 (pricing is per million tokens), it used the input price for both input and output tokens, and the conversation cost function reset totals each iteration instead of accumulating.

## Approach

Fix the divisor, use separate pricing tiers, and change `=` to `+=` in the loop.

## Step-by-Step

### Step 1: Fix the divisor

API pricing is per **million** tokens, not per thousand:

```diff
-const inputCost = (inputTokens / 1_000) * pricing.inputPerMillion;
+const inputCost = (inputTokens / 1_000_000) * pricing.inputPerMillion;
```

### Step 2: Use correct output pricing

Output tokens have their own (usually higher) price:

```diff
-const outputCost = (outputTokens / 1_000) * pricing.inputPerMillion;
+const outputCost = (outputTokens / 1_000_000) * pricing.outputPerMillion;
```

### Step 3: Accumulate conversation tokens

The loop was resetting totals each iteration:

```diff
-totalInputTokens = turn.inputTokens;
-totalOutputTokens = turn.outputTokens;
+totalInputTokens += turn.inputTokens;
+totalOutputTokens += turn.outputTokens;
```

## Key Learnings

- Always double-check your **units** — per-thousand vs per-million is a 1000x difference
- Output tokens typically cost **3-5x more** than input tokens
- The `=` vs `+=` bug is a classic and easy to miss — always accumulate in loops

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-01/)
- 🏋️ [Exercise](https://github.com/cmartineztdl/ai-knowhow/tree/main/exercises/block-01/ex-04-cost-estimator/)
