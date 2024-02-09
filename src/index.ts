import {
  MODULE_NAME,
  DEFAULT_LANGMAP,
  DEFAULT_LANGUAGE,
  MODULE_COMMANDS,
} from "./constants";
import { JsonParser } from "./parsers/json.parser";
import { YamlParser } from "./parsers/yaml.parser";
import { JsParser } from "./parsers/js.parser";
import { extendMarkdownItWithTableBlocks } from "./markdown-preview";
import * as vscode from "vscode";
import { LangCode, SupportedLang } from "./types/types";
import { LangParser } from "./interfaces/lang-parser.interface";
import {
  convertSelectionToMarkdownTable,
  convertSelectionToMarkdownTableBlock,
} from "./editor-commands";

export function activate(ctx: vscode.ExtensionContext) {
  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      MODULE_COMMANDS.CONVERT_SELECTION_TO_MARKDOWN_TABLE_BLOCK,
      convertSelectionToMarkdownTableBlock
    )
  );

  ctx.subscriptions.push(
    vscode.commands.registerCommand(
      MODULE_COMMANDS.CONVERT_SELECTION_TO_MARKDOWN_TABLE,
      convertSelectionToMarkdownTable
    )
  );

  return {
    extendMarkdownIt(md: any) {
      extendMarkdownItWithTableBlocks(md, {
        langParserMap: mapRuntimeParsers(
          vscode.workspace.getConfiguration(MODULE_NAME),
          getParser
        ),
      });
      md.use(injectTableBlockTheme);
      // vscode.window.showInformationMessage("Extension activated");
      return md;
    },
  };
}

/**
 * Get the formatter function, given a language code.
 *
 * @param langCode either "default" or the language code for a supported markup language (yaml, json, js)
 * @param defaultLang language code for formatter to use if langCode matches the default (e.g. "table")
 * @returns
 */
function getParser(langCode: LangCode, defaultLang: SupportedLang): LangParser {
  const formatters = {
    yaml: YamlParser,
    json: JsonParser,
    js: JsParser,
  };

  return langCode === "default"
    ? formatters[defaultLang]
    : formatters[langCode];
}

/**
 * Resolves extension configuration & defaults to create a lookup table for language
 * formatter functions that includes any configuration changes, i.e:
 *
 * { [userEnteredLanguageCode]: [(code) => formattedHTMLTable] }
 *
 * @param config extension VSCode config
 * @param getParser The interface for parsing string to table data for a given language code
 * @returns
 */
function mapRuntimeParsers(
  config: vscode.WorkspaceConfiguration,
  getParser: (l: LangCode, defaultLang: SupportedLang) => LangParser
): Record<string, LangParser> {
  const defaultLang = config.get("defaultLanguage", DEFAULT_LANGUAGE);
  const configMap = config.get("languageMappings", DEFAULT_LANGMAP);

  const languageMappings = Object.entries(configMap) as [LangCode, string][];
  const lookupTable = languageMappings.reduce(
    (p, [k, v]) => ({ ...p, [v]: getParser(k, defaultLang) }),
    {}
  );
  return lookupTable;
}

function injectTableBlockTheme(md: any) {
  const render = md.renderer.render;
  return render.apply(md.renderer, arguments);
}
