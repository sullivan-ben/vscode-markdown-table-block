# Markdown Table Block

Authoring large or even slightly complex markdown tables is headache inducing - introducing a user friendly alternative.

Markdown Table Block adds the ability enter table data as an array of records using `<input-language>:table` fenced code blocks, then have that render to a table in the markdown preview. This is especially useful for tables with many columns, or long cell content.

## Flagship Features

- **Multiple Languages**: Use the format that the data is already in, or just the language that you're most comfortable with. Supported Input languages are: js, yaml, json
- **Multi-line Cells**: Have as many lines inside a cell as you want
- **Embedded Markdown**: Use markdown inside table cells - even images!
- **Nested Tables**: Want a table in a table cell - just add another markdown table block codeblock in that cell value.
- **Custom Styles**: Use normalized entry mode to add per-table styles

## Basic Example

Table data is added as a of records with column headings as the key.

````markdown
```yaml:table
- RecordId: 1
  Description: Row 1 Value

- RecordId: 2
  Description: Row 2 Value

- RecordId: 3
  Description: Row 3 Value
```
````

This is then rendered as follows:

![Simple YAML Example](https://github.com/sullivan-ben/vscode-markdown-table-block/blob/master/images/example-basic.png)

## Usage Guide

Each language has two modes:

- **Basic Mode**: Data is entered as an array of row objects (i.e. records), or the input language equivalent. Column headings and cell values are parsed from the respective keys and values of each object.
- **Normalized Mode**: Enables custom table styling and reduces redundant data entry for long tables by alowing column headings to be written once and mapped to a reference key for each row record.

  Data structure is language dependent, but the general rule is that it is entered as two sections:

  - **Headers**: An object (or input language equivalent) where each key value matches a corresponding key in a content record.

    Each header value conforms to one of two interfaces:

    1. A string that is used as the column header value
    2. An object with the following properties:

       - **name** _(required)_: A string value to be used as the column heading.
       - **style** _(optional)_: An object containing cammel case equivalent of css properties. These are applied to both header and content cells.
       - **cellStyle** _(optional)_: An object containing cammel case equivalent of css properties. These are applied to both header and content cells.

  - **Content**: An array of row objects as in basic mode. The only difference is that the record key values are replaced when the table is rendered in preview mode.

### YAML

#### Basic Mode

Basic mode uses a single yaml document with sequence nodes containing a mapping for each record. Mapping keys are used as the table column names.

`````markdown
````yaml:table

- Column 1: 1
  Column 2: Row 1 Value

  # Multi-line cells can be entered using a literal scalar

  Column 3: |
    Paragraph 1.

    Paragraph 2.

- Column 1: 2

  # Missing columns are allowed & rendered as an empty cell

  # Column 2: Row 2 Value

  Column 3: |
    Multi-line markdown with list:

    - Item 1
    - Item 2
    - Item 3
    - Item 4

    Embedded Table:

    ```yaml:table
    - pro: 1
      con: 1
    - pro: 2
      con: 2
    ```

- Column 1: 3
  Column 2: Row 3 Value
  Column 3: "![image](./logo.png)"

````
`````

This is then rendered as follows:

![Basic Example](https://github.com/sullivan-ben/vscode-markdown-table-block/blob/master/images/example-usage-basic.png)

#### Normalized Mode

Normalized mode uses a two yaml documents separated by document separator (`---`), the first contains headers section, while the second contains table contents.

````markdown
```yaml:table
# Headers document
c1: id
c2:
  name: Title
  styles:
    textAlign: right
  cellStyles:
    backgroundColor: black
c3: Details

---
# Contents document
- c1: 1
  c2: Row 1 Value
  c3: |
    Multi-line value with list:
    - Item 1
    - Item 2

- c1: 2
  c2: Row 2 Value
  c3: |
    Multi-line value with list:
    - Item 1
    - Item 2
    - Item 3
    - Item 4

    Another Paragraph

- c1: test
  c2: Test Value
  c3: X
```
````

This is then rendered as follows:

![Normalized Example](https://github.com/sullivan-ben/vscode-markdown-table-block/blob/master/images/example-usage-normalized.png)

### JSON

#### Basic Mode

Basic mode uses an an array containing an object for each record. Record keys are used as the table column names.

`````markdown
````json:table
[
  {
  "Column 1": 1,
  "Column 2": "Row 1 Value",
  "Column 3": "Paragraph 1.\n\nParagraph 2."
  },
  {
    "Column 1": 2,
    "Column 3": "Multi-line markdown with list:\n - Item 1\n - Item 2\n - Item 3\n - Item 4\n\n Embedded Table:\n\n ```yaml:table\n - pro: 1\n con: 1\n - pro: 2\n con: 2\n\n```"
  },
  {
    "Column 1": 3,
    "Column 2": "Row 3 Value",
    "Column 3": "![image](../images/logo.png)"
  }
]
````
`````

> **HINT**: Because json does not support multi-line input, new lines must encoded as `\n`. Take care that you do not strip spacing when using a indentation sensitive language like yaml.

This is then rendered as follows:

![Basic Example](https://github.com/sullivan-ben/vscode-markdown-table-block/blob/master/images/example-usage-basic.png)

#### Normalized Mode

Normalized mode uses an object as input with two properties `headers` and `contents`.

Header value is an object where the keys match the table contents keys. The value of each is either a string (for header name) or another object (containing at least 'name' property). Other permitted properties are: styles, cellStyles.

Contents is identical to basic mode in syntax, with the only difference being that the keys are instead used to map header settings as opposed to being header names directly.

````markdown
```json:table
{
  "headers": {
    "c1": "id",
    "c2": {
      "name": "Title",
      "styles": {
        "textAlign": "right"
      },
      "cellStyles": {
        "backgroundColor": "black"
      }
    },
    "c3": "Details"
  },
  "contents": [
    {
      "c1": 1,
      "c2": "Row 1 Value",
      "c3": "Multi-line value with list:\n- Item 1\n- Item 2"
    },
    {
      "c1": 2,
      "c2": "Row 2 Value",
      "c3": "Multi-line value with list:\n- Item 1\n- Item 2\n- Item 3\n- Item 4\n\nAnother Paragraph"
    },
    {
      "c1": "test",
      "c2": "Test Value",
      "c3": "X"
    }
  ]
}
```
````

This is then rendered as follows:

![Basic Example](https://github.com/sullivan-ben/vscode-markdown-table-block/blob/master/images/example-usage-basic.png)

## Installation

Search for "Markdown Table Block" in the VS Code Extension Marketplace

## Configuration

- `markdown-table-block.defaultLanguage` — Configures the language to be rendered when the 'default' language tag is used, i.e. `table`. Allowed values are the supported languages (e.g. json, yaml, js).

- `markdown-table-block.languageMappings` — Allows override the language tags for each supported language AND the default tag.
