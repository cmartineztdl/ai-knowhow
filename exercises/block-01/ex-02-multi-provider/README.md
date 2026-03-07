# Exercise 02: Normalize Multi-Provider Responses

## Objective

Build an adapter layer that normalizes responses from both OpenAI and Anthropic into a common format. This is a key pattern for building provider-agnostic applications.

## What You Need to Do

1. Fix the `normalizeOpenAIResponse` function to correctly extract data from OpenAI's response format
2. Fix the `normalizeAnthropicResponse` function to correctly extract data from Anthropic's response format

## Hints

- Hint 1: Check how content blocks are accessed — OpenAI and Anthropic structure them differently
- Hint 2: Anthropic doesn't use `choices` — it uses `content` blocks directly
- Hint 3: The token usage fields have different names in each API

---

## 🧭 Related Materials

- 📖 [Theory: Anthropic API](../../../docs/block-01/02-anthropic-api.md)
- ✅ [Solution & Walkthrough](../../../solutions/block-01/ex-02-multi-provider/WALKTHROUGH.md)
