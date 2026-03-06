# Exercise 04: Configure Inference Parameters

## Objective

Build a parameter configuration system that selects the right inference parameters for different use cases. The configurator should know that code generation needs low temperature, creative writing needs high temperature, etc.

## What You Need to Do

1. Fix the `getParametersForUseCase` function — the parameter mappings are wrong
2. Implement the `validateParameters` function to enforce valid ranges
3. Implement the `mergeWithDefaults` function

## Hints

- Hint 1: Code generation should be deterministic (low temperature), not creative
- Hint 2: Temperature range is 0–2, top_p is 0–1
- Hint 3: The merge function should let user overrides take precedence over defaults
