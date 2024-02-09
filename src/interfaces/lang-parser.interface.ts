import { TableData } from "./table-data.interface";

export interface LangParser {
  parse: (data: string) => TableData;
}
