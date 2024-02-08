import { LangCode, SupportedLang } from "./types/types";

export const MODULE_NAME = "markdown-table-block";
export const DEFAULT_LANGUAGE: SupportedLang = "yaml";
export const DEFAULT_LANGMAP: Record<LangCode, string> = {
  default: "table",
  yaml: "table:yaml",
  json: "table:json",
  js: "table:js",
};
