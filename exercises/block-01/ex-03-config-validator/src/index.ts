/**
 * Exercise: Validate API Configuration
 * Difficulty: Medium
 *
 * Instructions:
 * Fix the configuration validation functions. They should check for required
 * API keys, validate their format, and identify the correct provider.
 *
 * Hints:
 * - OpenAI keys start with "sk-" (but NOT "sk-ant-")
 * - Anthropic keys start with "sk-ant-"
 * - Check the more specific pattern (sk-ant-) BEFORE the general one (sk-)
 * - A key must be at least 20 characters long to be considered valid
 */

export interface ApiConfig {
  provider: "openai" | "anthropic";
  apiKey: string;
  model: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate that an API key has the correct format.
 *
 * BUG: The minimum length check is wrong.
 * BUG: The format regex doesn't match real key patterns.
 */
export function validateApiKey(key: string): ValidationResult {
  const errors: string[] = [];

  if (!key || key.trim() === "") {
    return { valid: false, errors: ["API key is required"] };
  }

  // BUG: Should check for minimum length of 20, not maximum
  if (key.length > 20) {
    errors.push("API key is too short (minimum 20 characters)");
  }

  // BUG: This pattern rejects valid keys — it requires exactly "sk-" followed
  // by only alphanumeric chars, but real keys can have hyphens and underscores
  const validPattern = /^sk-[a-zA-Z0-9]+$/;
  if (!validPattern.test(key)) {
    errors.push(
      "API key format is invalid (must start with 'sk-' followed by alphanumeric characters, hyphens, or underscores)",
    );
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Detect the provider from an API key prefix.
 *
 * BUG: Checks the generic prefix before the specific one,
 * so Anthropic keys get misidentified as OpenAI.
 */
export function getProviderFromKey(
  key: string,
): "openai" | "anthropic" | "unknown" {
  // BUG: "sk-ant-..." starts with "sk-", so this matches first
  if (key.startsWith("sk-")) {
    return "openai";
  }
  if (key.startsWith("sk-ant-")) {
    return "anthropic";
  }
  return "unknown";
}

/**
 * Load and validate configuration from environment-like object.
 */
export function loadConfig(
  env: Record<string, string | undefined>,
): { config: ApiConfig | null; errors: string[] } {
  const errors: string[] = [];

  const openaiKey = env["OPENAI_API_KEY"];
  const anthropicKey = env["ANTHROPIC_API_KEY"];

  if (!openaiKey && !anthropicKey) {
    errors.push(
      "At least one API key is required (OPENAI_API_KEY or ANTHROPIC_API_KEY)",
    );
    return { config: null, errors };
  }

  // Pick the first available key
  const apiKey = openaiKey ?? anthropicKey!;
  const validation = validateApiKey(apiKey);

  if (!validation.valid) {
    return { config: null, errors: validation.errors };
  }

  const provider = getProviderFromKey(apiKey);
  if (provider === "unknown") {
    errors.push("Could not determine provider from API key format");
    return { config: null, errors };
  }

  const defaultModels: Record<string, string> = {
    openai: "gpt-4o",
    anthropic: "claude-sonnet-4-20250514",
  };

  return {
    config: {
      provider,
      apiKey,
      model: env["MODEL"] ?? defaultModels[provider],
    },
    errors: [],
  };
}
