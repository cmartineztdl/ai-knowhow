# Exercise 04: Build a Template Engine

## Objective

Build a simple prompt template engine that supports variable substitution, conditional sections, and default values.

## What You Need to Do

1. Fix the `renderTemplate` function to correctly replace `{{variable}}` placeholders
2. Fix the `renderWithDefaults` function to apply default values for missing variables
3. Fix the `renderConditional` function to handle `{{#if var}}...{{/if}}` blocks

## Hints

- Hint 1: The regex for matching variables needs to handle word characters properly
- Hint 2: Defaults should only fill in variables that aren't explicitly provided
- Hint 3: Conditional blocks should be removed entirely when the variable is falsy

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-02/)
- ✅ [Solution & Walkthrough](https://github.com/cmartineztdl/ai-knowhow/tree/main/solutions/block-02/ex-04-template-engine/WALKTHROUGH.md)
