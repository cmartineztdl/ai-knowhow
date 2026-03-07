# Exercise 04: Estimate API Costs

## Objective

Build a cost estimation utility that calculates API costs based on token counts and model pricing. The estimator should handle both input and output tokens with their different pricing tiers.

## What You Need to Do

1. Fix the `estimateCallCost` function to correctly calculate costs per million tokens
2. Fix the `estimateConversationCost` function to properly accumulate costs across multiple turns
3. Fix the `formatCostReport` function to produce accurate output

## Hints

- Hint 1: Pricing is typically per million tokens — make sure you're dividing correctly
- Hint 2: The conversation cost estimator might be resetting accumulated tokens incorrectly
- Hint 3: Check the output token estimation — it should be separate from input tokens

---

## 🧭 Related Materials

- 📖 [Theory: Token Counting & Pricing](../../../docs/block-01/04-token-counting-and-pricing.md)
- ✅ [Solution & Walkthrough](../../../solutions/block-01/ex-04-cost-estimator/WALKTHROUGH.md)
