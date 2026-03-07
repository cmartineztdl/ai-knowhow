/**
 * Solution: Estimate API Costs
 *
 * Approach: Fix the divisor from 1,000 to 1,000,000, use the correct output pricing,
 * and accumulate tokens with += instead of =.
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

export const MODEL_PRICING: Record<string, ModelPricing> = {
  "gpt-4o": { inputPerMillion: 2.5, outputPerMillion: 10.0 },
  "gpt-4o-mini": { inputPerMillion: 0.15, outputPerMillion: 0.6 },
  "claude-3.5-sonnet": { inputPerMillion: 3.0, outputPerMillion: 15.0 },
  "claude-3.5-haiku": { inputPerMillion: 0.8, outputPerMillion: 4.0 },
};

/**
 * Estimate the cost of a single API call.
 * FIX: Divide by 1_000_000, use separate input/output pricing.
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

  // FIX: Divide by 1_000_000 (pricing is per million tokens)
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPerMillion;
  // FIX: Use outputPerMillion for output tokens
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPerMillion;

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
 * FIX: Accumulate tokens with += instead of =.
 */
export function estimateConversationCost(
  turns: ConversationTurn[],
  model: string,
): CostEstimate {
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  for (const turn of turns) {
    // FIX: Use += to accumulate, not = to reset
    totalInputTokens += turn.inputTokens;
    totalOutputTokens += turn.outputTokens;
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
