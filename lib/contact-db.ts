import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'messages.json');

export interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
    read: boolean;
}

export async function saveMessage(data: { name: string, email: string, message: string }) {
    let messages: Message[] = [];

    if (fs.existsSync(DB_PATH)) {
        const content = fs.readFileSync(DB_PATH, 'utf-8');
        try {
            messages = JSON.parse(content);
        } catch (e) {
            messages = [];
        }
    }

    const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
        read: false
    };

    messages.unshift(newMessage); // Newest first
    fs.writeFileSync(DB_PATH, JSON.stringify(messages, null, 2));
    return newMessage;
}

export async function getMessages() {
    if (!fs.existsSync(DB_PATH)) return [];
    try {
        const content = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(content) as Message[];
    } catch (e) {
        return [];
    }
}

export async function markAsRead(id: string) {
    if (!fs.existsSync(DB_PATH)) return;
    try {
        const content = fs.readFileSync(DB_PATH, 'utf-8');
        let messages: Message[] = JSON.parse(content);
        messages = messages.map(m => m.id === id ? { ...m, read: true } : m);
        fs.writeFileSync(DB_PATH, JSON.stringify(messages, null, 2));
    } catch (e) { }
}

export async function deleteMessage(id: string) {
    if (!fs.existsSync(DB_PATH)) return;
    try {
        const content = fs.readFileSync(DB_PATH, 'utf-8');
        let messages: Message[] = JSON.parse(content);
        messages = messages.filter(m => m.id !== id);
        fs.writeFileSync(DB_PATH, JSON.stringify(messages, null, 2));
    } catch (e) { }
}
