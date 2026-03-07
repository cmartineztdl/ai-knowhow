---
description: Review and QA an existing course block
---

# Review Block Workflow

Quality assurance pass over a completed block. Invoke with `/review-block` and specify the block number.

## Prerequisites

- Block content must already exist in `docs/`, `exercises/`, and `solutions/`

## Steps

### 1. Review theory

- Read all files in `/docs/block-XX/`
- Check for: accuracy, clarity, completeness, code correctness
- Verify all `COURSE_OUTLINE.md` topics are covered
- Ensure image references are valid and images exist
- Flag any technical inaccuracies or unclear explanations

### 2. Review exercises

- Read all exercises in `/exercises/block-XX/`
- Check: clear instructions, progressive difficulty, no accidental solutions
- Verify exercises compile without syntax errors:

// turbo

```bash
npx tsc --noEmit --project exercises/block-XX/tsconfig.json 2>&1 || true
```

- Run tests and confirm they FAIL:

// turbo

```bash
npx vitest run --root exercises/block-XX 2>&1 || true
```

### 3. Review solutions

- Read all solutions in `/solutions/block-XX/`
- Check: code quality, comments explain "why", walkthrough is helpful
- Run tests and confirm they PASS:

// turbo

```bash
npx vitest run --root solutions/block-XX
```

### 4. Cross-reference

- Verify exercises map 1:1 with solutions
- Verify test files are identical between exercises and solutions
- Check that theory covers all concepts tested in exercises
- Verify **content-linker** navigation sections exist (`.agents/skills/content-linker/SKILL.md`):
  - Every theory doc has "Practice This" and Previous/Next links
  - Every exercise README links to its theory doc and solution
  - Every solution walkthrough links to its theory doc and exercise
  - All relative paths resolve to existing files

### 5. Verify repository SEO

- Confirm the root `README.md` lists the reviewed block with correct links
- Verify all block links resolve to existing directories
- Check that the README heading and description are keyword-rich
- If the README is out of date, re-run the **repo-seo** skill (`.agents/skills/repo-seo/SKILL.md`)

### 6. Report

Create a summary of findings:

- ✅ What looks good
- ⚠️ Suggestions for improvement
- ❌ Issues that must be fixed

Present the report to the user for review.
