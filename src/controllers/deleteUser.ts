import { TUser } from "../models/models";
import { ServerResponse } from "http";
import { invalidUserIdHandler, nonexistentUserHandler, updateCluster } from "../helpers";
import { validate } from "uuid";
import cluster from "cluster";

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

    if (!cluster.isWorker) {
        users.splice(userIndex, 1);
    } else {
        const updatedUsers = users.filter((user, index) => index !== userIndex)
        updateCluster(updatedUsers);
    }

    res.writeHead(204);
    res.end();
};