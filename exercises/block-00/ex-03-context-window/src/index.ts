/**
 * Exercise: Build a Context Window Manager
 * Difficulty: Medium
 *
 * Instructions:
 * Implement a context window manager that fits conversation messages
 * within a token budget. The system prompt must always be included.
 * When the conversation is too long, trim the OLDEST messages first
 * while keeping the most recent ones.
 *
 * Hints:
 * - Use the approximation: 1 token ≈ 4 characters
 * - Always include the system prompt
 * - Reserve tokens for the model's output (outputReserve)
 * - Process messages from newest to oldest
 */

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Estimate the number of tokens in a string.
 * Use the approximation: 1 token ≈ 4 characters.
 * Round up to the nearest integer.
 */
export function estimateTokens(text: string): number {
  // TODO: Implement this function
  throw new Error("Not implemented");
}

/**
 * Trim a conversation to fit within the token budget.
 *
 * Rules:
 * 1. The system prompt (first message) is ALWAYS included
 * 2. After accounting for systemPrompt and outputReserve,
 *    fill remaining budget with messages from NEWEST to OLDEST
 * 3. Return messages in their original chronological order
 *
 * @param messages - Full conversation (system prompt + history)
 * @param maxTokens - Total context window size
 * @param outputReserve - Tokens to reserve for model output
 * @returns Trimmed message array that fits within budget
 */
export function trimConversation(
  messages: Message[],
  maxTokens: number,
  outputReserve: number,
): Message[] {
  // TODO: Implement this function
  throw new Error("Not implemented");
}

/**
 * Create a context window from a system prompt and conversation history.
 *
 * @param systemPrompt - The system prompt text
 * @param history - Array of user/assistant messages
 * @param maxTokens - Maximum context window size
 * @param outputReserve - Tokens reserved for output (default: 500)
 * @returns Messages that fit within the context window
 */
export function createContextWindow(
  systemPrompt: string,
  history: Message[],
  maxTokens: number,
  outputReserve: number = 500,
): Message[] {
  // TODO: Implement this function
  throw new Error("Not implemented");
}
