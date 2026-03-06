/**
 * Solution: Build a Context Window Manager
 *
 * Approach: Use character-based token estimation, then greedily pack messages
 * from newest to oldest within the remaining budget after system prompt and output reserve.
 */

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Estimate tokens: 1 token ≈ 4 characters, rounded up.
 */
export function estimateTokens(text: string): number {
  if (text.length === 0) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Trim a conversation to fit within the token budget.
 * Always includes system prompt, fills remaining space newest-to-oldest.
 */
export function trimConversation(
  messages: Message[],
  maxTokens: number,
  outputReserve: number,
): Message[] {
  if (messages.length === 0) return [];

  const systemPrompt = messages[0];
  const history = messages.slice(1);

  // Budget after system prompt and output reserve
  const systemTokens = estimateTokens(systemPrompt.content);
  let remainingBudget = maxTokens - systemTokens - outputReserve;

  // Select messages from newest to oldest
  const selectedIndices: number[] = [];

  for (let i = history.length - 1; i >= 0; i--) {
    const msgTokens = estimateTokens(history[i].content);
    if (msgTokens <= remainingBudget) {
      selectedIndices.unshift(i); // Add to front to maintain order
      remainingBudget -= msgTokens;
    }
  }

  // Reconstruct in chronological order
  const result: Message[] = [systemPrompt];
  for (const idx of selectedIndices) {
    result.push(history[idx]);
  }

  return result;
}

/**
 * Create a context window from system prompt and conversation history.
 */
export function createContextWindow(
  systemPrompt: string,
  history: Message[],
  maxTokens: number,
  outputReserve: number = 500,
): Message[] {
  const systemMessage: Message = { role: "system", content: systemPrompt };
  const allMessages: Message[] = [systemMessage, ...history];
  return trimConversation(allMessages, maxTokens, outputReserve);
}
