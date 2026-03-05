import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import HapiSwagger from "hapi-swagger";
import applicationRoutes from "./routes/index.js";

const server = Hapi.server({
	port: 3000,
	host: "localhost",
	routes: {
		cors: {
			origin: ["http://localhost:5173"],
			additionalHeaders: ["cache-control", "x-requested-with"],
		},
	},
});

const swaggerOptions = {
	info: {
		title: "Clean Room Project API",
		version: "1.0.0",
	},
	grouping: "tags", // ⭐ this enables grouping
	tags: [
		{ name: "auth", description: "Authentication APIs" },
		{ name: "customer", description: "Customer management APIs" },
		{ name: "project", description: "Project APIs" },
		{ name: "users", description: "User management APIs" },
		{ name: "profiles", description: "Profile and permission APIs" },
		{ name: "calculation", description: "Engineering calculation APIs" },
	],
};

const startServer = async () => {
	await server.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: swaggerOptions,
		},
	]);

	server.route(applicationRoutes);

	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

startServer();
