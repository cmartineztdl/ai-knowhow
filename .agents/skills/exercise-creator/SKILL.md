---
name: exercise-creator
description: Generates Vitest-based exercises with intentional bugs or gaps for students to fix
---

# Exercise Creator Skill

## Purpose

Create hands-on coding exercises that reinforce the theory. Each exercise uses **Vitest** as the test runner — students make failing tests pass by fixing bugs, filling in implementations, or completing missing logic.

## Inputs

- **Block number** (e.g., `0`, `1`, `2`)
- Theory files from `/docs/block-XX/*.md` (must exist before invoking this skill)

## Output

Files written to `/exercises/block-XX/`:

```
exercises/block-XX/
├── README.md                         # Overview, setup, and exercise list
├── ex-01-topic-slug/
│   ├── README.md                     # Exercise objective, hints, and instructions
│   ├── src/
│   │   └── index.ts                  # Code with bugs or TODO gaps
│   └── __tests__/
│       └── index.test.ts             # Vitest tests that FAIL until student fixes src/
├── ex-02-topic-slug/
│   └── ...
└── vitest.config.ts                  # Shared Vitest config for the block
```

## Instructions

1. **Read** the theory files for the target block.
2. **Create** `/exercises/block-XX/README.md` with:
   - Block title and description
   - Setup instructions (`npm install`, `npx vitest`)
   - List of exercises with difficulty labels
3. **Create** `/exercises/block-XX/vitest.config.ts` with default configuration.
4. **For each exercise**, create the directory structure above.

### Exercise Design Rules

#### Types of Exercises (mix these across the block)

| Type          | Description                                   | Example                               |
| ------------- | --------------------------------------------- | ------------------------------------- |
| **Bug fix**   | Code runs but produces wrong output           | Tokenizer that miscounts tokens       |
| **TODO fill** | Key functions have `// TODO: implement` stubs | Missing embedding similarity function |
| **Refactor**  | Working but messy code needs cleanup          | Hardcoded API calls → parameterized   |
| **Debug**     | Code throws an error the student must trace   | Incorrect API response parsing        |

#### Difficulty Progression

- **ex-01, ex-02**: Easy — isolated function fixes, single concept
- **ex-03, ex-04**: Medium — multiple functions, combining concepts
- **ex-05+**: Hard — end-to-end scenarios, edge cases

### Test File Structure

```typescript
import { describe, it, expect } from 'vitest';
import { functionName } from '../src/index';

describe('Exercise title', () => {
  it('should [expected behavior]', () => {
    // Arrange
    const input = ...;

    // Act
    const result = functionName(input);

    // Assert
    expect(result).toBe(expectedOutput);
  });
});
```

### Source File Structure

```typescript
/**
 * Exercise: [Title]
 * Difficulty: [Easy | Medium | Hard]
 *
 * Instructions:
 * [What the student needs to do — 2-3 sentences]
 *
 * Hints:
 * - [Hint 1]
 * - [Hint 2]
 */

export function functionName(param: Type): ReturnType {
  // TODO: Implement this function
  // It should [description of expected behavior]
  throw new Error("Not implemented");
}
```

## Writing Style

- **Language**: English
- **Comments**: Generous — explain what the function SHOULD do, not how
- **Hints**: Progressive (first hint is vague, last hint is almost the answer)
- **Test names**: Readable sentences (`it('should count tokens using BPE rules')`)

## Quality Checklist

- [ ] Every exercise has a README with clear instructions
- [ ] All tests FAIL out of the box (student must fix to pass)
- [ ] Source files compile without syntax errors (bugs are logical, not syntactic)
- [ ] Difficulty progresses within the block
- [ ] vitest.config.ts is correct and tests can be discovered
- [ ] No solutions are accidentally included in exercise code
- [ ] _Cross-links to theory docs and solutions are added by the **content-linker** skill — do not add them manually_
