import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { Theme } from '../styles/Theme';

export type UnicornInstance = {
    openLeft(): void;
    openCenter(): void;
    openRight(): void;
};

export const Unicorn = React.memo(React.forwardRef((props: {
    left: React.ReactElement,
    center: React.ReactElement,
    right: React.ReactElement
}, ref: React.ForwardedRef<UnicornInstance>) => {
    const area = useWindowDimensions();
    const isWide = area.width > Theme.breakpoints.wide;
    const [state, setState] = React.useState<'left' | 'center' | 'right'>('center');
    const onClose = React.useCallback(() => {
        setState('center');
    }, []);
    const onLeft = React.useCallback(() => {
        setState('left');
    }, []);
    const onRight = React.useCallback(() => {
        setState('right');
    }, []);
    React.useImperativeHandle(ref, () => ({
        openLeft() {
            setState('left');
        },
        openCenter() {
            setState('center');
        },
        openRight() {
            setState('right');
        },
    }));

    return (
        <Drawer
            open={state === 'right'}
            onOpen={onRight}
            onClose={onClose}
            drawerType={'back'}
            drawerPosition='right'
            drawerStyle={{ backgroundColor: '#dfdfdf' }}
            renderDrawerContent={() => props.right}
        >
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
                        {props.center}
                    </View>
                </View>
            </Drawer>
        </Drawer>
    )
}));