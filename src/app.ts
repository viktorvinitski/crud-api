import { createServer, IncomingMessage, ServerResponse } from 'http';
import { config } from 'dotenv';
import { requestsHandler } from "./routes";
import { errorHandler } from "./helpers";
import { TUser } from "./models/models";

config();

const PORT = process.env.PORT;
const users: TUser[] = []

export const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    try {
        requestsHandler(req, res, users)
    } catch (error) {
        errorHandler(res, error);
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});