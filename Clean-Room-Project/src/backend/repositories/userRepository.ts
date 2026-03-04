import { database } from "../dbConnection/connections";

export const userRepository = {
  createUser: async (payload: any) => {
    console.log("Create user with payload:", payload);
    const [result] = await database.execute(
      `INSERT INTO tUsers (
        user_first_name,
        user_last_name,
        user_id,
        user_email_id,
        user_address,
        user_phone_home,
        user_phone_work,
        created_by,
        updated_by,
        user_admin_flag,
        customer_id,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.user_first_name,
        payload.user_last_name,
        payload.user_id || null,
        payload.user_email_id,
        payload.user_address || null,
        payload.user_phone_home || null,
        payload.user_phone_work || null,
        payload.created_by || "admin",
        payload.updated_by || "admin",
        payload.user_admin_flag === "Yes" ? "Y" : "N",
        payload.customer_id || null,
        payload.status || "A",
      ]
    );
    return (result as any).insertId;
  },

  updateUser: async (user_login_id: number, payload: any) => {
    await database.execute(
      `UPDATE tUsers
        SET
            user_first_name = ?,
            user_last_name = ?,
            user_email_id = ?,
            user_address = ?,
            user_phone_home = ?,
            user_phone_work = ?,
            user_admin_flag = ?,
            status = ?
        WHERE user_login_id = ?`,
      [
        payload.user_first_name,
        payload.user_last_name,
        payload.user_email_id,
        payload.user_address,
        payload.user_phone_home,
        payload.user_phone_work,
        payload.user_admin_flag === "Yes" ? "Y" : "N",
        payload.status || "A",
        user_login_id,
      ]
    );
  },

  getUserById: async (user_login_id: number) => {
    const [resultSets]: any = await database.execute(
      "CALL new_cleanroom_db.GetUserDetail(?)",
      [user_login_id]
    );
    const rows = resultSets[0];
    if (!rows || rows.length === 0) {
      return { success: false, message: "User not found" };
    }
    return { success: true, user: rows[0] };
  },

  getUsers: async () => {
    const [rows] = await database.execute(`SELECT * FROM tUsers`);
    return rows;
  },

  deleteUser: async (user_login_id: number) => {
    const [result] = await database.execute(
      "UPDATE tUsers SET status = 'I' WHERE user_login_id = ?",
      [user_login_id]
    );
    return (result as any).affectedRows;
  },

  getUserDetails: async (payload?: { admin_id?: string }) => {
    let query = `SELECT * FROM tUsers`;
    const params: any[] = [];
    if (payload?.admin_id) {
      query += ` WHERE admin_id = ?`;
      params.push(payload.admin_id);
    }
    const [result] = await database.execute(query, params);
    return result;
  },
};
