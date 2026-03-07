/**
 * Exercise: Implement Input Guardrails
 * Difficulty: Hard
 *
 * Instructions:
 * Fix a set of guardrail functions: input sanitization, prompt injection
 * detection, and a sliding-window rate limiter. Each function has multiple bugs.
 *
 * Hints:
 * - Control characters have char codes 0x00–0x1F (except \n and \t)
 * - Injection patterns should be case-insensitive
 * - Rate limiter must remove expired timestamps before checking the count
 */

/**
 * Sanitize user input: strip control characters (except newlines and tabs),
 * trim whitespace, and enforce a maximum length.
 *
 * BUG: Regex strips newlines and tabs when it shouldn't.
 * BUG: Doesn't enforce max length.
 */
export function sanitizeInput(input: string, maxLength: number = 4000): string {
  // BUG: This regex removes ALL control chars including \n (0x0A) and \t (0x09)
  const cleaned = input.replace(/[\x00-\x1F]/g, "");

  // BUG: Missing max length enforcement
  return cleaned.trim();
}

/**
 * Detect common prompt injection patterns in user input.
 * Returns an object with detected: boolean and matched patterns.
 *
 * BUG: Patterns are case-sensitive — should be case-insensitive.
 * BUG: Missing common injection patterns.
 */
export function detectInjection(
  input: string,
): { detected: boolean; patterns: string[] } {
  const injectionPatterns: Array<{ name: string; regex: RegExp }> = [
    // BUG: Missing the case-insensitive flag
    { name: "ignore-instructions", regex: /ignore all previous instructions/ },
    { name: "reveal-prompt", regex: /reveal your (system )?prompt/ },
    // BUG: Missing common patterns like "disregard above", "you are now", etc.
  ];

  const matched = injectionPatterns
    .filter((p) => p.regex.test(input))
    .map((p) => p.name);

  return { detected: matched.length > 0, patterns: matched };
}

/**
 * Create a sliding-window rate limiter.
 * Returns a function that checks whether a request is allowed.
 *
 * BUG: Doesn't clean up expired timestamps from the window.
 * BUG: Always allows requests (never returns false).
 */
export function createRateLimiter(
  maxRequests: number,
  windowMs: number,
): (userId: string) => boolean {
  const requests = new Map<string, number[]>();

  return (userId: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(userId) ?? [];

    // BUG: Should remove timestamps older than the window
    // (currently keeps all timestamps forever)

    userRequests.push(now);
    requests.set(userId, userRequests);

    // BUG: Always returns true — should check if count exceeds maxRequests
    return true;
  };
}
