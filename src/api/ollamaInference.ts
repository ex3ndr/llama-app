import axios from 'axios';
import * as z from 'zod';

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