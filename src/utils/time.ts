export async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function exponentialBackoffDelay(currentFailureCount: number, minDelay: number, maxDelay: number, maxFailureCount: number) {
    let maxDelayRet = minDelay + ((maxDelay - minDelay) / maxFailureCount) * Math.max(currentFailureCount, maxFailureCount);
    return Math.round(Math.random() * maxDelayRet);
}

export type BackoffFunc = <T>(callback: () => Promise<T>) => Promise<T>;

export function createBackoff(
    opts?: {
        onError?: (e: any, failuresCount: number) => void,
        minDelay?: number,
        maxDelay?: number,
        maxFailureCount?: number
    }): BackoffFunc {
    return async <T>(callback: () => Promise<T>): Promise<T> => {
        let currentFailureCount = 0;
        const minDelay = opts && opts.minDelay !== undefined ? opts.minDelay : 250;
        const maxDelay = opts && opts.maxDelay !== undefined ? opts.maxDelay : 1000;
        const maxFailureCount = opts && opts.maxFailureCount !== undefined ? opts.maxFailureCount : 50;
        while (true) {
            try {
                return await callback();
            } catch (e) {
                if (currentFailureCount < maxFailureCount) {
                    currentFailureCount++;
                }
                if (opts && opts.onError) {
                    opts.onError(e, currentFailureCount);
                }
                let waitForRequest = exponentialBackoffDelay(currentFailureCount, minDelay, maxDelay, maxFailureCount);
                await delay(waitForRequest);
            }
        }
    };
}

export let backoff = createBackoff({ onError: (e) => { console.warn(e); } });

export async function minDelay<T>(ms: number, execute: () => Promise<T>) {
    let start = Date.now();
    let result = await execute();
    let elapsed = Math.min(Math.max(Date.now() - start, 0), ms); // Protect from time drift
    if (elapsed < ms) {
        await delay(ms - elapsed);
    }
    return result;
}

export async function retry<T>(fn: () => Promise<T>): Promise<T> {
    while(true) {
        try {
            return await fn();
        } catch (e) {
            console.warn(e);
            await delay(1000);
        }
    }
}