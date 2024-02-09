import * as fs from "fs";
import * as path from "path";
import { TableData } from "../../src/interfaces/table-data.interface";
import {
  SupportedLang,
  Mode,
  LITERAL_TYPE_ARRAYS,
} from "../../src/types/types";

/**
 * @fileoverview
 * This file is used to load fixtures for testing. Fixtures should follow the pattern:
 *
 * - TableData (TypeScript) File:
 *  - Description: Defines the expected TableData for a given fixture.
 *  - Path: test/fixtures/<mode>/<fixture-name>.TableData.ts
 *
 * - Fixture File:
 *  - Description: Defines the expected data for a given fixture in a given language
 *  - Path: test/fixtures/<mode>/<fixture-name>.<lang>
 */

const FixtureNames = ["vegetables", "fruits"];

// Array to literal does not play well with type completion. Are there alternatives?
// type FixtureName = (typeof FixtureNames)[number];
type FixtureName = "vegetables" | "fruits";

type FixtureLanguages = SupportedLang | "md";

enum FixturePaths {
  basic = "basic-table",
  normalized = "normalized-table",
}

const FIXTURE_EXTENSIONS: FixtureLanguages[] = ["js", "md", "json", "yaml"];

interface FixtureLangData {
  type: Mode;
  name: FixtureName;
  lang: FixtureLanguages;
  data: string;
}

export interface FixtureSet {
  table: TableData;
  lang: Record<FixtureLanguages, FixtureLangData>;
}

interface FixturesArrayData {
  table: TableData;
  fixture: FixtureLangData;
}

function loadFixtureTableData(type: Mode, fixtureName: FixtureName): TableData {
  const fileName = `${fixtureName}.TableData.ts`;
  const expectedPath = path.join(__dirname, FixturePaths[type], fileName);
  try {
    return require(expectedPath).data;
  } catch (e) {
    const err = new Error(`Could not load TableData: ${expectedPath}`);
    err.stack = e.stack;
    throw err;
  }
}

function loadFixtureFile(
  type: Mode,
  fixtureName: FixtureName,
  extension: string
): FixtureLangData {
  const fileName = `${fixtureName}.${extension}`;
  const expectedPath = path.join(__dirname, FixturePaths[type], fileName);
  try {
    return {
      name: fixtureName,
      type,
      lang: extension as FixtureLanguages,
      data: fs.readFileSync(expectedPath, "utf8"),
    };
  } catch (e) {
    const err = new Error(`Could not find fixture: ${expectedPath}`);
    err.stack = e.stack;
    throw err;
  }
}

/**
 * Lazy load all fixtures & corresponding table data matching a given name & type
 *
 * @param type
 * @param name
 * @returns
 */
export function loadFixtureSet(type: Mode, name: FixtureName): FixtureSet {
  const obj = {};
  FIXTURE_EXTENSIONS.forEach((lang) => {
    Object.defineProperty(obj, lang, {
      get: () => loadFixtureFile(type, name, lang),
    });
  });

  return {
    table: loadFixtureTableData(type, name),
    lang: obj as Record<FixtureLanguages, FixtureLangData>,
  };
}

/**
 * Load all fixtures for a given type from the test/fixtures directory
 * @param filter
 * @returns
 */
export function loadFixturesArray(filter?: {
  types?: Mode[];
  fixtureNames?: FixtureName[];
  langs?: FixtureLanguages[];
}): FixturesArrayData[] {
  const names = filter?.fixtureNames ?? (FixtureNames as FixtureName[]);
  const types = filter?.types ?? (LITERAL_TYPE_ARRAYS.Modes as Mode[]);
  const langs = filter?.langs ?? (FIXTURE_EXTENSIONS as FixtureLanguages[]);

  const arr: FixturesArrayData[] = [];

  types.forEach((type) => {
    names.forEach((name) => {
      const fixture = loadFixtureSet(type, name);
      langs.forEach((lang) => {
        arr.push({
          table: fixture.table,
          fixture: {
            name,
            type,
            lang,
            data: fixture.lang[lang].data,
          },
        });
      });
    });
  });
  return arr;
}
