# Exercise 05: Model Selection Engine

## Objective

Build a model selection engine that recommends the best LLM for a given task based on requirements like reasoning complexity, budget, context size, and privacy needs.

## What You Need to Do

1. Implement the `scoreModel` function that rates a model against requirements
2. Implement the `selectBestModel` function that picks the best model from a catalog
3. Implement the `filterByConstraints` function to exclude models that don't meet hard constraints

## Hints

- Hint 1: Start with `filterByConstraints` — it removes models that violate hard requirements
- Hint 2: For scoring, consider weighting each criterion differently based on the requirements
- Hint 3: A model that is too expensive or too small for the context should score 0
