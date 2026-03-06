/**
 * Solution: Implement Cosine Similarity
 *
 * Approach: Build from primitives (dot product → magnitude → cosine similarity)
 * and handle the zero-vector edge case.
 */

/**
 * Compute the dot product of two vectors.
 */
export function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

/**
 * Compute the magnitude (Euclidean length) of a vector.
 */
export function magnitude(v: number[]): number {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

/**
 * Compute the cosine similarity between two vectors.
 * Returns 0 if either vector has zero magnitude to avoid division by zero.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  const magA = magnitude(a);
  const magB = magnitude(b);

  // Handle zero-magnitude vectors
  if (magA === 0 || magB === 0) return 0;

  return dotProduct(a, b) / (magA * magB);
}

/**
 * Find the most similar vector to a query from a list of candidates.
 * Returns the index of the most similar candidate.
 */
export function findMostSimilar(
  query: number[],
  candidates: number[][],
): number {
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
}
