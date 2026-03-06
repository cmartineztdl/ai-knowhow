# Exercise 03: Build a Context Window Manager

## Objective

Build a context window manager that handles conversation history within a token limit. The manager must trim old messages while always preserving the system prompt and the most recent user message.

## What You Need to Do

1. Implement the `estimateTokens` function (approximate: 1 token ≈ 4 characters)
2. Implement the `trimConversation` function that fits messages within a budget
3. Fix the `createContextWindow` function that assembles the final message list

## Hints

- Hint 1: Start from the most recent messages and work backwards
- Hint 2: The system prompt should always be included and counted against the budget
- Hint 3: Don't forget to reserve space for the model's response

---

## 🧭 Related Materials

- 📖 [Theory: Context Windows & Memory](../../../docs/block-00/04-context-windows-and-memory.md)
- ✅ [Solution & Walkthrough](../../../solutions/block-00/ex-03-context-window/WALKTHROUGH.md)
