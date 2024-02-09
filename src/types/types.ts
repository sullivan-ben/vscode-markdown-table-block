// No runtime types. Export this in case iteration is needed
export const LITERAL_TYPE_ARRAYS = {
  Modes: ["basic", "normalized"],
  SupportedLangs: ["yaml", "json", "js"],
};

// Array to literal does not play well with type completion. Are there alternatives?
// export type SupportedLang = (typeof LITERAL_TYPE_ARRAYS.SupportedLangs)[number];
export type SupportedLang = "yaml" | "json" | "js";

export type LangCode = SupportedLang & "default";

// Array to literal does not play well with type completion. Are there alternatives?
// export type Mode = (typeof LITERAL_TYPE_ARRAYS.Modes)[number];
export type Mode = "basic" | "normalized";

// CSS text alignment - for table cell style
export type TextAlignment = "left" | "right" | "center";

export type DocumentLineRange = { start: number; end: number };
