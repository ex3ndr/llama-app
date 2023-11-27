import { MMKV } from 'react-native-mmkv';

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