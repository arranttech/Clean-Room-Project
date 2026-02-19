import { ServerRoute, Request, ResponseToolkit } from '@hapi/hapi';
import { ApplicationRepository } from '../repositories/repository';
import { airflowService, RoomPayload } from '../services/service';

const applicationRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/',
    handler: () => {
      return 'API is running!';
    },
  },
  {
    method: 'GET',
    path: '/v1/customers',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const adminId = request.query.admin_id ? Number(request?.query?.admin_id) : undefined;
        const customers = await ApplicationRepository.getCustomerDetails({ admin_id: adminId });
        return h.response({ customers }).code(200);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        return h.response({ error: 'Internal Server Error' }).code(500);
      }
    }
  },  
  {
    method: 'POST',
    path: '/v1/customerinfo',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = request.payload as any;
        const id = await ApplicationRepository.createCustomer(payload);
        return h.response({ applicationId: id }).code(201);
      } catch (err) {
        console.error('Failed to save customer info:', err);
        return h
          .response({ error: 'Internal Server Error' })
          .code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/v1/projectinfo',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = request.payload as any; // Full project data
        const projectId = await ApplicationRepository.createProject(payload);
        return h.response({ projectId }).code(201);
      } catch (err) {
        console.error('Failed to save project info:', err);
        return h.response({ error: 'Internal Server Error' }).code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/v1/RoomStandards',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = request.payload as any;
        const id = await ApplicationRepository.createRoomStandards(payload);
        return h.response({ roomStandardsId: id }).code(201);
      } catch (err) {
        console.error('Failed to save room standards info:', err);
        return h
          .response({ error: 'Internal Server Error' })
          .code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/v1/projectzones',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = request.payload as any;
        const zoneId = await ApplicationRepository.createProjectZone(payload);
        return h.response({ zoneId }).code(201);
      } catch (err) {
        console.error('Failed to create project zone:', err);
        return h.response({ error: 'Internal Server Error' }).code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/v1/airflow',
    options: {
      tags: ['api'], // show in Swagger UI
      description: 'Calculate airflow for a room',
      notes: 'Takes room dimensions and ventilation settings and returns airflow calculations',
      validate: {
        // No Joi validation, just accept payload as-is
        payload: (value: any) => value,
      },
    },
  
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = request.payload as RoomPayload;
        console.log('Received payload:', payload);
  
        const result = airflowService(payload);
        return h.response(result).code(200);
      } catch (err) {
        console.error('Failed to calculate airflow:', err);
        return h.response({ error: 'Internal Server Error' }).code(500);
      }
    },
  },
];

export default applicationRoutes;
