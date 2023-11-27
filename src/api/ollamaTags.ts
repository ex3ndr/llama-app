import axios from 'axios';
import * as z from 'zod';

const tagsSchema = z.object({
    models: z.array(z.object({
        name: z.string()
    }))
})

export async function ollamaTags(src: string): Promise<string[]> {
    let res = await axios.get(src + '/api/tags');
    let parsed = tagsSchema.parse(res.data);
    return parsed.models.map((v) => v.name);
}