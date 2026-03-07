/**
 * Exercise: Build a Chat Completions Client
 * Difficulty: Easy
 *
 * Instructions:
 * Fix the functions that build and parse Chat Completions API requests/responses.
 * The request builder has the system prompt in the wrong position, and the
 * response extractor reads from the wrong property.
 *
 * Hints:
 * - The system message must be the FIRST message in the array
 * - OpenAI responses nest the reply inside choices[0].message.content
 * - Check the parameter names — they must match the API schema exactly
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
 *
 * BUG: The system prompt is appended at the END instead of the beginning.
 * BUG: The parameter name uses "maxTokens" instead of "max_tokens".
 */
export function buildChatRequest(
  userMessages: Array<{ role: "user" | "assistant"; content: string }>,
  systemPrompt: string,
  model: string = "gpt-4o",
  temperature: number = 0.7,
  maxTokens: number = 1024,
): ChatRequest {
  const messages: ChatMessage[] = [...userMessages];

  // BUG: System prompt should be first, not last
  messages.push({ role: "system", content: systemPrompt });

  return {
    model,
    messages,
    temperature,
    // BUG: Should be max_tokens, and the value is correct, but
    // the division makes it wrong
    max_tokens: maxTokens / 2,
  };
}

/**
 * Extract the assistant's reply text from a chat completion response.
 *
 * BUG: Reads from the wrong property path.
 */
export function extractReply(response: ChatResponse): string {
  // BUG: Should be response.choices[0].message.content
  const reply = (response as any).message?.content;
  return reply ?? "";
}

/**
 * Count the total tokens used in a response.
 */
export function getTotalTokens(response: ChatResponse): number {
  return response.usage.total_tokens;
}

/**
 * Check if the response was cut off due to token limits.
 */
export function wasResponseTruncated(response: ChatResponse): boolean {
  // BUG: Should check for "length", not "stop"
  return response.choices[0].finish_reason === "stop";
}
