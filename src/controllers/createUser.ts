import { TUser } from "../models/models";
import { IncomingMessage, ServerResponse } from "http";
import { v4 as uuid } from "uuid";
import { invalidRequestBodyHandler, updateCluster } from "../helpers";
import cluster from "cluster";

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
            invalidRequestBodyHandler(res);
            return;
        }

        const newUser = {
            id: uuid(),
            username,
            age,
            hobbies,
        };

        if (!cluster.isWorker) {
            users.push(newUser);
        } else {
            const updatedUsers = [...users, newUser]
            updateCluster(updatedUsers);
        }

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
    });
};