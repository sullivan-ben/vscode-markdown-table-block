import { MODULE_NAME } from "./constants";
import { HtmlFormatter } from "./formatters/html.formatter";
import { LangParser } from "./interfaces/lang-parser.interface";
import { LangCode } from "./types/types";

export function extendMarkdownItWithTableBlocks(
  md: markdownit,
  config: { langParserMap: Record<string, LangParser> }
) {
  const defaultRender = md.renderer.rules.fence;

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const lang = tokens[idx].info;

    // Markdownit adds the language code for a code fence to the info property of the
    // token. Check for this and exit if it doesn't match one defined by this module
    const langParser = config.langParserMap[lang as LangCode];
    if (langParser === undefined) {
      // @ts-ignore
      return defaultRender(tokens, idx, options, env, self);
    }

    try {
      const data = tokens[idx].content;
      const mdRenderer = (s: string) => md.render(s, {}); // renderer requires env object arg - even if empty
      const table = HtmlFormatter.format(langParser.parse(data), mdRenderer);

      // TODO: Issue#2 Cache table here & re-render in catch block with error message.
      // TODO: Use cache for performance improvements
      return `<div class="${MODULE_NAME}">${table}</div>`;
    } catch (e: any) {
      return `
        <div class="${MODULE_NAME} error">
          <strong>Markdown Table Block</strong>
          Formatting Error
          ${e.message}
          <em>${e.stack}</em>
        </div>
      `;
    }
  };

  return md;
}
