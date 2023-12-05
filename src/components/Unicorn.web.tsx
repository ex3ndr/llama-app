import * as React from 'react';
import { useWindowDimensions } from 'react-native';
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
            open={state === 'left'}
            onOpen={() => setState('left')}
            onClose={() => setState('center')}
            drawerType={isWide ? 'permanent' : 'back'}
            drawerStyle={{ backgroundColor: '#dfdfdf' }}
            renderDrawerContent={() => props.left}
        >
            {props.center}
        </Drawer>
    )
}));