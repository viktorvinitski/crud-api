import { createServer, IncomingMessage, ServerResponse } from 'http';
import { config } from 'dotenv';
import { errorHandler } from "./helpers";
import cluster from 'cluster';
import { availableParallelism } from 'os'
import { requestsHandler } from "./routes";
import { TUser } from "./models/models";

config();

const PORT = process.env.PORT_MULTI;
const numCPUs = availableParallelism();
const users: TUser[] = []

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs - 1; i++) {
        const worker = cluster.fork();

        worker.on('message', (message) => {
            console.log(message);
            if (message && message.users) {
                users.length = 0;
                users.push(...message.users);
            }
        });
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
        try {
            requestsHandler(req, res, users);
        } catch (error) {
            errorHandler(res, error);
        }
    });

    server.listen(PORT + cluster.worker.id, () => {
        console.log(`Worker ${process.pid} is listening on http://localhost:${PORT + cluster.worker.id}`);
    });

    process.send({ users });
}
