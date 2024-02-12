import { TUser } from "../models/models";
import { ServerResponse } from "http";
import { invalidUserIdHandler, nonexistentUserHandler } from "../helpers";
import { validate } from "uuid";

type TParams = {
    res: ServerResponse;
    users: TUser[];
    userId: string
}

export const deleteUserController = ({ res, users, userId }: TParams) => {
    if (!validate(userId)) {
        invalidUserIdHandler(res)
        return;
    }

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
        nonexistentUserHandler(res)
        return;
    }

    users.splice(userIndex, 1);

    res.writeHead(204);
    res.end();
};