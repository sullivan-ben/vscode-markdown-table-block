import { parseAllDocuments } from "yaml";
import jsFormatter from "./js.formatter";
import { LangFormatter } from "../interfaces/lang-formatter.interface";
import { TableData } from "../interfaces/formatter-column.interface";
import validateTableData from "../validators/table-data.validator";

/**
 * Convert yaml data into a HTML table
 * @param data
 * @param md
 * @returns
 */
function formatHTML(data: TableData | string, md: markdownit) {
  if (typeof data !== "string") {
    return jsFormatter.formatHTML(validateTableData(data), md);
  }

  const parsedDocs = parseAllDocuments(data);

  if (parsedDocs.length === 1) {
    return jsFormatter.formatHTML(
      // confusingly contents.toJSON() actually returns js, not json
      validateTableData({ contents: parsedDocs[0].contents?.toJSON() }),
      md
    );
  }

  if (parsedDocs.length === 2) {
    return jsFormatter.formatHTML(
      validateTableData({
        headers: parsedDocs[0]?.toJSON(),
        contents: parsedDocs[1]?.toJSON(),
      }),
      md
    );
  }

  throw new Error(
    "Expecting 1 or 2 yaml documents. Found: " + parsedDocs.length
  );
}

const jsonFormatter: LangFormatter = {
  formatHTML,
};

export default jsonFormatter;
