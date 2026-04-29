import { database } from "../dbConnection/connections";

export const exceloutputRepository = {
  async getExcelOutputByProject(projectId: number) {
    const [result]: any = await database.query(
      "CALL GetExcelOutputByProject(?)",
      [projectId]
    );

    return result?.[0] || [];
  },
};