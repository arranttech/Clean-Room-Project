import { database } from '../dbConnection/connections';

export const ApplicationRepository = {

  getUserDetails: async (payload?: { admin_id?: number }) => {
    try {
      let query = `SELECT * FROM tUsers`;
      const params: any[] = [];
  
      if (payload?.admin_id) {
        query += ` WHERE admin_id = ?`;
        params.push(payload.admin_id);
      }
  
      const [result] = await database.execute(query, params);
      return result;
    } catch (err) {
      console.error('Error in getCustomerDetails:', err);
      throw err;
    }
  },
  // Get all customers
  getCustomerDetails: async (payload?: { admin_id?: number }) => {
    try {
      let query = `SELECT * FROM tCustomers`;
      const params: any[] = [];
  
      if (payload?.admin_id) {
        query += ` WHERE admin_id = ?`;
        params.push(payload.admin_id);
      }
  
      const [result] = await database.execute(query, params);
      return result;
    } catch (err) {
      console.error('Error in getCustomerDetails:', err);
      throw err;
    }
  },
  // Create a new customer/application
  createCustomer: async (payload: any) => {
    try {
      const [result] = await database.execute(
        `INSERT INTO tCustomers 
          (admin_id, customer_name, customer_phone, customer_address, customer_email_id,customers_additional_notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          payload.admin_id || 10001,
          payload.customerName,
          payload.phoneNumber,
          payload.customerAddress,
          payload.emailAddress,
          payload.additionalNotes,
        ]
      );

      return (result as any).insertId; // insertId from MySQL
    } catch (err) {
      console.error('Error in createApplication:', err);
      throw err;
    }
  },
    
  createProject: async (payload: any) => {
    try {
      // Fallback customer ID
      const fallbackCustomerId = "47DFB1B2D46C";
  
      const customer_id = payload.customer_id || fallbackCustomerId;
  
      // Check if the customer exists
      const [customer]: any = await database.execute(
        `SELECT customer_id FROM tCustomers WHERE customer_id = ?`,
        [customer_id]
      );
  
      if (!customer.length) {
        throw new Error(
          `Customer ID ${customer_id} does not exist in tCustomers`
        );
      }
  
      // Insert project
      const [result] = await database.execute(
        `INSERT INTO tProjects
          (
            customer_id,
            project_unique_id,
            project_name,
            project_unit_branch,
            project_Industry,
            project_Handling,
            project_Location,
            project_max_temp,
            project_min_temp,
            project_relative_min_humid,
            project_relative_max_humid
          )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customer_id,
          payload.uniqueId,
          payload.projectName,
          payload.unitBranch,
          JSON.stringify(payload.industry),
          JSON.stringify(payload.handling),
          payload.selectedLocation.display_name,
          parseFloat(payload.maxTemp),
          parseFloat(payload.minTemp),
          parseFloat(payload.relativeHumidityMin),
          parseFloat(payload.relativeHumidityMax),
        ]
      );
  
      // Return generated project_id
      const [rows]: any = await database.execute(
        `SELECT project_id FROM tProjects WHERE project_unique_id = ? LIMIT 1`,
        [payload.uniqueId]
      );
  
      return rows[0].project_id;
    } catch (error) {
      console.error("Create Project Error:", error);
      throw error;
    }
  },

  
  

  // Insert room standards
  createRoomStandards: async (payload: any) => {
    try {
      const [result] = await database.execute(
        `INSERT INTO tRoomStandards 
          (
            project_system,
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
            flow_velocity,
            flow_medium,
            heating_flow_velocity,
            cooling_flow_velocity
          )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

      return (result as any).insertId;
    } catch (err) {
      console.error('Error in roomStandards:', err);
      throw err; // this will trigger Hapi 500
    }
  },
};
