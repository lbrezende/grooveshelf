/**
 * Convert a camelCase token key to a CSS custom property name.
 *
 * Examples:
 *   "cardForeground"    → "--card-foreground"
 *   "primaryForeground" → "--primary-foreground"
 *   "chart1"            → "--chart-1"
 *   "background"        → "--background"
 *   "mutedForeground"   → "--muted-foreground"
 */
export function tokenKeyToCssVar(key: string): string {
  // Insert hyphen before uppercase letters and before digits that follow letters
  const kebab = key
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([a-zA-Z])(\d)/g, "$1-$2")
    .toLowerCase();
  return `--${kebab}`;
}

/**
 * Convert a sidebar token key to its full CSS variable name.
 * e.g. "primaryForeground" → "--sidebar-primary-foreground"
 */
export function sidebarKeyToCssVar(key: string): string {
  const kebab = key
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([a-zA-Z])(\d)/g, "$1-$2")
    .toLowerCase();
  return `--sidebar-${kebab}`;
}
