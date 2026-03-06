/**
 * Solution: Model Selection Engine
 *
 * Approach: Filter by hard constraints first, then score remaining candidates
 * using weighted criteria based on the prioritize field.
 */

export interface ModelSpec {
  name: string;
  provider: string;
  maxContext: number;
  costPer1kTokens: number;
  reasoningScore: number;
  speedScore: number;
  multimodal: boolean;
  openSource: boolean;
}

export interface TaskRequirements {
  minContext: number;
  maxCostPer1kTokens: number;
  minReasoningScore: number;
  needsMultimodal: boolean;
  needsOpenSource: boolean;
  prioritize: "cost" | "quality" | "speed";
}

/**
 * Filter models that don't meet hard constraints.
 */
export function filterByConstraints(
  models: ModelSpec[],
  requirements: TaskRequirements,
): ModelSpec[] {
  return models.filter((model) => {
    if (model.maxContext < requirements.minContext) return false;
    if (model.costPer1kTokens > requirements.maxCostPer1kTokens) return false;
    if (model.reasoningScore < requirements.minReasoningScore) return false;
    if (requirements.needsMultimodal && !model.multimodal) return false;
    if (requirements.needsOpenSource && !model.openSource) return false;
    return true;
  });
}

/**
 * Score a model against requirements (0–100).
 * Primary criterion gets 50% weight, secondary criteria get 25% each.
 */
export function scoreModel(
  model: ModelSpec,
  requirements: TaskRequirements,
): number {
  // Normalize each dimension to 0–100
  const costScore =
    requirements.maxCostPer1kTokens === 0
      ? 100
      : (1 - model.costPer1kTokens / requirements.maxCostPer1kTokens) * 100;
  const qualityScore = (model.reasoningScore / 10) * 100;
  const speedScoreVal = (model.speedScore / 10) * 100;

  // Apply weights based on priority (70/15/15 split)
  switch (requirements.prioritize) {
    case "cost":
      return costScore * 0.7 + qualityScore * 0.15 + speedScoreVal * 0.15;
    case "quality":
      return qualityScore * 0.7 + costScore * 0.15 + speedScoreVal * 0.15;
    case "speed":
      return speedScoreVal * 0.7 + costScore * 0.15 + qualityScore * 0.15;
  }
}

/**
 * Select the best model — filter, score, pick highest.
 */
export function selectBestModel(
  catalog: ModelSpec[],
  requirements: TaskRequirements,
): ModelSpec | null {
  const candidates = filterByConstraints(catalog, requirements);
  if (candidates.length === 0) return null;

  let bestModel = candidates[0];
  let bestScore = scoreModel(candidates[0], requirements);

  for (let i = 1; i < candidates.length; i++) {
    const score = scoreModel(candidates[i], requirements);
    if (score > bestScore) {
      bestScore = score;
      bestModel = candidates[i];
    }
  }

  return bestModel;
}
