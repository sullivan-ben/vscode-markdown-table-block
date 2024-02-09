import { TableData } from "./table-data.interface";

export interface TableDataRule {
  error: (d: TableData) => string;
  isValid: (d: TableData) => boolean;
}
