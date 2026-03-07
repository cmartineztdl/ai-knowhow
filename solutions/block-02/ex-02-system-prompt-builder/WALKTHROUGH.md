# Walkthrough: Craft a System Prompt Builder

## Problem Summary

The system prompt builder had three issues: rules were comma-separated instead of numbered, the output format section was missing entirely, and persona merging overwrote the identity instead of enhancing it.

## Approach

Fix each function independently: correct the rules formatting, add the missing section, and properly merge persona details.

## Step-by-Step

### Step 1: Format rules as a numbered list

```diff
-const rulesSection = `RULES:\n${config.rules.join(", ")}`;
+const rulesSection = `RULES:\n${config.rules.map((r, i) => `${i + 1}. ${r}`).join("\n")}`;
```

### Step 2: Add the output format section

```diff
-return [identitySection, taskSection, rulesSection].join("\n\n");
+const formatSection = `OUTPUT FORMAT: ${config.outputFormat}`;
+return [identitySection, taskSection, rulesSection, formatSection].join("\n\n");
```

### Step 3: Enhance identity with persona (don't replace)

```diff
-identity: persona.name,
+identity: `${config.identity}\nPersona: ${persona.name}, specializing in ${persona.expertise}. Tone: ${persona.tone}.`,
```

### Step 4: Fix rules validation

```diff
-if (!config.rules) {
+if (!config.rules || config.rules.length === 0) {
```

## Key Learnings

- System prompts benefit from **structured sections**: identity, task, rules, format
- Rules as **numbered lists** are more readable and enforceable than prose
- Persona merging should **enhance** existing context, not replace it

---

## 🧭 Related Materials

- 📖 [Theory: System vs User vs Assistant Roles](../../../docs/block-02/02-system-vs-user-vs-assistant-roles.md)
- 🏋️ [Exercise](../../../exercises/block-02/ex-02-system-prompt-builder/)
