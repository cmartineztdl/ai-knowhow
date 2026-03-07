import { describe, it, expect } from "vitest";
import {
  estimateCallCost,
  estimateConversationCost,
  formatCostReport,
} from "../src/index";

describe("Exercise 04: Estimate API Costs", () => {
  describe("estimateCallCost", () => {
    it("should calculate gpt-4o costs correctly", () => {
      // 1000 input tokens at $2.50/M = $0.0025
      // 500 output tokens at $10.00/M = $0.005
      const estimate = estimateCallCost(1000, 500, "gpt-4o");

      expect(estimate.inputCost).toBeCloseTo(0.0025, 6);
      expect(estimate.outputCost).toBeCloseTo(0.005, 6);
      expect(estimate.totalCost).toBeCloseTo(0.0075, 6);
    });

    it("should calculate gpt-4o-mini costs correctly", () => {
      // 2000 input at $0.15/M = $0.0003
      // 1000 output at $0.60/M = $0.0006
      const estimate = estimateCallCost(2000, 1000, "gpt-4o-mini");

      expect(estimate.inputCost).toBeCloseTo(0.0003, 6);
      expect(estimate.outputCost).toBeCloseTo(0.0006, 6);
      expect(estimate.totalCost).toBeCloseTo(0.0009, 6);
    });

    it("should use different prices for input and output", () => {
      // Same token counts, output should cost more
      const estimate = estimateCallCost(1000, 1000, "gpt-4o");

      expect(estimate.outputCost).toBeGreaterThan(estimate.inputCost);
    });

    it("should throw for unknown models", () => {
      expect(() => estimateCallCost(100, 50, "unknown-model")).toThrow(
        "Unknown model",
      );
    });
  });

  describe("estimateConversationCost", () => {
    it("should accumulate costs across multiple turns", () => {
      const turns = [
        { inputTokens: 100, outputTokens: 50 },
        { inputTokens: 200, outputTokens: 100 },
        { inputTokens: 300, outputTokens: 150 },
      ];

      const estimate = estimateConversationCost(turns, "gpt-4o");

      expect(estimate.inputTokens).toBe(600);
      expect(estimate.outputTokens).toBe(300);
    });

    it("should handle single turn conversations", () => {
      const turns = [{ inputTokens: 500, outputTokens: 200 }];

      const estimate = estimateConversationCost(turns, "gpt-4o");

      expect(estimate.inputTokens).toBe(500);
      expect(estimate.outputTokens).toBe(200);
    });

    it("should handle empty conversations", () => {
      const estimate = estimateConversationCost([], "gpt-4o");

      expect(estimate.totalCost).toBe(0);
    });
  });

  describe("formatCostReport", () => {
    it("should produce a readable cost report", () => {
      const estimate = {
        inputTokens: 1000,
        outputTokens: 500,
        inputCost: 0.0025,
        outputCost: 0.005,
        totalCost: 0.0075,
      };

      const report = formatCostReport(estimate);

      expect(report).toContain("1000 input");
      expect(report).toContain("500 output");
      expect(report).toContain("$0.002500");
      expect(report).toContain("$0.005000");
      expect(report).toContain("$0.007500");
    });
  });
});
