import { LangFormatter } from "../interfaces/lang-formatter.interface";
import { TableData } from "../interfaces/formatter-column.interface";
import validateTableData from "../validators/table-data.validator";
import jsFormatter from "./js.formatter";

export function jsonStringToTableData(data: string): TableData {
  if (typeof data !== "string") {
    throw new Error("Expected string argument. Received " + typeof data);
  }

  const parsed = JSON.parse(data);

  if (Array.isArray(parsed)) {
    return { contents: parsed };
  }

  return validateTableData(parsed);
}

function formatHTML(data: TableData | string, md: markdownit) {
  if (typeof data !== "string") {
    return jsFormatter.formatHTML(validateTableData(data), md);
  }

  const parsed = jsonStringToTableData(data);
  return jsFormatter.formatHTML(parsed, md);
}

const jsonFormatter: LangFormatter = {
  formatHTML,
};

export default jsonFormatter;
