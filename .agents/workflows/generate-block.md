---
description: Generate all content for a course block end-to-end
---

# Generate Block Workflow

End-to-end content generation for a single course block. Invoke with `/generate-block` and specify the block number.

## Prerequisites

- `docs/COURSE_OUTLINE.md` must exist with the block definition
- Dependencies installed (`npm install`)

## Steps

### 1. Extract block topics

Read `docs/COURSE_OUTLINE.md` and identify all topics for the target block number. Note the topic names and key concepts.

### 2. Generate theory docs

// turbo
Use the **theory-writer** skill (`.agents/skills/theory-writer/SKILL.md`):

- Read the skill instructions
- Create `/docs/block-XX/README.md` and one file per topic
- Follow the document structure and writing style from the skill

### 3. Generate images

Use the **image-generator** skill (`.agents/skills/image-generator/SKILL.md`):

- Scan the theory docs for image placeholders and complex concepts
- Generate images using the `generate_image` tool
- Save to `/docs/block-XX/images/`
- Update markdown files with embedded image references

### 4. Generate exercises

Use the **exercise-creator** skill (`.agents/skills/exercise-creator/SKILL.md`):

- Read the theory docs for context
- Create `/exercises/block-XX/` with Vitest-based exercises
- Ensure tests FAIL out of the box
- Create `vitest.config.ts` and exercise READMEs

### 5. Generate solutions

Use the **solution-author** skill (`.agents/skills/solution-author/SKILL.md`):

- Read the exercises
- Create `/solutions/block-XX/` with working implementations
- Write WALKTHROUGH.md for each exercise
- Copy test files from exercises

### 6. Generate tools (if applicable)

Use the **tool-builder** skill (`.agents/skills/tool-builder/SKILL.md`):

- Only if the block has relevant tool ideas (see tool ideas table in the skill)
- Create utility scripts in `/tools/`
- Update `/tools/README.md`

### 7. Cross-link content

Use the **content-linker** skill (`.agents/skills/content-linker/SKILL.md`):

- Build the content map for the block (topic → exercise → solution → tool)
- Add navigation sections to all theory docs, exercise READMEs, solution walkthroughs, and tools README
- Verify all relative paths resolve to existing files

### 8. Verify solutions

// turbo

```bash
npx vitest run --root solutions/block-XX
```

All tests must pass. If any fail, fix the solution and re-run.

### 9. Verify exercises fail

// turbo

```bash
npx vitest run --root exercises/block-XX 2>&1 || true
```

Confirm tests fail (this is expected — exercises are broken by design).

### 10. Commit

```bash
git add docs/block-XX exercises/block-XX solutions/block-XX tools/
git commit -m "Add theory, exercises, solutions, and tools for block block-XX"
```

Replace `XX` with the actual block number.
