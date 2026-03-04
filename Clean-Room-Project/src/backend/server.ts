import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import HapiSwagger from "hapi-swagger";
import applicationRoutes from "./routes/index.js";
import HapiAuthJwt2 from "hapi-auth-jwt2";
import { userRepository } from "./repositories";
import dotenv from "dotenv";

dotenv.config();

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
};

const startServer = async () => {
	await server.register([
		Inert,
		Vision,
		HapiAuthJwt2, // Register jwt plugin here
		{
			plugin: HapiSwagger,
			options: swaggerOptions,
		},
	]);

const validate = async (decoded: unknown) => {
    const user = await userRepository.getUserById(decoded.user_id);

    if (!user || user.status === "I") {
    return { isValid: false };
    }

    return {
    isValid: true,
    credentials: user
    };
};
server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET || "supersecretkey",
    validate,
    verifyOptions: { algorithms: ["HS256"] },
});

    server.auth.default("jwt");

	server.route(applicationRoutes);


	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

startServer();
