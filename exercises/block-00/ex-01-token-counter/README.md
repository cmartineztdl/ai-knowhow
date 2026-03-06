# Exercise 01: Fix the Token Counter

## Objective

The `countTokens` function is supposed to simulate BPE-style tokenization by splitting text into sub-word tokens and counting them. However, it has several bugs that cause incorrect counts.

## What You Need to Do

1. Fix the `countTokens` function so it correctly splits text into tokens
2. Fix the `estimateCost` function so it correctly calculates API cost based on token count

## Hints

- Hint 1: Look carefully at how the vocabulary matching works — is it checking in the right order?
- Hint 2: The cost calculation might have a unit conversion issue
- Hint 3: BPE processes the longest matching vocabulary entries first

---

## 🧭 Related Materials

- 📖 [Theory: Tokenization & Embeddings](../../../docs/block-00/01-tokenization-and-embeddings.md)
- ✅ [Solution & Walkthrough](../../../solutions/block-00/ex-01-token-counter/WALKTHROUGH.md)
