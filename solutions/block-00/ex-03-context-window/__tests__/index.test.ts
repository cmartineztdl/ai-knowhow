import { describe, it, expect } from "vitest";
import {
  estimateTokens,
  trimConversation,
  createContextWindow,
  Message,
} from "../src/index";

describe("Exercise 03: Build a Context Window Manager", () => {
  describe("estimateTokens", () => {
    it("should estimate tokens at 1 token per 4 characters", () => {
      expect(estimateTokens("hello")).toBe(2); // 5 chars / 4 = 1.25 → 2
    });

    it("should return 0 for empty string", () => {
      expect(estimateTokens("")).toBe(0);
    });

    it("should round up fractional tokens", () => {
      expect(estimateTokens("hi")).toBe(1); // 2 chars / 4 = 0.5 → 1
    });

    it("should handle exact multiples", () => {
      expect(estimateTokens("abcd")).toBe(1); // 4 chars / 4 = 1
    });
  });

  describe("trimConversation", () => {
    const systemMsg: Message = { role: "system", content: "You are helpful." };
    const msg1: Message = { role: "user", content: "Hello there!" };
    const msg2: Message = {
      role: "assistant",
      content: "Hi! How can I help you today?",
    };
    const msg3: Message = {
      role: "user",
      content: "What is machine learning?",
    };

    it("should always include the system prompt", () => {
      const result = trimConversation([systemMsg, msg1, msg2, msg3], 100, 10);
      expect(result[0]).toEqual(systemMsg);
    });

    it("should include all messages when they fit", () => {
      const result = trimConversation([systemMsg, msg1, msg2, msg3], 1000, 10);
      expect(result).toEqual([systemMsg, msg1, msg2, msg3]);
    });

    it("should trim oldest messages first when budget is tight", () => {
      // System prompt = "You are helpful." = 16 chars = 4 tokens
      // Reserve = 5 tokens
      // Budget for history = 20 - 4 - 5 = 11 tokens
      // msg3 = "What is machine learning?" = 25 chars = 7 tokens (fits: 7 ≤ 11)
      // msg2 = "Hi! How can I help you today?" = 29 chars = 8 tokens (7+8=15 > 11, skip)
      // msg1 = "Hello there!" = 12 chars = 3 tokens (7+3=10 ≤ 11, fits)
      const result = trimConversation([systemMsg, msg1, msg2, msg3], 20, 5);
      expect(result).toEqual([systemMsg, msg1, msg3]);
    });

    it("should keep messages in chronological order", () => {
      const result = trimConversation([systemMsg, msg1, msg2, msg3], 1000, 10);
      expect(result.map((m) => m.role)).toEqual([
        "system",
        "user",
        "assistant",
        "user",
      ]);
    });
  });

  describe("createContextWindow", () => {
    it("should combine system prompt and history", () => {
      const history: Message[] = [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there!" },
      ];
      const result = createContextWindow("Be helpful.", history, 1000);
      expect(result[0]).toEqual({ role: "system", content: "Be helpful." });
      expect(result.length).toBe(3);
    });

    it("should respect token limits", () => {
      const longHistory: Message[] = Array.from({ length: 50 }, (_, i) => ({
        role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
        content: `This is message number ${i} with some padding text to use tokens.`,
      }));
      const result = createContextWindow("System.", longHistory, 50, 10);
      // Should have fewer messages than input
      expect(result.length).toBeLessThan(52); // 50 + system + some trimmed
      expect(result[0].role).toBe("system");
    });
  });
});
