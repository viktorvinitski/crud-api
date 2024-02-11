import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { TUser, Request } from "../models/models";
import { getUsersController } from "../controllers/getUsers";
import { getUserByIdController } from "../controllers/getUserById";
import { createUserController } from "../controllers/createUser";
import { updateUserController } from "../controllers/updateUser";
import { deleteUserController } from "../controllers/deleteUser";
import { nonExist } from "../controllers/nonExist";

const BASE_URL = '/api/users/'
const users: TUser[] = []

export const requestsHandler = (req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req;
    const { pathname } = parse(url!, false);
    const userId = pathname.replace(BASE_URL, '');

    if (pathname === BASE_URL && method === Request.GET) {
        getUsersController({ res, users });
    } else if (pathname === BASE_URL && method === Request.POST) {
        createUserController({ req, res, users });
    } else if (pathname === `${BASE_URL}${userId}` && method === Request.GET) {
        getUserByIdController({ res, userId, users });
    } else if (pathname === `${BASE_URL}${userId}` && method === Request.PUT) {
        updateUserController({ req, res, userId, users });
    } else if (pathname === `${BASE_URL}${userId}` && method === Request.DELETE) {
        deleteUserController({ res, users, userId });
    } else {
        // Handle non-existing endpoints
        nonExist({ res })
    }
}