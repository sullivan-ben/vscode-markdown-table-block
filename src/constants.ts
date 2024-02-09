import { LangCode, SupportedLang, TextAlignment } from "./types/types";

// This is the name of the extension as registered with vscode.
// The name cannot be changed without breaking the extension.
export const MODULE_NAME = "markdown-table-block";

// If command values change, they will need to be updated in the
// package.json Extension Maifest as well (contributes.commands)
export enum MODULE_COMMANDS {
  CONVERT_SELECTION_TO_MARKDOWN_TABLE_BLOCK = "markdown-table-block.convertSelectionToMarkdownTableBlock",
  CONVERT_SELECTION_TO_MARKDOWN_TABLE = "markdown-table-block.convertSelectionToMarkdownTable",
}

// Provide default language config. These can be overriden by
// user settings (settings.json)
export const DEFAULT_LANGUAGE: SupportedLang = "yaml";
export const DEFAULT_LANGMAP: Record<LangCode, string> = {
  default: "table",
  yaml: "table:yaml",
  json: "table:json",
  js: "table:js",
};

/**
 * The default text alignment for columns in a markdown table
 * TODO: Expose as config value or see if it can be inferred from markdown-it
 */
export const MARKDOWN_DEFAULT_COLUMN_ALIGNMENT: TextAlignment = "left";
