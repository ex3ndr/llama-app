import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { Theme } from '../styles/Theme';

export type UnicornInstance = {
    openLeft(): void;
    openRight(): void;
};

export const Unicorn = React.memo(React.forwardRef((props: {
    left: React.ReactElement,
    right: React.ReactElement
}, ref: React.ForwardedRef<UnicornInstance>) => {
    const area = useWindowDimensions();
    const isWide = area.width > Theme.breakpoints.wide;
    const [state, setState] = React.useState<'left' | 'right'>('right');
    const onClose = React.useCallback(() => {
        setState('right');
    }, []);
    const onLeft = React.useCallback(() => {
        setState('left');
    }, []);
    React.useImperativeHandle(ref, () => ({
        openLeft() {
            setState('left');
        },
        openRight() {
            setState('right');
        },
    }));

    return (
        <Drawer
            open={state === 'left'}
            onOpen={onLeft}
            onClose={onClose}
            drawerType={isWide ? 'permanent' : 'back'}
            drawerStyle={{ backgroundColor: '#dfdfdf' }}
            renderDrawerContent={() => props.left}
        >
            <View style={{ flexDirection: 'row', flexGrow: 1, flexBasis: 0 }}>
                {isWide && <View style={{ width: 0.5, backgroundColor: Theme.divider, opacity: 0.3 }} />}
                <View style={{ flexGrow: 1, flexBasis: 0 }}>
                    {props.right}
                </View>
            </View>
        </Drawer>
    )
}));