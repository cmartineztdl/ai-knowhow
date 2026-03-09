---
title: Authentication & Key Management
description: Learn how to securely manage API keys for LLM providers using environment variables, .env files, and secret rotation practices.
keywords: [ai, artificial intelligence, course, free, api keys, authentication, security, environment variables, dotenv, secret management]
---

import Quiz from '@site/src/components/Quiz';

# Authentication & Key Management

> Learn how to securely manage API keys for LLM providers using environment variables, `.env` files, and secret rotation practices.

## Introduction

API keys are the passwords to your AI services. Leak one and someone else racks up charges on your account — or worse, accesses sensitive data flowing through your prompts. This isn't a theoretical risk: leaked OpenAI keys regularly show up on GitHub and get drained within minutes by automated scanners.

Good key management is boring but essential. It's the difference between a weekend project that costs you $500 because a key leaked and a production system that stays secure. Fortunately, the patterns are straightforward once you know them.

## Core Concepts

### Environment Variables

The golden rule: **API keys live in environment variables, never in source code**. Both the OpenAI and Anthropic SDKs read from environment variables by default:

```typescript
// Both SDKs auto-read from env if you don't pass apiKey
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// These read OPENAI_API_KEY and ANTHROPIC_API_KEY respectively
const openai = new OpenAI();
const anthropic = new Anthropic();
```

Set them in your shell before running your code:

```bash
export OPENAI_API_KEY="sk-proj-..."
export ANTHROPIC_API_KEY="sk-ant-..."
```

### The `.env` File Pattern

For local development, manually exporting vars gets old fast. The **dotenv** pattern uses a `.env` file in your project root:

```bash
# .env — NEVER commit this file
OPENAI_API_KEY=sk-proj-abc123...
ANTHROPIC_API_KEY=sk-ant-xyz789...
```

Load it at the very start of your application:

```typescript
// npm install dotenv
import "dotenv/config"; // loads .env into process.env

import OpenAI from "openai";
const openai = new OpenAI(); // reads OPENAI_API_KEY from process.env
```

**Critical**: add `.env` to your `.gitignore` immediately. Better yet, commit a `.env.example` with placeholder values so collaborators know which variables are needed:

```bash
# .env.example — safe to commit
OPENAI_API_KEY=sk-proj-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Key Validation at Startup

Don't wait until the first API call fails to discover a missing key. Validate at startup:

```typescript
function validateConfig(): { openaiKey: string; anthropicKey: string } {
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  const missing: string[] = [];
  if (!openaiKey) missing.push("OPENAI_API_KEY");
  if (!anthropicKey) missing.push("ANTHROPIC_API_KEY");

  if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(", ")}`);
    console.error("Copy .env.example to .env and fill in your keys.");
    process.exit(1);
  }

  return { openaiKey, anthropicKey };
}
```

### Secret Rotation

API keys should be rotated periodically and immediately if you suspect a leak:

1. **Generate a new key** in your provider's dashboard
2. **Update** all environments (local `.env`, CI/CD secrets, production env vars)
3. **Revoke the old key** — don't just leave it active as a "backup"
4. **Verify** your application still works with the new key

Most providers let you have multiple active keys simultaneously, which makes zero-downtime rotation possible: deploy with the new key first, then revoke the old one.

### Production Best Practices

In production, `.env` files aren't enough. Use proper secrets management:

```typescript
// Different approaches by deployment target

// Vercel / Netlify: set env vars in dashboard, they're injected at build/runtime

// Docker: pass via --env-file or orchestrator secrets
// docker run --env-file .env.production my-app

// Node.js with runtime secrets (e.g., AWS Secrets Manager)
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

async function getApiKey(secretName: string): Promise<string> {
  const client = new SecretsManager({ region: "us-east-1" });
  const result = await client.getSecretValue({ SecretId: secretName });
  return result.SecretString ?? "";
}
```

## Visual Aids

![Flowchart showing the hierarchy of secret management: development uses .env files, staging uses CI/CD secrets, production uses cloud secret managers](images/03-key-management-flow.webp)

## Key Takeaways

- **Never hardcode API keys** — always use environment variables
- Use `.env` files for local development, but **never commit them** to version control
- **Validate keys at startup** — fail fast with clear error messages
- **Rotate keys** periodically and immediately after any suspected leak
- In production, use **secrets managers** (AWS Secrets Manager, Vault, platform env vars) instead of files

## Further Reading

- [OpenAI API Key Best Practices](https://platform.openai.com/docs/api-reference/authentication)
- [dotenv on npm](https://www.npmjs.com/package/dotenv)
- [12-Factor App — Config](https://12factor.net/config)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

## Knowledge Check

<Quiz 
  questions={[
    {
      text: "What is the 'golden rule' for managing API keys in your application?",
      options: [
        "Store them in a global variable for easy access.",
        "Always encrypt them and store them in the database.",
        "API keys should live in environment variables and never be in source code.",
        "Commit them to GitHub so your teammates can use them immediately."
      ],
      correctAnswerIndex: 2,
      explanation: "Hardcoding keys in source code leads to accidental leaks. Environment variables keep secrets separate from the codebase."
    },
    {
      text: "Why is it critical to add your `.env` file to `.gitignore`?",
      options: [
        "To save disk space on the GitHub server.",
        "To prevent your private API keys from being uploaded to public or shared repositories.",
        "Because git doesn't support files that start with a dot.",
        "To make the project build faster."
      ],
      correctAnswerIndex: 1,
      explanation: "The `.env` file contains your actual secrets. Excluding it from version control ensures those secrets don't leak when you push your code."
    },
    {
      text: "What is the purpose of a `.env.example` file?",
      options: [
        "It is a backup copy of your secrets in case you lose the .env file.",
        "It provides a template with placeholder values so other developers know which environment variables are required.",
        "It is where you store keys that are only for educational examples.",
        "It is required by the Node.js runtime to execute code."
      ],
      correctAnswerIndex: 1,
      explanation: "An example file shows the structure of the required configuration without exposing the sensitive values themselves."
    },
    {
      text: "How should you handle an API key if you suspect it has been leaked?",
      options: [
        "Change the name of the environment variable in your code.",
        "Immediately revoke (delete) the old key and generate a new one.",
        "Wait 24 hours to see if any unauthorized charges appear.",
        "Nothing, most providers automatically detect and block leaks."
      ],
      correctAnswerIndex: 1,
      explanation: "The only safe response to a leak is to invalidate the compromised key and replace it with a fresh one."
    },
    {
      text: "In a production environment, what is a more secure alternative to using `.env` files?",
      options: [
        "Hardcoding the keys just for the production build.",
        "Using a dedicated secrets manager (like AWS Secrets Manager or HashiCorp Vault).",
        "Asking the user to type the key every time the server starts.",
        "Storing the keys in the project's README."
      ],
      correctAnswerIndex: 1,
      explanation: "Cloud-based secrets managers provide better security, audit logs, and easier rotation compared to simple flat files on a server."
    }
  ]}
/>


