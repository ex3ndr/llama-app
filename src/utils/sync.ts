import { AppState } from "react-native";
import { InvalidateSync } from "./invalidate";

export function sync(args: { interval: number }, f: () => Promise<void>) {

    // Create sync
    const invalidateSync = new InvalidateSync(f);
    invalidateSync.invalidate();

    // Refresh on inverval
    setInterval(() => invalidateSync.invalidate(), args.interval * 1000);

    // Refresh on app became foreground
    AppState.addEventListener("change", (state) => {
        if (state === "active") {
            invalidateSync.invalidate();
        }
    });
}