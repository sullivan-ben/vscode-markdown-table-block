import { LangParser } from "../interfaces/lang-parser.interface";
import { TableData } from "../interfaces/table-data.interface";
import { trimAllValues, validateTableData } from "../utils/table-data.utils";

function jsonStringToTableData(data: string): TableData {
  if (typeof data !== "string") {
    throw new Error("Expected string argument. Received " + typeof data);
  }

  const parsed = JSON.parse(data);

  if (Array.isArray(parsed)) {
    return { contents: trimAllValues(parsed) };
  }

  parsed.contents = trimAllValues(parsed.contents);

  return validateTableData(parsed);
}

function parse(data: string): TableData {
  if (typeof data !== "string") {
    return validateTableData(data);
  }

  const parsed = jsonStringToTableData(data);
  return parsed;
}

export const JsonParser: LangParser = { parse };
