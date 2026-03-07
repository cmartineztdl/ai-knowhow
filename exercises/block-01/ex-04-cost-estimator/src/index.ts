/**
 * Exercise: Estimate API Costs
 * Difficulty: Medium
 *
 * Instructions:
 * Fix the cost estimation functions. They should correctly calculate
 * costs based on token counts and model pricing tiers.
 *
 * Hints:
 * - Pricing is per MILLION tokens (divide by 1_000_000)
 * - Input and output tokens have DIFFERENT prices
 * - Conversation costs should ACCUMULATE across turns, not reset
 */

export interface ModelPricing {
  inputPerMillion: number;
  outputPerMillion: number;
}

export interface CostEstimate {
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

export interface ConversationTurn {
  inputTokens: number;
  outputTokens: number;
}

/** Pricing table for common models (per million tokens) */
export const MODEL_PRICING: Record<string, ModelPricing> = {
  "gpt-4o": { inputPerMillion: 2.5, outputPerMillion: 10.0 },
  "gpt-4o-mini": { inputPerMillion: 0.15, outputPerMillion: 0.6 },
  "claude-3.5-sonnet": { inputPerMillion: 3.0, outputPerMillion: 15.0 },
  "claude-3.5-haiku": { inputPerMillion: 0.8, outputPerMillion: 4.0 },
};

/**
 * Estimate the cost of a single API call.
 *
 * BUG: Divides by 1000 instead of 1_000_000 (pricing is per million).
 * BUG: Uses the input price for both input and output.
 */
export function estimateCallCost(
  inputTokens: number,
  outputTokens: number,
  model: string,
): CostEstimate {
  const pricing = MODEL_PRICING[model];
  if (!pricing) {
    throw new Error(`Unknown model: ${model}`);
  }

  // BUG: Should divide by 1_000_000, not 1_000
  const inputCost = (inputTokens / 1_000) * pricing.inputPerMillion;
  // BUG: Should use outputPerMillion, not inputPerMillion
  const outputCost = (outputTokens / 1_000) * pricing.inputPerMillion;

  return {
    inputTokens,
    outputTokens,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
  };
}

/**
 * Estimate the total cost of a multi-turn conversation.
 *
 * BUG: Resets totals inside the loop instead of accumulating.
 */
export function estimateConversationCost(
  turns: ConversationTurn[],
  model: string,
): CostEstimate {
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  for (const turn of turns) {
    // BUG: These should be += not =
    totalInputTokens = turn.inputTokens;
    totalOutputTokens = turn.outputTokens;
  }

  return estimateCallCost(totalInputTokens, totalOutputTokens, model);
}

/**
 * Format a cost estimate as a human-readable string.
 */
export function formatCostReport(estimate: CostEstimate): string {
  return [
    `Tokens: ${estimate.inputTokens} input + ${estimate.outputTokens} output`,
    `Input cost:  $${estimate.inputCost.toFixed(6)}`,
    `Output cost: $${estimate.outputCost.toFixed(6)}`,
    `Total cost:  $${estimate.totalCost.toFixed(6)}`,
  ].join("\n");
}
