import { TUser } from "../models/models";
import { IncomingMessage, ServerResponse } from "http";
import { v4 as uuid } from "uuid";

type TParams = {
    req: IncomingMessage;
    res: ServerResponse;
    users: TUser[];
}

export const createUserController = ({ req, res, users }: TParams) => {
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

        const newUser = {
            id: uuid(),
            username,
            age,
            hobbies,
        };

        users.push(newUser);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
    });
};