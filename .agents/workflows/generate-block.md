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



### 5. Update repository SEO

Use the **repo-seo** skill (`.agents/skills/repo-seo/SKILL.md`):

- Regenerate the root `README.md` to include the new block
- Verify the README renders correctly in Markdown

### 6. Commit

```bash
git add docs/block-XX README.md
git commit -m "Add theory docs for block block-XX"
```

Replace `XX` with the actual block number.
