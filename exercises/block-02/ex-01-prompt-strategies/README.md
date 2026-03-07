# Exercise 01: Build a Prompt Strategy Selector

## Objective

Build functions that construct prompts using zero-shot, few-shot, and chain-of-thought strategies. Each function should produce the correctly structured messages array.

## What You Need to Do

1. Fix the `buildZeroShotPrompt` function to return the correct message structure
2. Fix the `buildFewShotPrompt` to properly interleave example pairs
3. Fix the `buildChainOfThoughtPrompt` to include the reasoning instruction

## Hints

- Hint 1: Zero-shot should have exactly two messages — system and user
- Hint 2: Few-shot examples should alternate between user and assistant roles
- Hint 3: Chain-of-thought needs a specific instruction telling the model to reason step by step

---

## 🧭 Related Materials

- 📖 [Theory: Zero-Shot, Few-Shot, Chain-of-Thought](../../../docs/block-02/01-zero-shot-few-shot-chain-of-thought.md)
- ✅ [Solution & Walkthrough](../../../solutions/block-02/ex-01-prompt-strategies/WALKTHROUGH.md)
