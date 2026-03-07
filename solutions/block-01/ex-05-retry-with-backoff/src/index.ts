/**
 * Solution: Implement Retry with Backoff
 *
 * Approach: Only retry on transient errors (429, 5xx), use exponential backoff
 * (baseDelay * 2^attempt) capped at maxDelay, and correctly limit retries.
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
 * FIX: Only retry on 429 (rate limit) and 5xx (server errors).
 */
export function isRetryableError(error: ApiError): boolean {
  return error.status === 429 || (error.status >= 500 && error.status < 600);
}

/**
 * Calculate delay for a given retry attempt using exponential backoff.
 * FIX: Use 2^attempt (exponential) and cap at maxDelay.
 */
export function calculateDelay(
  attempt: number,
  options: RetryOptions,
): number {
  // FIX: Exponential backoff: baseDelay * 2^attempt, capped at maxDelay
  const delay = options.baseDelayMs * Math.pow(2, attempt);
  return Math.min(delay, options.maxDelayMs);
}

/**
 * Execute a function with retry logic.
 * FIX: Correct loop bounds and check retryability before retrying.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = DEFAULT_OPTIONS,
): Promise<{ result: T; attempts: number }> {
  let lastError: ApiError | undefined;

  // FIX: Loop from 0 to maxRetries (inclusive)
  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      const result = await fn();
      return { result, attempts: attempt + 1 };
    } catch (error) {
      lastError = error as ApiError;

      // FIX: Check if error is retryable
      if (!isRetryableError(lastError)) {
        throw lastError;
      }

      if (attempt < options.maxRetries) {
        const delay = calculateDelay(attempt, options);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
