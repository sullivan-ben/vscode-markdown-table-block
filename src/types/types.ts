import { TableData } from "../interfaces/formatter-column.interface";

export type FormatterFn = (data: TableData | string, md: markdownit) => string;

export type SupportedLang = "yaml" | "json" | "js";
export type LangCode = SupportedLang & "default";
