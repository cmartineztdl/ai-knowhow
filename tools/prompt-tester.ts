#!/usr/bin/env npx tsx

/**
 * Tool: Prompt Tester
 * Description: Test a prompt with different strategies, models, and parameters
 * Usage: npx tsx tools/prompt-tester.ts [options]
 *
 * Examples:
 *   npx tsx tools/prompt-tester.ts --prompt "Classify: great product" --strategy zero-shot
 *   npx tsx tools/prompt-tester.ts --prompt "What is 15% of 80?" --strategy cot
 *   npx tsx tools/prompt-tester.ts --prompt "Extract name" --strategy few-shot --examples '["input|output","input2|output2"]'
 *   npx tsx tools/prompt-tester.ts --help
 */

import { parseArgs } from "node:util";

// --- Configuration ---
const config = {
  openaiKey: process.env.OPENAI_API_KEY,
  anthropicKey: process.env.ANTHROPIC_API_KEY,
};

// --- Argument Parsing ---
const { values } = parseArgs({
  options: {
    help: { type: "boolean", short: "h" },
    prompt: { type: "string", short: "p" },
    system: { type: "string", short: "s" },
    strategy: { type: "string", default: "zero-shot" },
    examples: { type: "string", short: "e" },
    model: { type: "string", short: "m", default: "gpt-4o" },
    temperature: { type: "string", short: "t", default: "0.7" },
    provider: { type: "string", default: "openai" },
    "max-tokens": { type: "string", default: "1024" },
    dry: { type: "boolean", default: false },
  },
});

if (values.help) {
  console.log(`Prompt Tester — Test prompts with different strategies and parameters

Usage: npx tsx tools/prompt-tester.ts [options]

Options:
  -h, --help          Show this help message
  -p, --prompt        The user prompt to test (required)
  -s, --system        Custom system prompt (optional)
  --strategy          Prompting strategy: zero-shot, few-shot, cot (default: zero-shot)
  -e, --examples      Few-shot examples as JSON array of "input|output" strings
  -m, --model         Model name (default: gpt-4o)
  -t, --temperature   Temperature 0-2 (default: 0.7)
  --provider          API provider: openai or anthropic (default: openai)
  --max-tokens        Max response tokens (default: 1024)
  --dry               Dry run — show the messages that would be sent without calling the API

Strategies:
  zero-shot    Just the prompt, no examples
  few-shot     Include example input/output pairs before the query
  cot          Chain-of-thought: instruct the model to reason step by step

Examples:
  # Zero-shot classification
  npx tsx tools/prompt-tester.ts -p "Is this review positive? 'Great product!'" --strategy zero-shot

  # Few-shot with examples
  npx tsx tools/prompt-tester.ts -p "Classify: 'It works'" \\
    --strategy few-shot \\
    -e '["I love it!|positive","Terrible.|negative"]'

  # Chain-of-thought for math
  npx tsx tools/prompt-tester.ts -p "What is 15% of 80?" --strategy cot

  # Dry run to preview messages
  npx tsx tools/prompt-tester.ts -p "Hello" --dry
`);
  process.exit(0);
}

// --- Types ---
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

// --- Build Messages ---
function buildMessages(
  prompt: string,
  strategy: string,
  systemPrompt: string,
  examples: string[],
): Message[] {
  const messages: Message[] = [];

  switch (strategy) {
    case "few-shot": {
      messages.push({ role: "system", content: systemPrompt });
      for (const ex of examples) {
        const [input, output] = ex.split("|");
        if (input && output) {
          messages.push({ role: "user", content: input.trim() });
          messages.push({ role: "assistant", content: output.trim() });
        }
      }
      messages.push({ role: "user", content: prompt });
      break;
    }

    case "cot": {
      messages.push({
        role: "system",
        content: `${systemPrompt}\n\nThink step by step before giving your final answer.`,
      });
      messages.push({ role: "user", content: prompt });
      break;
    }

    case "zero-shot":
    default: {
      messages.push({ role: "system", content: systemPrompt });
      messages.push({ role: "user", content: prompt });
      break;
    }
  }

  return messages;
}

// --- API Callers ---
async function callOpenAI(
  messages: Message[],
  model: string,
  temperature: number,
  maxTokens: number,
): Promise<{ content: string; usage: Record<string, number> }> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openaiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${error}`);
  }

  const data = (await response.json()) as any;
  return {
    content: data.choices[0].message.content,
    usage: data.usage,
  };
}

async function callAnthropic(
  messages: Message[],
  model: string,
  temperature: number,
  maxTokens: number,
): Promise<{ content: string; usage: Record<string, number> }> {
  const systemMsg = messages.find((m) => m.role === "system");
  const nonSystemMsgs = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role, content: m.content }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.anthropicKey!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemMsg?.content ?? "",
      messages: nonSystemMsgs,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${error}`);
  }

  const data = (await response.json()) as any;
  return {
    content: data.content[0].text,
    usage: data.usage,
  };
}

// --- Main ---
async function main() {
  if (!values.prompt) {
    console.error("Error: --prompt is required. Use --help for usage.");
    process.exit(1);
  }

  const strategy = values.strategy ?? "zero-shot";
  const systemPrompt =
    values.system ?? "You are a helpful assistant.";
  const temperature = parseFloat(values.temperature ?? "0.7");
  const maxTokens = parseInt(values["max-tokens"] ?? "1024", 10);
  const model = values.model ?? "gpt-4o";
  const provider = values.provider ?? "openai";

  let examples: string[] = [];
  if (values.examples) {
    try {
      examples = JSON.parse(values.examples);
    } catch {
      console.error("Error: --examples must be a valid JSON array");
      process.exit(1);
    }
  }

  const messages = buildMessages(values.prompt, strategy, systemPrompt, examples);

  console.log("┌─────────────────────────────────────");
  console.log(`│ Strategy:    ${strategy}`);
  console.log(`│ Model:       ${model}`);
  console.log(`│ Provider:    ${provider}`);
  console.log(`│ Temperature: ${temperature}`);
  console.log(`│ Max Tokens:  ${maxTokens}`);
  console.log("└─────────────────────────────────────");
  console.log();

  console.log("📨 Messages:");
  for (const msg of messages) {
    const label = msg.role.toUpperCase().padEnd(10);
    const preview =
      msg.content.length > 100
        ? msg.content.slice(0, 100) + "..."
        : msg.content;
    console.log(`  [${label}] ${preview}`);
  }
  console.log();

  if (values.dry) {
    console.log("🏜️  Dry run — no API call made.");
    console.log("\nFull messages JSON:");
    console.log(JSON.stringify(messages, null, 2));
    return;
  }

  // Validate API key
  if (provider === "openai" && !config.openaiKey) {
    console.error("Error: Set OPENAI_API_KEY environment variable");
    process.exit(1);
  }
  if (provider === "anthropic" && !config.anthropicKey) {
    console.error("Error: Set ANTHROPIC_API_KEY environment variable");
    process.exit(1);
  }

  console.log("⏳ Calling API...\n");

  const start = Date.now();
  const result =
    provider === "anthropic"
      ? await callAnthropic(messages, model, temperature, maxTokens)
      : await callOpenAI(messages, model, temperature, maxTokens);
  const elapsed = Date.now() - start;

  console.log("📬 Response:");
  console.log("─".repeat(40));
  console.log(result.content);
  console.log("─".repeat(40));
  console.log();
  console.log(`⏱️  ${elapsed}ms`);
  console.log(`📊 Tokens: ${JSON.stringify(result.usage)}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
