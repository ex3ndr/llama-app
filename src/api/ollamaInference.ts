import axios from 'axios';
import * as z from 'zod';
import { eventSource } from '../utils/eventSource';
import { createAsyncIterator } from '../utils/asyncIterator';

//
// Non-streaming
//

const inferenceSchema = z.object({
    model: z.string(),
    response: z.string(),
    context: z.array(z.number())
})

export async function ollamaInference(args: { endpoint: string, model: string, message: string, context?: string | null }) {

    // Doing inference
    let res = await axios.post(args.endpoint + '/api/generate', {
        model: args.model,
        prompt: args.message,
        context: args.context ? JSON.parse(args.context) : null,
        stream: false
    });

    // Parse response
    let parsed = inferenceSchema.parse(res.data);

    return {
        response: parsed.response,
        context: JSON.stringify(parsed.context)
    };
}

//
// Streaming
//

export type OllamaToken = {
    model: string,
    response: string,
    done: boolean,
    context?: number[]
};


export function ollamaInferenceStreaming(args: { endpoint: string, model: string, message: string, context?: string | null }): AsyncIterable<OllamaToken> {
    return {
        [Symbol.asyncIterator]() {
            let iterator = createAsyncIterator<OllamaToken>();
            let abortHandler = eventSource(args.endpoint + '/api/generate', {
                model: args.model,
                prompt: args.message,
                context: args.context ? JSON.parse(args.context) : null,
                stream: true
            }, (d, err) => {
                if (d) {
                    iterator.controller.push(JSON.parse(d) as OllamaToken);
                } else {
                    iterator.controller.complete(err);
                }
            });
            iterator.controller.setAbortCallback(abortHandler);
            return iterator.iterator;
        }
    }
}