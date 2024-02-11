import { TUser } from "../models/models";
import { ServerResponse } from "http";
import { validate } from "uuid";

type TParams = {
    res: ServerResponse;
    users: TUser[];
    userId: string
}

export const deleteUserController = ({ res, users, userId }: TParams) => {
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

    users.splice(userIndex, 1);

    res.writeHead(204);
    res.end();
};