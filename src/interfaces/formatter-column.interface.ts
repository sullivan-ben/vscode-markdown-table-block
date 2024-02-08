export interface ColumnMetadata {
  /**
   * The column name/header value
   */
  name: string;

  /**
   * Styles that apply to the whole column
   */
  styles?: object;

  /**
   * Styles that apply to each cell in the column
   */
  cellStyles?: object;
}

export interface TableData {
  headers?: Record<string, string | ColumnMetadata>;
  contents: object[];
}
