/**
 * Exercise: Enforce Structured Output
 * Difficulty: Medium
 *
 * Instructions:
 * Fix functions that parse, validate, and enforce structured JSON output
 * from LLM responses. The parser, validator, and fallback logic all have bugs.
 *
 * Hints:
 * - Models often wrap JSON in ```json ... ``` code fences
 * - Validation should check types, not just whether a field exists
 * - The retry loop should return a default on exhaustion, not throw
 */

export interface SentimentResult {
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  keywords: string[];
}

/**
 * Parse JSON from a model response that might include markdown code fences.
 *
 * BUG: Doesn't strip ```json ... ``` fences before parsing.
 * BUG: Doesn't trim whitespace.
 */
export function parseJsonOutput(raw: string): unknown {
  // BUG: Should strip code fences and trim before parsing
  return JSON.parse(raw);
}

/**
 * Validate that a parsed object matches the SentimentResult schema.
 *
 * BUG: Checks if sentiment is a string but doesn't validate the allowed values.
 * BUG: Doesn't check if confidence is within 0-1 range.
 * BUG: Doesn't verify keywords is an array of strings.
 */
export function validateSentiment(
  data: unknown,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const obj = data as Record<string, unknown>;

  if (typeof obj.sentiment !== "string") {
    errors.push("sentiment must be a string");
  }
  // BUG: Should also check that sentiment is one of the allowed values

  if (typeof obj.confidence !== "number") {
    errors.push("confidence must be a number");
  }
  // BUG: Should check 0-1 range

  // BUG: Should check that keywords is an array AND each element is a string
  if (!obj.keywords) {
    errors.push("keywords is required");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Try to parse and validate output, retrying up to maxRetries times.
 * Returns the default value if all attempts fail.
 *
 * BUG: Throws on final failure instead of returning the default.
 * BUG: Doesn't actually call the validate function.
 */
export function extractWithRetry(
  attempts: string[],
  defaultValue: SentimentResult,
): SentimentResult {
  for (let i = 0; i < attempts.length; i++) {
    try {
      const parsed = parseJsonOutput(attempts[i]);
      // BUG: Should validate before returning
      return parsed as SentimentResult;
    } catch {
      // BUG: On last attempt, should return defaultValue instead of throwing
      if (i === attempts.length - 1) {
        throw new Error("All attempts failed");
      }
    }
  }

  throw new Error("No attempts provided");
}
