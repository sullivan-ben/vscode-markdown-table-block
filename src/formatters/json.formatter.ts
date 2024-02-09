import { TableData } from "../interfaces/table-data.interface";
import { LangFormatter } from "../interfaces/lang-formatter.interface";

function format(
  data: TableData,
  nestedContentRenderer?: (data: string) => string
): string {
  if (data.headers) return JSON.stringify(data, null, 2);
  return JSON.stringify(data.contents, null, 2);
}

export const JsonFormatter: LangFormatter = {
  format,
};
