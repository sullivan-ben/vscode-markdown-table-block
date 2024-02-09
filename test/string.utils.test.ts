import * as StringUtils from "../src/utils/string.utils";
import { equal, deepStrictEqual } from "assert";

describe("StringUtils", () => {
  it("Should trim characters correctly", () => {
    interface tc {
      inputValue: string;
      characters?: string;
      expectedResult: string;
    }
    const tests: tc[] = [
      { inputValue: "  test  ", characters: undefined, expectedResult: "test" },
      { inputValue: "  test  ", characters: " ", expectedResult: "test" },
      { inputValue: "  test  ", characters: " t", expectedResult: "es" },
      { inputValue: "  test  ", characters: " tse", expectedResult: "" },
      { inputValue: "  test  ", characters: "t", expectedResult: "  test  " },
      { inputValue: "  roarer  ", characters: "r ", expectedResult: "oare" },
    ];

    tests.forEach(({ inputValue, characters, expectedResult }, i) => {
      equal(
        StringUtils.trim(inputValue, characters),
        expectedResult,
        `tc-${i}`
      );
    });
  });

  it("Should trim words correctly", () => {
    interface tc {
      inputValue: string;
      words?: string[];
      expectedResult: string;
    }
    const tests: tc[] = [
      { inputValue: "  test  ", words: undefined, expectedResult: "test" },
      { inputValue: "  test", words: ["test"], expectedResult: "  " },
      { inputValue: "  test  ", words: ["te", "st", "  "], expectedResult: "" },
      { inputValue: "  test\n", words: [" ", "\n"], expectedResult: "test" },
    ];

    tests.forEach(({ inputValue, words, expectedResult }, i) => {
      equal(StringUtils.trim(inputValue, words), expectedResult, `tc-${i}`);
    });
  });

  it("should convert camel case to kebab case", () => {
    const tests = [
      { input: "testString", expected: "test-string" },
      { input: "testStringTest", expected: "test-string-test" },
    ];

    tests.forEach(({ input, expected }, i) => {
      equal(StringUtils.toKebab(input), expected, `tc-${i}`);
    });
  });

  it("should convert to camel case", () => {
    // prettier-ignore
    const tests = [
      { input: "test-string", expected: "testString", type: "Kebab to Cammel" },
      { input: "test-string-two", expected: "testStringTwo", type: "Kebab to Cammel" },
      { input: "test-string-3", expected: "testString3", type: "Kebab to Cammel" },
      { input: "test string", expected: "testString", type: "Space to cammel" },
      { input: "Test string", expected: "testString", type: "Space to cammel" },
      { input: "Test String", expected: "testString", type: "Space to cammel" },
      { input: "test string two", expected: "testStringTwo", type: "Space to cammel" },
      { input: "Test string two", expected: "testStringTwo", type: "Space to cammel" },
      { input: "Test String Two", expected: "testStringTwo", type: "Space to cammel" },
      { input: "test_string", expected: "testString", type: "Snake to cammel" },
      { input: "Test_string", expected: "testString", type: "Snake to cammel" },
      { input: "Test_String", expected: "testString", type: "Snake to cammel" },
      { input: "test_string_two", expected: "testStringTwo", type: "Snake to cammel" },
      { input: "Test_string_two", expected: "testStringTwo", type: "Snake to cammel" },
      { input: "Test_String_Two", expected: "testStringTwo", type: "Snake to cammel" },
    ];

    tests.forEach(({ input, expected, type }, i) => {
      equal(StringUtils.toCammelCase(input), expected, `tc-${i}: ${type}`);
    });
  });
});
