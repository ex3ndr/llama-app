import * as React from 'react';

export function useAsyncTask(task: () => Promise<void>, deps: any[] = []): [boolean, () => void] {
    const [loading, setLoading] = React.useState(false);
    const execute = React.useCallback(() => {
        if (loading) {
            return;
        }
        (async () => {
            setLoading(true);
            try {
                await task();
            } finally {
                setLoading(false);
            }
        })();
    }, [loading, deps]);

    return [loading, execute];
}