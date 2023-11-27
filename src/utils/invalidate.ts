import { createBackoff, BackoffFunc, backoff } from "./time";

export class InvalidateSync {
    private _invalidated = false;
    private _invalidatedDouble = false;
    private _stopped = false;
    private _command: () => Promise<void>;
    private _backoff: BackoffFunc;

    constructor(command: () => Promise<void>, opts?: { backoff?: BackoffFunc }) {
        this._backoff = opts && opts.backoff ? opts.backoff : backoff;
        this._command = command;
    }

    invalidate() {
        if (this._stopped) {
            return;
        }
        if (!this._invalidated) {
            this._invalidated = true;
            this._invalidatedDouble = false;
            this._doSync();
        }
        if (!this._invalidatedDouble) {
            this._invalidatedDouble = true;
        }
    }

    stop() {
        if (this._stopped) {
            return;
        }
        this._stopped = true;
    }

    private _doSync = async () => {
        await this._backoff(async () => {
            if (this._stopped) {
                return;
            }
            await this._command();
        });
        if (this._stopped) {
            return;
        }
        if (this._invalidatedDouble) {
            this._invalidatedDouble = false;
            this._doSync();
        } else {
            this._invalidated = false;
        }
    }
}