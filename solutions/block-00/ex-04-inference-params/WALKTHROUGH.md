# Walkthrough: Configure Inference Parameters

## Problem Summary

The parameter presets were assigned to the wrong use cases (code generation had creative writing values and vice versa). Additionally, `validateParameters` and `mergeWithDefaults` needed implementation.

## Approach

1. Swap the presets to match their intended use cases
2. Implement validation as range checks for each parameter
3. Use object spread for clean merging

## Step-by-Step

### Step 1: Fix the presets

The presets were scrambled across four use cases. The correct mapping:

- **code_generation**: `temperature: 0, top_p: 1` (deterministic)
- **creative_writing**: `temperature: 1.2, top_p: 0.9` (varied)
- **data_extraction**: `temperature: 0, top_p: 0.1` (very focused)
- **conversation**: `temperature: 0.7, top_p: 0.9` (balanced)

### Step 2: Implement validateParameters

Check each parameter against its valid range and push descriptive error messages:

```typescript
if (params.temperature < 0 || params.temperature > 2) {
  errors.push("temperature must be between 0 and 2");
}
```

### Step 3: Implement mergeWithDefaults

Object spread gives us clean precedence handling:

```typescript
return { ...defaults, ...overrides };
```

## Key Learnings

- Matching inference parameters to use cases is critical — wrong settings waste money or produce bad output
- Temperature 0 is not "no creativity" — it's deterministic greedy decoding
- Validation prevents costly API errors — better to catch bad params locally

---

## 🧭 Related Materials

- 📖 [Theory: Inference Parameters](../../../docs/block-00/05-inference-parameters.md)
- 🏋️ [Exercise](../../../exercises/block-00/ex-04-inference-params/)
