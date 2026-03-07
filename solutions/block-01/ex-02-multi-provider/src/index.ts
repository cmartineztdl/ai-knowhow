/**
 * Solution: Normalize Multi-Provider Responses
 *
 * Approach: Read each provider's response using their specific structure,
 * mapping to a common NormalizedResponse type.
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
 * FIX: Correct property path and proper token mapping.
 */
export function normalizeOpenAIResponse(
  response: OpenAIResponse,
): NormalizedResponse {
  return {
    // FIX: Read from choices[0].message.content
    text: response.choices[0].message.content,
    model: response.model,
    // FIX: Map prompt_tokens to input, completion_tokens to output
    inputTokens: response.usage.prompt_tokens,
    outputTokens: response.usage.completion_tokens,
    finishReason: response.choices[0].finish_reason,
  };
}

/**
 * Normalize an Anthropic response into the unified format.
 * FIX: Join text content blocks and use stop_reason.
 */
export function normalizeAnthropicResponse(
  response: AnthropicResponse,
): NormalizedResponse {
  return {
    // FIX: Iterate content blocks and join text
    text: response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join(""),
    model: response.model,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    // FIX: Use stop_reason from Anthropic response
    finishReason: response.stop_reason,
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
