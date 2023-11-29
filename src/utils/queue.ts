export class Queue<T> {
    private _queue: T[] = [];
    private _resolvers: { resolve: (v: T | null) => void, reject: (reason: any) => void }[] = [];
    private _completed = false;
    private _completeError: any | null = null;

    push(item: T) {
        if (this._completed) {
            throw Error('Queue already completed');
        }
        if (this._resolvers.length > 0) {
            const resolver = this._resolvers.shift()!;
            resolver.resolve(item);
        } else {
            this._queue.push(item);
        }
    }

    async pop(): Promise<T | null> {
        if (this._completed) {
            if (this._completeError) {
                throw this._completeError;
            } else {
                return null;
            }
        }
        if (this._queue.length > 0) {
            return this._queue.shift()!;
        } else {
            return new Promise<T | null>((resolve, reject) => {
                this._resolvers.push({ resolve, reject });
            });
        }
    }

    complete(error?: any | null) {
        if (!this._completed) {
            this._completed = true;
            this._completeError = error || null;
            let p = [...this._resolvers];
            this._resolvers = [];
            for (const resolver of p) {
                if (!error) {
                    resolver.resolve(null);
                } else {
                    resolver.reject(error);
                }
            }
        }
    }
}

export class GroupQueue<T> {
    private _queue: T[] = [];
    private _resolvers: { resolve: (v: T[] | null) => void, reject: (reason: any) => void }[] = [];
    private _completed = false;
    private _completeError: any | null = null;

    push(item: T) {
        if (this._completed) {
            throw Error('Queue already completed');
        }
        if (this._resolvers.length > 0) {
            const resolver = this._resolvers.shift()!;
            resolver.resolve([item]);
        } else {
            this._queue.push(item);
        }
    }

    async pop(): Promise<T[] | null> {
        if (this._completed) {
            if (this._completeError) {
                throw this._completeError;
            } else {
                return null;
            }
        }
        if (this._queue.length > 0) {
            let r = [...this._queue];
            this._queue = [];
            return r;
        } else {
            return new Promise<T[] | null>((resolve, reject) => {
                this._resolvers.push({ resolve, reject });
            });
        }
    }

    complete(error?: any | null) {
        if (!this._completed) {
            this._completed = true;
            this._completeError = error || null;
            let p = [...this._resolvers];
            this._resolvers = [];
            for (const resolver of p) {
                if (!error) {
                    resolver.resolve(null);
                } else {
                    resolver.reject(error);
                }
            }
        }
    }
}