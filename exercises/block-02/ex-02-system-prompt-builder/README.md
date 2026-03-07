# Exercise 02: Craft a System Prompt Builder

## Objective

Build a function that assembles system prompts from structured components: identity, task, rules, and output format.

## What You Need to Do

1. Fix the `buildSystemPrompt` function to correctly assemble all four sections
2. Fix the `addPersona` function to properly merge persona traits into a prompt config

## Hints

- Hint 1: The sections should be joined with double newlines, not missing entirely
- Hint 2: Rules should be formatted as a numbered list, not a comma-separated string
- Hint 3: Check that all four sections are present in the output

---

## 🧭 Related Materials

- 📖 [Theory: System vs User vs Assistant Roles](../../../docs/block-02/02-system-vs-user-vs-assistant-roles.md)
- ✅ [Solution & Walkthrough](../../../solutions/block-02/ex-02-system-prompt-builder/WALKTHROUGH.md)
