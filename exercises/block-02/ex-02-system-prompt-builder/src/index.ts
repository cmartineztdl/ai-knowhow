/**
 * Exercise: Craft a System Prompt Builder
 * Difficulty: Easy
 *
 * Instructions:
 * Fix the functions that build structured system prompts from components.
 * The builder has issues with section assembly and formatting.
 *
 * Hints:
 * - Four sections: identity, task, rules, format — all must appear
 * - Rules should be a numbered list (1. Rule one\n2. Rule two)
 * - Sections are separated by double newlines
 */

export interface PromptConfig {
  identity: string;
  task: string;
  rules: string[];
  outputFormat: string;
}

/**
 * Build a complete system prompt from structured components.
 *
 * BUG: Rules are joined with commas instead of formatted as a numbered list.
 * BUG: The outputFormat section is missing from the output.
 */
export function buildSystemPrompt(config: PromptConfig): string {
  const identitySection = config.identity;
  const taskSection = `TASK: ${config.task}`;

  // BUG: Should be a numbered list, not comma-separated
  const rulesSection = `RULES:\n${config.rules.join(", ")}`;

  // BUG: Output format section is not included at all
  return [identitySection, taskSection, rulesSection].join("\n\n");
}

/**
 * Apply a persona to a prompt config by updating the identity.
 *
 * BUG: Overwrites the identity instead of enhancing it.
 * BUG: Doesn't include the tone descriptor.
 */
export function addPersona(
  config: PromptConfig,
  persona: { name: string; expertise: string; tone: string },
): PromptConfig {
  return {
    ...config,
    // BUG: Should combine identity with persona details, not replace
    // BUG: Missing the tone
    identity: persona.name,
  };
}

/**
 * Validate that a prompt config has all required fields.
 */
export function validateConfig(
  config: PromptConfig,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.identity || config.identity.trim() === "") {
    errors.push("Identity is required");
  }
  if (!config.task || config.task.trim() === "") {
    errors.push("Task is required");
  }
  // BUG: Should check if rules array is empty, not just if it exists
  if (!config.rules) {
    errors.push("At least one rule is required");
  }
  if (!config.outputFormat || config.outputFormat.trim() === "") {
    errors.push("Output format is required");
  }

  return { valid: errors.length === 0, errors };
}
