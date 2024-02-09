export interface ColumnMetadata {
  /**
   * The column name/header value
   */
  name: string;

  /**
   * Styles that apply to the header of the column (i.e. th)
   */
  headerStyles?: object;

  /**
   * Styles that apply to each cell in the column (i.e. td)
   */
  cellStyles?: object;
}

export interface BasicTableData {
  contents: object[];
}

export interface NormalizedTableData {
  headers?: Record<string, string | ColumnMetadata>;
  contents: object[];
}

export interface StrictNormalizedTableData {
  headers: Record<string, ColumnMetadata>;
  contents: object[];
}

export interface TableData extends BasicTableData, NormalizedTableData {}
