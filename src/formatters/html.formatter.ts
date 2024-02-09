import { TableData } from "../interfaces/table-data.interface";
import { LangFormatter } from "../interfaces/lang-formatter.interface";
import { toStrictNormalizedTableData } from "../utils/table-data.utils";
import { toKebab } from "../utils/string.utils";

const defaultStyles = {
  table: {
    width: "100%",
  },
  thead: {},
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
function style(k: keyof typeof defaultStyles, additionalStyles?: object) {
  const allStyles = { ...defaultStyles[k], ...additionalStyles };

  return Object.entries(allStyles).reduce(
    (p, [key, value]) => `${p} ${toKebab(key)}:${value};`,
    ""
  );
}

function format(
  data: TableData,
  nestedContentRenderer?: (data: string) => string
): string {
  if (!Array.isArray(data.contents)) {
    // Should have already been parsed by this point, but lets check anyway just to be safe
    throw new Error("Invalid table contents. Expected array.");
  }

  const { headers, contents } = toStrictNormalizedTableData(data);
  const renderContent = (data?: string) => {
    if (!data) return "";
    if (nestedContentRenderer) return nestedContentRenderer(data);
    return data;
  };

  const rows = contents.map((row: any) => {
    return `<tr>${Object.keys(headers)
      .map(
        (k) =>
          `<td style="${style("td", headers[k].cellStyles)}" >
            ${renderContent(row?.[k]?.toString())}
          </td>`
      )
      .join("")}</tr>`;
  });

  return `
    <table style="${style("table")}">
      <thead style="${style("thead")}">
        <tr>
          ${Object.values(headers)
            .map(
              (h) =>
                `<th style="${style("th", h.headerStyles)}">
                  ${renderContent(h.name)}
                </th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${rows.join("")}
      </tbody>
    </table>
  `;
}

export const HtmlFormatter: LangFormatter = {
  format,
};
