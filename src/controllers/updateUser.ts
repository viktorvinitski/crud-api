import { TUser } from "../models/models";
import { IncomingMessage, ServerResponse } from "http";
import { invalidRequestBodyHandler, invalidUserIdHandler, nonexistentUserHandler } from "../helpers";
import { validate } from "uuid";

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

        users[userIndex] = updatedUser;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
    });
};