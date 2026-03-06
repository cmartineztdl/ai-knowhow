/**
 * Solution: Fix the Token Counter
 *
 * Approach: Sort vocabulary by length (longest first) for greedy BPE matching,
 * and fix cost calculation to divide by 1000 since pricing is per-thousand-tokens.
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
 * Matches the LONGEST vocabulary entries first (greedy BPE).
 */
export function tokenize(text: string): string[] {
  const tokens: string[] = [];
  const lowerText = text.toLowerCase();
  let i = 0;

  // FIX: Sort vocabulary by length, longest first
  const sortedVocab = [...VOCABULARY].sort((a, b) => b.length - a.length);

  while (i < lowerText.length) {
    let matched = false;

    for (const vocab of sortedVocab) {
      if (lowerText.startsWith(vocab, i)) {
        tokens.push(vocab);
        i += vocab.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
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
 * Price is per 1000 tokens, so we divide token count by 1000.
 */
export function estimateCost(
  text: string,
  pricePerThousandTokens: number,
): number {
  const tokens = countTokens(text);
  // FIX: Divide by 1000 since price is per 1000 tokens
  const cost = (tokens / 1000) * pricePerThousandTokens;
  return Math.round(cost * 1_000_000) / 1_000_000;
}
