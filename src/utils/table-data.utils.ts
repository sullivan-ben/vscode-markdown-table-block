import { TableDataRule } from "../interfaces/table-data-rule.interface";
import {
  BasicTableData,
  ColumnMetadata,
  NormalizedTableData,
  StrictNormalizedTableData,
  TableData,
} from "../interfaces/table-data.interface";
import { trim } from "./string.utils";
import {
  ContentsMustBeArray,
  ContentsMustBeArrayOfObjects,
  HeaderMustBeObjectIfExists,
  HeaderObjectValuesBeStringOrHaveNameProperty,
} from "./table-data.rules";

/**
 * Maps the keys to their respective ColumnMetadata object, otherwise creates a
 * default one in order to ensure that there is a ColumnMetadata object for every
 * key in every content record.
 *
 * @param contents
 * @param headers
 * @returns
 */
export function getAllColumnMetadata(
  contents: object[],
  headers?: object
): Map<string, ColumnMetadata> {
  const headerValueMap = new Map<string, ColumnMetadata>();

  const resolveHeaderValue = (key: string): [string, ColumnMetadata] => {
    if (headers?.[key]) {
      return typeof headers[key] === "string"
        ? [key, { name: headers[key], headerStyles: {}, cellStyles: {} }]
        : [key, { ...headers[key] }];
    }
    return [key, { name: key, headerStyles: {}, cellStyles: {} }];
  };

  contents.forEach((row: any) => {
    Object.keys(row).forEach((key) =>
      headerValueMap.set(...resolveHeaderValue(key))
    );
  });

  return headerValueMap;
}

/**
 * Ensure that both the contents array AND the headers object exists on a set of table data
 *
 * @param data
 * @returns
 */
export function toStrictNormalizedTableData(
  data: BasicTableData & NormalizedTableData
): StrictNormalizedTableData {
  const headers = getAllColumnMetadata(data.contents, data?.headers);
  return { headers: Object.fromEntries(headers), contents: data.contents };
}

/**
 * Validate that the received data correctly matches the TableData interface
 *
 * @param data
 * @returns
 */
export function validateTableData(data: TableData | any): TableData {
  if (typeof data !== "object") {
    throw new Error(
      "Invalid data format. Expected object. Received " + typeof data
    );
  }

  const rules: TableDataRule[] = [
    HeaderMustBeObjectIfExists,
    ContentsMustBeArray,
    ContentsMustBeArrayOfObjects,
    HeaderObjectValuesBeStringOrHaveNameProperty,
  ];

  rules.forEach((rule) => {
    if (!rule.isValid(data)) {
      throw new Error(`Invalid data format. ${rule.error(data)}`);
    }
  });

  // ensure no extra properties are passed
  const result: any = { contents: data.contents };
  if (data.headers) result.headers = data.headers;

  return result;
}

/**
 * Trailing spaces & line-breaks can introduce inconsistencies when parsing to-from languages. Remove them for consistency.
 *
 * @param contents
 * @returns
 */
export function trimAllValues(contents: Record<string, string>[]) {
  return contents.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([k, v]) => [
        k,
        typeof v === "string" ? trim(v, ["\n", " "]) : v,
      ])
    )
  );
}
