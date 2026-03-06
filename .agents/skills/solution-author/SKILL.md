---
name: solution-author
description: Generates clean solutions and walkthroughs for course exercises
---

# Solution Author Skill

## Purpose

Produce clean, idiomatic, fully-working solutions for each exercise, along with a step-by-step walkthrough explaining the reasoning.

## Inputs

- **Block number** (e.g., `0`, `1`, `2`)
- Exercise files from `/exercises/block-XX/` (must exist before invoking this skill)

## Output

Files written to `/solutions/block-XX/`:

```
solutions/block-XX/
├── README.md                         # Overview and index of solutions
├── ex-01-topic-slug/
│   ├── src/
│   │   └── index.ts                  # Working solution
│   ├── __tests__/
│   │   └── index.test.ts             # Same tests as exercise (copied)
│   └── WALKTHROUGH.md                # Step-by-step explanation
├── ex-02-topic-slug/
│   └── ...
└── vitest.config.ts                  # Same config as exercises
```

## Instructions

1. **Read** each exercise in `/exercises/block-XX/`.
2. **Copy** the test files exactly as-is from the exercise (tests should not change).
3. **Implement** the solution in `src/index.ts` — clean, idiomatic TypeScript.
4. **Write** `WALKTHROUGH.md` for each exercise.
5. **Verify** all tests pass by running `npx vitest run` in the solution directory.

### Solution Code Style

```typescript
/**
 * Solution: [Exercise Title]
 *
 * Approach: [1-2 sentence summary of the approach taken]
 */

export function functionName(param: Type): ReturnType {
  // Step 1: [What this section does and WHY]
  const intermediate = transform(param);

  // Step 2: [Next logical step]
  return computeResult(intermediate);
}
```

- **Comments explain WHY**, not what (the code should be self-explanatory for "what")
- Use descriptive variable names
- Prefer readability over cleverness
- Follow TypeScript best practices (proper types, no `any`)

### Walkthrough Structure

```markdown
# Walkthrough: [Exercise Title]

## Problem Summary

What was broken/missing and why.

## Approach

High-level strategy for solving the exercise.

## Step-by-Step

### Step 1: [Identify the issue]

Explanation of what was wrong and how to spot it.

### Step 2: [Implement the fix]

Code snippet showing the key change, with explanation.

### Step 3: [Verify]

How to confirm the fix works (run tests, check output).

## Key Learnings

- What concept this exercise reinforced
- Common mistakes to watch out for
- Related concepts to explore next
```

## Quality Checklist

- [ ] Every exercise has a corresponding solution
- [ ] All tests pass when run against the solution
- [ ] Solution code is clean and well-commented
- [ ] WALKTHROUGHs are thorough but concise
- [ ] Test files are identical to exercise test files
- [ ] No hardcoded values that only work for specific test cases
- [ ] _Cross-links to theory docs and exercises are added by the **content-linker** skill — do not add them manually_
