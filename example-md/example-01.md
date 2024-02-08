# Test

### JSON RAW

```json
[
  {
    "test": "test"
  }
]
```

```yaml:table
- RecordId: 1
  Description: Row 1 Value

- RecordId: 2
  Description: Row 2 Value

- RecordId: 3
  Description: Row 3 Value
```

### YAML

#### Basic

````yaml:table
- Column 1: 1
  Column 2: Row 1 Value

  # Multi-line cells using a literal scalar
  Column 3: |
    Paragraph 1.

    Paragraph 2.

- Column 1: 2

  # Missing columns are allowed
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
  Column 3: "![image](../docs/logo.png)"
````

#### Normalized

```yaml:table
c1: id
c2:
  name: Title
  styles:
    textAlign: right
  cellStyles:
    backgroundColor: black
c3: Details
---
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

### Typescript Raw

```ts
const a = "test";
```

### JSON Table

#### Simple

````json:table
[
  {
  "Column 1": 1,
  "Column 2": "Row 1 Value",
  "Column 3": "Paragraph 1.\n\nParagraph 2."
  },
  {
    "Column 1": 2,
    "Column 3": "Multi-line markdown with list:\n - Item 1\n - Item 2\n - Item 3\n - Item 4\n\n Embedded Table:\n\n ```yaml:table\n - pro: 1\n   con: 1\n - pro: 2\n   con: 2\n\n```"
  },
  {
    "Column 1": 3,
    "Column 2": "Row 3 Value",
    "Column 3": "![image](../docs/logo.png)"
  }
]
````

#### Normalized

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

### JS TABLE

```js:table
[
  {
    column1: 1,
    column2: "Row 1: Value",
    column3: "...",
  },
  {
    column1: 2,
    column2: "Row 2 Value",
    column3: "..."
  },
]
```
