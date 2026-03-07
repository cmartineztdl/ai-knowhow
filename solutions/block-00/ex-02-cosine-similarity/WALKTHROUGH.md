# Walkthrough: Implement Cosine Similarity

## Problem Summary

Four functions needed implementation from scratch: `dotProduct`, `magnitude`, `cosineSimilarity`, and `findMostSimilar`.

## Approach

Build bottom-up: dot product and magnitude are the building blocks, cosine similarity combines them, and findMostSimilar iterates over candidates.

## Step-by-Step

### Step 1: Implement dotProduct

The dot product is the sum of element-wise multiplications. Use `reduce` for a clean one-liner:

```typescript
export function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}
```

### Step 2: Implement magnitude

Magnitude is the square root of the dot product of a vector with itself:

```typescript
export function magnitude(v: number[]): number {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}
```

### Step 3: Implement cosineSimilarity

Apply the formula, but guard against division by zero:

```typescript
export function cosineSimilarity(a: number[], b: number[]): number {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dotProduct(a, b) / (magA * magB);
}
```

### Step 4: Implement findMostSimilar

Iterate over candidates, track the best score and its index:

```typescript
let bestIndex = 0;
let bestScore = -Infinity;
for (let i = 0; i < candidates.length; i++) {
  const score = cosineSimilarity(query, candidates[i]);
  if (score > bestScore) {
    bestScore = score;
    bestIndex = i;
  }
}
return bestIndex;
```

## Key Learnings

- Cosine similarity is the fundamental operation behind semantic search
- Always handle the zero-vector edge case — it's mathematically undefined
- This exact math runs behind every embedding-based search system

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-00/)
- 🏋️ [Exercise](https://github.com/cmartineztdl/ai-knowhow/tree/main/exercises/block-00/ex-02-cosine-similarity/)
