/**
 * Exercise: Build a Template Engine
 * Difficulty: Medium
 *
 * Instructions:
 * Fix a simple prompt template engine that handles variable substitution,
 * defaults, and conditional sections. Each function has a specific bug.
 *
 * Hints:
 * - Use regex to match {{variableName}} patterns
 * - Defaults should not override explicitly provided values
 * - Conditional blocks {{#if var}}content{{/if}} should be kept or removed
 */

/**
 * Replace {{variable}} placeholders with values from the variables map.
 * Throws if a variable is referenced but not provided.
 *
 * BUG: The regex doesn't match properly — uses single braces instead of double.
 * BUG: Doesn't throw for missing variables.
 */
export function renderTemplate(
  template: string,
  variables: Record<string, string>,
): string {
  // BUG: Wrong regex — should be \{\{(\w+)\}\} for double braces
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    // BUG: Returns the placeholder text instead of throwing on missing variable
    return variables[key] ?? `{${key}}`;
  });
}

/**
 * Render a template with defaults: use provided variables first, fall back to defaults.
 *
 * BUG: Defaults override provided variables instead of the other way around.
 */
export function renderWithDefaults(
  template: string,
  variables: Record<string, string>,
  defaults: Record<string, string>,
): string {
  // BUG: Defaults should be spread first, then variables override
  const merged = { ...variables, ...defaults };
  return renderTemplate(template, merged);
}

/**
 * Handle conditional blocks: {{#if varName}}content{{/if}}.
 * If the variable is truthy, keep the content. If falsy, remove the block.
 *
 * BUG: Always keeps the content regardless of variable truthiness.
 * BUG: Doesn't remove the {{#if}} and {{/if}} markers.
 */
export function renderConditional(
  template: string,
  variables: Record<string, string>,
): string {
  // BUG: Should check variable truthiness and remove block markers
  return template.replace(
    /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_match, _key, content) => {
      // BUG: Always returns content, should check if variable is truthy
      return content;
    },
  );
}
