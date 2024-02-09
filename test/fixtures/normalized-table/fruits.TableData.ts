import { TableData } from "../../../src/interfaces/table-data.interface";

export const data: TableData = {
  headers: {
    id: "_Id_",
    name: "Name",
    color: "Color",
    comments: "_Comments_",
  },
  contents: [
    {
      id: "F1",
      name: "Apple",
      color: "Red",
      comments: "Crunchy, Sometimes green",
    },
    {
      id: "F2",
      name: "Orange",
      color: "Orange",
      comments: "Fleshy, Peel before eating",
    },
    {
      id: "F3",
      name: "Banana",
      color: "Yellow",
      comments: `Soft, Peel before eating

**Other comments**:
Subject to ripeness sublimation (instantly transition from unripe to overripe)`,
    },
  ],
};
