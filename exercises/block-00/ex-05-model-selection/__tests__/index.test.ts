import { describe, it, expect } from "vitest";
import {
  filterByConstraints,
  scoreModel,
  selectBestModel,
  ModelSpec,
  TaskRequirements,
} from "../src/index";

const CATALOG: ModelSpec[] = [
  {
    name: "gpt-4o",
    provider: "openai",
    maxContext: 128000,
    costPer1kTokens: 0.005,
    reasoningScore: 9,
    speedScore: 7,
    multimodal: true,
    openSource: false,
  },
  {
    name: "gpt-4o-mini",
    provider: "openai",
    maxContext: 128000,
    costPer1kTokens: 0.00015,
    reasoningScore: 7,
    speedScore: 9,
    multimodal: true,
    openSource: false,
  },
  {
    name: "claude-3.5-sonnet",
    provider: "anthropic",
    maxContext: 200000,
    costPer1kTokens: 0.003,
    reasoningScore: 9,
    speedScore: 8,
    multimodal: true,
    openSource: false,
  },
  {
    name: "llama-3-70b",
    provider: "meta",
    maxContext: 8000,
    costPer1kTokens: 0.0,
    reasoningScore: 8,
    speedScore: 5,
    multimodal: false,
    openSource: true,
  },
  {
    name: "gemini-1.5-flash",
    provider: "google",
    maxContext: 1000000,
    costPer1kTokens: 0.000075,
    reasoningScore: 6,
    speedScore: 10,
    multimodal: true,
    openSource: false,
  },
];

describe("Exercise 05: Model Selection Engine", () => {
  describe("filterByConstraints", () => {
    it("should return all models when constraints are loose", () => {
      const requirements: TaskRequirements = {
        minContext: 1000,
        maxCostPer1kTokens: 1,
        minReasoningScore: 1,
        needsMultimodal: false,
        needsOpenSource: false,
        prioritize: "quality",
      };
      expect(filterByConstraints(CATALOG, requirements).length).toBe(5);
    });

    it("should filter by minimum context window", () => {
      const requirements: TaskRequirements = {
        minContext: 100000,
        maxCostPer1kTokens: 1,
        minReasoningScore: 1,
        needsMultimodal: false,
        needsOpenSource: false,
        prioritize: "quality",
      };
      const result = filterByConstraints(CATALOG, requirements);
      // llama-3-70b has only 8000 context → excluded
      expect(result.every((m) => m.maxContext >= 100000)).toBe(true);
      expect(result.find((m) => m.name === "llama-3-70b")).toBeUndefined();
    });

    it("should filter by open source requirement", () => {
      const requirements: TaskRequirements = {
        minContext: 1000,
        maxCostPer1kTokens: 1,
        minReasoningScore: 1,
        needsMultimodal: false,
        needsOpenSource: true,
        prioritize: "quality",
      };
      const result = filterByConstraints(CATALOG, requirements);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe("llama-3-70b");
    });

    it("should filter by multimodal requirement", () => {
      const requirements: TaskRequirements = {
        minContext: 1000,
        maxCostPer1kTokens: 1,
        minReasoningScore: 1,
        needsMultimodal: true,
        needsOpenSource: false,
        prioritize: "quality",
      };
      const result = filterByConstraints(CATALOG, requirements);
      expect(result.every((m) => m.multimodal)).toBe(true);
      expect(result.find((m) => m.name === "llama-3-70b")).toBeUndefined();
    });

    it("should filter by budget", () => {
      const requirements: TaskRequirements = {
        minContext: 1000,
        maxCostPer1kTokens: 0.001,
        minReasoningScore: 1,
        needsMultimodal: false,
        needsOpenSource: false,
        prioritize: "cost",
      };
      const result = filterByConstraints(CATALOG, requirements);
      expect(result.every((m) => m.costPer1kTokens <= 0.001)).toBe(true);
    });
  });

  describe("scoreModel", () => {
    const baseReqs: TaskRequirements = {
      minContext: 1000,
      maxCostPer1kTokens: 0.01,
      minReasoningScore: 1,
      needsMultimodal: false,
      needsOpenSource: false,
      prioritize: "quality",
    };

    it("should score higher for better reasoning when prioritizing quality", () => {
      const gpt4oScore = scoreModel(CATALOG[0], baseReqs); // reasoning: 9
      const miniScore = scoreModel(CATALOG[1], { ...baseReqs }); // reasoning: 7
      expect(gpt4oScore).toBeGreaterThan(miniScore);
    });

    it("should score higher for cheaper models when prioritizing cost", () => {
      const costReqs = { ...baseReqs, prioritize: "cost" as const };
      const miniScore = scoreModel(CATALOG[1], costReqs); // cost: 0.00015
      const gpt4oScore = scoreModel(CATALOG[0], costReqs); // cost: 0.005
      expect(miniScore).toBeGreaterThan(gpt4oScore);
    });

    it("should score higher for faster models when prioritizing speed", () => {
      const speedReqs = { ...baseReqs, prioritize: "speed" as const };
      const flashScore = scoreModel(CATALOG[4], speedReqs); // speed: 10
      const llamaScore = scoreModel(CATALOG[3], speedReqs); // speed: 5
      expect(flashScore).toBeGreaterThan(llamaScore);
    });

    it("should return a score between 0 and 100", () => {
      const score = scoreModel(CATALOG[0], baseReqs);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe("selectBestModel", () => {
    it("should select the best quality model for complex reasoning", () => {
      const requirements: TaskRequirements = {
        minContext: 50000,
        maxCostPer1kTokens: 0.01,
        minReasoningScore: 8,
        needsMultimodal: false,
        needsOpenSource: false,
        prioritize: "quality",
      };
      const result = selectBestModel(CATALOG, requirements);
      expect(result).not.toBeNull();
      expect(result!.reasoningScore).toBeGreaterThanOrEqual(8);
    });

    it("should select the cheapest viable model for cost optimization", () => {
      const requirements: TaskRequirements = {
        minContext: 50000,
        maxCostPer1kTokens: 0.01,
        minReasoningScore: 5,
        needsMultimodal: false,
        needsOpenSource: false,
        prioritize: "cost",
      };
      const result = selectBestModel(CATALOG, requirements);
      expect(result).not.toBeNull();
      // Should pick one of the cheaper models
      expect(result!.costPer1kTokens).toBeLessThan(0.005);
    });

    it("should return null when no models match constraints", () => {
      const requirements: TaskRequirements = {
        minContext: 500000,
        maxCostPer1kTokens: 0.001,
        minReasoningScore: 9,
        needsMultimodal: true,
        needsOpenSource: true,
        prioritize: "quality",
      };
      const result = selectBestModel(CATALOG, requirements);
      expect(result).toBeNull();
    });

    it("should handle empty catalog", () => {
      const requirements: TaskRequirements = {
        minContext: 1000,
        maxCostPer1kTokens: 1,
        minReasoningScore: 1,
        needsMultimodal: false,
        needsOpenSource: false,
        prioritize: "quality",
      };
      expect(selectBestModel([], requirements)).toBeNull();
    });
  });
});
