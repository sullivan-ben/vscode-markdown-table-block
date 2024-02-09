import { TableData } from "./table-data.interface";

export interface LangFormatter {
  /**
   * Format the parsed data into a string (e.g. markdown, html, etc.).
   *
   * @param data Parsed data
   * @param nestedContentRenderer Optionally include a renderer (parse then format) to allow nesting of markdown/table data
   * @returns
   */
  format: (
    data: TableData,
    nestedContentRenderer?: (data: string) => string
  ) => string;
}
