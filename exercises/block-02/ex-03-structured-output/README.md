# Exercise 03: Enforce Structured Output

## Objective

Build functions that enforce structured JSON output from LLM responses: parse raw output, validate against a schema, and handle failures gracefully.

## What You Need to Do

1. Fix the `parseJsonOutput` function to correctly extract JSON from model responses
2. Fix the `validateOutput` function to properly check required fields and types
3. Fix the `extractWithFallback` function to retry with a corrected prompt

## Hints

- Hint 1: Model responses sometimes include markdown code fences around JSON
- Hint 2: The validator should check types, not just existence of fields
- Hint 3: The fallback function should return the default value on the last attempt, not throw

---

## 🧭 Related Materials

- 📖 [Theory: Output Formatting](../../../docs/block-02/03-output-formatting.md)
- ✅ [Solution & Walkthrough](../../../solutions/block-02/ex-03-structured-output/WALKTHROUGH.md)
