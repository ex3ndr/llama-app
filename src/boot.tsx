import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Root } from './app/_root';
import { delay } from './utils/time';

export const Boot = React.memo(() => {

    // State
    const [root, setRoot] = React.useState<any>(null);

    // Loading
    React.useEffect(() => {
        (async () => {
            await delay(5000);
            setRoot(<Root />);
        })();
    }, []);

    // Splash
    const onLayoutRootView = React.useCallback(async () => {
        if (root) {
            await SplashScreen.hideAsync();
        }
    }, [root]);

    // Render loading
    if (!root) {
        return (
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexBasis: 0, flexGrow: 1 }}>
                <ActivityIndicator /> {/* There are no splash on Web */}
            </View>
        );
    }

    // Render app
    return (
        <View key={'booted'} style={{ flexDirection: 'column', alignItems: 'stretch', flexBasis: 0, flexGrow: 1 }} onLayout={onLayoutRootView}>
            {root}
        </View>
    );
});