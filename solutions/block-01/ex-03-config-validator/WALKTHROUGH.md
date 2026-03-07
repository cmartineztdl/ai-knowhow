# Walkthrough: Validate API Configuration

## Problem Summary

Three bugs: the length check was inverted (rejected long keys instead of short ones), the regex didn't accept hyphens/underscores, and the provider detection checked the generic `sk-` prefix before the specific `sk-ant-` prefix, causing Anthropic keys to be misidentified.

## Approach

Fix each validation function independently.

## Step-by-Step

### Step 1: Fix the length check

The original checked `key.length > 20` (rejecting long keys). It should reject short keys:

```diff
-if (key.length > 20) {
+if (key.length < 20) {
```

### Step 2: Fix the regex pattern

Real API keys contain hyphens and underscores, not just alphanumeric characters:

```diff
-const validPattern = /^sk-[a-zA-Z0-9]+$/;
+const validPattern = /^sk-[a-zA-Z0-9_-]+$/;
```

### Step 3: Fix provider detection order

`"sk-ant-..."` starts with `"sk-"`, so the generic check must come after the specific one:

```diff
-if (key.startsWith("sk-")) {
-  return "openai";
-}
-if (key.startsWith("sk-ant-")) {
-  return "anthropic";
-}
+if (key.startsWith("sk-ant-")) {
+  return "anthropic";
+}
+if (key.startsWith("sk-")) {
+  return "openai";
+}
```

## Key Learnings

- Always check **specific patterns before general ones** in if/else chains
- API keys can contain more than just alphanumeric characters — test with real formats
- Fail-fast validation at startup prevents confusing errors at runtime

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-01/)
- 🏋️ [Exercise](https://github.com/cmartineztdl/ai-knowhow/tree/main/exercises/block-01/ex-03-config-validator/)
