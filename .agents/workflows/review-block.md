---
description: Review and QA an existing course block
---

# Review Block Workflow

Quality assurance pass over a completed block. Invoke with `/review-block` and specify the block number.

## Prerequisites

- Block content must already exist in `docs/`

## Steps

### 1. Review theory

- Read all files in `/docs/block-XX/`
- Check for: accuracy, clarity, completeness, code correctness
- Verify all `COURSE_OUTLINE.md` topics are covered
- Ensure image references are valid and images exist
- Flag any technical inaccuracies or unclear explanations



### 2. Verify document SEO

- Check all `.md` files in `/docs/block-XX/` for existing SEO frontmatter (title, description, keywords)
- If frontmatter is missing, inaccurate, or missing target keywords like "course" and "free", re-run the **docs-seo** skill (`.agents/skills/docs-seo/SKILL.md`) on the block's files

### 3. Verify repository SEO

- Confirm the root `README.md` lists the reviewed block with correct links
- Verify all block links resolve to existing directories
- Check that the README heading and description are keyword-rich
- If the README is out of date, re-run the **repo-seo** skill (`.agents/skills/repo-seo/SKILL.md`)

### 4. Report

Create a summary of findings:

- ✅ What looks good
- ⚠️ Suggestions for improvement
- ❌ Issues that must be fixed

Present the report to the user for review.
