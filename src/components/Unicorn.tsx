import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Theme } from '../styles/Theme';

export type UnicornInstance = {
    openLeft(): void;
    openCenter(): void;
    openRight(): void;
};

export const Unicorn = React.memo(React.forwardRef((props: { left: React.ReactElement, center: React.ReactElement, right: React.ReactElement }, ref: React.ForwardedRef<UnicornInstance>) => {
    const pagerRef = React.useRef<PagerView>(null);
    const area = useWindowDimensions();
    const isWide = area.width > Theme.breakpoints.wide;
    React.useImperativeHandle(ref, () => ({
        openLeft() {
            pagerRef.current?.setPage(0);
        },
        openCenter() {
            pagerRef.current?.setPage(1);
        },
        openRight() {
            pagerRef.current?.setPage(2);
        },
    }));

    return (
        <PagerView
            style={{ backgroundColor: Theme.background, flexGrow: 1 }}
            overScrollMode={'never'}
            overdrag={false}
            initialPage={1}
            keyboardDismissMode={"on-drag"}
            ref={pagerRef}
        >
            <View key={"left"}>
                {props.left}
            </View>
            <View key={"center"}>
                {props.center}
            </View>
            <View key={"right"}>
                {props.right}
            </View>
        </PagerView>
    )
}));