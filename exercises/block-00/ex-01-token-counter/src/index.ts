/**
 * Exercise: Fix the Token Counter
 * Difficulty: Easy
 *
 * Instructions:
 * The tokenizer and cost estimator have bugs. Fix them so all tests pass.
 * Do NOT modify the vocabulary — only fix the logic.
 *
 * Hints:
 * - BPE tokenizers match the LONGEST vocabulary entry first
 * - Cost is typically measured per 1,000 tokens, not per token
 * - Watch out for off-by-one errors in the loop
 */

/** Simple vocabulary simulating BPE-learned tokens */
const VOCABULARY: string[] = [
  "the",
  "th",
  "e",
  "quick",
  "qu",
  "ick",
  "brown",
  "br",
  "own",
  "fox",
  "jump",
  "jumps",
  "ing",
  "ed",
  " ",
];

/**
 * Tokenize text using a simple vocabulary-based approach.
 * Should match the LONGEST vocabulary entries first (greedy).
 *
 * BUG: The current implementation matches shortest first,
 * producing too many tokens.
 */
export function tokenize(text: string): string[] {
  const tokens: string[] = [];
  const lowerText = text.toLowerCase();
  let i = 0;

  while (i < lowerText.length) {
    let matched = false;

    // BUG: This iterates from shortest to longest — should be longest to shortest
    for (const vocab of VOCABULARY) {
      if (lowerText.startsWith(vocab, i)) {
        tokens.push(vocab);
        i += vocab.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Unknown character becomes its own token
      tokens.push(lowerText[i]);
      i += 1;
    }
  }

  return tokens;
}

/**
 * Count the number of tokens in a text string.
 */
export function countTokens(text: string): number {
  return tokenize(text).length;
}

/**
 * Estimate the API cost for a given text.
 *
 * BUG: The cost calculation treats pricePerThousandTokens as price per token.
 */
export function estimateCost(
  text: string,
  pricePerThousandTokens: number,
): number {
  const tokens = countTokens(text);
  // BUG: Should divide by 1000 since price is per 1000 tokens
  const cost = tokens * pricePerThousandTokens;
  return Math.round(cost * 1_000_000) / 1_000_000; // Round to 6 decimal places
}
