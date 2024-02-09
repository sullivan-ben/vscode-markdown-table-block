import { ColumnMetadata, TableData } from "../interfaces/table-data.interface";
import {
  getAllColumnMetadata,
  validateTableData,
} from "../utils/table-data.utils";
import { toCammelCase, trim } from "../utils/string.utils";
import { TextAlignment } from "../types/types";
import { LangFormatter } from "../interfaces/lang-formatter.interface";

/**
 * The default text alignment for columns in a markdown table
 * TODO: Expose as config value or see if it can be inferred from markdown-it
 */
const MARKDOWN_DEFAULT_COLUMN_ALIGNMENT: TextAlignment = "left";

/**
 * Parse a markdown table in string form into a 2D javascript array
 *
 * @param table A markdown table that is in string form
 * @returns A javascript array (`arr[rows][cols]`)
 */
function parseToValuesArray(table: string) {
  const rowsRegex = /^.+$/gm;
  const rowArr = table.match(rowsRegex);

  const parseRowCells = (row: string) => {
    // Enable escaping with backslash, otherwise treat as pipe-delimited list
    const regex = /(?<data>([^\|]+)(\\\|)?([^\|]+))/gm;
    const result = [...row.matchAll(regex)].map(
      (m) => m.groups?.data?.trim() ?? ""
    );
    return result;
  };

  return rowArr?.map((row) => parseRowCells(row));
}

/**
 * In TableData type, headers can be either Record<string, string> or Record<string, ColumnMetadata>
 * Given the respective key/value, this function converts the former to the latter.
 *
 * @param key
 * @param value
 * @returns
 */
function headerValueToMetadataObject(
  key: string,
  value: string | object
): [string, ColumnMetadata] {
  const metadata: ColumnMetadata = {
    ...(typeof value === "string"
      ? { name: value }
      : (value as ColumnMetadata)),
  };
  return [key, metadata];
}

/**
 * Get the text alignment of a delimiter cell as per github markdown table syntax
 * @param cell
 * @returns
 */
function getDelimiterCellAlignment(cell: string): TextAlignment {
  if (cell.startsWith(":") && cell.endsWith(":")) return "center";
  if (cell.startsWith(":")) return "left";
  if (cell.endsWith(":")) return "right";
  return MARKDOWN_DEFAULT_COLUMN_ALIGNMENT;
}

/**
 * Create the contents for a headers object, but return as entries (Object.entries) for convenience
 * @param headerRow An array of column heading names
 * @param delimiterRow An array containing each cell of the markdown delimiter row
 * @returns
 */
function processHeaders(
  headerRow: string[],
  delimiterRow: string[]
): [string, string | ColumnMetadata][] {
  // Transform header row to entries and prepare header names to be used as normalized header ids
  const headerEntries: [string, string | ColumnMetadata][] = headerRow.map(
    (header) => [toCammelCase(trim(header, "_*")), header]
  );

  if (!headerRow || headerRow.length !== delimiterRow.length) {
    throw new Error(
      "Invalid table format. Header and delimiter row must have the same number of cells."
    );
  }

  delimiterRow.forEach((cell, index) => {
    const textAlign = getDelimiterCellAlignment(cell);
    if (textAlign === MARKDOWN_DEFAULT_COLUMN_ALIGNMENT) return;

    const header = headerEntries[index];
    const [key, value] = headerValueToMetadataObject(...header);

    value.headerStyles = { ...value.headerStyles, textAlign };
    value.cellStyles = { ...value.cellStyles, textAlign };

    headerEntries[index] = [key, value];
  });

  return headerEntries;
}

/**
 * Perform any necessary transformations or sanitization for cell values
 * @param cell
 */
function processCellValue(cell: string): string {
  const brToLineBreak = (s) => s.replace(/ *<\/br>/g, "\n");
  return brToLineBreak(cell);
}

/**
 * Parse a string of javascript code into javascript objects or arrays.
 * @param table A javascript object or array that is in string form
 * @returns A javascript object or array
 */
