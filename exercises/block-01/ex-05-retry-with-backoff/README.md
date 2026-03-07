# Exercise 05: Implement Retry with Backoff

## Objective

Build a retry utility that handles transient API errors with exponential backoff and jitter. This is a critical pattern for building resilient LLM integrations.

## What You Need to Do

1. Fix the `isRetryableError` function to correctly identify which errors are safe to retry
2. Fix the `calculateDelay` function to implement proper exponential backoff with jitter
3. Fix the `withRetry` function to correctly implement the retry loop

## Hints

- Hint 1: Only 429 and 5xx errors should be retried — 4xx client errors should not
- Hint 2: Exponential backoff means the delay doubles each attempt: `baseDelay * 2^attempt`
- Hint 3: The retry loop should stop after maxRetries attempts, not continue forever
- Hint 4: Check the off-by-one — attempt 0 is the first try, not a retry

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-01/)
- ✅ [Solution & Walkthrough](https://github.com/cmartineztdl/ai-knowhow/tree/main/solutions/block-01/ex-05-retry-with-backoff/WALKTHROUGH.md)
