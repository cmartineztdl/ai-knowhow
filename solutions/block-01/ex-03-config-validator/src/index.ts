/**
 * Solution: Validate API Configuration
 *
 * Approach: Fix the key validation regex to accept hyphens/underscores, fix the length
 * check direction, and check specific prefixes before generic ones.
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
 * FIX: Check minimum length, accept hyphens and underscores in keys.
 */
export function validateApiKey(key: string): ValidationResult {
  const errors: string[] = [];

  if (!key || key.trim() === "") {
    return { valid: false, errors: ["API key is required"] };
  }

  // FIX: Check for minimum length (key.length < 20)
  if (key.length < 20) {
    errors.push("API key is too short (minimum 20 characters)");
  }

  // FIX: Accept hyphens and underscores in addition to alphanumeric chars
  const validPattern = /^sk-[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(key)) {
    errors.push(
      "API key format is invalid (must start with 'sk-' followed by alphanumeric characters, hyphens, or underscores)",
    );
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Detect the provider from an API key prefix.
 * FIX: Check the more specific prefix (sk-ant-) BEFORE the generic (sk-).
 */
export function getProviderFromKey(
  key: string,
): "openai" | "anthropic" | "unknown" {
  // FIX: Check for Anthropic first (more specific prefix)
  if (key.startsWith("sk-ant-")) {
    return "anthropic";
  }
  if (key.startsWith("sk-")) {
    return "openai";
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
