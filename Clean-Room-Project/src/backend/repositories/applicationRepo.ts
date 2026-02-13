import { database } from '../dbConnection/connections';

export const ApplicationRepository = {
  createApplication: async (payload: any) => {
    try {
      const [result] = await database.execute(
        `INSERT INTO customerInfo 
        (customerName, phoneNumber, customerAddress, emailAddress, additionalNotes, projectName, unitBranch, handling, industry, uniqueId, selectedLocation, minTemp, maxTemp, relativeHumidityMin, relativeHumidityMax)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payload.customerName,
          payload.phoneNumber,
          payload.customerAddress,
          payload.emailAddress,
          payload.additionalNotes,
          payload.projectName,
          payload.unitBranch,
          JSON.stringify(payload.handling || []),
          JSON.stringify(payload.industry || []),
          payload.uniqueId,
          JSON.stringify(payload.selectedLocation || {}),
          payload.minTemp || null,
          payload.maxTemp || null,
          payload.relativeHumidityMin || null,
          payload.relativeHumidityMax || null,
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
