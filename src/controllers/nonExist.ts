import { ServerResponse } from "http";

type TParams = {
    res: ServerResponse;
}

export const nonExist = ({ res }: TParams) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint not found' }));
};