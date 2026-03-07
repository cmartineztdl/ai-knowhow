# Exercise 01: Build a Chat Completions Client

## Objective

Build a function that constructs a properly formatted Chat Completions request from a conversation history. The function should handle message formatting, system prompt injection, and parameter configuration.

## What You Need to Do

1. Fix the `buildChatRequest` function to properly structure messages with roles
2. Fix the `extractReply` function to correctly extract the assistant's response from the API response

## Hints

- Hint 1: Look at how the system prompt is being added — is it in the right position?
- Hint 2: The response structure has nested objects — are you accessing the right property?
- Hint 3: The system message should always be the first message in the array

---

## 🧭 Related Materials

- 📖 [Read the Theory](https://cmartineztdl.github.io/ai-knowhow/docs/block-01/)
- ✅ [Solution & Walkthrough](https://github.com/cmartineztdl/ai-knowhow/tree/main/solutions/block-01/ex-01-chat-completions/WALKTHROUGH.md)
