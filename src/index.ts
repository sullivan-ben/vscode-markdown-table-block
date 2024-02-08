import { MODULE_NAME, DEFAULT_LANGMAP, DEFAULT_LANGUAGE } from "./constants";
import jsonFormatter from "./formatters/json.formatter";
import yamlFormatter from "./formatters/yaml.formatter";
import jsFormatter from "./formatters/js.formatter";
import { extendMarkdownItWithTableBlocks } from "./table-block";
import * as vscode from "vscode";
import { LangCode, SupportedLang, FormatterFn } from "./types/types";

export function activate(ctx: vscode.ExtensionContext) {
  return {
    extendMarkdownIt(md: any) {
      extendMarkdownItWithTableBlocks(md, {
        langFormatterMap: mapRuntimeFormatters(
          vscode.workspace.getConfiguration(MODULE_NAME),
          getFormatterFn
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
 * @param defaultLang language code for formatter to use if langCode is "default"
 * @returns
 */
function getFormatterFn(
  langCode: LangCode,
  defaultLang: SupportedLang
): FormatterFn {
  const formatters = {
    yaml: yamlFormatter.formatHTML,
    json: jsonFormatter.formatHTML,
    js: jsFormatter.formatHTML,
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
 * @param getFormatterFn function to get formatter function for a given language code
 * @returns
 */
function mapRuntimeFormatters(
  config: vscode.WorkspaceConfiguration,
  getFormatterFn: (l: LangCode, defaultLang: SupportedLang) => FormatterFn
): Record<string, FormatterFn> {
  const defaultLang = config.get("defaultLanguage", DEFAULT_LANGUAGE);
  const configMap = config.get("languageMappings", DEFAULT_LANGMAP);

  const languageMappings = Object.entries(configMap) as [LangCode, string][];
  const lookupTable = languageMappings.reduce(
    (p, [k, v]) => ({ ...p, [v]: getFormatterFn(k, defaultLang) }),
    {}
  );
  return lookupTable;
}

function injectTableBlockTheme(md: any) {
  const render = md.renderer.render;
  return render.apply(md.renderer, arguments);
}
