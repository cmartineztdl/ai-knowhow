---
name: image-generator
description: Generates explanatory diagrams and illustrations for theory documents
---

# Image Generator Skill

## Purpose

Create visual aids (diagrams, architecture visuals, concept illustrations) that make theory content easier to understand. Images are generated using the `generate_image` tool and embedded into the existing theory Markdown files.

## Inputs

- **Block number** (e.g., `0`, `1`, `2`)
- Theory files from `/docs/block-XX/*.mdx` (must exist before invoking this skill)

## Output

- Images saved to `/docs/block-XX/images/` as `.webp`
- Theory `.mdx` files updated with embedded image references

## Instructions

1. **Scan** all `.mdx` files in `/docs/block-XX/` for:
   - Existing `![description](images/...)` placeholders left by the theory-writer skill
   - Concepts that would benefit from a visual but don't have a placeholder yet
2. **For each image needed**, use the `generate_image` tool with a detailed prompt.
3. **Save** the generated image to `/docs/block-XX/images/<descriptive-name>.webp`
4. **Update** the corresponding `.mdx` file to embed the image with proper alt text.

## Image Types & Prompt Guidelines

### Architecture Diagrams

- Use for: system overviews, data flows, component relationships
- Prompt style: _"Clean technical diagram showing [X]. Dark background, flat design, labeled components connected by arrows. Developer documentation style."_

### Concept Visualizations

- Use for: abstract concepts (embeddings, attention, vector spaces)
- Prompt style: _"Educational illustration of [X]. Minimalist style, dark theme, vibrant accent colors. Clear labels. Suitable for a technical course."_

### Comparison Charts

- Use for: model comparisons, strategy trade-offs, before/after
- Prompt style: _"Side-by-side comparison diagram of [X] vs [Y]. Clean layout, dark background, color-coded sections with labels."_

### Process Flows

- Use for: step-by-step procedures, pipelines, algorithms
- Prompt style: _"Step-by-step flowchart showing [process]. Numbered steps, dark theme, modern flat design, arrows connecting each stage."_

## Visual Style Guide

- **Background**: Dark (#1a1a2e or similar)
- **Accent colors**: Vibrant but not neon — blues (#4361ee), purples (#7209b7), teals (#4cc9f0)
- **Typography**: Clean, sans-serif labels
- **Style**: Flat/minimalist, no 3D effects
- **Consistency**: All images in a block should feel like they belong to the same course

## File Naming

- Use kebab-case: `transformer-architecture.webp`
- Prefix with topic number when tied to a specific topic: `01-token-embedding-space.webp`
- Keep names descriptive and short

## Embedding Format

```markdown
![Description of what the image shows](images/filename.webp)
```

The alt text must be a genuine description of the image content (not just the filename), for accessibility.

## Quality Checklist

- [ ] All image placeholders from theory files have been fulfilled
- [ ] Additional images added where concepts are complex or abstract
- [ ] All images use the consistent dark-theme style
- [ ] Alt text is descriptive and accessible
- [ ] Markdown links are relative and correct
- [ ] No broken image references
