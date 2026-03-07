/**
 * Solution: Build a Template Engine
 *
 * Approach: Use double-brace regex for variable substitution, spread defaults
 * first then variables, and check variable truthiness for conditionals.
 */

/**
 * Replace {{variable}} placeholders with values from the variables map.
 * FIX: Uses double-brace regex and throws for missing variables.
 */
export function renderTemplate(
  template: string,
  variables: Record<string, string>,
): string {
  // FIX: Use \{\{(\w+)\}\} for double braces
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    // FIX: Throw for missing variables
    if (!(key in variables)) {
      throw new Error(`Missing template variable: ${key}`);
    }
    return variables[key];
  });
}

/**
 * Render a template with defaults: use provided variables first, fall back to defaults.
 * FIX: Spread defaults first, then variables override.
 */
export function renderWithDefaults(
  template: string,
  variables: Record<string, string>,
  defaults: Record<string, string>,
): string {
  // FIX: Defaults first, variables override
  const merged = { ...defaults, ...variables };
  return renderTemplate(template, merged);
}

/**
 * Handle conditional blocks: {{#if varName}}content{{/if}}.
 * FIX: Checks variable truthiness and removes block markers properly.
 */
export function renderConditional(
  template: string,
  variables: Record<string, string>,
): string {
  return template.replace(
    /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_match, key, content) => {
      // FIX: Check if variable exists and is truthy
      const value = variables[key];
      if (value && value.length > 0) {
        return content;
      }
      return "";
    },
  );
}
