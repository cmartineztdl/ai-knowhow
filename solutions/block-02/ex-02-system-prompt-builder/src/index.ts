/**
 * Solution: Craft a System Prompt Builder
 *
 * Approach: Assemble four sections with proper formatting — numbered rules,
 * output format section, and persona enhancement that preserves the original identity.
 */

export interface PromptConfig {
  identity: string;
  task: string;
  rules: string[];
  outputFormat: string;
}

/**
 * Build a complete system prompt from structured components.
 * FIX: Rules as numbered list, output format section included.
 */
export function buildSystemPrompt(config: PromptConfig): string {
  const identitySection = config.identity;
  const taskSection = `TASK: ${config.task}`;

  // FIX: Format rules as a numbered list
  const rulesSection = `RULES:\n${config.rules.map((r, i) => `${i + 1}. ${r}`).join("\n")}`;

  // FIX: Include the output format section
  const formatSection = `OUTPUT FORMAT: ${config.outputFormat}`;

  return [identitySection, taskSection, rulesSection, formatSection].join("\n\n");
}

/**
 * Apply a persona to a prompt config by enhancing the identity.
 * FIX: Combines original identity with persona details including tone.
 */
export function addPersona(
  config: PromptConfig,
  persona: { name: string; expertise: string; tone: string },
): PromptConfig {
  return {
    ...config,
    // FIX: Enhance identity instead of replacing, include all persona fields
    identity: `${config.identity}\nPersona: ${persona.name}, specializing in ${persona.expertise}. Tone: ${persona.tone}.`,
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
  // FIX: Check if rules array is empty, not just if it exists
  if (!config.rules || config.rules.length === 0) {
    errors.push("At least one rule is required");
  }
  if (!config.outputFormat || config.outputFormat.trim() === "") {
    errors.push("Output format is required");
  }

  return { valid: errors.length === 0, errors };
}
