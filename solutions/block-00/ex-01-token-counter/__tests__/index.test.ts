import { describe, it, expect } from "vitest";
import { tokenize, countTokens, estimateCost } from "../src/index";

describe("Exercise 01: Fix the Token Counter", () => {
  describe("tokenize", () => {
    it("should match the longest vocabulary entry first", () => {
      const tokens = tokenize("the");
      // "the" should be one token, not ["th", "e"]
      expect(tokens).toEqual(["the"]);
    });

    it("should tokenize a multi-word string", () => {
      const tokens = tokenize("the quick");
      expect(tokens).toEqual(["the", " ", "quick"]);
    });

    it("should handle words not fully in vocabulary", () => {
      const tokens = tokenize("the fox jumps");
      expect(tokens).toEqual(["the", " ", "fox", " ", "jumps"]);
    });

    it("should handle unknown characters as individual tokens", () => {
      const tokens = tokenize("the!");
      expect(tokens).toEqual(["the", "!"]);
    });
  });

  describe("countTokens", () => {
    it("should count tokens correctly for simple text", () => {
      expect(countTokens("the quick")).toBe(3);
    });

    it("should count tokens for text with unknown chars", () => {
      expect(countTokens("the fox!")).toBe(4); // "the", " ", "fox", "!"
    });
  });

  describe("estimateCost", () => {
    it("should calculate cost per 1000 tokens correctly", () => {
      // "the quick" = 3 tokens, at $0.01 per 1000 tokens
      const cost = estimateCost("the quick", 0.01);
      expect(cost).toBeCloseTo(0.00003, 5); // 3/1000 * 0.01
    });

    it("should handle larger texts", () => {
      // "the fox jumps" = 5 tokens, at $0.002 per 1000 tokens
      const cost = estimateCost("the fox jumps", 0.002);
      expect(cost).toBeCloseTo(0.00001, 5); // 5/1000 * 0.002
    });
  });
});
