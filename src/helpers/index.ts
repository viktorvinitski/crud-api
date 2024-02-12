import { ServerResponse } from "http";
import { messages } from "../constants/messages";

export const invalidUserIdHandler = (res: ServerResponse) => {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: messages.invalidUserId }));
}

export const nonexistentUserHandler = (res: ServerResponse) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: messages.notFound }));
}

export const invalidRequestBodyHandler = (res: ServerResponse) => {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: messages.invalidBody }));
}

export const errorHandler = (res: ServerResponse, error: Error) => {
    console.error(error.stack);

    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
};

