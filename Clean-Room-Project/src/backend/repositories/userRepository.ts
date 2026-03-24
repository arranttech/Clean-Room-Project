import { database } from "../dbConnection/connections";

export const userRepository = {
  // createUser: async (payload: any) => {
  //   console.log("Create user with payload:", payload);
  //   const [result] = await database.execute(
  //     `INSERT INTO tUsers (
  //       user_first_name,
  //       user_last_name,
  //       user_id,
  //       user_email_id,
  //       user_address,
  //       user_phone_home,
  //       user_phone_work,
  //       created_by,
  //       updated_by,
  //       user_admin_flag,
  //       customer_id,
  //       status
  //     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  //     [
  //       payload.user_first_name,
  //       payload.user_last_name,
  //       payload.user_id || null,
  //       payload.user_email_id,
  //       payload.user_address || null,
  //       payload.user_phone_home || null,
  //       payload.user_phone_work || null,
  //       payload.created_by || "admin",
  //       payload.updated_by || "admin",
  //       payload.user_admin_flag === "Yes" ? "Y" : "N",
  //       payload.customer_id || null,
  //       payload.status || "A",
  //     ]
  //   );
  //   console.log(" INSERT RESULT:", result);
  //   return (result as any).insertId;
  // },


  createUser: async (payload: any) => {
  const connection = await database.getConnection();

  try {
     console.log(" ENTER createUser()");
    console.log(" RAW PAYLOAD RECEIVED:");
    console.log(JSON.stringify(payload, null, 2));
    await connection.beginTransaction();
     console.log(" Transaction started");

    console.log(" PAYLOAD:", payload);

     console.log(" VALUES BEING INSERTED INTO tUsers:");
    console.log({
      user_first_name: payload.user_first_name,
      user_last_name: payload.user_last_name,
      user_id: payload.user_id,
      user_email_id: payload.user_email_id,
      user_address: payload.user_address,
      user_phone_home: payload.user_phone_home,
      user_phone_work: payload.user_phone_work,
      created_by: payload.created_by,
      updated_by: payload.updated_by,
      user_admin_flag: payload.user_admin_flag,
      status: payload.status,
    });

    
    const [result]: any = await connection.execute(
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
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.user_first_name,
        payload.user_last_name,
        payload.user_id,
        payload.user_email_id,
        payload.user_address || "",
        payload.user_phone_home || "",
        payload.user_phone_work || "",
        payload.created_by || "admin",
        payload.updated_by || "admin",
        payload.user_admin_flag === "Yes" ? "Y" : "N",
        payload.status || "A",
      ]
    );
    console.log("INSERT RESULT:", result);

    const userId = result.insertId;

    console.log(" USER INSERTED ID:", userId);

    // 2. Insert into tCustomerUsers 
    const customerIds = payload.customer_ids || [];

    console.log(" CUSTOMER IDS RECEIVED:", customerIds);
    console.log(
      "CUSTOMER IDS TYPES:",
      customerIds.map((id: any) => typeof id)
    );


    for (const customerId of customerIds) {
       console.log(`Inserting mapping: userId=${userId}, customerId=${customerId}`);
      await connection.execute(
        `INSERT INTO tCustomerUsers (user_login_id, customer_id)
         VALUES (?, ?)`,
        [userId, customerId]
      );
    }
    console.log("All customer mappings inserted");

    await connection.commit();

      console.log(" Transaction committed successfully");

    return userId;

  } catch (error) {
    console.error("TRANSACTION FAILED");
    await connection.rollback();
    console.error(" ROLLBACK DONE");
    console.error("TRANSACTION ERROR:", error);
    throw error;
  } finally {
    connection.release();
     console.log(" DB CONNECTION RELEASED");
  }
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
    // Direct query instead of stored procedure — includes all fields including status
    const [rows]: any = await database.execute(
      `SELECT
        u.user_login_id,
        u.user_id,
        cu.customer_id,
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
      LEFT JOIN tCustomerUsers cu ON u.user_login_id = cu.user_login_id
      WHERE u.user_login_id = ?
      LIMIT 1`,
      [user_login_id]
    );
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
