import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { LayoutExternalStyleProps, LayoutInternalStyleProps, extractExternalLayoutStyle, extractInternalLayoutStyle } from '../styles/layout';

export const Box = React.memo((props: { style?: StyleProp<LayoutExternalStyleProps & LayoutInternalStyleProps>, maxWidth?: number, maxHeight?: number, children: any }) => {

    const external = extractExternalLayoutStyle(props.style);
    const internal = extractInternalLayoutStyle(props.style);

    // Corner case when nothing is specified
    if (props.maxWidth === undefined && props.maxHeight === undefined) {
        return (
            <View style={[{ flexGrow: 1, flexBasis: 0, alignSelf: 'stretch', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }, external, internal]}>
                {props.children}
            </View>
        );
    }


    // Max-width only
    if (props.maxWidth !== undefined && props.maxHeight === undefined) {
        return (
            <View style={[{ flexGrow: 1, flexBasis: 0, alignSelf: 'stretch', alignItems: 'stretch', justifyContent: 'center', flexDirection: 'row' }, external]}>
                <View style={[{ flexGrow: 1, flexBasis: 0, maxWidth: props.maxWidth, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }, internal]}>
                    {props.children}
                </View>
            </View>
        );
    }

    // Max-height only
    if (props.maxWidth === undefined && props.maxHeight !== undefined) {
        return (
            <View style={[{ flexGrow: 1, flexBasis: 0, alignSelf: 'stretch', alignItems: 'stretch', justifyContent: 'center', flexDirection: 'column' }, external]}>
                <View style={[{ flexGrow: 1, flexBasis: 0, maxHeight: props.maxHeight, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }, internal]}>
                    {props.children}
                </View>
            </View>
        );
    }

    return (
        <View style={[{ flexGrow: 1, flexBasis: 0, alignSelf: 'stretch', alignItems: 'stretch', justifyContent: 'center', flexDirection: 'row' }, external]}>
            <View style={{ flexGrow: 1, flexBasis: 0, maxWidth: props.maxWidth, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center' }}>
                <View style={[{ flexGrow: 1, flexBasis: 0, maxHeight: props.maxHeight, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }, internal]}>
                    {props.children}
                </View>
            </View>
        </View>
    );
})