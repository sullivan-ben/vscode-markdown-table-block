import { TableData } from "../interfaces/table-data.interface";
import { LangFormatter } from "../interfaces/lang-formatter.interface";
import { Document, ToStringOptions, parseDocument, stringify } from "yaml";

function formatDocument(doc): string {
  doc.contents.items.forEach((item, i) => {
    if (i === 0) return; // first item already has a space before
    item.spaceBefore = true;
  });

  const options: ToStringOptions = {
    blockQuote: "literal",
    collectionStyle: "block",
  };

  const str = doc.toString(options);

  // yaml module uses keep chomping syntax and has no option to change to clip
  // See:
  // - yaml spec: https://yaml.org/spec/1.2.2/#8112-block-chomping-indicator
  // - yaml module docs: https://eemeli.org/yaml/#tostring-options
  const withClipChomp = str.replace(/: \|-/g, ": |");
  return withClipChomp;
}

function format(
  data: TableData,
  nestedContentRenderer?: (data: string) => string
): string {
  const docs: Document[] = [];

  // We're stringifying, then parsing because yaml library doesn't provide
  // adequate options to update data using stringify - and we need to
  const toYamlDoc = (data: any): Document => parseDocument(stringify(data));

  if (data.headers) docs.push(toYamlDoc(data.headers));
  docs.push(toYamlDoc(data.contents));

  const formattedDocs = docs.map((doc) => formatDocument(doc));
  return formattedDocs.join("\n---\n");
}

export const YamlFormatter: LangFormatter = {
  format,
};
