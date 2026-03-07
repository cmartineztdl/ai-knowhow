---
name: content-linker
description: Cross-references theory documents so students can navigate between related content
---

# Content Linker Skill

## Purpose

Inject navigation sections into course content files so students can jump seamlessly between theory topics. This skill runs **after** the theory-writer skill and is **idempotent** — running it again replaces existing navigation sections.

## Inputs

- **Block number** (e.g., `0`, `1`, `2`)
- All content for the block must already exist:
  - `/docs/block-XX/*.mdx` (theory-writer)

## Output

Updated markdown files with navigation sections appended or replaced.

## Instructions

### 1. Add navigation to theory docs

For each theory doc (`docs/block-XX/XX-topic-slug.mdx`), append a link to the previous and next topics if they exist, or back to the block outline.

```markdown
---

## 🧭 Navigation

- ⬅️ Previous: [Previous Topic Title](01-previous-topic.mdx) (if applicable)
- ➡️ Next: [Next Topic Title](03-next-topic.mdx) (if applicable)
- 📋 [Back to Block Outline](README.md)
```

## Idempotency

All navigation sections start with `---` followed by `## 🧭`. When re-running the skill:

1. **Search** each file for the marker `## 🧭`
2. If found, **delete** everything from the `---` before it to the end of the file
3. **Re-append** the updated navigation section

This ensures the skill can be run multiple times without duplicating content.

## Quality Checklist

- [ ] Every theory doc links to the previous and next topics
- [ ] All relative paths are correct and resolve to existing files
- [ ] Navigation sections are idempotent (running twice produces the same result)
