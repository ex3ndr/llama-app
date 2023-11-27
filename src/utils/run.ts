export function run<T>(src: () => Promise<T>): Promise<T> {
    return src();
}