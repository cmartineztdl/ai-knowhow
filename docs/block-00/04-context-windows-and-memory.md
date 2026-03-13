---
title: Context Windows & Memory
description: Learn how LLMs handle limited memory, why token limits matter, and discover strategies for working within context windows.
keywords: [ai, artificial intelligence, course, free, context window, token limits, chunking, memory, sliding window]
---

import Quiz from '@site/src/components/Quiz';

# Context Windows & Memory

> Learn how LLMs handle limited memory, why token limits matter, and strategies for working within them.

## Introduction

LLMs don't have memory the way humans do. They don't remember your last conversation or learn from previous interactions. Every time you make an API call, the model sees only what's in the **context window** — the combined system prompt, conversation history, and your new message, all measured in tokens.

This has huge practical implications. If your context window is 128K tokens, you _can_ stuff a small novel into it, but bigger contexts cost more, take longer to process, and models tend to pay less attention to the middle (a phenomenon known as "lost in the middle"). Understanding context windows is essential for building reliable AI-powered applications.

## Core Concepts

### Token Limits

Every model has a maximum context length. This is the total number of tokens for **input + output combined**:

| Model             | Max Context | Approximate Pages |
| ----------------- | ----------- | ----------------- |
| GPT-4o            | 128K tokens | ~300 pages        |
| Claude 3.5 Sonnet | 200K tokens | ~500 pages        |
| Gemini 1.5 Pro    | 2M tokens   | ~5,000 pages      |
| Llama 3 (8B)      | 8K tokens   | ~20 pages         |

If your input exceeds the limit, the API will return an error. If input + output would exceed it, the model's response gets cut off.

```typescript
// Always check your token count before sending a request
import { encoding_for_model } from "tiktoken";

function checkContextFit(messages: string[], maxTokens: number): boolean {
  const encoder = encoding_for_model("gpt-4o");
  const totalTokens = messages.reduce((sum, msg) => {
    return sum + encoder.encode(msg).length;
  }, 0);
  encoder.free();

  const reserveForOutput = 1000; // Leave room for the response
  console.log(
    `Using ${totalTokens} of ${maxTokens - reserveForOutput} available tokens`,
  );
  return totalTokens < maxTokens - reserveForOutput;
}
```

### Chunking Strategies

When your data doesn't fit in one context window, you need to **chunk** it — split it into pieces that each fit. The choice of chunking strategy significantly affects quality:

**Fixed-size chunking**: Split every N tokens. Simple but can break mid-sentence.

```typescript
function fixedSizeChunk(
  text: string,
  chunkSize: number,
  overlap: number,
): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
}
```

**Recursive chunking**: Split on paragraph boundaries, then sentences, then words. Preserves semantic units better.

**Semantic chunking**: Use embeddings to detect topic shifts. Most expensive but produces the most coherent chunks.

### Context Management in Conversations

In a multi-turn chat application, the conversation history grows with every message. Eventually it won't fit in the context window. Common strategies:

1. **Sliding window**: Drop the oldest messages, keeping only the most recent N turns
2. **Summarization**: Periodically summarize old messages into a compact paragraph
3. **Hybrid**: Keep recent messages verbatim and summarize older ones

```typescript
// Simple sliding window context management
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

function trimConversation(
  messages: Message[],
  maxTokens: number,
  systemPrompt: Message,
): Message[] {
  // Always keep the system prompt
  const result: Message[] = [systemPrompt];
  let tokenCount = estimateTokens(systemPrompt.content);

  // Add messages from most recent, working backwards
  for (let i = messages.length - 1; i >= 0; i--) {
    const msgTokens = estimateTokens(messages[i].content);
    if (tokenCount + msgTokens > maxTokens) break;
    result.splice(1, 0, messages[i]); // Insert after system prompt
    tokenCount += msgTokens;
  }
  return result;
}
```

### The "Lost in the Middle" Problem

Research has shown that LLMs pay the most attention to tokens at the **beginning** and **end** of the context, while information buried in the middle gets less attention. This means the order in which you present information matters — put the most important content at the beginning or end of your prompt.

![Illustration of a context window showing how system prompt, conversation history, and new user message fill up the available token budget](images/04-context-window-layout.webp)

## Key Takeaways

- The **context window** is the model's entire "working memory" — it can only see what you send in each request
- **Token limits** vary by model from 8K to 2M+ but bigger isn't always better (cost and attention degrade)
- **Chunking** is essential for processing documents that exceed the context window
- In chat apps, use a **sliding window** or **summarization** strategy to manage growing conversation history
- Put important information at the **beginning or end** of your context, not buried in the middle

## Further Reading

- [Lost in the Middle — Liu et al. 2023](https://arxiv.org/abs/2307.03172)
- [Anthropic — Long context prompting tips](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/long-context-tips)
- [OpenAI — Managing tokens](https://platform.openai.com/docs/guides/rate-limits/managing-tokens)
- [LangChain — Text splitters](https://js.langchain.com/docs/how_to/#text-splitters)

## Knowledge Check

<Quiz 
  questions={[
    {
      text: "What does the 'context window' of an LLM represent?",
      options: [
        "The maximum number of simultaneous users the model can support.",
        "The total number of tokens (input + output) the model can process in a single request.",
        "The amount of hard drive storage required to run the model locally.",
        "The model's long-term memory connecting multiple separate sessions."
      ],
      correctAnswerIndex: 1,
      explanation: "The context window is the model's entire 'working memory' per API call, limited by a specific token count that includes the prompt, history, and the generated response."
    },
    {
      text: "If your input plus the generated response exceeds the model's token limit, what happens?",
      options: [
        "The model will automatically compress the response to fit.",
        "The API will charge you a premium fee for the extra tokens.",
        "The API will either return an error (if input alone is too big) or cut off the response.",
        "The model will open a new context window specifically for the overflow."
      ],
      correctAnswerIndex: 2,
      explanation: "Exceeding the max context length results in an API error for inputs that are too long, or prematurely cuts off outputs that run out of space."
    },
    {
      text: "When processing a document that is larger than the model's context window, what is the necessary approach?",
      options: [
        "Increase the model's temperature parameter.",
        "Split the document into smaller pieces called 'chunks'.",
        "Convert the document into a smaller file format like plain text.",
        "Use only character-level tokenization."
      ],
      correctAnswerIndex: 1,
      explanation: "Chunking is the process of breaking a large document into smaller pieces that safely fit within the context window limits so the model can process them."
    },
    {
      text: "What is the 'lost in the middle' phenomenon?",
      options: [
        "The tendency for LLMs to forget the rules specified in the system prompt.",
        "The model's inability to translate languages effectively for intermediate proficiency levels.",
        "The tendency of LLMs to pay less attention to information located in the middle of a large context.",
        "A bug where the API loses network connection halfway through generating a response."
      ],
      correctAnswerIndex: 2,
      explanation: "Research indicates that LLMs focus best on information at the very beginning and very end of a prompt, often overlooking or placing less weight on details buried in the middle."
    },
    {
      text: "How can you effectively manage the context window in a long-running multi-turn chat application?",
      options: [
        "Ask the user to retype their history in every message.",
        "Use a sliding window to drop the oldest messages or periodically summarize the conversation history.",
        "Switch to a base model since they don't have context limits.",
        "Rely on the model's built-in permanent memory to recall earlier sessions."
      ],
      correctAnswerIndex: 1,
      explanation: "To keep history within the token limit, common strategies include a sliding window (keeping only recent messages) or summarizing older messages to condense the information."
    }
  ]}
/>

