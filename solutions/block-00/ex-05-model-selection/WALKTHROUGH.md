# Walkthrough: Model Selection Engine

## Problem Summary

Three functions needed implementation: filtering models by hard constraints, scoring them against soft requirements, and selecting the best one.

## Approach

Classic filter-then-rank pattern:

1. Eliminate models that fail hard constraints (context size, budget, etc.)
2. Score remaining models using weighted criteria
3. Pick the highest-scoring model

## Step-by-Step

### Step 1: Implement filterByConstraints

Use `.filter()` with each hard constraint as a condition. If any constraint fails, exclude the model:

```typescript
return models.filter((model) => {
  if (model.maxContext < requirements.minContext) return false;
  if (model.costPer1kTokens > requirements.maxCostPer1kTokens) return false;
  // ... more constraints
  return true;
});
```

### Step 2: Implement scoreModel

Normalize each dimension to 0-100, then apply weights:

- **Cost**: `(1 - cost/maxCost) * 100` — lower cost = higher score
- **Quality**: `(reasoning/10) * 100`
- **Speed**: `(speed/10) * 100`

The `prioritize` field determines weights: primary gets 50%, others get 25% each.

### Step 3: Implement selectBestModel

Filter first, then iterate to find the highest score:

```typescript
const candidates = filterByConstraints(catalog, requirements);
if (candidates.length === 0) return null;
// Find highest-scoring candidate
```

## Key Learnings

- Real model selection uses a similar pattern: hard constraints first, then soft ranking
- Weighting criteria lets you express preferences without hard cutoffs
- The "best" model depends entirely on the task — there's no universal answer

---

## 🧭 Related Materials

- 📖 [Theory: Model Landscape](../../../docs/block-00/06-model-landscape.md)
- 🏋️ [Exercise](../../../exercises/block-00/ex-05-model-selection/)
