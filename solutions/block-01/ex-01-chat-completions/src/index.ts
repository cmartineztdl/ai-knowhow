/**
 * Solution: Build a Chat Completions Client
 *
 * Approach: Place the system prompt first in the messages array, use the correct
 * max_tokens value, and access response.choices[0].message.content for the reply.
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature: number;
  max_tokens: number;
}

export interface ChatResponse {
  id: string;
  choices: Array<{
    index: number;
    message: {
      role: "assistant";
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Build a properly formatted chat completion request.
 * FIX: System prompt is placed FIRST, max_tokens uses the unmodified value.
 */
export function buildChatRequest(
  userMessages: Array<{ role: "user" | "assistant"; content: string }>,
  systemPrompt: string,
  model: string = "gpt-4o",
  temperature: number = 0.7,
  maxTokens: number = 1024,
): ChatRequest {
  // FIX: System prompt goes first, then user messages
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...userMessages,
  ];

  return {
    model,
    messages,
    temperature,
    // FIX: Use maxTokens directly without dividing
    max_tokens: maxTokens,
  };
}

/**
 * Extract the assistant's reply text from a chat completion response.
 * FIX: Read from choices[0].message.content.
 */
export function extractReply(response: ChatResponse): string {
  // FIX: Correct path into the response object
  return response.choices[0]?.message?.content ?? "";
}

/**
 * Count the total tokens used in a response.
 */
export function getTotalTokens(response: ChatResponse): number {
  return response.usage.total_tokens;
}

/**
 * Check if the response was cut off due to token limits.
 * FIX: "length" means truncated, "stop" means complete.
 */
export function wasResponseTruncated(response: ChatResponse): boolean {
  return response.choices[0].finish_reason === "length";
}
