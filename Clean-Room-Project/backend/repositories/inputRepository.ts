import { database } from "../dbConnection/connections";

export const inputRepository = {
	getAllInputs: async (payload?: { room_id?: number }) => {
		let query = `SELECT * FROM tInputValue`;
		const params: any[] = [];

		if (payload?.room_id) {
			query += ` WHERE RoomId = ?`;
			params.push(payload.room_id);
		}

		const [result] = await database.execute(query, params);
		return result;
	},
};
