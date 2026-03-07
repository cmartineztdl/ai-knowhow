# Exercise 05: Implement Input Guardrails

## Objective

Build a comprehensive input validation pipeline for LLM applications: sanitization, injection detection, and rate limiting.

## What You Need to Do

1. Fix the `sanitizeInput` function to properly clean and limit input
2. Fix the `detectInjection` function to catch common injection patterns
3. Fix the `createRateLimiter` function to correctly track and enforce limits

## Hints

- Hint 1: Sanitization should strip control characters AND enforce a max length
- Hint 2: Injection patterns include "ignore previous instructions" and similar phrases
- Hint 3: The rate limiter needs to clean up expired entries from the window

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-02/)
- ✅ [Solution & Walkthrough](https://github.com/cmartineztdl/ai-knowhow/tree/main/solutions/block-02/ex-05-input-guardrails/WALKTHROUGH.md)
