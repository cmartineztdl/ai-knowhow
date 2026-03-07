# Walkthrough: Enforce Structured Output

## Problem Summary

The structured output pipeline had three categories of bugs: the JSON parser didn't handle code-fenced responses, the validator didn't check enum values or ranges, and the retry loop threw instead of returning defaults.

## Approach

Fix parsing first (needed by the others), then validation, then the retry logic.

## Step-by-Step

### Step 1: Strip code fences before JSON parsing

```diff
-return JSON.parse(raw);
+let cleaned = raw.trim();
+cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?\s*```$/i, "");
+cleaned = cleaned.trim();
+return JSON.parse(cleaned);
```

### Step 2: Validate sentiment enum values and confidence range

```diff
+} else if (!["positive", "negative", "neutral"].includes(obj.sentiment)) {
+  errors.push("sentiment must be positive, negative, or neutral");
 ...
+} else if (obj.confidence < 0 || obj.confidence > 1) {
+  errors.push("confidence must be between 0 and 1");
 ...
-if (!obj.keywords) {
+if (!Array.isArray(obj.keywords)) {
+  errors.push("keywords must be an array");
+} else if (!obj.keywords.every((k) => typeof k === "string")) {
+  errors.push("keywords must contain only strings");
```

### Step 3: Return defaults instead of throwing

```diff
-return parsed as SentimentResult;
+const validation = validateSentiment(parsed);
+if (validation.valid) return parsed as SentimentResult;
 ...
-throw new Error("All attempts failed");
+return defaultValue;
```

## Key Learnings

- LLMs often wrap JSON in **markdown code fences** — always strip them
- Validate **enum values** and **numeric ranges**, not just types
- Retry loops should **degrade gracefully** with defaults, not crash

---

## 🧭 Related Materials

- 📖 [Theory: Output Formatting](../../../docs/block-02/03-output-formatting.md)
- 🏋️ [Exercise](../../../exercises/block-02/ex-03-structured-output/)
