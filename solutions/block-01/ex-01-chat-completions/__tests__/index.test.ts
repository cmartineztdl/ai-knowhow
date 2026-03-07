import { describe, it, expect } from "vitest";
import {
  buildChatRequest,
  extractReply,
  getTotalTokens,
  wasResponseTruncated,
} from "../src/index";

describe("Exercise 01: Build a Chat Completions Client", () => {
  describe("buildChatRequest", () => {
    it("should place the system prompt as the first message", () => {
      const request = buildChatRequest(
        [{ role: "user", content: "Hello" }],
        "You are a helpful assistant.",
      );

      expect(request.messages[0]).toEqual({
        role: "system",
        content: "You are a helpful assistant.",
      });
      expect(request.messages[1]).toEqual({
        role: "user",
        content: "Hello",
      });
    });

    it("should preserve multi-turn conversation order after system prompt", () => {
      const request = buildChatRequest(
        [
          { role: "user", content: "Hi" },
          { role: "assistant", content: "Hello!" },
          { role: "user", content: "How are you?" },
        ],
        "Be concise.",
      );

      expect(request.messages).toHaveLength(4);
      expect(request.messages[0].role).toBe("system");
      expect(request.messages[1]).toEqual({ role: "user", content: "Hi" });
      expect(request.messages[2]).toEqual({
        role: "assistant",
        content: "Hello!",
      });
      expect(request.messages[3]).toEqual({
        role: "user",
        content: "How are you?",
      });
    });

    it("should use the provided max_tokens value without modification", () => {
      const request = buildChatRequest(
        [{ role: "user", content: "Test" }],
        "System",
        "gpt-4o",
        0.7,
        2048,
      );

      expect(request.max_tokens).toBe(2048);
    });

    it("should default to gpt-4o and temperature 0.7", () => {
      const request = buildChatRequest(
        [{ role: "user", content: "Test" }],
        "System",
      );

      expect(request.model).toBe("gpt-4o");
      expect(request.temperature).toBe(0.7);
    });
  });

  describe("extractReply", () => {
    it("should extract the assistant message content", () => {
      const response = {
        id: "chatcmpl-123",
        choices: [
          {
            index: 0,
            message: { role: "assistant" as const, content: "Hello there!" },
            finish_reason: "stop",
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      };

      expect(extractReply(response)).toBe("Hello there!");
    });

    it("should return empty string for missing content", () => {
      const response = {
        id: "chatcmpl-456",
        choices: [
          {
            index: 0,
            message: { role: "assistant" as const, content: "" },
            finish_reason: "stop",
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 0, total_tokens: 10 },
      };

      expect(extractReply(response)).toBe("");
    });
  });

  describe("getTotalTokens", () => {
    it("should return total token usage", () => {
      const response = {
        id: "chatcmpl-789",
        choices: [
          {
            index: 0,
            message: { role: "assistant" as const, content: "Hi" },
            finish_reason: "stop",
          },
        ],
        usage: { prompt_tokens: 25, completion_tokens: 50, total_tokens: 75 },
      };

      expect(getTotalTokens(response)).toBe(75);
    });
  });

  describe("wasResponseTruncated", () => {
    it("should return true when finish_reason is 'length'", () => {
      const response = {
        id: "chatcmpl-trunc",
        choices: [
          {
            index: 0,
            message: { role: "assistant" as const, content: "Partial..." },
            finish_reason: "length",
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 1024,
          total_tokens: 1034,
        },
      };

      expect(wasResponseTruncated(response)).toBe(true);
    });

    it("should return false when finish_reason is 'stop'", () => {
      const response = {
        id: "chatcmpl-full",
        choices: [
          {
            index: 0,
            message: { role: "assistant" as const, content: "Complete." },
            finish_reason: "stop",
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      };

      expect(wasResponseTruncated(response)).toBe(false);
    });
  });
});
