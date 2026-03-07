/**
 * Exercise: Build a Prompt Strategy Selector
 * Difficulty: Easy
 *
 * Instructions:
 * Fix three functions that build prompts using different strategies.
 * Each has bugs in how it structures the messages array.
 *
 * Hints:
 * - Zero-shot: system + user only, no examples
 * - Few-shot: examples must use user/assistant pairs, not system messages
 * - CoT: the reasoning instruction must be in the system prompt
 */

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface Example {
  input: string;
  output: string;
}

/**
 * Build a zero-shot prompt with a system prompt and user query.
 *
 * BUG: Returns messages in wrong order (user first, system second).
 * BUG: Adds an extra empty assistant message.
 */
export function buildZeroShotPrompt(
  systemPrompt: string,
  userQuery: string,
): Message[] {
  return [
    { role: "user", content: userQuery },
    { role: "system", content: systemPrompt },
    { role: "assistant", content: "" },
  ];
}

/**
 * Build a few-shot prompt with examples before the actual query.
 *
 * BUG: Examples are added as system messages instead of user/assistant pairs.
 * BUG: The actual user query is missing from the output.
 */
export function buildFewShotPrompt(
  systemPrompt: string,
  examples: Example[],
  userQuery: string,
): Message[] {
  const messages: Message[] = [
    { role: "system", content: systemPrompt },
  ];

  // BUG: Examples should be user/assistant pairs, not system messages
  for (const example of examples) {
    messages.push({ role: "system", content: `Input: ${example.input}\nOutput: ${example.output}` });
  }

  // BUG: Missing the actual user query
  return messages;
}

/**
 * Build a chain-of-thought prompt that instructs the model to reason step by step.
 *
 * BUG: The reasoning instruction is added as a user message instead of being
 * part of the system prompt.
 * BUG: The reasoning instruction text is wrong.
 */
export function buildChainOfThoughtPrompt(
  systemPrompt: string,
  userQuery: string,
): Message[] {
  return [
    { role: "system", content: systemPrompt },
    // BUG: Reasoning instruction should be part of system prompt, not a separate user message
    { role: "user", content: "Answer directly without explanation." },
    { role: "user", content: userQuery },
  ];
}
