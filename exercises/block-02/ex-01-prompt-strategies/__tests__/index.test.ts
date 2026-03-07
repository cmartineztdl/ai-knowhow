import { describe, it, expect } from "vitest";
import {
  buildZeroShotPrompt,
  buildFewShotPrompt,
  buildChainOfThoughtPrompt,
} from "../src/index";

describe("Exercise 01: Build a Prompt Strategy Selector", () => {
  describe("buildZeroShotPrompt", () => {
    it("should place system message first and user message second", () => {
      const messages = buildZeroShotPrompt(
        "You are a classifier.",
        "Is this positive or negative?",
      );

      expect(messages).toHaveLength(2);
      expect(messages[0]).toEqual({
        role: "system",
        content: "You are a classifier.",
      });
      expect(messages[1]).toEqual({
        role: "user",
        content: "Is this positive or negative?",
      });
    });

    it("should not include any assistant messages", () => {
      const messages = buildZeroShotPrompt("System", "Query");
      const assistantMessages = messages.filter((m) => m.role === "assistant");
      expect(assistantMessages).toHaveLength(0);
    });
  });

  describe("buildFewShotPrompt", () => {
    const examples = [
      { input: "I love it!", output: "positive" },
      { input: "Terrible product.", output: "negative" },
    ];

    it("should include system prompt, example pairs, and user query", () => {
      const messages = buildFewShotPrompt(
        "Classify sentiment.",
        examples,
        "It works fine.",
      );

      // system + (2 examples × 2 messages each) + user query = 6
      expect(messages).toHaveLength(6);
    });

    it("should structure examples as user/assistant pairs", () => {
      const messages = buildFewShotPrompt(
        "Classify sentiment.",
        examples,
        "It works fine.",
      );

      expect(messages[0]).toEqual({ role: "system", content: "Classify sentiment." });
      expect(messages[1]).toEqual({ role: "user", content: "I love it!" });
      expect(messages[2]).toEqual({ role: "assistant", content: "positive" });
      expect(messages[3]).toEqual({ role: "user", content: "Terrible product." });
      expect(messages[4]).toEqual({ role: "assistant", content: "negative" });
      expect(messages[5]).toEqual({ role: "user", content: "It works fine." });
    });

    it("should work with no examples (degrades to zero-shot + query)", () => {
      const messages = buildFewShotPrompt("System", [], "Query");
      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe("system");
      expect(messages[1].role).toBe("user");
    });
  });

  describe("buildChainOfThoughtPrompt", () => {
    it("should include reasoning instruction in the system prompt", () => {
      const messages = buildChainOfThoughtPrompt(
        "You are a math tutor.",
        "What is 15% of 80?",
      );

      expect(messages[0].role).toBe("system");
      expect(messages[0].content).toContain("step by step");
    });

    it("should have exactly two messages: system and user", () => {
      const messages = buildChainOfThoughtPrompt("Tutor", "Solve 2+2");
      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe("system");
      expect(messages[1].role).toBe("user");
    });

    it("should preserve the original system prompt content", () => {
      const messages = buildChainOfThoughtPrompt(
        "You are a math tutor.",
        "Solve this.",
      );

      expect(messages[0].content).toContain("You are a math tutor.");
    });

    it("should have the user query as the last message", () => {
      const messages = buildChainOfThoughtPrompt("System", "My question");
      expect(messages[messages.length - 1]).toEqual({
        role: "user",
        content: "My question",
      });
    });
  });
});
