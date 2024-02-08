import { MODULE_NAME } from "./constants";
import { FormatterFn, LangCode } from "./types/types";

export function extendMarkdownItWithTableBlocks(
  md: markdownit,
  config: { langFormatterMap: Record<string, FormatterFn> }
) {
  const defaultRender = md.renderer.rules.fence;

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const lang = tokens[idx].info;
    const langFormatter = config.langFormatterMap[lang as LangCode];
    if (langFormatter === undefined) {
      // @ts-ignore
      return defaultRender(tokens, idx, options, env, self);
    }

    try {
      const data = tokens[idx].content;
      return `<div class="${MODULE_NAME}">${langFormatter(data, md)}</div>`;
    } catch (e: any) {
      return `
        <div class="${MODULE_NAME} error">
          <strong>Markdown Table Block</strong>
          Formatting Error
          <em>${e.message}</em>
        </div>
      `;
    }
  };

  return md;
}

function preProcess(source: string): string {
  return source
    .replace(/\</g, "&lt;")
    .replace(/\>/g, "&gt;")
    .replace(/\n+$/, "")
    .trimStart();
}
