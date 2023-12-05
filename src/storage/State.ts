import { ollamaInferenceStreaming } from "../api/ollamaInference";
import { ollamaTags } from "../api/ollamaTags";
import { InvalidateSync } from "../utils/invalidate";
import { sync } from "../utils/sync";
import { loadChat, readDialogs, readEndpoint, readLastModel, readModels, writeChat, writeDialogs, writeLastModel, writeModels } from "./storage";
import { StoreApi, UseBoundStore, create } from 'zustand';
import { Dialog, Message } from "./types";
import { randomId } from "../utils/randomId";
import { createDialogTitle } from "../utils/createDialogTitle";
import { log } from "../utils/log";

interface AppState {
    endpoint: string,
    lastModel: string | null,
    models: string[] | null,
    chat: ChatState | null,
    dialogs: Dialog[],
    setLastModel: (model: string | null) => void,
    sendMessage: (message: string) => void,
    stopInference: () => void,
    onInferenceIntermediate: (message: string) => void
    onInferenceResult: (message: string, context: string) => void,
    openChat: (id: string) => void,
    newChat: () => void
};

interface ChatState {
    id: string,
    state: 'inference' | 'idle'
    model: string,
    messages: Message[],
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
        lastModel: readLastModel(),
        models: readModels(),
        chat: null,
        dialogs: readDialogs(),
        setLastModel(model) {
            writeLastModel(model);
            set((state) => ({ ...state, lastModel: model }));
        },
        sendMessage(message) {
            set((state) => {
                if (!state.chat) {

                    //
                    // Chat creation
                    //

                    let id = randomId();
                    let model = state.lastModel!;
                    let dialogs = [...state.dialogs, { id, title: createDialogTitle(message), model }];
                    let messages: Message[] = [{
                        sender: 'user',
                        content: {
                            kind: 'text',
                            value: message
                        }
                    }, {
                        sender: 'assistant',
                        content: {
                            kind: 'text',
                            value: '',
                            generating: true
                        }
                    }];

                    // Update dialogs
                    writeDialogs(dialogs);
                    writeChat(id, { model, context: null, messages });

                    // Return updates
                    return {
                        ...state,
                        chat: {
                            id,
                            state: 'inference',
                            model,
                            messages: messages,
                            context: null
                        },
                        dialogs
                    };
                } else {
                    if (state.chat.state === 'idle') {

                        // Update chat
                        let messages: Message[] = [...state.chat.messages, {
                            sender: 'user',
                            content: {
                                kind: 'text',
                                value: message
                            }
                        }, {
                            sender: 'assistant',
                            content: {
                                kind: 'text',
                                value: '',
                                generating: true
                            }
                        }];
                        writeChat(state.chat.id, { model: state.chat.model, context: null, messages });

                        // Return updates
                        return {
                            ...state,
                            chat: {
                                ...state.chat,
                                state: 'inference',
                                messages
                            }
                        };
                    } else {
                        return state;
                    }
                }
            });

            // Invalidate inference
            inference.invalidate();
        },
        onInferenceIntermediate(message) {
            set((state) => {
                if (state.chat && state.chat.state === 'inference') {

                    // Update chat
                    let messages: Message[] = [...state.chat.messages.slice(0, state.chat.messages.length - 1), {
                        sender: 'assistant',
                        content: {
                            kind: 'text',
                            value: message,
                            generating: true
                        }
                    }];
                    writeChat(state.chat.id, { model: state.chat.model, context: null, messages });

                    // Return result
                    return {
                        ...state,
                        chat: {
                            ...state.chat,
                            state: 'inference',
                            messages: [...state.chat.messages.slice(0, state.chat.messages.length - 1), {
                                sender: 'assistant',
                                content: {
                                    kind: 'text',
                                    value: message,
                                    generating: true
                                }
                            }]
                        }
                    };
                } else {
                    return state
                }
            });

            // Invalidate inference
            inference.invalidate();
        },
        onInferenceResult(message, context) {
            set((state) => {
                if (state.chat && state.chat.state === 'inference') {

                    // Update chat
                    let messages: Message[] = [...state.chat.messages.slice(0, state.chat.messages.length - 1), {
                        sender: 'assistant',
                        content: {
                            kind: 'text',
                            value: message
                        }
                    }];
                    writeChat(state.chat.id, { model: state.chat.model, context: null, messages });

                    // Return result
                    return {
                        ...state,
                        chat: {
                            ...state.chat,
                            state: 'idle',
                            context,
                            messages
                        }
                    };
                } else {
                    return state
                }
            });

            // Invalidate inference
            inference.invalidate();
        },
        stopInference() {
            set((state) => {
                if (state.chat && state.chat.state === 'inference') {

                    // Update chat
                    let messages: Message[] = state.chat.messages.slice(0, state.chat.messages.length - 1);
                    writeChat(state.chat.id, { model: state.chat.model, context: null, messages });

                    return {
                        ...state,
                        chat: {
                            ...state.chat,
                            state: 'idle',
                            messages
                        }
                    };
                } else {
                    return state
                }
            });

            // Invalidate inference
            inference.invalidate();
        },
        openChat(id) {

            // Load chat
            let chat = loadChat(id);

            // Resolve state
            let state: 'idle' | 'inference' = 'idle';
            if (chat.messages[chat.messages.length - 1].content.generating) {
                state = 'inference';
            }

            // Update state
            set((s) => {
                return {
                    ...s,
                    chat: {
                        id,
                        model: chat.model,
                        state,
                        context: chat.context,
                        messages: chat.messages
                    }
                }
            });

            // Invalidate inference
            inference.invalidate();
        },
        newChat() {
            set((s) => {
                return {
                    ...s,
                    chat: null
                }
            });
        },
    }));
    _state = state;

    // Start inference sync
    inference = new InvalidateSync(async () => {
        let now = state.getState();
        if (now.chat && now.chat.state === 'inference') {

            // Streaming of inference
            let res = '';
            let context: number[] | null = null;
            let id = now.chat.id;
            try {
                log('Starting inference...');
                for await (let tokens of ollamaInferenceStreaming({
                    endpoint,
                    model: now.chat!.model,
                    message: now.chat!.messages[now.chat!.messages.length - 2].content.value,
                    context: now.chat!.context
                })) {

                    // Update message
                    res += tokens.response;

                    // If we are still in inference
                    now = state.getState()
                    if (now.chat && now.chat.state === 'inference' && now.chat.id === id) {
                        now.onInferenceIntermediate(res);
                    } else {
                        log('Inference aborted');
                        throw Error('Aborted');
                    }

                    // What if we done
                    if (tokens.done) {
                        context = tokens.context!;
                        break;
                    }
                }
                if (!context) {
                    throw Error('Context was not received');
                }

                // Apply result
                now = state.getState();
                if (now.chat && now.chat.state === 'inference' && now.chat.id === id) {
                    now.onInferenceResult(res, JSON.stringify(context));
                } else {
                    log('Inference aborted');
                }
            } finally {
                log('Inference stopped');
            }
        }
    });

    // Start models sync
    sync({ interval: 60 /* 1 min */ }, async () => {
        let models = await ollamaTags(endpoint);
        writeModels(models);
        state.setState(s => ({ ...s, models }));
    });
}

export function useAppState() {
    if (!_state) {
        throw new Error("State not loaded");
    }
    return _state();
}