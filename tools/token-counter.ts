#!/usr/bin/env npx tsx

/**
 * Tool: Token Counter
 * Description: Count tokens in a text string or file using a simplified BPE-style tokenizer
 * Usage: npx tsx tools/token-counter.ts [options]
 *
 * Examples:
 *   npx tsx tools/token-counter.ts --text "Hello, how are you?"
 *   npx tsx tools/token-counter.ts --file README.md
 *   npx tsx tools/token-counter.ts --text "Hello world" --model gpt-4o
 *   npx tsx tools/token-counter.ts --help
 */

import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";

// --- Model pricing (per 1K tokens, input) ---
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  "gpt-4o": { input: 0.005, output: 0.015 },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
  "claude-3.5-sonnet": { input: 0.003, output: 0.015 },
  "claude-3.5-haiku": { input: 0.0008, output: 0.004 },
  "gemini-1.5-pro": { input: 0.00125, output: 0.005 },
  "gemini-1.5-flash": { input: 0.000075, output: 0.0003 },
};

// --- Argument Parsing ---
const { values } = parseArgs({
  options: {
    help: { type: "boolean", short: "h" },
    text: { type: "string", short: "t" },
    file: { type: "string", short: "f" },
    model: { type: "string", short: "m" },
  },
});

if (values.help) {
  console.log(`Token Counter — Estimate token count and API cost

Usage: npx tsx tools/token-counter.ts [options]

Options:
  -h, --help     Show this help message
  -t, --text     Text to tokenize (string)
  -f, --file     Path to a file to tokenize
  -m, --model    Model for cost estimation (default: gpt-4o)

Supported models:
${Object.keys(MODEL_PRICING)
  .map((m) => `  - ${m}`)
  .join("\n")}

Examples:
  npx tsx tools/token-counter.ts --text "Hello, how are you?"
  npx tsx tools/token-counter.ts --file src/index.ts --model gpt-4o-mini
  `);
  process.exit(0);
}

// --- Token Estimation ---
function estimateTokens(text: string): number {
  // Approximation: ~4 characters per token for English text
  // This matches OpenAI's rule of thumb
  if (text.length === 0) return 0;
  return Math.ceil(text.length / 4);
}

function estimateWordBasedTokens(text: string): number {
  // Alternative: ~0.75 tokens per word (more accurate for natural language)
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  return Math.ceil(words.length * 1.33);
}

// --- Main Logic ---
function main() {
  let inputText: string;

  if (values.text) {
    inputText = values.text;
  } else if (values.file) {
    try {
      inputText = readFileSync(values.file, "utf-8");
    } catch {
      console.error(`Error: Could not read file '${values.file}'`);
      process.exit(1);
    }
  } else {
    console.error("Error: Provide either --text or --file");
    console.error("Run with --help for usage information");
    process.exit(1);
  }

  const model = values.model || "gpt-4o";
  const pricing = MODEL_PRICING[model];

  const charTokens = estimateTokens(inputText);
  const wordTokens = estimateWordBasedTokens(inputText);
  const avgEstimate = Math.round((charTokens + wordTokens) / 2);

  console.log("┌─────────────────────────────────────────┐");
  console.log("│          Token Counter Results          │");
  console.log("├─────────────────────────────────────────┤");
  console.log(
    `│  Characters:        ${inputText.length.toString().padStart(16)} │`,
  );
  console.log(
    `│  Words:             ${inputText
      .split(/\s+/)
      .filter((w) => w.length > 0)
      .length.toString()
      .padStart(16)} │`,
  );
  console.log(
    `│  Lines:             ${inputText.split("\n").length.toString().padStart(16)} │`,
  );
  console.log("├─────────────────────────────────────────┤");
  console.log(`│  Est. tokens (char):${charTokens.toString().padStart(16)} │`);
  console.log(`│  Est. tokens (word):${wordTokens.toString().padStart(16)} │`);
  console.log(`│  Average estimate:  ${avgEstimate.toString().padStart(16)} │`);

  if (pricing) {
    const inputCost = (avgEstimate / 1000) * pricing.input;
    const outputCost = (avgEstimate / 1000) * pricing.output;
    console.log("├─────────────────────────────────────────┤");
    console.log(`│  Model:             ${model.padStart(16)} │`);
    console.log(`│  Input cost:       $${inputCost.toFixed(6).padStart(15)} │`);
    console.log(
      `│  Output cost:      $${outputCost.toFixed(6).padStart(15)} │`,
    );
  } else {
    console.log("├─────────────────────────────────────────┤");
    console.log(`│  Model '${model}' not found in pricing table │`);
  }

  console.log("└─────────────────────────────────────────┘");
  console.log(
    "\n💡 Note: These are estimates. For exact counts, use tiktoken or the API's token counter.",
  );
}

main();
