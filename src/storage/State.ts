import { ollamaInference } from "../api/ollamaInference";
import { ollamaTags } from "../api/ollamaTags";
import { InvalidateSync } from "../utils/invalidate";
import { sync } from "../utils/sync";
import { readEndpoint } from "./storage";
import { StoreApi, UseBoundStore, create } from 'zustand';

interface AppState {
    endpoint: string,
    lastModel: string | null,
    models: string[] | null,
    chat: ChatState | null,
    setLastModel: (model: string | null) => void,
    sendMessage: (message: string) => void,
    onInferenceResult: (message: string, context: string) => void
};

interface MessageState {
    sender: 'assistant' | 'user'
    content: {
        kind: 'text',
        value: string
    }
}

interface ChatState {
    state: 'inference' | 'idle'
    model: string,
    messages: MessageState[],
    context: string | null
}

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

    // Create sync
    let inference: InvalidateSync;

    // Create state
    const state = create<AppState>((set) => ({
        endpoint: endpoint,
        lastModel: null,
        models: null,
        chat: null,
        setLastModel(model) {
            set((state) => ({ ...state, lastModel: model }))
        },
        sendMessage(message) {
            set((state) => {
                if (!state.chat) {
                    return {
                        ...state,
                        chat: {
                            state: 'inference',
                            model: state.lastModel!,
                            messages: [{
                                sender: 'user',
                                content: {
                                    kind: 'text',
                                    value: message
                                }
                            }],
                            context: null
                        }
                    };
                } else {
                    if (state.chat.state === 'idle') {
                        return {
                            ...state,
                            chat: {
                                ...state.chat,
                                state: 'inference',
                                messages: [...state.chat.messages, {
                                    sender: 'user',
                                    content: {
                                        kind: 'text',
                                        value: message
                                    }
                                }]
                            }
                        };
                    } else {
                        return state;
                    }
                }
            });
            inference.invalidate();
        },
        onInferenceResult(message, context) {
            set((state) => {
                if (state.chat && state.chat.state === 'inference') {
                    return {
                        ...state,
                        chat: {
                            ...state.chat,
                            state: 'idle',
                            context,
                            messages: [...state.chat.messages, {
                                sender: 'assistant',
                                content: {
                                    kind: 'text',
                                    value: message
                                }
                            }]
                        }
                    };
                } else {
                    return state
                }
            })
        }
    }));
    _state = state;

    // Start inference sync
    inference = new InvalidateSync(async () => {
        let now = state.getState();
        if (now.chat && now.chat.state === 'inference') {

            // Doing inference
            let res = await ollamaInference({
                endpoint,
                model: now.chat!.model,
                message: now.chat!.messages[now.chat!.messages.length - 1].content.value,
                context: now.chat!.context
            });

            // Apply result
            now.onInferenceResult(res.response, res.context);
        }
    });

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