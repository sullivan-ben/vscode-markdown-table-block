import { loadFixturesArray } from "./fixtures/fixture-loader";
import { deepStrictEqual } from "assert";
import { YamlFormatter } from "../src/formatters/yaml.formatter";
import { JsonFormatter } from "../src/formatters/json.formatter";
import { JsFormatter } from "../src/formatters/js.formatter";
import { MdFormatter } from "../src/formatters/md-table.formatter";
import { trim } from "../src/utils/string.utils";

describe("Formatters", () => {
  it("should format to yaml", () => {
    const fixtures = loadFixturesArray({
      types: ["basic", "normalized"],
      fixtureNames: ["fruits", "vegetables"],
      langs: ["yaml"],
    });

    fixtures.forEach((fixture) => {
      const { type, name, lang } = fixture.fixture;
      deepStrictEqual(
        YamlFormatter.format(fixture.table),
        fixture.fixture.data,
        `Failed to correctly format TableData to ${type}.${name}.${lang}`
      );
    });
  });

  it("should format to json", () => {
    const fixtures = loadFixturesArray({
      types: ["basic", "normalized"],
      fixtureNames: ["fruits", "vegetables"],
      langs: ["json"],
    });

    fixtures.forEach((fixture) => {
      const { type, name, lang } = fixture.fixture;
      deepStrictEqual(
        JsonFormatter.format(fixture.table),
        fixture.fixture.data,
        `Failed to correctly format TableData to ${type}.${name}.${lang}`
      );
    });
  });

  it("should format to js", () => {
    const fixtures = loadFixturesArray({
      // TODO: Add normalized fixtures for js
      types: ["basic"],
      fixtureNames: ["fruits", "vegetables"],
      langs: ["js"],
    });

    fixtures.forEach((fixture) => {
      const { type, name, lang } = fixture.fixture;

      // VSCODE lints the js fixture, but we don't want it to.
      // Formatter should be a bit more robust, but for now, manually fix a few issues
      const fixtureData = trim(fixture.fixture.data, [
        "\n", // added to js fixture by eslint on save
        "// prettier-ignore", // required to prevent prettier from formatting on save
      ]);

      deepStrictEqual(
        JsFormatter.format(fixture.table),
        fixtureData,
        `Failed to correctly format TableData to ${type}.${name}.${lang}`
      );
    });
  });

  it("should format to md", () => {
    const fixtures = loadFixturesArray({
      types: ["basic", "normalized"],
      fixtureNames: ["fruits", "vegetables"],
      langs: ["md"],
    });

    fixtures.forEach((fixture) => {
      const { type, name, lang } = fixture.fixture;
      deepStrictEqual(
        MdFormatter.format(fixture.table),
        fixture.fixture.data,
        `Failed to correctly format TableData to ${type}.${name}.${lang}`
      );
    });
  });
});
