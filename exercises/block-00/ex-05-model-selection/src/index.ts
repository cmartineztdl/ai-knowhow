/**
 * Exercise: Model Selection Engine
 * Difficulty: Hard
 *
 * Instructions:
 * Build a system that recommends the best LLM based on task requirements.
 * You need to implement scoring, filtering, and selection logic.
 *
 * Hints:
 * - Filter first, then score the remaining candidates
 * - Score each capability relative to the requirement
 * - Handle edge cases: empty catalog, no matching models
 */

export interface ModelSpec {
  name: string;
  provider: string;
  maxContext: number; // in tokens
  costPer1kTokens: number; // in dollars
  reasoningScore: number; // 1-10
  speedScore: number; // 1-10
  multimodal: boolean;
  openSource: boolean;
}

export interface TaskRequirements {
  minContext: number; // minimum context window needed
  maxCostPer1kTokens: number; // budget constraint
  minReasoningScore: number; // minimum reasoning capability
  needsMultimodal: boolean; // requires image/video support
  needsOpenSource: boolean; // must be self-hosted
  prioritize: "cost" | "quality" | "speed"; // what to optimize for
}

/**
 * Filter models that don't meet the hard constraints.
 *
 * Hard constraints (model is excluded if ANY fail):
 * - maxContext must be >= minContext
 * - costPer1kTokens must be <= maxCostPer1kTokens
 * - reasoningScore must be >= minReasoningScore
 * - If needsMultimodal is true, model must support multimodal
 * - If needsOpenSource is true, model must be open source
 */
export function filterByConstraints(
  models: ModelSpec[],
  requirements: TaskRequirements,
): ModelSpec[] {
  // TODO: Implement this function
  throw new Error("Not implemented");
}

/**
 * Score a model against requirements, returning a value between 0 and 100.
 *
 * Scoring strategy based on `prioritize`:
 * - "cost": Weight cost-efficiency highest (lower cost = higher score)
 * - "quality": Weight reasoning score highest
 * - "speed": Weight speed score highest
 *
 * Suggested weights:
 * - Primary criterion:  70% of score
 * - Secondary criteria: 15% each (the other two non-primary criteria)
 *
 * For cost scoring: score = (1 - cost/maxCost) * 100
 * For quality scoring: score = (reasoningScore / 10) * 100
 * For speed scoring: score = (speedScore / 10) * 100
 */
export function scoreModel(
  model: ModelSpec,
  requirements: TaskRequirements,
): number {
  // TODO: Implement this function
  throw new Error("Not implemented");
}

/**
 * Select the best model for the given requirements.
 *
 * Steps:
 * 1. Filter out models that violate hard constraints
 * 2. Score each remaining model
 * 3. Return the model with the highest score
 * 4. Return null if no models match
 */
export function selectBestModel(
  catalog: ModelSpec[],
  requirements: TaskRequirements,
): ModelSpec | null {
  // TODO: Implement this function
  throw new Error("Not implemented");
}
