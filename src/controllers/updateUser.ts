import { TUser } from "../models/models";
import { IncomingMessage, ServerResponse } from "http";
import { invalidRequestBodyHandler, invalidUserIdHandler, nonexistentUserHandler, updateCluster } from "../helpers";
import { validate } from "uuid";
import cluster from "cluster";

type TParams = {
    req: IncomingMessage;
    res: ServerResponse;
    users: TUser[];
    userId: string
}

export const updateUserController = ({ req, res, users, userId }: TParams) => {
    if (!validate(userId)) {
        invalidUserIdHandler(res)
        return;
    }

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
        nonexistentUserHandler(res);
        return;
    }

    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { username, age, hobbies } = JSON.parse(body);

        if (!username || !age || !Array.isArray(hobbies)) {
            invalidRequestBodyHandler(res);
            return;
        }

        const updatedUser = {
            id: userId,
            username,
            age,
            hobbies,
        };

        if (!cluster.isWorker) {
            users[userIndex] = updatedUser;
        } else {
            const updatedUsers = users.map(user => updatedUser.id === user.id ? updatedUser : user)
            updateCluster(updatedUsers);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
    });
};