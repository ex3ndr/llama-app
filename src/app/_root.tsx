import * as React from 'react';
import { Welcome } from './Welcome';

export const Root = React.memo(() => {
    return <Welcome />;
});