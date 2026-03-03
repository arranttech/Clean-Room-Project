import { ServerRoute } from "@hapi/hapi";
import { userRepository } from "../repositories";

export const userRoute: ServerRoute[] = [
  {
    method: "GET",
    path: "/v1/users",
    handler: async (request, h) => {
      try {
		const user_login_id = request.query.user_login_id 
			? Number(request.query.user_login_id) 
			: null;

		if (user_login_id) {
			const result = await userRepository.getUserById(user_login_id);
			return h.response(result).code(200);
		}
		
        const users = await userRepository.getUsers();
        return h.response({ users }).code(200);
      } catch (err) {
        console.error(err);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  {
    method: "POST",
    path: "/v1/users",
    handler: async (request, h) => {
      try {
        const payload = request.payload as any;
        const userLoginId = await userRepository.createUser(payload);

        return h
          .response({
            message: "User created successfully",
            userId: userLoginId,
          })
          .code(201);
      } catch {
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },

  {
    method: "PUT",
    path: "/v1/users/{id}",
    handler: async (request, h) => {
      try {
        const id = Number(request.params.id);
        const payload = request.payload as any;

        await userRepository.updateUser(id, payload);

        return h
          .response({
            message: "User updated successfully",
          })
          .code(200);
      } catch (err) {
        console.error(err);

        return h
          .response({
            error: "Internal Server Error",
          })
          .code(500);
      }
    },
  },

  {
    method: "DELETE",
    path: "/v1/users/{id}",
    handler: async (request, h) => {
      try {
        const id = Number(request.params.id);
        if (!id) return h.response({ error: "Invalid user ID" }).code(400);

        const deleted = await userRepository.deleteUser(id);

        if (!deleted) return h.response({ error: "User not found" }).code(404);

        return h.response({ message: "User deleted successfully" }).code(200);
      } catch {
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  },
];