function parse(table: string): TableData {
  const tableArr = parseToValuesArray(table);

  if (!tableArr || tableArr.length < 3) {
    throw new Error(
      "Invalid table format. Table must have header, delimiter, and one or more content rows."
    );
  }

  const [headerRow, delimiterRow, ...contentArr] = tableArr;
  const headersEntries = processHeaders(headerRow, delimiterRow);

  // Count any difference between raw header and processed key as metadata, because even if there
  // is no explicit metadata, markdown styles (stripped from keys) can introduce illegal keys
  const hasMetadata = headersEntries.some(
    ([key, value]) => typeof value !== "string" || key !== toCammelCase(value)
  );

  const contents = contentArr.map((row) =>
    row.reduce((acc, cell, i) => {
      // If there is metadata, table mode will be normalized, use normalized header ids
      const header = hasMetadata ? headersEntries[i][0] : headerRow[i];
      return { ...acc, [header]: processCellValue(cell) };
    }, {})
  );

  const result = hasMetadata
    ? { headers: Object.fromEntries(headersEntries), contents }
    : { contents: contents };

  return validateTableData(result);
}

function mapHeaderToMarkdown(
  header: string | ColumnMetadata,
  contents
): string {
  if (typeof header === "string") return header;
  return header.name;
}

function format(
  data: TableData,
  nestedContentRenderer?: (data: string) => string
): string {
  const rowArrays: string[][] = [];

  const newLineToBreak = (s: string) => {
    const regex = / *[\n\r]/g;
    return s.replace(regex, "</br>");
  };
  const headers = getAllColumnMetadata(data.contents, data?.headers);
  rowArrays.push([...headers].map(([k, v]) => v.name));
  rowArrays.push([...headers].map(() => "-"));
  rowArrays.push(
    ...data.contents.map((row: object) => {
      const rowArr: any = [];
      headers.forEach((header, key) => {
        const content = row[key] + ""; // implicitly convert contents to a string
        rowArr.push(newLineToBreak(trim(content, ["\n"])));
      });
      return rowArr;
    })
  );

  const maxColumnWidths = rowArrays.reduce((acc, row) => {
    row.forEach((cell, i) => {
      if (!acc[i] || cell.length > acc[i]) acc[i] = cell.length;
    });
    return acc;
  }, [] as number[]);

  const minContentWidth = 3; // min content width
  const padding = 1; // padding between content and cell border

  const columnWidths = maxColumnWidths.map((width) =>
    width < minContentWidth ? minContentWidth : width
  );

  const addCellPadding = (
    content: string,
    targetWidth: number,
    alignMent: TextAlignment,
    paddingChar: string = " "
  ) => {
    const requiredPadding = targetWidth - content.length;
    const cellPadding = {
      center: {
        left: Math.floor(requiredPadding / 2),
        right: Math.ceil(requiredPadding / 2),
      },
      left: {
        left: 0,
        right: requiredPadding,
      },
      right: {
        left: requiredPadding,
        right: 0,
      },
    }[alignMent];

    return (
      " ".repeat(padding) +
      paddingChar.repeat(cellPadding.left) +
      content +
      paddingChar.repeat(cellPadding.right) +
      " ".repeat(padding)
    );
  };

  const result = rowArrays.map((row, rowIndex) =>
    row.reduce((acc, cell, columnIndex) => {
      const header = [...headers][columnIndex][1];
      const align =
        // @ts-ignore
        header.headerStyles?.textAlign ?? MARKDOWN_DEFAULT_COLUMN_ALIGNMENT;

      // Separator always in second row of table
      if (rowIndex === 1) {
        const separatorBase = [
          " ".repeat(padding),
          "-".repeat(columnWidths[columnIndex]),
          " ".repeat(padding),
        ].join("");

        const addAlignment = (separator: string, align: TextAlignment) => {
          return {
            left: separator,
            right: separator.replace(/-(?= *?$)/, ":"),
            center: separator.replace(/(-(?= *?$))|((?<=^ *?)-)/g, ":"),
          }[align];
        };

        return acc + addAlignment(separatorBase, align) + "|";
      }

      return acc + addCellPadding(cell, columnWidths[columnIndex], align) + "|";
    }, "|")
  );

  return result.join("\n") + "\n";
}

export const MdFormatter: LangFormatter = { format };
