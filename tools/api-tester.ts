#!/usr/bin/env npx tsx

/**
 * Tool: API Tester
 * Description: Quick test calls to OpenAI and Anthropic APIs from the command line
 * Usage: npx tsx tools/api-tester.ts [options]
 *
 * Examples:
 *   npx tsx tools/api-tester.ts --provider openai --prompt "Say hello"
 *   npx tsx tools/api-tester.ts --provider anthropic --prompt "Explain REST"
 *   npx tsx tools/api-tester.ts --provider openai --prompt "Hello" --model gpt-4o-mini
 *   npx tsx tools/api-tester.ts --help
 */

import { parseArgs } from "node:util";

// --- Model defaults ---
const DEFAULTS: Record<string, { model: string; envVar: string }> = {
  openai: { model: "gpt-4o", envVar: "OPENAI_API_KEY" },
  anthropic: { model: "claude-sonnet-4-20250514", envVar: "ANTHROPIC_API_KEY" },
};

// --- Argument Parsing ---
const { values } = parseArgs({
  options: {
    help: { type: "boolean", short: "h" },
    provider: { type: "string", short: "p" },
    prompt: { type: "string", short: "q" },
    model: { type: "string", short: "m" },
    temperature: { type: "string", short: "t" },
    "max-tokens": { type: "string" },
    stream: { type: "boolean", short: "s" },
  },
});

if (values.help) {
  console.log(`API Tester — Quick test calls to OpenAI/Anthropic APIs

Usage: npx tsx tools/api-tester.ts [options]

Options:
  -h, --help         Show this help message
  -p, --provider     API provider: "openai" or "anthropic" (required)
  -q, --prompt       The prompt to send (required)
  -m, --model        Model to use (default: provider's default)
  -t, --temperature  Temperature 0.0-2.0 (default: 0.7)
      --max-tokens   Maximum tokens in response (default: 1024)
  -s, --stream       Enable streaming output

Environment Variables:
  OPENAI_API_KEY      Required for OpenAI calls
  ANTHROPIC_API_KEY   Required for Anthropic calls

Examples:
  npx tsx tools/api-tester.ts -p openai -q "Explain closures in JS"
  npx tsx tools/api-tester.ts -p anthropic -q "What is TypeScript?" -m claude-3-5-haiku-latest
  npx tsx tools/api-tester.ts -p openai -q "Hello" --stream
  `);
  process.exit(0);
}

// --- Validation ---
const provider = values.provider;
if (!provider || !["openai", "anthropic"].includes(provider)) {
  console.error('Error: --provider is required ("openai" or "anthropic")');
  process.exit(1);
}

const prompt = values.prompt;
if (!prompt) {
  console.error("Error: --prompt is required");
  process.exit(1);
}

const config = DEFAULTS[provider];
const apiKey = process.env[config.envVar];

if (!apiKey) {
  console.error(`Error: ${config.envVar} environment variable is not set`);
  process.exit(1);
}

const model = values.model ?? config.model;
const temperature = values.temperature ? parseFloat(values.temperature) : 0.7;
const maxTokens = values["max-tokens"]
  ? parseInt(values["max-tokens"], 10)
  : 1024;

// --- API Calls ---
async function callOpenAI(): Promise<void> {
  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey });

  console.log(`\n🤖 Calling OpenAI (${model})...\n`);
  const startTime = Date.now();

  if (values.stream) {
    const stream = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt! }],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    let totalTokens = 0;
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        process.stdout.write(content);
        totalTokens++;
      }
    }
    console.log(`\n\n⏱  ${Date.now() - startTime}ms (streamed ~${totalTokens} chunks)`);
  } else {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt! }],
      temperature,
      max_tokens: maxTokens,
    });

    const reply = response.choices[0].message.content;
    console.log(reply);
    console.log("\n┌─────────────────────────────────────────┐");
    console.log(`│  Model:          ${model.padStart(20)} │`);
    console.log(
      `│  Prompt tokens:  ${response.usage?.prompt_tokens?.toString().padStart(20)} │`,
    );
    console.log(
      `│  Output tokens:  ${response.usage?.completion_tokens?.toString().padStart(20)} │`,
    );
    console.log(
      `│  Total tokens:   ${response.usage?.total_tokens?.toString().padStart(20)} │`,
    );
    console.log(`│  Time:           ${(Date.now() - startTime + "ms").padStart(20)} │`);
    console.log("└─────────────────────────────────────────┘");
  }
}

async function callAnthropic(): Promise<void> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const anthropic = new Anthropic({ apiKey });

  console.log(`\n🤖 Calling Anthropic (${model})...\n`);
  const startTime = Date.now();

  if (values.stream) {
    const stream = anthropic.messages.stream({
      model,
      messages: [{ role: "user", content: prompt! }],
      max_tokens: maxTokens,
    });

    stream.on("text", (text) => {
      process.stdout.write(text);
    });

    const finalMessage = await stream.finalMessage();
    console.log(`\n\n⏱  ${Date.now() - startTime}ms`);
    console.log(
      `📊 Tokens: ${finalMessage.usage.input_tokens} input + ${finalMessage.usage.output_tokens} output`,
    );
  } else {
    const response = await anthropic.messages.create({
      model,
      messages: [{ role: "user", content: prompt! }],
      max_tokens: maxTokens,
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    console.log(text);
    console.log("\n┌─────────────────────────────────────────┐");
    console.log(`│  Model:          ${model.padStart(20)} │`);
    console.log(
      `│  Input tokens:   ${response.usage.input_tokens.toString().padStart(20)} │`,
    );
    console.log(
      `│  Output tokens:  ${response.usage.output_tokens.toString().padStart(20)} │`,
    );
    console.log(`│  Stop reason:    ${response.stop_reason?.padStart(20)} │`);
    console.log(`│  Time:           ${(Date.now() - startTime + "ms").padStart(20)} │`);
    console.log("└─────────────────────────────────────────┘");
  }
}

// --- Main ---
async function main() {
  try {
    if (provider === "openai") {
      await callOpenAI();
    } else {
      await callAnthropic();
    }
  } catch (error: any) {
    console.error(`\n❌ API Error: ${error.message}`);
    if (error.status) {
      console.error(`   Status: ${error.status}`);
    }
    process.exit(1);
  }
}

main();
