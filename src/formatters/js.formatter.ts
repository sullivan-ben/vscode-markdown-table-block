import { TableData } from "../interfaces/table-data.interface";
import { LangFormatter } from "../interfaces/lang-formatter.interface";
import { stringify } from "javascript-stringify";

function format(
  data: TableData,
  nestedContentRenderer?: (data: string) => string
): string {
  // return JSON.stringify(data, null, 2);
  if (data.headers) return stringify(data, null, 2) ?? "";
  return stringify(data.contents, null, 2) ?? "";
}

export const JsFormatter: LangFormatter = {
  format,
};
