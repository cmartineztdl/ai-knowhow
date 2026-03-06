/**
 * Solution: Configure Inference Parameters
 *
 * Approach: Fix the swapped presets, implement range validation,
 * and use object spread for merging with overrides.
 */

export interface InferenceParams {
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
}

export type UseCase =
  | "code_generation"
  | "creative_writing"
  | "data_extraction"
  | "conversation";

/**
 * Get recommended inference parameters for a specific use case.
 * FIX: Corrected all preset values to match their intended use cases.
 */
export function getParametersForUseCase(useCase: UseCase): InferenceParams {
  const presets: Record<UseCase, InferenceParams> = {
    // FIX: Code generation should be deterministic
    code_generation: {
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 4000,
    },
    // FIX: Creative writing should be high temperature
    creative_writing: {
      temperature: 1.2,
      top_p: 0.9,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      max_tokens: 2000,
    },
    // FIX: Data extraction should be very focused
    data_extraction: {
      temperature: 0,
      top_p: 0.1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 500,
    },
    // FIX: Conversation should be balanced
    conversation: {
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
      max_tokens: 1000,
    },
  };

  return presets[useCase];
}

/**
 * Validate that inference parameters are within acceptable ranges.
 */
export function validateParameters(params: InferenceParams): string[] {
  const errors: string[] = [];

  if (params.temperature < 0 || params.temperature > 2) {
    errors.push("temperature must be between 0 and 2");
  }
  if (params.top_p < 0 || params.top_p > 1) {
    errors.push("top_p must be between 0 and 1");
  }
  if (params.frequency_penalty < 0 || params.frequency_penalty > 2) {
    errors.push("frequency_penalty must be between 0 and 2");
  }
  if (params.presence_penalty < 0 || params.presence_penalty > 2) {
    errors.push("presence_penalty must be between 0 and 2");
  }
  if (params.max_tokens < 1 || params.max_tokens > 128000) {
    errors.push("max_tokens must be between 1 and 128000");
  }

  return errors;
}

/**
 * Merge user-provided overrides with default parameters.
 */
export function mergeWithDefaults(
  defaults: InferenceParams,
  overrides: Partial<InferenceParams>,
): InferenceParams {
  return { ...defaults, ...overrides };
}
