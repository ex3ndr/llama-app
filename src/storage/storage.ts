import { MMKV } from 'react-native-mmkv';
import { Dialog, Message } from './types';

const storage = new MMKV();

export function readEndpoint() {
    let endpoint = storage.getString('endpoint');
    if (endpoint) {
        return endpoint;
    } else {
        return null;
    }
}

export function writeEndpoint(src: string | null) {
    if (src) {
        storage.set('endpoint', src);
    } else {
        storage.delete('endpoint');
    }
}

export function clearStorage() {
    storage.clearAll();
}

export function readModels(): string[] | null {
    let ex = storage.getString('models');
    if (!ex) {
        return null;
    } else {
        return JSON.parse(ex) as string[];
    }
}

export function writeModels(src: string[]) {
    storage.set('models', JSON.stringify(src));
}

export function readLastModel(): string | null {
    let ex = storage.getString('last_model');
    if (ex) {
        return ex;
    } else {
        return null;
    }
}

export function writeLastModel(src: string | null) {
    if (src) {
        storage.set('last_model', src);
    } else {
        storage.delete('last_model');
    }
}

export function writeDialogs(dialogs: Dialog[]) {
    storage.set('dialogs', JSON.stringify(dialogs));
}

export function readDialogs(): Dialog[] {
    let ex = storage.getString('dialogs');
    if (ex) {
        return JSON.parse(ex);
    } else {
        return [];
    }
}

export function writeChat(id: string, data: {
    model: string,
    context: string | null,
    messages: Message[]
}) {
    storage.set('chat_' + id, JSON.stringify(data));
}

export function loadChat(id: string): { model: string, context: string | null, messages: Message[] } {
    return JSON.parse(storage.getString('chat_' + id)!);
}