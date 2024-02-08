import { LangFormatter } from "../interfaces/lang-formatter.interface";
import { TableData } from "../interfaces/formatter-column.interface";
import { ColumnMetadata } from "../interfaces/formatter-column.interface";
import validateTableData from "../validators/table-data.validator";

const defaultStyles = {
  table: {
    width: "100%",
  },
  thead: {
    background: "#333",
  },
  th: {
    whiteSpace: "nowrap",
  },
  td: {
    textAlign: "left",
    verticalAlign: "top",
  },
};

/**
 * Convert a style object to an inline string of css properties
 * @param k
 * @returns
 */
function s(k: keyof typeof defaultStyles, additionalStyles?: object) {
  const cammelToKebab = (s: string) =>
    s.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();

  const allStyles = { ...defaultStyles[k], ...additionalStyles };

  return Object.entries(allStyles).reduce(
    (p, [key, value]) => `${p} ${cammelToKebab(key)}:${value};`,
    ""
  );
}

/**
 * The headers object may or may not exist. If it does,
 * the keys could be different from header values. Create
 * a map of header keys to header values.
 *
 * @param contents
 * @param headers
 * @returns
 */
function createHeaderKeyValueMap(
  contents: object[],
  headers?: object
): Map<string, ColumnMetadata> {
  const headerValueMap = new Map<string, ColumnMetadata>();

  const resolveHeaderValue = (key: string): [string, ColumnMetadata] => {
    if (headers?.[key]) {
      return typeof headers[key] === "string"
        ? [key, { name: headers[key], styles: {}, cellStyles: {} }]
        : [key, { ...headers[key] }];
    }
    return [key, { name: key, styles: {}, cellStyles: {} }];
  };

  contents.forEach((row: any) => {
    Object.keys(row).forEach((key) =>
      headerValueMap.set(...resolveHeaderValue(key))
    );
  });

  return headerValueMap;
}

function toHTMLTable(data: TableData, md: markdownit) {
  if (!Array.isArray(data.contents)) {
    // Should have already been parsed by this point.
    throw new Error("Invalid table contents. Expected array.");
  }

  if (data.headers) {
    const a = "wait";
    console.log(a);
  }
  const headerData = createHeaderKeyValueMap(
    data.contents,
    data.headers as object
  );

  const rows = data.contents.map((row: any) => {
    return `<tr>${Array.from(headerData.keys())
      .map(
        (k) =>
          `<td style="${s("td", {
            ...headerData.get(k)!.styles,
            ...headerData.get(k)!.cellStyles,
          })}" >${md.render(row?.[k]?.toString() ?? "")}</td>`
      )
      .join("")}</tr>`;
  });

  return `
    <table style="${s("table")}">
      <thead style="${s("thead")}">
        <tr>
          ${Array.from(headerData.values())
            .map((h) => `<th style="${s("th", h.styles)}">${h.name}</th>`)
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${rows.join("")}
      </tbody>
    </table>
  `;
}

/**
 * Parse a string of javascript code into javascript objects or arrays.
 * @param code A javascript object or array that is in string form
 * @returns A javascript object or array
 */
function parseJS(code: string) {
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

function formatHTML(data: TableData | string, md: markdownit) {
  const parsed = typeof data === "string" ? parseJS(data) : data;
  return toHTMLTable(parsed, md);
}

const jsonFormatter: LangFormatter = {
  formatHTML,
};

export default jsonFormatter;
