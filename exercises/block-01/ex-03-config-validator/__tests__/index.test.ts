import { describe, it, expect } from "vitest";
import {
  validateApiKey,
  getProviderFromKey,
  loadConfig,
} from "../src/index";

describe("Exercise 03: Validate API Configuration", () => {
  describe("validateApiKey", () => {
    it("should accept a valid OpenAI key", () => {
      const result = validateApiKey("sk-proj-abc123def456ghi789jkl012");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept a valid Anthropic key", () => {
      const result = validateApiKey("sk-ant-api03-abcdef123456abcdef1234");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject empty keys", () => {
      const result = validateApiKey("");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("API key is required");
    });

    it("should reject keys shorter than 20 characters", () => {
      const result = validateApiKey("sk-short");
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("too short"))).toBe(true);
    });

    it("should reject keys without the sk- prefix", () => {
      const result = validateApiKey("invalid-key-format-abcdefghijklmnop");
      expect(result.valid).toBe(false);
    });
  });

  describe("getProviderFromKey", () => {
    it("should identify OpenAI keys", () => {
      expect(getProviderFromKey("sk-proj-abc123def456ghi789")).toBe("openai");
    });

    it("should identify Anthropic keys", () => {
      expect(getProviderFromKey("sk-ant-api03-abcdef12345")).toBe("anthropic");
    });

    it("should return unknown for unrecognized keys", () => {
      expect(getProviderFromKey("invalid-key")).toBe("unknown");
    });
  });

  describe("loadConfig", () => {
    it("should load config from OpenAI key", () => {
      const result = loadConfig({
        OPENAI_API_KEY: "sk-proj-abc123def456ghi789jkl012",
      });
      expect(result.config).not.toBeNull();
      expect(result.config?.provider).toBe("openai");
      expect(result.config?.model).toBe("gpt-4o");
    });

    it("should load config from Anthropic key", () => {
      const result = loadConfig({
        ANTHROPIC_API_KEY: "sk-ant-api03-abcdef123456abcdef1234",
      });
      expect(result.config).not.toBeNull();
      expect(result.config?.provider).toBe("anthropic");
      expect(result.config?.model).toBe("claude-sonnet-4-20250514");
    });

    it("should return errors when no keys are provided", () => {
      const result = loadConfig({});
      expect(result.config).toBeNull();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should use custom model when provided", () => {
      const result = loadConfig({
        OPENAI_API_KEY: "sk-proj-abc123def456ghi789jkl012",
        MODEL: "gpt-4o-mini",
      });
      expect(result.config?.model).toBe("gpt-4o-mini");
    });
  });
});
