import { TUser } from "../models/models";
import { ServerResponse } from "http";

type TParams = {
    res: ServerResponse;
    users: TUser[];
}

export const getUsersController = ({ res, users }: TParams) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
};