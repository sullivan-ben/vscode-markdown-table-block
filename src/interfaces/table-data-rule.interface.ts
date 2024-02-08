import { TableData } from "./formatter-column.interface";

export interface TableDataRule {
  error: (d: TableData) => string;
  isValid: (d: TableData) => boolean;
}
