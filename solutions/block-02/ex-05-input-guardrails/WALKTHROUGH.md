# Walkthrough: Implement Input Guardrails

## Problem Summary

The guardrails pipeline had bugs across all three functions: sanitization removed safe whitespace, injection detection was case-sensitive and incomplete, and the rate limiter never denied requests.

## Approach

Fix sanitization regex, add case-insensitive injection patterns, and implement proper sliding-window rate limiting.

## Step-by-Step

### Step 1: Preserve newlines and tabs in sanitization

```diff
-const cleaned = input.replace(/[\x00-\x1F]/g, "");
+const cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
```

The range `\x00-\x1F` includes `\t` (0x09) and `\n` (0x0A). We skip those by excluding 0x09 and 0x0A from the character class.

### Step 2: Enforce max length

```diff
-return cleaned.trim();
+return cleaned.slice(0, maxLength).trim();
```

### Step 3: Add case-insensitive flags and more patterns

```diff
-{ name: "ignore-instructions", regex: /ignore all previous instructions/ },
+{ name: "ignore-instructions", regex: /ignore\s+(all\s+)?previous\s+instructions/i },
+{ name: "disregard", regex: /disregard\s+(the\s+)?(above|previous)/i },
+{ name: "role-override", regex: /you\s+are\s+now\s+a/i },
```

### Step 4: Implement sliding-window rate limiting

```diff
+const validRequests = userRequests.filter((t) => now - t < windowMs);
+if (validRequests.length >= maxRequests) {
+  requests.set(userId, validRequests);
+  return false;
+}
+validRequests.push(now);
+requests.set(userId, validRequests);
-return true;
+return true;
```

## Key Learnings

- Control character ranges need **careful exclusions** for `\n` and `\t`
- Injection detection must be **case-insensitive** and cover multiple phrasings
- Rate limiters need to **clean expired entries** before counting

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-02/)
- 🏋️ [Exercise](https://github.com/cmartineztdl/ai-knowhow/tree/main/exercises/block-02/ex-05-input-guardrails/)
