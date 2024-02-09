import { TableData } from "../interfaces/table-data.interface";
import { validateTableData } from "../utils/table-data.utils";
import { LangParser } from "../interfaces/lang-parser.interface";

/**
 * Parse a string of javascript code into javascript objects or arrays.
 * @param code A javascript object or array that is in string form
 * @returns A javascript object or array
 */
function parse(code: string): TableData {
  // Convert it to a JSON object to that we can parse it without resorting
  // to eval, which is unsafe.
  const re = new RegExp(/(\w+ ?)(?=:)|(,(?=\s*[}\]]))|(".*")/, "g");
  const jsonStr = code.replace(
    re,
    (match, keyMatch, trailingCommaMatch, stringValueMatch) => {
      if (keyMatch) return `"${keyMatch}"`;
      if (trailingCommaMatch) return ``;
      if (stringValueMatch) return stringValueMatch; // return any strings as-is
    }
  );

  const parsed = JSON.parse(jsonStr);
  const result = Array.isArray(parsed) ? { contents: parsed } : parsed;

  return validateTableData(result);
}

export const JsParser: LangParser = { parse };
