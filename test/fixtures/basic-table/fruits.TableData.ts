import { TableData } from "../../../src/interfaces/table-data.interface";

export const data: TableData = {
  contents: [
    {
      Id: "F1",
      Name: "Apple",
      Color: "Red",
      Comments: "Crunchy, Sometimes green",
    },
    {
      Id: "F2",
      Name: "Orange",
      Color: "Orange",
      Comments: "Fleshy, Peel before eating",
    },
    {
      Id: "F3",
      Name: "Banana",
      Color: "Yellow",
      Comments: `Soft, Peel before eating

**Other Comments**:
Subject to ripeness sublimation (instantly transition from unripe to overripe)`,
    },
  ],
};
