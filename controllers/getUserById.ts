import { TUser } from "../models/models";
import { ServerResponse } from "http";
import { validate } from "uuid";

type TParams = {
    res: ServerResponse;
    userId: string;
    users: TUser[];
}

export const getUserByIdController = ({ res, userId, users }: TParams) => {
    if (!validate(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid userId format' }));
        return;
    }

    const user = users.find((u) => u.id === userId);

    if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
        return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
};