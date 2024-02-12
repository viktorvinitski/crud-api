import { createServer, IncomingMessage, ServerResponse } from 'http';
import { errorHandler } from "./helpers";
import cluster from 'cluster';
import os from 'os'
import { requestsHandler } from "./routes";
import { proxyRequest, updateDb } from "./helpers";
import { TUser } from "./models/models";
import { users } from "./db";
import {config} from "dotenv";

config();

const PORT = Number(process.env.PORT_MULTI);
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork({ PORT_FOR_WORKER: `${PORT + i + 1}` });
  }

  Object.values(cluster.workers).forEach((worker) => {
    worker.on("message", (msg) => {
      if (msg.type === "updateUsers") {
        Object.values(cluster.workers).forEach((worker) => worker?.send(msg));
      }
    });
  });

  const workerPorts = [...Array(numCPUs).keys()].map((i) => PORT + i + 1);
  let roundRobinIndex = 0;
  const proxyServer = createServer((req, res) => {
    const workerPort = workerPorts[roundRobinIndex++ % numCPUs];
    proxyRequest(workerPort, req, res);
  });

  proxyServer.listen(PORT, () => {
    console.log(`Balancer is running on port ${PORT}`);
  });
} else {
  const port = +process.env.PORT_FOR_WORKER;
  if (port) {
      const server = createServer((req: IncomingMessage, res: ServerResponse) => {
          try {
              requestsHandler(req, res, users);
          } catch (error) {
              errorHandler(res, error);
          }
      });
      server.listen(port, () => {
          console.log(`Worker ${process.pid} started on port ${port}`);
      });
  }

  process.on("message", (msg) => {
    const { type } = msg as { type: string };
    if (type === "updateUsers") {
      const { data } = msg as { data: TUser[] };
        updateDb(data);
    }
  });
}
