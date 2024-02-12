import { randomUUID } from "node:crypto";
import { requestsHandler } from "../src/routes";
import { IncomingMessage } from "http";
import { TUser } from "../src/models/models";

describe('requestsHandler', () => {
    const mockResponse = {
        writeHead: jest.fn(),
        end: jest.fn(),
    } as any;

    describe('Get users', () => {
        test('Should get all users', () => {
            const users: TUser[] = []
            const mockRequest = {
                method: 'GET',
                url: 'http://localhost:3000/api/users',
            } as IncomingMessage;
            requestsHandler(mockRequest, mockResponse, users);
            expect(mockResponse.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
            expect(mockResponse.end).toHaveBeenCalledWith(JSON.stringify(users));
        });
    })

    describe('Get user by id', () => {
        test('Should get user by id', async () => {
            const userId = randomUUID();
            const user = {
                id: userId,
                username: "test",
                age: 20,
                hobbies: ["football"],
            };
            const users: TUser[] = [user];
            const mockRequest = {
                method: 'GET',
                url: `http://localhost:3000/api/users/${userId}`,
            } as IncomingMessage;
            requestsHandler(mockRequest, mockResponse, users);
            expect(mockResponse.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
            expect(mockResponse.end).toHaveBeenCalledWith(JSON.stringify(user));
        })

        test('Should return 400 if user id is wrong', async () => {
            const users: TUser[] = [];
            const mockRequest = {
                method: 'GET',
                url: `http://localhost:3000/api/users/test`,
            } as IncomingMessage;
            requestsHandler(mockRequest, mockResponse, users);
            expect(mockResponse.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
        })

        test("Should return 404 if user doesn't exist", async () => {
            const userId = randomUUID();
            const users: TUser[] = []
            const mockRequest = {
                method: 'GET',
                url: `http://localhost:3000/api/users/${userId}`,
            } as IncomingMessage;
            requestsHandler(mockRequest, mockResponse, users);
            expect(mockResponse.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'application/json' });
        })
    })

    describe('Delete user', () => {
        test("Should delete user", async () => {
            const userId = randomUUID();
            const user = {
                id: userId,
                username: "test",
                age: 20,
                hobbies: ["football"],
            }
            const users: TUser[] = [user]
            const mockRequest = {
                method: 'DELETE',
                url: `http://localhost:3000/api/users/${userId}`,
            } as IncomingMessage;
            requestsHandler(mockRequest, mockResponse, users);
            expect(mockResponse.writeHead).toHaveBeenCalledWith(204);
            expect(users.length).toBe(0);
        })

        test("Should return 404 if user doesn't exist", async () => {
            const userId = randomUUID();
            const users: TUser[] = []
            const mockRequest = {
                method: 'DELETE',
                url: `http://localhost:3000/api/users/${userId}`,
            } as IncomingMessage;
            requestsHandler(mockRequest, mockResponse, users);
            expect(mockResponse.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'application/json' });
        })

        test("Should return 400 if user id is wrong", async () => {
            const users: TUser[] = []
            const mockRequest = {
                method: 'DELETE',
                url: `http://localhost:3000/api/users/test`,
            } as IncomingMessage;
            requestsHandler(mockRequest, mockResponse, users);
            expect(mockResponse.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
        })
    })
});
