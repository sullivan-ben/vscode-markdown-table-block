/**
 * Use this to trim characters or words from the beginning and end
 * of a string. This is a more powerful version of the built-in
 * String.prototype.trim, which only trims whitespace.
 *
 * @param str Input string to be trimmed
 * @param values Either:
 *  - string: Each character is trimmed separately
 *  - string[]: Each array item is treated as a "word" and trimmed only when there is a complete match
 * @returns The trimmed string
 */
export function trim(str: string, values?: string | string[]): string {
  if (typeof str !== "string") {
    throw new Error(
      `Invalid input type. Expected string, received ${typeof str}`
    );
  }

  if (values === undefined) return str.trim();

  return typeof values === "string"
    ? str.replace(new RegExp(`^[${values}]+|[${values}]+$`, "g"), "")
    : str.replace(
        new RegExp(`^(${values.join("|")})+|(${values.join("|")})+$`, "g"),
        ""
      );
}

/**
 * Convert cammelCase to kebab-case
 *
 * TODO: Add support for other input cases
 *
 * @param s A string in camel case
 */
export function toKebab(s: string) {
  return s.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Convert any string to camel case
 *
 * Removes all non-alphanumeric characters and capitalizes first letters of words
 *
 * @param s
 * @returns
 */
export function toCammelCase(s: string) {
  return s.replace(/(^.)|([^0-9A-Za-z$].)/gm, (m, g1, g2) => {
    if (g1) return g1.toLowerCase();
    if (g2) return g2[1].toUpperCase();
    return m;
  });
}

export function removeCodeblockBackticks(s: string): string {
  return trim(s.replace(/```.*/g, ""), ["\n", " "]);
}
