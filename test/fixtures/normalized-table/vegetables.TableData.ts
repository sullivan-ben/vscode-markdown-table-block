import { TableData } from "../../../src/interfaces/table-data.interface";

export const data: TableData = {
  headers: {
    id: "Id",
    name: {
      name: "_Name_",
      headerStyles: {
        textAlign: "right",
      },
      cellStyles: {
        textAlign: "right",
      },
    },
    color: "Color",
    comments: {
      name: "Comments",
      headerStyles: {
        textAlign: "center",
      },
      cellStyles: {
        textAlign: "center",
      },
    },
  },
  contents: [
    {
      id: "V1",
      name: "Pumpkin",
      color: "Orange",
      comments: "Good in soup",
    },
    {
      id: "V2",
      name: "Brussel Sprouts",
      color: "Green",
      comments: "Gross. Avoid",
    },
    {
      id: "V3",
      name: "Potato",
      color: "Brown",
      comments: "Boil 'em, mash 'em, stick 'em in a stew.",
    },
  ],
};
