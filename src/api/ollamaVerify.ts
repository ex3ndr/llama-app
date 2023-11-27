import { ollamaTags } from './ollamaTags';

export async function ollamaVerify(src: string): Promise<boolean> {
    try {
        await ollamaTags(src);
        return true;
    } catch (e) {
        return false;
    }
}