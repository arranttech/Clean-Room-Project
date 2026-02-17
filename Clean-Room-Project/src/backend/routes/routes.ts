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
    path: '/api/customerInfo',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = request.payload as any;
        const id = await ApplicationRepository.createApplication(payload);
        return h.response({ applicationId: id }).code(201);
      } catch (err) {
        console.error('Failed to save customer info:', err);
        return h
          .response({ error: 'Internal Server Error' })
          .code(500);
      }
    },
  },
];

export default applicationRoutes;
