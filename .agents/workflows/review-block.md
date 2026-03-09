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



### 2. Validate Quizzes

- Ensure there is an interactive `<Quiz />` at the bottom of each `.md` file in `/docs/block-XX/`
- Verify that each quiz contains exactly 5 multiple choice questions
- If missing, or if it doesn't have 5 questions, run the **quiz-generator** skill (`.agents/skills/quiz-generator/SKILL.md`) to re-generate the quiz.

### 3. Verify document SEO

- Check all `.md` files in `/docs/block-XX/` for existing SEO frontmatter (title, description, keywords)
- If frontmatter is missing, inaccurate, or missing target keywords like "course" and "free", re-run the **docs-seo** skill (`.agents/skills/docs-seo/SKILL.md`) on the block's files

### 4. Verify repository SEO

- Confirm the root `README.md` lists the reviewed block with correct links
- Verify all block links resolve to existing directories
- Check that the README heading and description are keyword-rich
- If the README is out of date, re-run the **repo-seo** skill (`.agents/skills/repo-seo/SKILL.md`)

### 5. Report

Create a summary of findings:

- ✅ What looks good
- ⚠️ Suggestions for improvement
- ❌ Issues that must be fixed

Present the report to the user for review.
