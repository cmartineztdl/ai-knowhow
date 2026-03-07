/**
 * Exercise: Implement Retry with Backoff
 * Difficulty: Hard
 *
 * Instructions:
 * Fix the retry utility functions. The retry logic should only retry on
 * transient errors (429, 5xx), use exponential backoff with jitter,
 * and respect a maximum retry count.
 *
 * Hints:
 * - Only retry on status 429 or 5xx (500-599)
 * - Exponential backoff: baseDelay * 2^attempt
 * - Add jitter (randomness) to prevent thundering herd
 * - The delay should never exceed maxDelay
 */

export interface RetryOptions {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

export interface ApiError {
  status: number;
  message: string;
}

export const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
};

/**
 * Determine if an error is retryable.
 *
 * BUG: Currently considers ALL errors retryable.
 * Should only retry on 429 (rate limit) and 5xx (server errors).
 */
export function isRetryableError(error: ApiError): boolean {
  // BUG: This retries everything — should only retry 429 and 5xx
  return error.status >= 400;
}

/**
 * Calculate delay for a given retry attempt using exponential backoff.
 *
 * BUG: Uses linear backoff instead of exponential.
 * BUG: Doesn't cap at maxDelay.
 */
export function calculateDelay(
  attempt: number,
  options: RetryOptions,
): number {
  // BUG: Should be baseDelay * 2^attempt (exponential), not baseDelay * attempt (linear)
  const delay = options.baseDelayMs * attempt;
  // BUG: Missing Math.min to cap at maxDelayMs
  return delay;
}

/**
 * Execute a function with retry logic.
 *
 * BUG: The retry loop has an off-by-one error — it retries one too many times.
 * BUG: It doesn't check if the error is retryable before retrying.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = DEFAULT_OPTIONS,
): Promise<{ result: T; attempts: number }> {
  let lastError: ApiError | undefined;

  // BUG: Should be <= maxRetries (0 is first attempt, then up to maxRetries retries)
  // Currently iterates one extra time
  for (let attempt = 0; attempt <= options.maxRetries + 1; attempt++) {
    try {
      const result = await fn();
      return { result, attempts: attempt + 1 };
    } catch (error) {
      lastError = error as ApiError;

      // BUG: Should check isRetryableError before retrying
      if (attempt < options.maxRetries) {
        const delay = calculateDelay(attempt, options);
        // In tests we use fake timers, so this is fine
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
