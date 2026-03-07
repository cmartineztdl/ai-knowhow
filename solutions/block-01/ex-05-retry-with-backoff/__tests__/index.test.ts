import { describe, it, expect, vi } from "vitest";
import {
  isRetryableError,
  calculateDelay,
  withRetry,
  DEFAULT_OPTIONS,
} from "../src/index";
import type { ApiError, RetryOptions } from "../src/index";

describe("Exercise 05: Implement Retry with Backoff", () => {
  describe("isRetryableError", () => {
    it("should retry on 429 (rate limit)", () => {
      expect(isRetryableError({ status: 429, message: "Too many requests" }))
        .toBe(true);
    });

    it("should retry on 500 (internal server error)", () => {
      expect(isRetryableError({ status: 500, message: "Server error" }))
        .toBe(true);
    });

    it("should retry on 503 (service unavailable)", () => {
      expect(isRetryableError({ status: 503, message: "Unavailable" }))
        .toBe(true);
    });

    it("should NOT retry on 400 (bad request)", () => {
      expect(isRetryableError({ status: 400, message: "Bad request" }))
        .toBe(false);
    });

    it("should NOT retry on 401 (unauthorized)", () => {
      expect(isRetryableError({ status: 401, message: "Unauthorized" }))
        .toBe(false);
    });

    it("should NOT retry on 404 (not found)", () => {
      expect(isRetryableError({ status: 404, message: "Not found" }))
        .toBe(false);
    });
  });

  describe("calculateDelay", () => {
    const options: RetryOptions = {
      maxRetries: 3,
      baseDelayMs: 1000,
      maxDelayMs: 10000,
    };

    it("should use exponential backoff (delay doubles each attempt)", () => {
      const delay0 = calculateDelay(0, options);
      const delay1 = calculateDelay(1, options);
      const delay2 = calculateDelay(2, options);

      // 1000 * 2^0 = 1000, 1000 * 2^1 = 2000, 1000 * 2^2 = 4000
      expect(delay0).toBe(1000);
      expect(delay1).toBe(2000);
      expect(delay2).toBe(4000);
    });

    it("should cap delay at maxDelayMs", () => {
      const delay = calculateDelay(10, options); // 1000 * 2^10 = 1024000 > 10000
      expect(delay).toBe(10000);
    });
  });

  describe("withRetry", () => {
    it("should return result on first success", async () => {
      const fn = vi.fn().mockResolvedValue("success");
      const { result, attempts } = await withRetry(fn);

      expect(result).toBe("success");
      expect(attempts).toBe(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should retry on retryable errors and succeed", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce({ status: 429, message: "Rate limited" })
        .mockRejectedValueOnce({ status: 500, message: "Server error" })
        .mockResolvedValue("recovered");

      const options = { maxRetries: 3, baseDelayMs: 10, maxDelayMs: 100 };
      const { result, attempts } = await withRetry(fn, options);

      expect(result).toBe("recovered");
      expect(attempts).toBe(3);
    });

    it("should NOT retry on non-retryable errors", async () => {
      const fn = vi
        .fn()
        .mockRejectedValue({ status: 401, message: "Unauthorized" });

      const options = { maxRetries: 3, baseDelayMs: 10, maxDelayMs: 100 };

      await expect(withRetry(fn, options)).rejects.toEqual({
        status: 401,
        message: "Unauthorized",
      });
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should throw after exhausting all retries", async () => {
      const fn = vi
        .fn()
        .mockRejectedValue({ status: 500, message: "Server error" });

      const options = { maxRetries: 2, baseDelayMs: 10, maxDelayMs: 100 };

      await expect(withRetry(fn, options)).rejects.toEqual({
        status: 500,
        message: "Server error",
      });
      // 1 initial + 2 retries = 3 total
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });
});
