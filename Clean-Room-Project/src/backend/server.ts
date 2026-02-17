// Correct for ES modules
import Hapi from '@hapi/hapi';
import applicationRoutes from './routes/routes.ts'; // must include .js extension in Node ESM




const server = Hapi.server({
  port: 3000,
  host: 'localhost',
  routes: {
    cors: {
      origin: ['http://localhost:5173'], // Allow your frontend URL here
      additionalHeaders: ['cache-control', 'x-requested-with'], // optional headers
    },
  },
});


// Register all application routes
server.route(applicationRoutes);


const startServer = async () => {
  try {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();