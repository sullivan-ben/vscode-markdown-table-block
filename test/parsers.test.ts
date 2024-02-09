import { loadFixturesArray } from "./fixtures/fixture-loader";
import { deepStrictEqual } from "assert";
import { YamlParser } from "../src/parsers/yaml.parser";
import { JsonParser } from "../src/parsers/json.parser";
import { MdTableParser } from "../src/parsers/md-table.parser";

describe("Parsers", () => {
  it("should parse from yaml", () => {
    const fixtures = loadFixturesArray({
      types: ["basic", "normalized"],
      fixtureNames: ["vegetables", "fruits"],
      langs: ["yaml"],
    });

    fixtures.forEach((fixture) => {
      const { type, name, lang } = fixture.fixture;
      deepStrictEqual(
        YamlParser.parse(fixture.fixture.data),
        fixture.table,
        `Failed to correctly parse ${type}.${name}.${lang} to TableData`
      );
    });
  });

  it("should parse from json", () => {
    const fixtures = loadFixturesArray({
      types: ["basic", "normalized"],
      fixtureNames: ["vegetables", "fruits"],
      langs: ["json"],
    });

    fixtures.forEach((fixture) => {
      const { type, name, lang } = fixture.fixture;
      deepStrictEqual(
        JsonParser.parse(fixture.fixture.data),
        fixture.table,
        `Failed to correctly parse ${type}.${name}.${lang} to TableData`
      );
    });
  });

  it("should parse from md", () => {
    const fixtures = loadFixturesArray({
      types: ["basic", "normalized"],
      fixtureNames: ["vegetables", "fruits"],
      langs: ["md"],
    });

    fixtures.forEach((fixture) => {
      const { type, name, lang } = fixture.fixture;
      deepStrictEqual(
        MdTableParser.parse(fixture.fixture.data),
        fixture.table,
        `Failed to correctly parse ${type}.${name}.${lang} to TableData`
      );
    });
  });
});
