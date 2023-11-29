import * as React from 'react';
import { StyleProp } from 'react-native';
import { LayoutExternalStyleProps } from '../styles/layout';
import LottieView from 'lottie-react-native';

export const Lottie = React.memo((props: { style?: StyleProp<LayoutExternalStyleProps>, source?: any }) => {
    return (
        <LottieView style={props.style} source={props.source} autoPlay={true} />
    )
})