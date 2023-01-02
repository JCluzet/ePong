import User from "./user";

export type Chan = {
    id: number;
    name: string;
    isPrivate: boolean;
    isDirectConv: boolean;
    creatorId: number;
    users: User[];
    password?: string
}

export type DatabaseMessageType = {
    id: number;
    chanId: number;
    senderId: string;
    content: string;
    timestamp: string;
}

export type WebSocketMessageType = {
    chanId: number;
    senderId: string;
    content: string;
    timestamp: string;
}