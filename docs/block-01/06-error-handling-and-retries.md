---
title: Error Handling & Retries
description: Learn how to build resilient LLM integrations with proper error handling, exponential backoff, and circuit breaker patterns.
keywords: [ai, artificial intelligence, course, free, error handling, retries, exponential backoff, circuit breaker, rate limits, resilience]
---

import Quiz from '@site/src/components/Quiz';

# Error Handling & Retries

> Learn how to build resilient LLM integrations with proper error handling, exponential backoff, and circuit breaker patterns.

## Introduction

LLM APIs are external services, and external services fail. Rate limits, timeouts, server errors, network blips — if your code doesn't handle these gracefully, your application will feel fragile and unreliable. The user doesn't care _why_ it failed; they care that it works.

The good news is that most LLM API errors are **transient** — they go away if you try again after a short wait. That makes retry logic incredibly effective. But naive retries (just hammering the endpoint) make things worse. You need structured strategies: exponential backoff, rate limit awareness, and circuit breakers.

## Core Concepts

### Common API Errors

Both OpenAI and Anthropic return standard HTTP error codes. Know the ones you'll see most often:

```typescript
// Error codes and what they mean
const ERROR_GUIDE = {
  400: "Bad Request — malformed input (fix your code, don't retry)",
  401: "Unauthorized — invalid API key (fix your key, don't retry)",
  403: "Forbidden — insufficient permissions (check your plan/key)",
  404: "Not Found — invalid model or endpoint",
  429: "Rate Limited — too many requests (RETRY with backoff)",
  500: "Internal Server Error — provider issue (RETRY with backoff)",
  502: "Bad Gateway — provider issue (RETRY with backoff)",
  503: "Service Unavailable — overloaded (RETRY with backoff)",
  529: "Overloaded — Anthropic-specific (RETRY with backoff)",
};
```

The key insight: only **retry on transient errors** (429, 5xx). Retrying a 400 or 401 is pointless — those need code changes.

### Exponential Backoff

**Exponential backoff** increases the delay between retries, giving the server time to recover:

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
  } = {},
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 1000, maxDelayMs = 30000 } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const status = error?.status ?? error?.statusCode;
      const isRetryable = status === 429 || (status >= 500 && status < 600);

      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      // Exponential delay with jitter to avoid thundering herd
      const delay = Math.min(
        baseDelayMs * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelayMs,
      );

      console.warn(
        `Attempt ${attempt + 1} failed (${status}). Retrying in ${Math.round(delay)}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Unreachable");
}
```

The **jitter** (random addition) prevents the "thundering herd" problem — if many clients back off to the exact same time, they'll all retry simultaneously and cause another spike.

### Rate Limit Handling

When you hit a rate limit (429), the API usually tells you when to retry via the `Retry-After` header:

```typescript
async function withRateLimitHandling<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (error?.status === 429) {
      // Check for Retry-After header
      const retryAfter = error.headers?.["retry-after"];
      const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 5000;

      console.warn(`Rate limited. Waiting ${waitMs}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));

      return fn(); // single retry after the wait
    }
    throw error;
  }
}

// Usage
const response = await withRateLimitHandling(() =>
  openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: "Hello" }],
  }),
);
```

### Circuit Breaker Pattern

If an API is consistently failing, retrying every request wastes resources and increases latency. A **circuit breaker** "trips" after a threshold of failures and stops making calls for a cooldown period:

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: "closed" | "open" | "half-open" = "closed";

  constructor(
    private threshold: number = 5,
    private cooldownMs: number = 30000,
  ) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime > this.cooldownMs) {
        this.state = "half-open"; // allow one test request
      } else {
        throw new Error("Circuit breaker is open — service unavailable");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = "closed";
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.threshold) {
      this.state = "open";
      console.warn(`Circuit breaker tripped after ${this.failures} failures`);
    }
  }
}

// Usage
const breaker = new CircuitBreaker(5, 30000);

const response = await breaker.call(() =>
  openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: "Hello" }],
  }),
);
```

### Combining Strategies

In practice, you layer these patterns together:

