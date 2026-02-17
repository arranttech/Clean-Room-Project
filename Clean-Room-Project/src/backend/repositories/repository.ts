import { database } from '../dbConnection/connections';

export const ApplicationRepository = {
  createApplication: async (payload: any) => {
    console.log('payload in repository:', payload);
    try {
      const [result] = await database.execute(
        `INSERT INTO tCustomers 
        (customer_name, customer_phone, customer_address, customers_additional_notes, customer_email_id)
        VALUES (?, ?, ?, ?, ?)`,
        [
          payload.customerName,
          payload.phoneNumber,
          payload.customerAddress,
          payload.additionalNotes,
          payload.emailAddress,
        ]
      );


      return result.insertId;
    } catch (err) {
      console.error('Error in createApplication:', err);
      throw err;
    }
  },

    roomStandards: async (payload: any) => {
    try {
      const [result] = await database.execute(
        `INSERT INTO tRoomStandards 
            (project_system,
            project_system_type,
            project_heating_method,
            project_cooling_method,
            project_standard,
            project_classification_name,
            project_ACPH,
            project_temp_unit,
            project_required_inside_temp,
            project_required_inside_humid,
            project_max_temp,
            project_min_temp,
            project_relative_min_humid,
            project_relative_max_humid,
            flow_velocity) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payload.system || null,
          payload.systemType || null,
          payload.heatingMethod || null,
          payload.coolingMethod || null,
          payload.standard || null,
          payload.classification || null,
          payload.acph || null,
          payload.tempUnit || null,
          payload.reqInsideTempC || null,
          payload.reqInsideHum || null,
          payload.maxTempC || null,
          payload.minTempC || null,
          payload.rhMin || null,
          payload.rhMax || null,
          payload.flowVelocity || null,
          payload.flowMedium || null,
          payload.heatingFlowVelocity || null,
          payload.coolingFlowVelocity || null,
        ]
      );

      return result.insertId;
    } catch (err) {
      console.error('Error in createApplication:', err);
      throw err; // this will trigger Hapi 500
    }
  },

};
