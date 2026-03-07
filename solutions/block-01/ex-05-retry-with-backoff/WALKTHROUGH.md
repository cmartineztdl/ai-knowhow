# Walkthrough: Implement Retry with Backoff

## Problem Summary

The retry utility had four bugs: `isRetryableError` treated all 4xx+ errors as retryable, `calculateDelay` used linear instead of exponential backoff without a max cap, and `withRetry` had an off-by-one error in the loop bound and didn't check error retryability.

## Approach

Fix each function independently, then verify they compose correctly.

## Step-by-Step

### Step 1: Fix error classification

Only 429 (rate limit) and 5xx (server errors) should be retried:

```diff
-return error.status >= 400;
+return error.status === 429 || (error.status >= 500 && error.status < 600);
```

### Step 2: Fix exponential backoff

Use `Math.pow(2, attempt)` instead of linear multiplication, and cap with `Math.min`:

```diff
-const delay = options.baseDelayMs * attempt;
-return delay;
+const delay = options.baseDelayMs * Math.pow(2, attempt);
+return Math.min(delay, options.maxDelayMs);
```

### Step 3: Fix the retry loop

Fix the off-by-one (remove `+ 1` from loop bound) and add retryability check:

```diff
-for (let attempt = 0; attempt <= options.maxRetries + 1; attempt++) {
+for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
```

```diff
+if (!isRetryableError(lastError)) {
+  throw lastError;
+}
```

## Key Learnings

- **Only retry transient errors** — retrying a 401 is wasted time
- **Exponential backoff** (1s → 2s → 4s → 8s) gives servers breathing room
- **Cap the delay** to prevent absurdly long waits
- Watch for **off-by-one errors** in retry loops — first call + N retries = N+1 total attempts

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-01/)
- 🏋️ [Exercise](https://github.com/cmartineztdl/ai-knowhow/tree/main/exercises/block-01/ex-05-retry-with-backoff/)
