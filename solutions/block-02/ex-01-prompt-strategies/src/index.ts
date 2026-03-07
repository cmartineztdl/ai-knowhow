/**
 * Solution: Build a Prompt Strategy Selector
 *
 * Approach: Correct message ordering — system first, examples as user/assistant
 * pairs, and CoT instruction merged into the system prompt.
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
 * FIX: System first, user second, no empty assistant message.
 */
export function buildZeroShotPrompt(
  systemPrompt: string,
  userQuery: string,
): Message[] {
  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userQuery },
  ];
}

/**
 * Build a few-shot prompt with examples before the actual query.
 * FIX: Examples as user/assistant pairs, user query at the end.
 */
export function buildFewShotPrompt(
  systemPrompt: string,
  examples: Example[],
  userQuery: string,
): Message[] {
  const messages: Message[] = [
    { role: "system", content: systemPrompt },
  ];

  // FIX: Each example becomes a user/assistant pair
  for (const example of examples) {
    messages.push({ role: "user", content: example.input });
    messages.push({ role: "assistant", content: example.output });
  }

  // FIX: Add the actual user query
  messages.push({ role: "user", content: userQuery });

  return messages;
}

/**
 * Build a chain-of-thought prompt that instructs the model to reason step by step.
 * FIX: Reasoning instruction is part of the system prompt, not a separate message.
 */
export function buildChainOfThoughtPrompt(
  systemPrompt: string,
  userQuery: string,
): Message[] {
  return [
    {
      role: "system",
      // FIX: Append CoT instruction to system prompt
      content: `${systemPrompt}\n\nThink step by step before giving your final answer.`,
    },
    { role: "user", content: userQuery },
  ];
}
