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

### 2. Generate content docs

// turbo
Use the **theory-writer** skill (`.agents/skills/theory-writer/SKILL.md`):

- Read the skill instructions
- Create `/docs/block-XX/README.md` and one file per topic
- Follow the document structure and writing style from the skill

### 3. Generate images

Use the **image-generator** skill (`.agents/skills/image-generator/SKILL.md`):

- Scan the content docs for image placeholders and complex concepts
- Generate images using the `generate_image` tool
- Save to `/docs/block-XX/images/`
- Update markdown files with embedded image references



### 4. Create document SEO metadata

Use the **docs-seo** skill (`.agents/skills/docs-seo/SKILL.md`):

- Read the skill instructions
- Scan the newly generated `.md` files in `/docs/block-XX/`
- Inject the appropriate SEO frontmatter (title, description, keywords) for each file

### 5. Generate interactive quizzes

Use the **quiz-generator** skill (`.agents/skills/quiz-generator/SKILL.md`):

- Read the skill instructions
- Scan the newly generated `.md` files in `/docs/block-XX/`
- For each file, generate 5 questions and append the Quiz component to the end

### 6. Update repository & website SEO

Use the **repo-seo** skill (`.agents/skills/repo-seo/SKILL.md`):

- Read the skill instructions
- Regenerate the root `README.md` to include the new block
- Regenerate `src/pages/index.mdx` (Docusaurus homepage)
- Verify both files render correctly and contain the updated block list

### 7. Manual Review

Review the generated changes in your IDE and on the local dev server. Once satisfied, you can manually commit the changes.

Replace `XX` with the actual block number.
