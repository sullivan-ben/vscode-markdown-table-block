import { TableDataRule } from "../interfaces/table-data-rule.interface";

const HeaderMustBeObjectIfExists: TableDataRule = {
  error: (d) => `Expected Header as Object. Received ${typeof d.headers}`,
  isValid: (d) => d.headers === undefined || typeof d.headers === "object",
};

const ContentsMustBeArray: TableDataRule = {
  error: (d) => `Expected Contents as Array. Received ${typeof d.contents}`,
  isValid: (d) => d.contents !== undefined && Array.isArray(d.contents),
};

const ContentsMustBeArrayOfObjects: TableDataRule = {
  error: (d) => `Expected Contents as Array of Objects.`,
  isValid: (d) => d.contents.every((c: any) => typeof c === "object"),
};

const HeaderObjectValuesBeStringOrHaveNameProperty: TableDataRule = {
  error: (d) =>
    `Expected Header Object values to be string or have a name property.`,
  isValid: (d) =>
    d.headers === undefined ||
    Object.values(d.headers).every(
      (v: any) => typeof v === "string" || v?.name !== undefined
    ),
};

export {
  HeaderMustBeObjectIfExists,
  ContentsMustBeArray,
  ContentsMustBeArrayOfObjects,
  HeaderObjectValuesBeStringOrHaveNameProperty,
};