```typescript
const breaker = new CircuitBreaker(5, 30000);

async function callLLM(prompt: string) {
  return breaker.call(() =>
    withRetry(
      () =>
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
        }),
      { maxRetries: 3, baseDelayMs: 1000 },
    ),
  );
}
```

This gives you: retry with backoff for transient errors → circuit break if failures persist → fast fail when the circuit is open.

## Visual Aids

![Diagram showing the circuit breaker state machine: closed state allows requests, open state blocks them, half-open state lets one test request through](images/06-circuit-breaker-states.webp)

## Key Takeaways

- Only **retry transient errors** (429, 5xx) — client errors (4xx) need code fixes
- **Exponential backoff with jitter** prevents overloading the API during recovery
- Read the `Retry-After` header for **rate limit** responses to know exactly when to retry
- **Circuit breakers** protect your app when an API is down for extended periods
- Layer strategies: retry → rate limit handling → circuit breaker for maximum resilience
- Always log retries and failures — you need observability into API reliability

## Further Reading

- [OpenAI Rate Limits](https://platform.openai.com/docs/guides/rate-limits)
- [Anthropic Rate Limits](https://docs.anthropic.com/en/api/rate-limits)
- [Exponential Backoff — AWS Architecture Blog](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [Circuit Breaker Pattern — Martin Fowler](https://martinfowler.com/bliki/CircuitBreaker.html)

## Knowledge Check

<Quiz 
  questions={[
    {
      text: "Which of the following HTTP status codes indicates a 'transient' error that should be retried?",
      options: [
        "400 Bad Request",
        "401 Unauthorized",
        "429 Rate Limited",
        "404 Not Found"
      ],
      correctAnswerIndex: 2,
      explanation: "Retrying a 400 or 401 won't help because those usually indicate a code or configuration bug. A 429 means the server is temporarily overloaded and might respond correctly if you try again later."
    },
    {
      text: "What is the primary purpose of 'exponential backoff' in retry logic?",
      options: [
        "To make the application run faster by skipping errors.",
        "To progressively increase the wait time between retries, giving the server more time to recover from a high load.",
        "To ensure that all retries are completed within 1 second.",
        "To permanently block an API key if it fails more than 3 times."
      ],
      correctAnswerIndex: 1,
      explanation: "By waiting longer and longer between attempts, you reduce the immediate pressure on an overloaded server, increasing the likelihood that the next retry will succeed."
    },
    {
      text: "In the context of retries, what is 'jitter'?",
      options: [
        "A bug that causes the server to shake.",
        "A small, random amount of time added to the backoff delay to prevent many clients from retrying simultaneously.",
        "A type of model hallucination where the text is repetitive.",
        "A security protocol used to verify API requests."
      ],
      correctAnswerIndex: 1,
      explanation: "Jitter prevents the 'thundering herd' problem, where multiple clients all resend their failed requests at the exact same moment, causing a new spike in traffic."
    },
    {
      text: "How does a 'circuit breaker' pattern help protect your application?",
      options: [
        "It stops your app from making any network calls at all to save battery.",
        "It temporarily stops attempting to call a failing service after a certain failure threshold is met, preventing wasted resources and long wait times.",
        "It automatically upgrades your API plan if you run out of credits.",
        "It encrypts your code to prevent unauthorized access."
      ],
      correctAnswerIndex: 1,
      explanation: "If a service is consistently down, a circuit breaker 'trips' and immediately returns an error for any further calls until a cooldown period has passed, sparing your system from useless waiting."
    },
    {
      text: "Where can you often find information on how long to wait before retrying a 429 (Rate Limit) error?",
      options: [
        "In the model's system prompt.",
        "In the 'Retry-After' HTTP header returned by the API.",
        "By searching for the error code on StackOverflow.",
        "You can't; it's always a mystery how long you must wait."
      ],
      correctAnswerIndex: 1,
      explanation: "Most modern APIs include a 'Retry-After' header specifically to tell clients exactly how many seconds to wait before they are allowed to send another request."
    }
  ]}
/>


