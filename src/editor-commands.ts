import * as vscode from "vscode";
import { DocumentLineRange, LITERAL_TYPE_ARRAYS } from "./types/types";
import { DEFAULT_LANGUAGE, MODULE_NAME } from "./constants";
import { MdTableParser } from "./parsers/md-table.parser";
import { TableData } from "./interfaces/table-data.interface";
import { YamlFormatter } from "./formatters/yaml.formatter";
import { JsonFormatter } from "./formatters/json.formatter";
import { JsFormatter } from "./formatters/js.formatter";
import { MdFormatter } from "./formatters/md-table.formatter";
import { YamlParser } from "./parsers/yaml.parser";
import { JsonParser } from "./parsers/json.parser";
import { JsParser } from "./parsers/js.parser";
import { removeCodeblockBackticks } from "./utils/string.utils";
import { HtmlFormatter } from "./formatters/html.formatter";

var MarkdownIt = require("markdown-it");

async function showLanguagePicker(title?: string) {
  return vscode.window.showQuickPick(
    [
      // Show the default language first, so that it is selected by default
      vscode.workspace
        .getConfiguration(MODULE_NAME)
        .get("defaultLanguage", DEFAULT_LANGUAGE),
      ...LITERAL_TYPE_ARRAYS.SupportedLangs,
    ]
      .filter((value, index, self) => self.indexOf(value) === index) // remove duplicate default value
      .filter((lang) => lang !== "js") // remove js. There are some bugs in the js parser that need resolving
      .map((lang, i) => ({
        label: lang,
        description: i === 0 ? `(default language)` : undefined,
      })),
    {
      title: title ?? "Select a language",
    }
  );
}

/**
 * Use markdowninit to parse the document and return a list of all line ranges for
 * any markdown tables in the editor
 * @param editor
 * @returns
 */
function getDocumentCodeBlocks(
  editor: vscode.TextEditor
): { lang: string; range: DocumentLineRange }[] {
  const m: markdownit = new MarkdownIt();
  const a = m.parse(editor?.document.getText() ?? "", {});

  const documentTables = a.reduce((codeblocks, token) => {
    if (token.type !== "fence" || !token.info.match(/.*:table/))
      return codeblocks;
    // @ts-ignore
    const codeblock = { start: token.map[0], end: token.map[1] };
    codeblocks.push({
      lang: token.info.match(/.+(?=:table)/)?.at(0) || "yaml", // replace with default
      range: codeblock,
    });
    return codeblocks;
  }, [] as { lang: string; range: DocumentLineRange }[]);

  return documentTables;
}

/**
 * Use markdowninit to parse the document and return a list of all line ranges for
 * any markdown tables in the editor
 * @param editor
 * @returns
 */
function getDocumentTables(editor: vscode.TextEditor): DocumentLineRange[] {
  const m: markdownit = new MarkdownIt();
  const a = m.parse(editor?.document.getText() ?? "", {});

  const documentTables = a.reduce((tables, token) => {
    if (token.type !== "table_open") return tables;
    // @ts-ignore
    const table = { start: token.map[0], end: token.map[1] };
    tables.push(table);
    return tables;
  }, [] as DocumentLineRange[]);

  return documentTables;
}

/**
 * Determine if the line ranges of a feature is intersecting the cursor/selection
 * in the editor
 * @param editor
 */
function isSelectedFeature(
  editor: vscode.TextEditor,
  range: DocumentLineRange
): boolean {
  // If there is no selection, set selection to current cursor
  const selection: DocumentLineRange = editor.selection.isEmpty
    ? { start: editor.selection.active.line, end: editor.selection.active.line }
    : { start: editor.selection.start.line, end: editor.selection.end.line };

  return (
    (selection.start >= range.start && selection.end <= range.end) || // selection is inside feature
    (selection.start <= range.start && selection.end >= range.end)
  ); // selection includes feature
}

/**
 * Return the line ranges of any features that are intersecting the cursor/selection
 * in the editor
 * @param editor
 */
function getSelectedFeatures(
  editor: vscode.TextEditor,
  features: DocumentLineRange[]
): DocumentLineRange[] {
  // If there is no selection, set selection to current cursor
  const selection: DocumentLineRange = editor.selection.isEmpty
    ? { start: editor.selection.active.line, end: editor.selection.active.line }
    : { start: editor.selection.start.line, end: editor.selection.end.line };

  const selectedTables = features.filter(
    (feature) =>
      (selection.start >= feature.start && selection.end <= feature.end) || // selection is inside table
      (selection.start <= feature.start && selection.end >= feature.end) // selection includes table
  );

  return selectedTables;
}

function replaceTextRange(
  editor: vscode.TextEditor,
  range: DocumentLineRange,
  newText: string | ((rangeText: string) => string)
) {
  if (editor) {
    const document = editor.document;
    const vsRange = new vscode.Range(
      new vscode.Position(range.start, 0), // Start position (line n, char 0)
      new vscode.Position(range.end, 0) // End position (line n, char 0)
    );

    const edit = new vscode.WorkspaceEdit();
    if (typeof newText === "string") {
      edit.replace(document.uri, vsRange, newText);
    } else {
      edit.replace(document.uri, vsRange, newText(document.getText(vsRange)));
    }

    vscode.workspace.applyEdit(edit).then((success) => {
      if (!success) {
        vscode.window.showErrorMessage("Error updating text");
      }
    });
  }
}

/**
 * If selection or cursor in the current editor is a markdown table, this
 * provides a command to convert it to a supported markdown-table-block
 * language format
 */
export function convertSelectionToMarkdownTableBlock() {
  showLanguagePicker("Convert to language").then((value) => {
    if (!value) return;

    // Wrap string in a markdown table block
    const wrap = (str: string) => `\`\`\`${value.label}:table\n${str}\n\`\`\``;

    const formatter = {
      yaml: (t: TableData) => wrap(YamlFormatter.format(t, (s: string) => s)),
      json: (t: TableData) => wrap(JsonFormatter.format(t, (s: string) => s)),
      js: (t: TableData) => wrap(JsFormatter.format(t, (s: string) => s)),
    }[value.label];

    if (!formatter) return;
    // vscode.window.showInformationMessage(`Selected ${value.label}!!!`);

    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const documentTables = getDocumentTables(editor);
    const selectedTables = documentTables.filter((t) =>
      isSelectedFeature(editor, t)
    );
    selectedTables.forEach((tableRange) =>
      replaceTextRange(editor, tableRange, (str) =>
        formatter(MdTableParser.parse(str))
      )
    );
  });
}

/**
 * If selection or cursor in the current editor is a markdown-table-block,
 * this provides a command to convert it to a markdown table
 */
export function convertSelectionToMarkdownTable() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const parsers = {
    yaml: (t: string) => YamlParser.parse(t),
    json: (t: string) => JsonParser.parse(t),
    js: (t: string) => JsParser.parse(t),
  };

  const documentCodeBlocks = getDocumentCodeBlocks(editor);
  const selectedCodeBlocks = documentCodeBlocks.filter((b) =>
    isSelectedFeature(editor, b.range)
  );
  selectedCodeBlocks.forEach((b) => {
    replaceTextRange(editor, b.range, (str) => {
      const sanitized = removeCodeblockBackticks(str);
      const parsed = parsers[b.lang](sanitized);
      const formatted = MdFormatter.format(parsed);
      return formatted;
    });
  });
}
