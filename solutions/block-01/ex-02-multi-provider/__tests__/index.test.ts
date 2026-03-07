import { describe, it, expect } from "vitest";
import {
  normalizeOpenAIResponse,
  normalizeAnthropicResponse,
  normalizeResponse,
} from "../src/index";

describe("Exercise 02: Normalize Multi-Provider Responses", () => {
  const openaiResponse = {
    id: "chatcmpl-abc",
    model: "gpt-4o",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant" as const,
          content: "Hello from OpenAI!",
        },
        finish_reason: "stop",
      },
    ],
    usage: { prompt_tokens: 15, completion_tokens: 8, total_tokens: 23 },
  };

  const anthropicResponse = {
    id: "msg-xyz",
    model: "claude-sonnet-4-20250514",
    content: [{ type: "text" as const, text: "Hello from Anthropic!" }],
    stop_reason: "end_turn",
    usage: { input_tokens: 12, output_tokens: 6 },
  };

  describe("normalizeOpenAIResponse", () => {
    it("should extract text from choices[0].message.content", () => {
      const result = normalizeOpenAIResponse(openaiResponse);
      expect(result.text).toBe("Hello from OpenAI!");
    });

    it("should correctly map token counts", () => {
      const result = normalizeOpenAIResponse(openaiResponse);
      expect(result.inputTokens).toBe(15);
      expect(result.outputTokens).toBe(8);
    });

    it("should include model and finish reason", () => {
      const result = normalizeOpenAIResponse(openaiResponse);
      expect(result.model).toBe("gpt-4o");
      expect(result.finishReason).toBe("stop");
    });
  });

  describe("normalizeAnthropicResponse", () => {
    it("should extract text from content blocks", () => {
      const result = normalizeAnthropicResponse(anthropicResponse);
      expect(result.text).toBe("Hello from Anthropic!");
    });

    it("should handle multiple content blocks", () => {
      const multiBlock = {
        ...anthropicResponse,
        content: [
          { type: "text" as const, text: "First part. " },
          { type: "text" as const, text: "Second part." },
        ],
      };
      const result = normalizeAnthropicResponse(multiBlock);
      expect(result.text).toBe("First part. Second part.");
    });

    it("should correctly map token counts", () => {
      const result = normalizeAnthropicResponse(anthropicResponse);
      expect(result.inputTokens).toBe(12);
      expect(result.outputTokens).toBe(6);
    });

    it("should map stop_reason to finishReason", () => {
      const result = normalizeAnthropicResponse(anthropicResponse);
      expect(result.finishReason).toBe("end_turn");
    });
  });

  describe("normalizeResponse (auto-detect)", () => {
    it("should detect and normalize OpenAI responses", () => {
      const result = normalizeResponse(openaiResponse);
      expect(result.text).toBe("Hello from OpenAI!");
      expect(result.model).toBe("gpt-4o");
    });

    it("should detect and normalize Anthropic responses", () => {
      const result = normalizeResponse(anthropicResponse);
      expect(result.text).toBe("Hello from Anthropic!");
      expect(result.model).toBe("claude-sonnet-4-20250514");
    });
  });
});
