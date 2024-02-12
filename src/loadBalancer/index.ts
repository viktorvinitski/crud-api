import { createServer, request as httpRequest } from 'http';
import os from "os";

const numCPUs = os.cpus().length;
const host = 'localhost'

let portsCount = 0
const getNextPort = (startPort: number) => {
    portsCount = portsCount === numCPUs ? 1 : portsCount + 1;
    return startPort + portsCount;
}

export const initLoadBalancer = (port: number) => {
    const server = createServer(async (request, response) => {
        const nextPort = getNextPort(port);

        console.log(`Request to proxy port ${nextPort}`);
        const options = {
            hostname: host,
            port: nextPort,
            path: request.url,
            method: request.method,
            headers: request.headers,
        };

        const requestToCP = httpRequest(options, (responseFromCP) => {
            response.statusCode = responseFromCP.statusCode || 500;
            response.setHeader('Content-Type', 'application/json');
            let body = '';
            responseFromCP.on('data', (chunk) => {
                body += chunk.toString();
                response.write(chunk);
            });
            responseFromCP.on('end', () => {
                response.end();
            });
        });

        request.on('data', (chunk) => {
            requestToCP.write(chunk);
        });
        request.on('end', () => {
            requestToCP.end();
        });
    });

    server.listen(port, host, () => {
        console.log(`Multi server is running at http://${host}:${port}/`);
    });

    return server
}

