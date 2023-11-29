import { log } from "./log";
import { run } from "./run";

export function eventSource(url: string, data: any, handler: (data: string | null, error: any | null) => void): () => void {

    log('Event source start');

    // Cancel
    let cancel: (() => void) | null = null;
    let canceled = false;

    // Run source
    run(async () => {

        // Start
        const controller = new AbortController();
        let stream: ReadableStreamDefaultReader<Uint8Array> | null = null;
        let ended = false;
        let complete = () => {
            if (!ended) {
                ended = true;
                log('Ended');
                controller.abort();
                if (stream) {
                    stream.releaseLock();
                }
            }
        };
        cancel = complete;

        // Request
        let res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
            signal: controller.signal
        });
        if (canceled) {
            log('Aborted just after request start');
            controller.abort();
            return;
        }

        // Check header
        if (!res.ok || !res.body) {
            complete();
            handler(null, new Error('Received status code: ' + res.status));
            return;
        }

        // Capture stream
        stream = res.body.getReader();
        const decoder = new TextDecoder();
        let pending: string = '';

        // Read cycle
        try {
            while (true) {
                const { done, value } = await stream.read();

                // If ended
                if (done) {
                    if (pending.length > 0) { // New lines are impossible here
                        if (!canceled) {
                            handler(pending, null);
                        }
                    }
                    break;
                }

                // Append chunk
                let chunk = decoder.decode(value);
                pending += chunk;

                // Yield results 
                while (pending.indexOf('\n') >= 0) {
                    let offset = pending.indexOf('\n');
                    if (!canceled) {
                        handler(pending.slice(0, offset), null);
                    }
                    pending = pending.slice(offset + 1);
                }
            }
        } catch (e) {
            complete();
            if (!canceled) {
                handler(null, e);
            }
            return;
        } finally {
            stream.releaseLock();
            controller.abort();
        }
        complete();
        handler(null, null);
    });

    // Return cancelation
    return () => {
        if (!canceled) {
            log('Cancel called');
            canceled = true;
            if (cancel) {
                cancel();
            }
        }
    };
}