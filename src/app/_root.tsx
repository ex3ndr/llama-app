import * as React from 'react';
import { Navigation } from './_navigation';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { readEndpoint } from '../storage/storage';
import { loadState } from '../storage/State';

export async function Root(): Promise<React.JSX.Element> {

    // If configured
    if (readEndpoint()) {
        await loadState();
        return (
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <Navigation initial='app' />
            </SafeAreaProvider>
        );
    };

    // If not
    return (
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <Navigation initial='welcome' />
        </SafeAreaProvider>
    );
};