import { Request, ResponseToolkit } from "@hapi/hapi";
import { exceloutputRepository } from "../repositories/excelRepository.ts";

export const exceloutputController = {
  async getExcelOutputByProject(request: Request, h: ResponseToolkit) {
    try {
      const projectId = Number(request.params.projectId);

      if (!projectId) {
        return h
          .response({
            success: false,
            message: "projectId is required",
          })
          .code(400);
      }

      const rows = await exceloutputRepository.getExcelOutputByProject(projectId);

      return h
        .response({
          success: true,
          data: rows,
        })
        .code(200);
    } catch (error) {
      console.error("Excel output error:", error);

      return h
        .response({
          success: false,
          message: "Failed to fetch excel output data",
        })
        .code(500);
    }
  },
};