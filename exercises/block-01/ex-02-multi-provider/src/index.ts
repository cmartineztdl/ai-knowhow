/**
 * Exercise: Normalize Multi-Provider Responses
 * Difficulty: Easy
 *
 * Instructions:
 * Build adapter functions that convert OpenAI and Anthropic response formats
 * into a unified NormalizedResponse type. Both normalizers have bugs that
 * you need to fix.
 *
 * Hints:
 * - OpenAI responses use choices[0].message.content
 * - Anthropic responses use content[] array with type:"text" blocks
 * - Token field names differ between providers
 */

export interface NormalizedResponse {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  finishReason: string;
}

export interface OpenAIResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: { role: "assistant"; content: string };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AnthropicResponse {
  id: string;
  model: string;
  content: Array<{ type: "text"; text: string }>;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Normalize an OpenAI response into the unified format.
 *
 * BUG: Reads content from the wrong path.
 * BUG: Swaps input and output token counts.
 */
export function normalizeOpenAIResponse(
  response: OpenAIResponse,
): NormalizedResponse {
  return {
    // BUG: Should be response.choices[0].message.content
    text: (response as any).content ?? "",
    model: response.model,
    // BUG: These are swapped
    inputTokens: response.usage.completion_tokens,
    outputTokens: response.usage.prompt_tokens,
    finishReason: response.choices[0].finish_reason,
  };
}

/**
 * Normalize an Anthropic response into the unified format.
 *
 * BUG: Tries to access content like OpenAI format.
 * BUG: Uses wrong field name for finish reason.
 */
export function normalizeAnthropicResponse(
  response: AnthropicResponse,
): NormalizedResponse {
  return {
    // BUG: Should iterate content blocks and join text, not access choices
    text: (response as any).choices?.[0]?.message?.content ?? "",
    model: response.model,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    // BUG: Anthropic uses stop_reason, not finish_reason
    finishReason: (response as any).finish_reason ?? "",
  };
}

/**
 * Detect which provider a response comes from and normalize it.
 */
export function normalizeResponse(
  response: OpenAIResponse | AnthropicResponse,
): NormalizedResponse {
  if ("choices" in response) {
    return normalizeOpenAIResponse(response as OpenAIResponse);
  }
  return normalizeAnthropicResponse(response as AnthropicResponse);
}
