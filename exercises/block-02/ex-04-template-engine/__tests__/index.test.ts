import { describe, it, expect } from "vitest";
import {
  renderTemplate,
  renderWithDefaults,
  renderConditional,
} from "../src/index";

describe("Exercise 04: Build a Template Engine", () => {
  describe("renderTemplate", () => {
    it("should replace variables with values", () => {
      const result = renderTemplate(
        "Hello, {{name}}! You are a {{role}}.",
        { name: "Alice", role: "developer" },
      );
      expect(result).toBe("Hello, Alice! You are a developer.");
    });

    it("should handle multiple occurrences of the same variable", () => {
      const result = renderTemplate(
        "{{name}} said: Hello, {{name}}!",
        { name: "Bob" },
      );
      expect(result).toBe("Bob said: Hello, Bob!");
    });

    it("should throw for missing variables", () => {
      expect(() =>
        renderTemplate("Hello, {{name}}!", {}),
      ).toThrow();
    });

    it("should leave non-variable text unchanged", () => {
      const result = renderTemplate("No variables here.", {});
      expect(result).toBe("No variables here.");
    });

    it("should handle templates with curly braces in content", () => {
      const result = renderTemplate(
        'Output: {"key": "{{value}}"}',
        { value: "test" },
      );
      expect(result).toBe('Output: {"key": "test"}');
    });
  });

  describe("renderWithDefaults", () => {
    it("should use provided variables over defaults", () => {
      const result = renderWithDefaults(
        "{{greeting}}, {{name}}!",
        { name: "Alice", greeting: "Hi" },
        { name: "World", greeting: "Hello" },
      );
      expect(result).toBe("Hi, Alice!");
    });

    it("should fall back to defaults for missing variables", () => {
      const result = renderWithDefaults(
        "{{greeting}}, {{name}}!",
        { name: "Alice" },
        { greeting: "Hello" },
      );
      expect(result).toBe("Hello, Alice!");
    });

    it("should work with no defaults", () => {
      const result = renderWithDefaults(
        "Hello, {{name}}!",
        { name: "Alice" },
        {},
      );
      expect(result).toBe("Hello, Alice!");
    });
  });

  describe("renderConditional", () => {
    it("should keep content when variable is truthy", () => {
      const result = renderConditional(
        "Start. {{#if showExtra}}Extra content.{{/if}} End.",
        { showExtra: "yes" },
      );
      expect(result).toBe("Start. Extra content. End.");
    });

    it("should remove block when variable is missing", () => {
      const result = renderConditional(
        "Start. {{#if showExtra}}Extra content.{{/if}} End.",
        {},
      );
      expect(result).toBe("Start.  End.");
    });

    it("should remove block when variable is empty string", () => {
      const result = renderConditional(
        "Before {{#if name}}Hello, user!{{/if}} After",
        { name: "" },
      );
      expect(result).toBe("Before  After");
    });

    it("should handle multiple conditional blocks", () => {
      const template =
        "{{#if a}}Block A{{/if}} middle {{#if b}}Block B{{/if}}";
      const result = renderConditional(template, { a: "yes" });
      expect(result).toBe("Block A middle ");
    });

    it("should handle multiline content in blocks", () => {
      const template = "{{#if details}}Line 1\nLine 2\nLine 3{{/if}}";
      const result = renderConditional(template, { details: "yes" });
      expect(result).toBe("Line 1\nLine 2\nLine 3");
    });
  });
});
