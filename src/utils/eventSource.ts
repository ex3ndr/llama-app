import { log } from "./log";
import { run } from "./run";

//
// Inspiration from https://github.com/adamchel/rn-eventsource/blob/master/src/EventSource.js
//

const Networking = require('react-native').Networking;

export function eventSource(url: string, data: any, handler: (data: string | null, error: any | null) => void): () => void {

    log('Event source start');

    // Cancel
    let cancel: (() => void) | null = null;
    let canceled = false;

    // Run source
    run(async () => {

        // Start request
        let requestId = await startRequest(url, data);
        if (canceled) {
            log('Aborted just after request start');
            abortRequest(requestId);
            return;
        }
        log('Requeted');

        // Subscribe
        let ended = false;
        let subscriptions: any[] = [];
        let complete = () => {
            if (!ended) {
                ended = true;
                log('Ended');
                abortRequest(requestId);
                for (let s of subscriptions) {
                    s.remove();
                }
            }
        };
        cancel = complete;

        // Pending buffer
        let pending: string = '';
        function flushPending() {
            while (pending.indexOf('\n') >= 0) {
                let offset = pending.indexOf('\n');
                if (!canceled) {
                    handler(pending.slice(0, offset), null);
                }
                pending = pending.slice(offset + 1);
            }
        }

        // Callbacks
        subscriptions.push(Networking.addListener('didReceiveNetworkResponse', (args: [number, number /* status code */, any, string]) => {
            if (args[0] === requestId && !ended) {
                if (args[1] !== 200) {
                    complete();
                    handler(null, new Error('Received status code: ' + args[1]));
                }
            }
        }));
        subscriptions.push(Networking.addListener('didReceiveNetworkIncrementalData', (args: [number, string /* data */, number /* progress */, number /* total */]) => {
            if (args[0] === requestId && !ended) {
                pending += args[1];
                flushPending();
            }
        }));
        subscriptions.push(Networking.addListener('didCompleteNetworkResponse', (args: [number, string | null /* error */, boolean /* timeOutError */]) => {
            if (args[0] === requestId && !ended) {
                complete();
                if (args[1]) {
                    handler(null, new Error('Error: ' + args[1]));
                } else if (args[2]) {
                    handler(null, new Error('Timeout error'));
                } else {
                    flushPending();
                    if (pending.length !== 0 && !canceled /* Could end during flushing */) {
                        handler(pending, null); // Last line
                    }
                    if (!canceled /* Could end during flushing */) {
                        handler(null, null);
                    }
                }
            }
        }));
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

async function startRequest(url: string, data: any) {
    return await new Promise<number>((resolve) => {
        Networking.sendRequest(
            'POST', // Method
            'unknown', // Tracking Name (??)
            url, // URL
            { "Content-Type": "application/json" }, // Headers
            JSON.stringify(data), // Body
            'text', // Text body
            true, // we want incremental events
            0, // there is no timeout defined in the WHATWG spec for EventSource
            resolve,
            false, // Disable credentials
        );
    });
}

function abortRequest(id: number) {
    Networking.abortRequest(id);
}