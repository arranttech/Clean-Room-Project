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
        null,
        payload.status || "A",
      ]
    );

    const userLoginId = (result as any).insertId;

    const customerIdsFromArray = Array.isArray(payload.customer_ids)
      ? payload.customer_ids
      : [];
    const customerIds = [
      ...new Set(
        [...customerIdsFromArray, payload.customer_id]
          .map((id) => Number(id))
          .filter((id) => Number.isFinite(id) && id > 0)
      ),
    ];

    if (customerIds.length > 0) {
      const placeholders = customerIds.map(() => "(?, ?)").join(", ");
      const values = customerIds.flatMap((customerId) => [customerId, userLoginId]);
      await database.execute(
        `INSERT INTO tCustomerUsers (customer_id, user_id) VALUES ${placeholders}`,
        values
      );
    }

    return userLoginId;
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

    const customerIdsFromArray = Array.isArray(payload.customer_ids)
      ? payload.customer_ids
      : [];
    const customerIds = [
      ...new Set(
        [...customerIdsFromArray, payload.customer_id]
          .map((id) => Number(id))
          .filter((id) => Number.isFinite(id) && id > 0)
      ),
    ];

    if (Array.isArray(payload.customer_ids) || payload.customer_id !== undefined) {
      await database.execute("DELETE FROM tCustomerUsers WHERE user_id = ?", [
        user_login_id,
      ]);

      if (customerIds.length > 0) {
        const placeholders = customerIds.map(() => "(?, ?)").join(", ");
        const values = customerIds.flatMap((customerId) => [customerId, user_login_id]);
        await database.execute(
          `INSERT INTO tCustomerUsers (customer_id, user_id) VALUES ${placeholders}`,
          values
        );
      }
    }
  },

  getUserById: async (user_login_id: number) => {
    // Direct query instead of stored procedure — includes all fields including status
    const [rows]: any = await database.execute(
      `SELECT
        u.user_login_id,
        u.user_id,
        u.customer_id,
        u.user_first_name,
        u.user_last_name,
        u.user_email_id,
        u.user_address,
        u.user_phone_home,
        u.user_phone_work,
        u.user_admin_flag,
        u.created_by,
        u.updated_by,
        u.created_date,
        u.updated_date,
        CASE WHEN u.status IS NULL OR u.status = '' THEN 'A' ELSE u.status END AS status,
        p.user_password
      FROM tUsers u
      LEFT JOIN tUserPassword p ON u.user_login_id = p.user_login_id
      WHERE u.user_login_id = ?
      LIMIT 1`,
      [user_login_id]
    );
    if (!rows || rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    const [customerRows]: any = await database.execute(
      `SELECT customer_id FROM tCustomerUsers WHERE user_id = ?`,
      [user_login_id]
    );

    const customer_ids = (customerRows || []).map((row: any) => row.customer_id);

    return { success: true, user: { ...rows[0], customer_ids } };
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
