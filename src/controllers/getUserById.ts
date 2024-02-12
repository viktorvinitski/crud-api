import { TUser } from "../models/models";
import { ServerResponse } from "http";
import { invalidUserIdHandler, nonexistentUserHandler } from "../helpers";
import { validate } from "uuid";

type TParams = {
    res: ServerResponse;
    users: TUser[];
    userId: string;
}

export const getUserByIdController = ({ res, userId, users }: TParams) => {
    if (!validate(userId)) {
        invalidUserIdHandler(res)
        return;
    }

    const user = users.find((u) => u.id === userId);

    if (!user) {
        nonexistentUserHandler(res)
        return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
};