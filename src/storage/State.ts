import { ollamaTags } from "../api/ollamaTags";
import { sync } from "../utils/sync";
import { readEndpoint } from "./storage";
import { StoreApi, UseBoundStore, create } from 'zustand';

interface AppState {
    endpoint: string,
    lastModel: string | null,
    models: string[] | null,
    setLastModel: (model: string | null) => void
};

//
// State Management
// 

let _state: UseBoundStore<StoreApi<AppState>> | null = null;

export async function loadState() {

    // Load endpoint
    const endpoint = readEndpoint();
    if (!endpoint) {
        throw new Error("No endpoint found in storage");
    }

    // Create state
    const state = create<AppState>((set) => ({
        endpoint: endpoint,
        lastModel: null,
        models: null,
        setLastModel(model) {
            set((state) => ({ ...state, lastModel: model }))
        },
    }));
    _state = state;

    // Start models sync
    sync({ interval: 60 /* 1 min */ }, async () => {
        let models = await ollamaTags(endpoint);
        state.setState(s => ({ ...s, models }));
    });
}

export function useAppState() {
    if (!_state) {
        throw new Error("State not loaded");
    }
    return _state();
}