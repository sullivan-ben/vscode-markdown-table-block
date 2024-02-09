import { parseAllDocuments } from "yaml";
import { LangParser } from "../interfaces/lang-parser.interface";
import { TableData } from "../interfaces/table-data.interface";
import { validateTableData } from "../utils/table-data.utils";
import { trimAllValues } from "../utils/table-data.utils";

/**
 * Convert yaml data into a HTML table
 * @param data
 * @param md
 * @returns
 */
function parse(data: string): TableData {
  if (typeof data !== "string") {
    return validateTableData(data);
  }

  const parsedDocs = parseAllDocuments(data);

  if (parsedDocs.length === 1) {
    // confusingly yaml parser ".toJSON()" actually returns js, not json
    return validateTableData({
      contents: trimAllValues(parsedDocs[0].contents?.toJSON()),
    });
  }

  if (parsedDocs.length === 2) {
    return validateTableData({
      // confusingly yaml parser ".toJSON()" actually returns js, not json
      headers: parsedDocs[0]?.toJSON(),
      contents: trimAllValues(parsedDocs[1]?.toJSON()),
    });
  }

  throw new Error(
    "Expecting 1 or 2 yaml documents. Found: " + parsedDocs.length
  );
}

export const YamlParser: LangParser = { parse };
