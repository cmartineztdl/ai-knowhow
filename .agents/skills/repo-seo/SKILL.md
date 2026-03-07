---
name: repo-seo
description: Regenerates the root README.md with SEO-friendly content reflecting the current course state
---

# Repo SEO Skill

## Purpose

Keep the root `README.md` optimized for GitHub repository search and discoverability. This skill regenerates the file from scratch every time a block is created or updated, ensuring it always reflects the current course state with keyword-rich, well-structured content.

## Inputs

- **Block number** that was just created or updated (for context; the skill regenerates the _entire_ README regardless)
- Course data is read from `docs/COURSE_OUTLINE.md` and the filesystem

## Output

Overwrites `/README.md` (the repository root).

## Instructions

### 1. Gather course state

1. **Read** `docs/COURSE_OUTLINE.md` to get all block titles, descriptions, and topic tables
2. **Scan** the filesystem for directories matching `docs/block-XX/`, `exercises/block-XX/`, and `solutions/block-XX/` to determine which blocks have published content

### 2. Regenerate README.md

Overwrite the root `README.md` using the template below. Replace placeholders with real data.

### README Template

```markdown
# AI Know-How — Learn AI Development with Hands-On Exercises

> A practical, developer-first course to understand and leverage AI in day-to-day coding.
> Master LLMs, prompt engineering, AI agents, RAG, and more — with theory, exercises, and reusable tools.
> Stack: JavaScript / TypeScript · OpenAI · Anthropic

Welcome to **AI Know-How**, a free, self-paced course designed to help developers build a complete mental model of Large Language Models (LLMs) and how to effectively integrate them into modern applications. Learn everything from how transformers work under the hood to building AI-powered apps, agents, and retrieval-augmented generation (RAG) pipelines.

## 📚 Course Structure

The repository is organized to provide a seamless learning experience, starting with theory and culminating in hands-on code:

- **[Theory & Concepts (`/docs`)](./docs/COURSE_OUTLINE.md)** — Core concepts and detailed explanations of how AI models work.
- **[Coding Exercises (`/exercises`)](./exercises/)** — Practical challenges with intentional bugs for you to fix.
- **[Solutions & Walkthroughs (`/solutions`)](./solutions/)** — Complete, optimal solutions with step-by-step explanations.
- **[Developer Tools (`/tools`)](./tools/)** — Reusable CLI utility scripts for interacting with AI models.

## 🗺️ Course Blocks

### Available Now

<!-- FOR EACH BLOCK THAT HAS CONTENT (docs/block-XX/ exists): -->

- **Block {N}: {Block Title}**
  {One-line description from the outline.}
  - 📖 [Read the Theory](./docs/block-{NN}/)
  - 💻 [Do the Exercises](./exercises/block-{NN}/)
  - ✅ [View the Solutions](./solutions/block-{NN}/)

<!-- END FOR EACH -->

### Coming Soon

<!-- FOR EACH BLOCK WITHOUT CONTENT: -->

- **Block {N}: {Block Title}** — {One-line description}

<!-- END FOR EACH -->

## 🗺️ Learning Path

Start with **Block 0** (Foundations) and **Block 1** (APIs), then follow the path that interests you most. Blocks 0–2 are sequential prerequisites; after that, explore in parallel depending on your goals.

> See the **[Full Course Outline](./docs/COURSE_OUTLINE.md)** for topic details and the recommended dependency graph.

## 🏷️ Topics

`ai` · `llm` · `openai` · `anthropic` · `prompt-engineering` · `ai-agents` · `rag` · `machine-learning` · `course` · `tutorial` · `javascript` · `typescript`

---

## ❤️ Support

If you found this material helpful or learned something new, consider supporting my work!

[**☕ Buy me a coffee**](https://buymeacoffee.com/cmartineztdl)
```

### Template Rules

- **H1 heading**: Must include keywords ("AI", "Learn", "Exercises"). This becomes the GitHub page title.
- **Opening blockquote**: Acts as a subtitle/tagline. Keep it to 2–3 lines with high-value keywords.
- **First paragraph**: Summarize the entire project in ~3 sentences. Include terms people would search for (LLMs, transformers, prompt engineering, RAG, AI agents, etc.).
- **Available Now vs Coming Soon**: Only list a block under "Available Now" if `docs/block-XX/` exists. All other blocks go under "Coming Soon".
- **Topics section**: These match the GitHub "Topics" tags. Include them in the README as plain text so they are indexed by search engines even if the user hasn't set them on the GitHub repo settings.
- **Support section**: Always preserved at the bottom.
- **No hard line breaks**: Never hard-wrap prose paragraphs at a fixed column width. Write each paragraph as a single line and let Markdown renderers handle wrapping. Hard breaks cause awkward rendering on narrow screens.

## Idempotency

This skill **overwrites the entire file** on every run, so it is inherently idempotent. The template above is the single source of truth for the README structure.

## SEO Checklist

- [ ] `# H1` contains primary keywords (AI, Learn, Exercises)
- [ ] Opening blockquote includes secondary keywords (LLMs, prompt engineering, AI agents, RAG)
- [ ] First paragraph reads naturally and includes search-friendly terms
- [ ] All available blocks are listed with working links
- [ ] Topics section includes all relevant keywords as plain text
- [ ] No placeholder text or TODOs remain in the output
- [ ] File renders correctly as Markdown on GitHub

## GitHub Repo Settings Reminder

After running this skill, **remind the user** to also update these settings in the GitHub repo UI (these cannot be automated via file changes):

1. **Description**: _"A practical, developer-first course on AI development: LLMs, prompt engineering, agents, RAG, and more — with exercises and solutions in TypeScript."_
2. **Topics**: `ai`, `llm`, `openai`, `anthropic`, `prompt-engineering`, `ai-agents`, `rag`, `machine-learning`, `course`, `tutorial`, `javascript`, `typescript`
