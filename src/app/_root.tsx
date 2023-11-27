import * as React from 'react';
import { Navigation } from './_navigation';

export async function Root(): Promise<React.JSX.Element> {
    return <Navigation initial='welcome' />;
};