# Block 0 Exercises — Foundations: How LLMs Actually Work

> Hands-on exercises to reinforce your understanding of LLM fundamentals.

## Setup

```bash
cd exercises/block-00
npm install    # from repo root
npx vitest run # run all tests (they should FAIL initially)
```

## Exercises

| #   | Exercise                       | Difficulty | Topic                        |
| --- | ------------------------------ | ---------- | ---------------------------- |
| 01  | Fix the Token Counter          | Easy       | Tokenization & embeddings    |
| 02  | Implement Cosine Similarity    | Easy       | Embeddings & vector spaces   |
| 03  | Build a Context Window Manager | Medium     | Context windows & memory     |
| 04  | Configure Inference Parameters | Medium     | Inference parameters         |
| 05  | Model Selection Engine         | Hard       | Model landscape & trade-offs |

## How It Works

Each exercise has:

- `src/index.ts` — Code with bugs or `TODO` stubs for you to fix
- `__tests__/index.test.ts` — Vitest tests that verify your solution
- `README.md` — Instructions, hints, and context

Fix the code in `src/index.ts` until all tests pass. Don't modify the test files!

---

## 🧭 Related Materials

- 📖 [Theory docs for this block](https://cmartineztdl.github.io/ai-knowhow/docs/block-00/)
- ✅ [Solutions for this block](https://github.com/cmartineztdl/ai-knowhow/tree/main/solutions/block-00/)
- 📋 [Course Outline](https://cmartineztdl.github.io/ai-knowhow/docs/COURSE_OUTLINE)
