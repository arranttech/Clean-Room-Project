import { ServerRoute } from "@hapi/hapi";
import { exceloutputController } from "../controller/excelController.ts";

export const exceloutputRoute: ServerRoute[] = [
  {
    method: "GET",
    path: "/v1/exceloutput/{projectId}",
    handler: exceloutputController.getExcelOutputByProject,
  },
];