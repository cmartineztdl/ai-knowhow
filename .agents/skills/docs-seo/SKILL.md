---
description: Automatically review, update, and fix SEO metadata found in the frontmatter of Markdown and MDX files.
---

# `docs-seo` Skill

This skill is designed to manage and optimize Search Engine Optimization (SEO) metadata across all Markdown (`.md`) and MDX (`.mdx`) files in the Docusaurus project.

## How it works
Docusaurus uses markdown frontmatter to populate page `<head>` metadata (title, description, keywords, image). High-quality metadata is essential for proper search engine indexing and attractive social media previews.

## Guidelines for SEO Metadata
Every `.md` or `.mdx` file should ideally have the following frontmatter fields:

- **title**: A concise, clear, and descriptive title for the page. Maximum 60 characters.
- **description**: A compelling summary of the page's content that encourages click-throughs. Maximum 160 characters.
- **keywords**: A comma-separated list of relevant keywords (e.g., `[ai, "artificial intelligence", course, free, "prompt engineering", docusaurus]`).
- **image**: (Optional but recommended) Path to a social card image for sharing.

## Operations
When instructed to run SEO maintenance or the `/docs-seo` slash command, perform the following tasks:

1. **Scan**: Identify all `.md` and `.mdx` files within the `docs/` and `src/pages/` directories.
2. **Review**: Evaluate the existing frontmatter of each file.
   - If frontmatter is missing entirely, analyze the document content and generate a new SEO-optimized frontmatter section at the top of the file.
   - If fields like `description` or `keywords` are missing or generic, update them to be specific to the document's content.
3. **Update**: Modify the files with the improved frontmatter. Example of good SEO frontmatter:
   ```md
   ---
   title: Introduction to Prompt Engineering
   description: Learn the foundational concepts of prompt engineering to effectively interact with Large Language Models (LLMs).
   keywords: [prompt engineering, course, free, LLM, artificial intelligence, basics, tutorial]
   image: /img/social-cards/prompt-engineering.jpg
   ---
   ```
4. **Report**: After completing the process, output a brief summary of the files modified and the primary SEO enhancements made.
