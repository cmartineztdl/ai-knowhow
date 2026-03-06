import { describe, it, expect } from "vitest";
import {
  getParametersForUseCase,
  validateParameters,
  mergeWithDefaults,
  InferenceParams,
} from "../src/index";

describe("Exercise 04: Configure Inference Parameters", () => {
  describe("getParametersForUseCase", () => {
    it("should return deterministic params for code generation", () => {
      const params = getParametersForUseCase("code_generation");
      expect(params.temperature).toBe(0);
      expect(params.top_p).toBe(1);
    });

    it("should return creative params for creative writing", () => {
      const params = getParametersForUseCase("creative_writing");
      expect(params.temperature).toBeGreaterThanOrEqual(1);
      expect(params.top_p).toBeGreaterThanOrEqual(0.8);
    });

    it("should return focused params for data extraction", () => {
      const params = getParametersForUseCase("data_extraction");
      expect(params.temperature).toBe(0);
      expect(params.top_p).toBeLessThanOrEqual(0.2);
    });

    it("should return balanced params for conversation", () => {
      const params = getParametersForUseCase("conversation");
      expect(params.temperature).toBeGreaterThan(0);
      expect(params.temperature).toBeLessThanOrEqual(1);
    });
  });

  describe("validateParameters", () => {
    it("should return empty array for valid parameters", () => {
      const params: InferenceParams = {
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        max_tokens: 1000,
      };
      expect(validateParameters(params)).toEqual([]);
    });

    it("should catch temperature out of range", () => {
      const params: InferenceParams = {
        temperature: 3,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1000,
      };
      const errors = validateParameters(params);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.toLowerCase().includes("temperature"))).toBe(
        true,
      );
    });

    it("should catch negative temperature", () => {
      const params: InferenceParams = {
        temperature: -0.5,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1000,
      };
      expect(validateParameters(params).length).toBeGreaterThan(0);
    });

    it("should catch top_p out of range", () => {
      const params: InferenceParams = {
        temperature: 0.7,
        top_p: 1.5,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1000,
      };
      expect(validateParameters(params).length).toBeGreaterThan(0);
    });

    it("should catch max_tokens of 0", () => {
      const params: InferenceParams = {
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 0,
      };
      expect(validateParameters(params).length).toBeGreaterThan(0);
    });

    it("should report multiple errors", () => {
      const params: InferenceParams = {
        temperature: -1,
        top_p: 2,
        frequency_penalty: 3,
        presence_penalty: -1,
        max_tokens: 0,
      };
      expect(validateParameters(params).length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("mergeWithDefaults", () => {
    const defaults: InferenceParams = {
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1000,
    };

    it("should return defaults when no overrides", () => {
      expect(mergeWithDefaults(defaults, {})).toEqual(defaults);
    });

    it("should override specific values", () => {
      const result = mergeWithDefaults(defaults, { temperature: 0 });
      expect(result.temperature).toBe(0);
      expect(result.top_p).toBe(0.9); // unchanged
    });

    it("should override multiple values", () => {
      const result = mergeWithDefaults(defaults, {
        temperature: 1.5,
        max_tokens: 4000,
      });
      expect(result.temperature).toBe(1.5);
      expect(result.max_tokens).toBe(4000);
      expect(result.top_p).toBe(0.9);
    });
  });
});
