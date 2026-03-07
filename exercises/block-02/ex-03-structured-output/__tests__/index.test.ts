import { describe, it, expect } from "vitest";
import {
  parseJsonOutput,
  validateSentiment,
  extractWithRetry,
} from "../src/index";

describe("Exercise 03: Enforce Structured Output", () => {
  describe("parseJsonOutput", () => {
    it("should parse plain JSON", () => {
      const result = parseJsonOutput('{"key": "value"}');
      expect(result).toEqual({ key: "value" });
    });

    it("should parse JSON wrapped in code fences", () => {
      const raw = '```json\n{"sentiment": "positive", "confidence": 0.9}\n```';
      const result = parseJsonOutput(raw);
      expect(result).toEqual({ sentiment: "positive", confidence: 0.9 });
    });

    it("should handle whitespace around JSON", () => {
      const raw = '  \n  {"key": "value"}  \n  ';
      const result = parseJsonOutput(raw);
      expect(result).toEqual({ key: "value" });
    });

    it("should parse JSON wrapped in plain code fences", () => {
      const raw = '```\n{"data": true}\n```';
      const result = parseJsonOutput(raw);
      expect(result).toEqual({ data: true });
    });

    it("should throw for invalid JSON", () => {
      expect(() => parseJsonOutput("not json")).toThrow();
    });
  });

  describe("validateSentiment", () => {
    it("should accept valid sentiment results", () => {
      const result = validateSentiment({
        sentiment: "positive",
        confidence: 0.85,
        keywords: ["great", "amazing"],
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject invalid sentiment values", () => {
      const result = validateSentiment({
        sentiment: "happy",
        confidence: 0.5,
        keywords: [],
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("sentiment"))).toBe(true);
    });

    it("should reject confidence outside 0-1 range", () => {
      const result = validateSentiment({
        sentiment: "positive",
        confidence: 1.5,
        keywords: ["ok"],
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("confidence"))).toBe(true);
    });

    it("should reject negative confidence", () => {
      const result = validateSentiment({
        sentiment: "neutral",
        confidence: -0.1,
        keywords: [],
      });
      expect(result.valid).toBe(false);
    });

    it("should reject non-array keywords", () => {
      const result = validateSentiment({
        sentiment: "negative",
        confidence: 0.7,
        keywords: "not-an-array",
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("keywords"))).toBe(true);
    });

    it("should reject keywords with non-string elements", () => {
      const result = validateSentiment({
        sentiment: "positive",
        confidence: 0.8,
        keywords: [42, true],
      });
      expect(result.valid).toBe(false);
    });
  });

  describe("extractWithRetry", () => {
    it("should return the first valid result", () => {
      const result = extractWithRetry(
        ['{"sentiment": "positive", "confidence": 0.9, "keywords": ["good"]}'],
        { sentiment: "neutral", confidence: 0, keywords: [] },
      );

      expect(result.sentiment).toBe("positive");
    });

    it("should skip invalid attempts and use the next valid one", () => {
      const result = extractWithRetry(
        [
          "not json",
          '{"sentiment": "negative", "confidence": 0.8, "keywords": ["bad"]}',
        ],
        { sentiment: "neutral", confidence: 0, keywords: [] },
      );

      expect(result.sentiment).toBe("negative");
    });

    it("should return default value when all attempts fail", () => {
      const defaultVal = { sentiment: "neutral" as const, confidence: 0, keywords: [] };
      const result = extractWithRetry(
        ["not json", "also not json"],
        defaultVal,
      );

      expect(result).toEqual(defaultVal);
    });

    it("should return default value for empty attempts", () => {
      const defaultVal = { sentiment: "neutral" as const, confidence: 0, keywords: [] };
      const result = extractWithRetry([], defaultVal);
      expect(result).toEqual(defaultVal);
    });

    it("should validate the parsed output before returning", () => {
      const result = extractWithRetry(
        ['{"sentiment": "happy", "confidence": 2, "keywords": "nope"}'],
        { sentiment: "neutral" as const, confidence: 0, keywords: [] },
      );

      // Invalid sentiment value should be caught, default returned
      expect(result.sentiment).toBe("neutral");
    });
  });
});
