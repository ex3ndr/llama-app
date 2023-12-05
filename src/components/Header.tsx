import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../styles/Theme';

export const Header = React.memo((props: {
    left?: React.ReactElement,
    right?: React.ReactElement,
    children?: any
}) => {

    const safeInsets = useSafeAreaInsets();
    let maxWidth = 900;
    if (props.left) {
        maxWidth -= 48;
    }
    if (props.right) {
        maxWidth -= 48;
    }

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: Theme.background, paddingTop: safeInsets.top, }}>
            {!!props.left && (
                <View style={{ width: 48, height: 48 }}>
                    {props.left}
                </View>
            )}
            <View style={{ flexGrow: 1, flexBasis: 0, justifyContent: 'center', flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', flexGrow: 1, flexBasis: 0, maxWidth, height: 48 }}>
                    {props.children}
                </View>
            </View>
            {!!props.right && (
                <View style={{ width: 48, height: 48 }}>
                    {props.right}
                </View>
            )}
        </View>
    )
});