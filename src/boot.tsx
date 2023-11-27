import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { loadLibs } from './libs';

export const Boot = React.memo(() => {

    // State
    const [root, setRoot] = React.useState<any>(null);

    // Loading
    React.useEffect(() => {
        (async () => {

            // Load luibs
            await loadLibs();

            // Load component
            // NOTE: We are doing this async to make them loaded only
            //       after some modules are loaded, like Skia.
            //       This greadly simplifies things since you can write
            //       your code as is and avoid weird boilerplate
            let Root = (await import('./app/_root')).Root;
            let root = await Root();
            setRoot(root);
        })();
    }, []);

    // Render loading
    if (!root) {
        return (
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexBasis: 0, flexGrow: 1 }}>
                <ActivityIndicator />
            </View>
        );
    }

    // Render app
    return (
        <View key={'booted'} style={{ flexDirection: 'column', alignItems: 'stretch', flexBasis: 0, flexGrow: 1 }}>
            {root}
        </View>
    );
});