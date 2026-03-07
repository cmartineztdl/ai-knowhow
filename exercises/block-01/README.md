# Block 1 Exercises — Talking to Models: APIs & SDKs

> Hands-on exercises to reinforce your understanding of LLM API interactions.

## Setup

```bash
cd exercises/block-01
npm install    # from repo root
npx vitest run # run all tests (they should FAIL initially)
```

## Exercises

| #   | Exercise                           | Difficulty | Topic                          |
| --- | ---------------------------------- | ---------- | ------------------------------ |
| 01  | Build a Chat Completions Client    | Easy       | OpenAI API                     |
| 02  | Normalize Multi-Provider Responses | Easy       | Anthropic API                  |
| 03  | Validate API Configuration         | Medium     | Authentication & key management |
| 04  | Estimate API Costs                 | Medium     | Token counting & pricing       |
| 05  | Implement Retry with Backoff       | Hard       | Error handling & retries       |

## How It Works

Each exercise has:

- `src/index.ts` — Code with bugs or `TODO` stubs for you to fix
- `__tests__/index.test.ts` — Vitest tests that verify your solution
- `README.md` — Instructions, hints, and context

Fix the code in `src/index.ts` until all tests pass. Don't modify the test files!

---

## 🧭 Related Materials

- 📖 [Theory docs for this block](https://cmartineztdl.github.io/ai-knowhow/docs/block-01/)
- ✅ [Solutions for this block](https://github.com/cmartineztdl/ai-knowhow/tree/main/solutions/block-01/)
- 📋 [Course Outline](https://cmartineztdl.github.io/ai-knowhow/docs/COURSE_OUTLINE)
