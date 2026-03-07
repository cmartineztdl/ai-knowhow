---
name: theory-writer
description: Generates structured theory documentation in Markdown for a given course block
---

# Theory Writer Skill

## Purpose

Generate clear, developer-friendly theory documents for a course block. Each topic from the `COURSE_OUTLINE.md` becomes a dedicated `.md` file.

## Inputs

- **Block number** (e.g., `0`, `1`, `2`)
- Topics are extracted from [COURSE_OUTLINE.md](docs/COURSE_OUTLINE.md)

## Output

Files written to `/docs/block-XX/` — one `.md` per topic, plus a `README.md` table of contents.

## Instructions

1. **Read** `docs/COURSE_OUTLINE.md` and extract all topics for the target block.
2. **Create** `/docs/block-XX/README.md` with:
   - Block title and description
   - Numbered list linking to each topic file
   - Prerequisites (which blocks should be completed first)
3. **For each topic**, create `/docs/block-XX/XX-topic-slug.md` following this structure:

### Document Structure

```markdown
# Topic Title

> One-sentence summary of what the reader will learn.

## Introduction

Brief context: why this matters for a developer working with AI.
(2–3 paragraphs)

## Core Concepts

### Concept A

Explanation with code examples in JavaScript/TypeScript.

### Concept B

Explanation with code examples.

(repeat as needed)

## Visual Aids

![description](images/placeholder-name.webp)
Include image placeholders where diagrams or illustrations would help.
Describe what the image should show in the alt text.

## Key Takeaways

- Bullet list of 3–5 main points

## Further Reading

- Links to official docs, papers, or blog posts
```

## Writing Style

- **Language**: English
- **Tone**: Conversational but precise — like a senior dev explaining to a mid-level colleague
- **Length**: 500–800 words per topic (scannable, not academic)
- **Code**: All code examples in JavaScript/TypeScript with syntax highlighting
- **Jargon**: Define technical terms on first use
- **Analogies**: Use real-world analogies to explain abstract concepts
- **No hard line breaks**: Never hard-wrap prose paragraphs at a fixed column width. Write each paragraph as a single line and let Markdown renderers handle wrapping.

## File Naming

- Use kebab-case: `01-tokenization-and-embeddings.md`
- Number prefix for ordering: `01-`, `02-`, etc.
- Topic slug derived from the topic name in the outline

## Quality Checklist

- [ ] Every topic from the outline has a corresponding file
- [ ] `README.md` links to all topic files
- [ ] Code examples are syntactically correct and runnable
- [ ] Image placeholders have descriptive alt text
- [ ] No placeholder/lorem text left behind
- [ ] _Cross-links to exercises and tools are added by the **content-linker** skill — do not add them manually_
