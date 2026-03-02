import { database } from "../dbConnection/connections";

export const resultRepository = {
	storeResults: async (payload: any) => {
		const [result] = await database.execute(
			`INSERT INTO tProjectResults (
        project_id,
        project_RoomName,
        project_RoomId,
        project_Area,
        project_Volume,
        project_RoomCfm,
        project_FreshAir,
        project_ExhaustAir
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				payload.project_id,
				payload.roomName ?? null,
				payload.project_RoomId,
				payload.project_Area ?? null,
				payload.project_Volume ?? null,
				payload.project_RoomCfm ?? null,
				payload.project_FreshAir ?? null,
				payload.project_ExhaustAir ?? null,
			]
		);

		return (result as any).insertId;
	},
};
