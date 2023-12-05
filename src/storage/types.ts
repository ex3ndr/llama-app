export interface Message {
    sender: 'assistant' | 'user'
    content: {
        kind: 'text',
        value: string,
        generating?: boolean
    }
}

export interface Dialog {
    id: string,
    model: string,
    title: string
}