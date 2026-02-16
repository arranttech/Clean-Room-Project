import { database } from '../dbConnection/connections';

export const ApplicationRepository = {
  createApplication: async (payload: any) => {
    try {
      const [result] = await database.execute(
        `INSERT INTO tCustomers 
        (customer_name, customer_phone, customer_address, customer_additional_notes, customer_email_id)
        VALUES (?, ?, ?, ?, ?)`,
        [
          payload.customerName,
          payload.phoneNumber,
          payload.customerAddress,
          payload.additionalNotes,
          payload.emailAddress,
        ]
      );

      // @ts-ignore
      return result.insertId;
    } catch (err) {
      console.error('Error in createApplication:', err);
      throw err; // this will trigger Hapi 500
    }
  },
  
};
