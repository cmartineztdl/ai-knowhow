import { describe, it, expect } from "vitest";
import {
  buildSystemPrompt,
  addPersona,
  validateConfig,
} from "../src/index";

describe("Exercise 02: Craft a System Prompt Builder", () => {
  const baseConfig = {
    identity: "You are CodeBot, an expert TypeScript developer.",
    task: "Review pull requests for bugs and style issues.",
    rules: [
      "Always explain why something is a problem",
      "Rate severity as critical, warning, or nit",
      "Never modify code, only comment",
    ],
    outputFormat: "Respond with a markdown list of issues.",
  };

  describe("buildSystemPrompt", () => {
    it("should include all four sections", () => {
      const prompt = buildSystemPrompt(baseConfig);

      expect(prompt).toContain(baseConfig.identity);
      expect(prompt).toContain("TASK:");
      expect(prompt).toContain("RULES:");
      expect(prompt).toContain("OUTPUT FORMAT:");
    });

    it("should format rules as a numbered list", () => {
      const prompt = buildSystemPrompt(baseConfig);

      expect(prompt).toContain("1. Always explain why something is a problem");
      expect(prompt).toContain("2. Rate severity as critical, warning, or nit");
      expect(prompt).toContain("3. Never modify code, only comment");
    });

    it("should separate sections with double newlines", () => {
      const prompt = buildSystemPrompt(baseConfig);
      const sections = prompt.split("\n\n");

      expect(sections.length).toBeGreaterThanOrEqual(4);
    });

    it("should include the output format section", () => {
      const prompt = buildSystemPrompt(baseConfig);

      expect(prompt).toContain("OUTPUT FORMAT:");
      expect(prompt).toContain("Respond with a markdown list of issues.");
    });
  });

  describe("addPersona", () => {
    it("should enhance identity with persona name, expertise, and tone", () => {
      const result = addPersona(baseConfig, {
        name: "ReviewBot",
        expertise: "security vulnerabilities",
        tone: "direct and concise",
      });

      expect(result.identity).toContain("ReviewBot");
      expect(result.identity).toContain("security vulnerabilities");
      expect(result.identity).toContain("direct and concise");
    });

    it("should preserve the original identity content", () => {
      const result = addPersona(baseConfig, {
        name: "ReviewBot",
        expertise: "security",
        tone: "friendly",
      });

      expect(result.identity).toContain(baseConfig.identity);
    });

    it("should not modify other config fields", () => {
      const result = addPersona(baseConfig, {
        name: "Bot",
        expertise: "testing",
        tone: "casual",
      });

      expect(result.task).toBe(baseConfig.task);
      expect(result.rules).toEqual(baseConfig.rules);
      expect(result.outputFormat).toBe(baseConfig.outputFormat);
    });
  });

  describe("validateConfig", () => {
    it("should pass for a complete config", () => {
      const result = validateConfig(baseConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should fail when identity is empty", () => {
      const result = validateConfig({ ...baseConfig, identity: "" });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Identity is required");
    });

    it("should fail when rules array is empty", () => {
      const result = validateConfig({ ...baseConfig, rules: [] });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("At least one rule is required");
    });

    it("should collect all errors at once", () => {
      const result = validateConfig({
        identity: "",
        task: "",
        rules: [],
        outputFormat: "",
      });
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    });
  });
});
