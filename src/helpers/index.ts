import { messages } from "../constants/messages";
import { IncomingMessage, ServerResponse } from "http";
import http from "http";
import { users } from "../db";
import { TUser } from "../models/models";

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

export const proxyRequest = (port: number, req: IncomingMessage, res: ServerResponse) => {
  const proxy = http.request(
    {
      hostname: "localhost",
      port: port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    },
  );

  req.pipe(proxy, { end: true });
};

export const updateDb = (newUsers: TUser[]) => {
    users.splice(0, users.length, ...newUsers);
};

export const updateCluster = (users: TUser[]) => {
    process.send({ type: "updateUsers", data: users });
};

