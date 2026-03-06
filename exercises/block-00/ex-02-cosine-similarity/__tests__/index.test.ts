import { describe, it, expect } from "vitest";
import {
  dotProduct,
  magnitude,
  cosineSimilarity,
  findMostSimilar,
} from "../src/index";

describe("Exercise 02: Implement Cosine Similarity", () => {
  describe("dotProduct", () => {
    it("should compute dot product of two vectors", () => {
      expect(dotProduct([1, 2, 3], [4, 5, 6])).toBe(32);
    });

    it("should return 0 for orthogonal vectors", () => {
      expect(dotProduct([1, 0], [0, 1])).toBe(0);
    });

    it("should handle negative values", () => {
      expect(dotProduct([1, -2], [-3, 4])).toBe(-11);
    });
  });

  describe("magnitude", () => {
    it("should compute magnitude of a simple vector", () => {
      expect(magnitude([3, 4])).toBe(5);
    });

    it("should return 0 for zero vector", () => {
      expect(magnitude([0, 0, 0])).toBe(0);
    });

    it("should handle unit vectors", () => {
      expect(magnitude([1, 0, 0])).toBe(1);
    });
  });

  describe("cosineSimilarity", () => {
    it("should return 1 for identical vectors", () => {
      expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1, 5);
    });

    it("should return 1 for parallel vectors of different magnitudes", () => {
      expect(cosineSimilarity([1, 2, 3], [2, 4, 6])).toBeCloseTo(1, 5);
    });

    it("should return 0 for orthogonal vectors", () => {
      expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0, 5);
    });

    it("should return -1 for opposite vectors", () => {
      expect(cosineSimilarity([1, 2], [-1, -2])).toBeCloseTo(-1, 5);
    });

    it("should return 0 when either vector has zero magnitude", () => {
      expect(cosineSimilarity([0, 0], [1, 2])).toBe(0);
    });
  });

  describe("findMostSimilar", () => {
    it("should return the index of the most similar vector", () => {
      const query = [1, 0, 0];
      const candidates = [
        [0, 1, 0], // orthogonal
        [1, 0.1, 0], // very similar
        [0, 0, 1], // orthogonal
      ];
      expect(findMostSimilar(query, candidates)).toBe(1);
    });

    it("should find exact match", () => {
      const query = [3, 4, 5];
      const candidates = [
        [1, 1, 1],
        [3, 4, 5], // exact match
        [5, 4, 3],
      ];
      expect(findMostSimilar(query, candidates)).toBe(1);
    });
  });
});
