import { createServer, IncomingMessage, ServerResponse } from 'http';
import { config } from 'dotenv';
import { requestsHandler } from "./routes";

config();

const PORT = process.env.PORT;

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    requestsHandler(req, res)
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});