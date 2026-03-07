/**
 * Solution: Enforce Structured Output
 *
 * Approach: Strip code fences before parsing, validate all fields against
 * the schema, and return defaults when all retry attempts fail.
 */

export interface SentimentResult {
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  keywords: string[];
}

/**
 * Parse JSON from a model response that might include markdown code fences.
 * FIX: Strips ```json ... ``` and ``` ... ``` fences, trims whitespace.
 */
export function parseJsonOutput(raw: string): unknown {
  // FIX: Strip code fences and trim
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?\s*```$/i, "");
  cleaned = cleaned.trim();
  return JSON.parse(cleaned);
}

/**
 * Validate that a parsed object matches the SentimentResult schema.
 * FIX: Checks allowed sentiment values, confidence range, and keywords types.
 */
export function validateSentiment(
  data: unknown,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const obj = data as Record<string, unknown>;

  if (typeof obj.sentiment !== "string") {
    errors.push("sentiment must be a string");
  } else if (!["positive", "negative", "neutral"].includes(obj.sentiment)) {
    // FIX: Check allowed values
    errors.push("sentiment must be positive, negative, or neutral");
  }

  if (typeof obj.confidence !== "number") {
    errors.push("confidence must be a number");
  } else if (obj.confidence < 0 || obj.confidence > 1) {
    // FIX: Check range
    errors.push("confidence must be between 0 and 1");
  }

  // FIX: Check that keywords is an array of strings
  if (!Array.isArray(obj.keywords)) {
    errors.push("keywords must be an array");
  } else if (!obj.keywords.every((k: unknown) => typeof k === "string")) {
    errors.push("keywords must contain only strings");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Try to parse and validate output, retrying from a list of attempts.
 * Returns the default value if all attempts fail or result is invalid.
 * FIX: Validates parsed output and returns default on exhaustion.
 */
export function extractWithRetry(
  attempts: string[],
  defaultValue: SentimentResult,
): SentimentResult {
  for (let i = 0; i < attempts.length; i++) {
    try {
      const parsed = parseJsonOutput(attempts[i]);
      // FIX: Validate before returning
      const validation = validateSentiment(parsed);
      if (validation.valid) {
        return parsed as SentimentResult;
      }
    } catch {
      // Parse failed, try next
    }
  }

  // FIX: Return default instead of throwing
  return defaultValue;
}
