import { TUser } from "../models/models";
import { IncomingMessage, ServerResponse } from "http";
import { validate } from "uuid";

type TParams = {
    req: IncomingMessage;
    res: ServerResponse;
    users: TUser[];
    userId: string
}

export const updateUserController = ({ req, res, users, userId }: TParams) => {
    if (!validate(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid userId format' }));
        return;
    }

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
        return;
    }

    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { username, age, hobbies } = JSON.parse(body);

        if (!username || !age || !Array.isArray(hobbies)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid request body' }));
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