# Exercise 03: Validate API Configuration

## Objective

Build a configuration validator that checks for required API keys, validates their format, and provides clear error messages for missing or malformed configuration.

## What You Need to Do

1. Fix the `validateApiKey` function to properly validate key format patterns
2. Fix the `loadConfig` function to correctly read and validate all configuration
3. Fix the `getProviderFromKey` function to correctly identify the provider from a key prefix

## Hints

- Hint 1: OpenAI keys start with "sk-" and Anthropic keys start with "sk-ant-"
- Hint 2: The regex patterns may be checking the wrong thing
- Hint 3: Check the order of validation — more specific patterns should be checked first

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-01/)
- ✅ [Solution & Walkthrough](https://github.com/cmartineztdl/ai-knowhow/tree/main/solutions/block-01/ex-03-config-validator/WALKTHROUGH.md)
