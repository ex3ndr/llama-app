import { Queue } from "./queue";

export type AsyncIteratorController<T> = {
    push(item: T): void;
    complete(error?: any): void;
    setAbortCallback(handler: () => void): void;
};

export function createAsyncIterator<T>(): { iterator: AsyncIterator<T>, controller: AsyncIteratorController<T> } {

    // Status
    let queue = new Queue<IteratorResult<T>>();
    let resolvers: any[] = [];
    let abortCallback: (() => void) | null = null;
    let onReturn = () => {
        resolvers = [];
        if (abortCallback) {
            abortCallback();
        }
        return Promise.resolve({ value: undefined, done: true } as any);
    };

    return {
        iterator: {
            async next(): Promise<IteratorResult<T>> {
                let r = await queue.pop();
                if (!r) {
                    return { value: undefined, done: true };
                } else {
                    return r;
                }
            },
            return: onReturn,
            throw(error: any) {
                return Promise.reject(error);
            }
        },
        controller: {
            push(item: T) {
                queue.push({ value: item, done: false });
            },
            complete(error?: any) {
                queue.complete(error);
            },
            setAbortCallback(handler: () => void) {
                abortCallback = handler;
            }
        }
    };
}