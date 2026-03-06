---
name: content-linker
description: Cross-references theory, exercises, solutions, and tools so students can navigate between related content
---

# Content Linker Skill

## Purpose

Inject navigation sections into all course content files so students can jump seamlessly between theory, exercises, solutions, and tools. This skill runs **after** all other content-generation skills and is **idempotent** — running it again replaces existing navigation sections.

## Inputs

- **Block number** (e.g., `0`, `1`, `2`)
- All content for the block must already exist:
  - `/docs/block-XX/*.md` (theory-writer)
  - `/exercises/block-XX/` (exercise-creator)
  - `/solutions/block-XX/` (solution-author)
  - `/tools/` (tool-builder, if applicable)

## Output

Updated markdown files across all four content directories with navigation sections appended or replaced.

## Instructions

### 1. Build the content map

Read the block content and build a mapping that connects each topic to its related resources:

```
Topic: "Tokenization & Embeddings"
├── Theory:    docs/block-00/01-tokenization-and-embeddings.md
├── Exercise:  exercises/block-00/ex-01-token-counter/
├── Solution:  solutions/block-00/ex-01-token-counter/WALKTHROUGH.md
└── Tool:      tools/token-counter.ts (if applicable)
```

**How to build the map:**

1. Read `docs/block-XX/index.md` to get the ordered list of topics and their filenames
2. Read `exercises/block-XX/README.md` to get exercise names and their topic associations
3. Read `solutions/block-XX/README.md` to get solution names
4. Read `tools/README.md` to find tools tagged with this block number
5. Match exercises to topics by comparing the "Topic" column in the exercise table to the topic names from the theory index

### 2. Add navigation to theory docs

For each theory file (`docs/block-XX/XX-topic-slug.md`), **append** a navigation section after the existing content:

```markdown
---

## 🧭 Navigation

### Practice This

- 🏋️ [Exercise: Fix the Token Counter](../../exercises/block-00/ex-01-token-counter/)
- 🔧 [Tool: token-counter.ts](../../tools/token-counter.ts)

### Continue Reading

- ⬅️ Previous: (none — this is the first topic)
- ➡️ Next: [Transformer Architecture](02-transformer-architecture.md)
- 📚 [Back to Block Index](index.md)
```

**Rules:**

- Include exercise links only if a matching exercise exists for this topic
- Include tool links only if a matching tool exists for this topic
- Previous/Next links are based on the file numbering order
- First topic has no "Previous"; last topic has no "Next"

### 3. Add navigation to theory index

For `docs/block-XX/index.md`, add a **Resources** section after the existing content:

```markdown
---

## 🧭 Resources

- 🏋️ [Exercises for this block](../../exercises/block-00/)
- ✅ [Solutions for this block](../../solutions/block-00/)
- 🔧 [Tools](../../tools/)
- 📋 [Course Outline](../COURSE_OUTLINE.md)
```

### 4. Add navigation to exercise READMEs

For each exercise README (`exercises/block-XX/ex-*/README.md`), append:

```markdown
---

## 🧭 Related Materials

- 📖 [Theory: Tokenization & Embeddings](../../../docs/block-00/01-tokenization-and-embeddings.md)
- ✅ [Solution & Walkthrough](../../../solutions/block-00/ex-01-token-counter/WALKTHROUGH.md)
```

For the block-level `exercises/block-XX/README.md`, append:

```markdown
---

## 🧭 Related Materials

- 📖 [Theory docs for this block](../../docs/block-00/)
- ✅ [Solutions for this block](../../solutions/block-00/)
- 📋 [Course Outline](../../docs/COURSE_OUTLINE.md)
```

### 5. Add navigation to solution walkthroughs

For each `solutions/block-XX/ex-*/WALKTHROUGH.md`, append:

```markdown
---

## 🧭 Related Materials

- 📖 [Theory: Tokenization & Embeddings](../../../docs/block-00/01-tokenization-and-embeddings.md)
- 🏋️ [Exercise](../../../exercises/block-00/ex-01-token-counter/)
```

For the block-level `solutions/block-XX/README.md`, append:

```markdown
---

## 🧭 Related Materials

- 📖 [Theory docs for this block](../../docs/block-00/)
- 🏋️ [Exercises for this block](../../exercises/block-00/)
- 📋 [Course Outline](../../docs/COURSE_OUTLINE.md)
```

### 6. Update tools README

For each tool in `tools/README.md` that is tagged with this block, add a "Related theory" column or update the description to include a link:

```markdown
| Tool                                 | Description                       | Block | Related Theory                                                                  |
| ------------------------------------ | --------------------------------- | ----- | ------------------------------------------------------------------------------- |
| [token-counter.ts](token-counter.ts) | Estimate token count and API cost | 0     | [Tokenization & Embeddings](../docs/block-00/01-tokenization-and-embeddings.md) |
```

## Idempotency

All navigation sections start with `---` followed by `## 🧭`. When re-running the skill:

1. **Search** each file for the marker `## 🧭`
2. If found, **delete** everything from the `---` before it to the end of the file
3. **Re-append** the updated navigation section

This ensures the skill can be run multiple times without duplicating content.

## Relative Path Reference

All links must use **relative paths** so they work in GitHub, local editors, and static site generators. Use `../` notation based on the file's location.

| From                                        | To                                          | Example relative path                                            |
| ------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| `docs/block-00/01-*.md`                     | `exercises/block-00/ex-01-*/`               | `../../exercises/block-00/ex-01-token-counter/`                  |
| `docs/block-00/01-*.md`                     | `tools/token-counter.ts`                    | `../../tools/token-counter.ts`                                   |
| `exercises/block-00/ex-01-*/README.md`      | `docs/block-00/01-*.md`                     | `../../../docs/block-00/01-tokenization-and-embeddings.md`       |
| `exercises/block-00/ex-01-*/README.md`      | `solutions/block-00/ex-01-*/WALKTHROUGH.md` | `../../../solutions/block-00/ex-01-token-counter/WALKTHROUGH.md` |
| `solutions/block-00/ex-01-*/WALKTHROUGH.md` | `docs/block-00/01-*.md`                     | `../../../docs/block-00/01-tokenization-and-embeddings.md`       |
| `tools/README.md`                           | `docs/block-00/01-*.md`                     | `../docs/block-00/01-tokenization-and-embeddings.md`             |

## Quality Checklist

- [ ] Every theory doc has a "Practice This" section linking to its exercise (if one exists)
- [ ] Every theory doc has Previous/Next links and a "Back to Index" link
- [ ] Theory index links to exercises, solutions, and tools directories
- [ ] Every exercise README links back to its theory doc and its solution
- [ ] Every solution walkthrough links back to its theory doc and exercise
- [ ] Tools README links to related theory docs
- [ ] All relative paths are correct and resolve to existing files
- [ ] Navigation sections are idempotent (running twice produces the same result)
