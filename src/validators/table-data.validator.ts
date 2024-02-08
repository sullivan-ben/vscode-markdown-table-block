import { TableData } from "../interfaces/formatter-column.interface";
import { TableDataRule } from "../interfaces/table-data-rule.interface";
import {
  ContentsMustBeArray,
  ContentsMustBeArrayOfObjects,
  HeaderMustBeObjectIfExists,
  HeaderObjectValuesBeStringOrHaveNameProperty,
} from "./table-data.rules";

/**
 * Validate that the received data correctly matches the TableData interface
 *
 * @param data
 * @returns
 */
export default function validateTableData(data: TableData | any): TableData {
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

  const { headers, contents } = data; // ensure no extra properties are passed
  return { contents, headers };
}
