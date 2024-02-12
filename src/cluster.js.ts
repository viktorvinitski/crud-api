import { createServer, IncomingMessage, ServerResponse } from 'http';
import { config } from 'dotenv';
import { errorHandler } from "./helpers";
import cluster, { Worker } from 'cluster';
import os from 'os'
import { requestsHandler } from "./routes";
import { initLoadBalancer } from "./loadBalancer";
import { TUser } from "./models/models";

config();

const PORT = Number(process.env.PORT_MULTI);
const numCPUs = os.cpus().length;
const users: TUser[] = [];

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    try {
        requestsHandler(req, res, users);
    } catch (error) {
        errorHandler(res, error);
    }
});

if (cluster.isPrimary) {
    const workers: Worker[] = [];

    for (let i = 1; i <= numCPUs; i++) {
        const childWorker = cluster.fork({ HOST: 'localhost', PORT: PORT + i });

        workers.push(childWorker);
        childWorker.on('message', (data) => {
            workers.forEach((worker) => worker.send(data));
        });
    }

    cluster.on('exit', (worker, code) => {
        console.log(`Worker ${worker.id} died. Exit code: ${code}`);
    });

    initLoadBalancer(PORT);
} else {
    server.listen(PORT + cluster.worker.id, () => {
        console.log(`Worker ${process.pid} is listening on http://localhost:${PORT + cluster.worker.id}`);
    });
}