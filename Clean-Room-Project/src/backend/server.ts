// Correct for ES modules
import Hapi from "@hapi/hapi";
import applicationRoutes from "./routes/index.js";
import { openApiSpec } from "./swagger/openapi.js";

const server = Hapi.server({
	port: 3000,
	host: "localhost",
	routes: {
		cors: {
			origin: ["http://localhost:5173"],
			additionalHeaders: ["cache-control", "x-requested-with"],
		},
		payload: {
			parse: true, // default true - ensure parsing
			allow: "application/json",
			output: "data",
		},
	},
});

const startServer = async () => {
	try {
		// Register application routes
		server.route(applicationRoutes);

		server.route({
			method: "GET",
			path: "/swagger.json",
			handler: () => openApiSpec,
		});

		await server.start();
		console.log(`Server running at: ${server.info.uri}`);
	} catch (err) {
		console.error("Failed to start server:", err);
		process.exit(1);
	}
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
	console.error(err);
	process.exit(1);
});
