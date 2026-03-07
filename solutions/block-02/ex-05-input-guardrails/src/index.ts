/**
 * Solution: Implement Input Guardrails
 *
 * Approach: Preserve safe whitespace chars, use case-insensitive injection
 * patterns, and implement sliding-window rate limiting with expiry cleanup.
 */

/**
 * Sanitize user input: strip control characters (except newlines and tabs),
 * trim whitespace, and enforce a maximum length.
 * FIX: Preserves \n and \t, enforces maxLength.
 */
export function sanitizeInput(input: string, maxLength: number = 4000): string {
  // FIX: Remove control chars EXCEPT \t (0x09) and \n (0x0A)
  const cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");

  // FIX: Enforce max length before trimming
  return cleaned.slice(0, maxLength).trim();
}

/**
 * Detect common prompt injection patterns in user input.
 * FIX: Case-insensitive flag and more comprehensive patterns.
 */
export function detectInjection(
  input: string,
): { detected: boolean; patterns: string[] } {
  const injectionPatterns: Array<{ name: string; regex: RegExp }> = [
    // FIX: Added case-insensitive flag (i) to all patterns
    { name: "ignore-instructions", regex: /ignore\s+(all\s+)?previous\s+instructions/i },
    { name: "reveal-prompt", regex: /reveal\s+your\s+(system\s+)?prompt/i },
    // FIX: Added missing patterns
    { name: "disregard", regex: /disregard\s+(the\s+)?(above|previous)/i },
    { name: "role-override", regex: /you\s+are\s+now\s+a/i },
  ];

  const matched = injectionPatterns
    .filter((p) => p.regex.test(input))
    .map((p) => p.name);

  return { detected: matched.length > 0, patterns: matched };
}

/**
 * Create a sliding-window rate limiter.
 * FIX: Cleans expired timestamps and enforces the limit.
 */
export function createRateLimiter(
  maxRequests: number,
  windowMs: number,
): (userId: string) => boolean {
  const requests = new Map<string, number[]>();

  return (userId: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(userId) ?? [];

    // FIX: Remove timestamps outside the current window
    const validRequests = userRequests.filter((t) => now - t < windowMs);

    // FIX: Check if limit is exceeded BEFORE adding the new request
    if (validRequests.length >= maxRequests) {
      requests.set(userId, validRequests);
      return false;
    }

    validRequests.push(now);
    requests.set(userId, validRequests);
    return true;
  };
}
