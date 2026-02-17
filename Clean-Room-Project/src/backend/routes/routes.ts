import { ServerRoute, Request, ResponseToolkit } from '@hapi/hapi';
import { ApplicationRepository } from '../repositories/repository';

const applicationRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/',
    handler: () => {
      return 'API is running!';
    },
  },
  {
    method: 'POST',
    path: '/v1/customerInfo',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = request.payload as any;
        console.log('Received payload in handler:', payload);
        const id = await ApplicationRepository.createApplication(payload);
        console.log('Created application with ID:', id);
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
    path: '/v1/standards',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = request.payload as any;
        const id = await ApplicationRepository.roomStandards(payload);
        return h.response({ roomStandardsId: id }).code(201);
      } catch (err) {
        console.error('Failed to save room standards info:', err);
        return h
          .response({ error: 'Internal Server Error' })
          .code(500);
      }
    },
  },
];

export default applicationRoutes;
