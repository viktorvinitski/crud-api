export enum Request {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export type TUser = {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}