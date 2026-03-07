# Walkthrough: Build a Template Engine

## Problem Summary

The template engine had three bugs: single-brace regex instead of double, defaults overriding provided variables, and conditional blocks always being rendered.

## Approach

Fix each function independently — regex, merge order, and truthiness check.

## Step-by-Step

### Step 1: Fix the variable regex

```diff
-return template.replace(/\{(\w+)\}/g, (_, key) => {
-  return variables[key] ?? `{${key}}`;
+return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
+  if (!(key in variables)) {
+    throw new Error(`Missing template variable: ${key}`);
+  }
+  return variables[key];
```

### Step 2: Fix defaults merge order

```diff
-const merged = { ...variables, ...defaults };
+const merged = { ...defaults, ...variables };
```

### Step 3: Check variable truthiness for conditionals

```diff
-return content;
+const value = variables[key];
+if (value && value.length > 0) {
+  return content;
+}
+return "";
```

## Key Learnings

- `{{double braces}}` require escaped regex: `\{\{(\w+)\}\}`
- Spread order matters: `{ ...defaults, ...overrides }` — last one wins
- Conditional rendering needs explicit **truthiness checks**, not just "always show"

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-02/)
- 🏋️ [Exercise](https://github.com/cmartineztdl/ai-knowhow/tree/main/exercises/block-02/ex-04-template-engine/)
