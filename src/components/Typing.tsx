import * as React from 'react';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';

export const Typing = React.memo(() => {
    return (
        <View style={{ width: 0, height: 0, justifyContent: 'center', alignItems: 'center', transform: [{ translateY: -3 }, { translateX: 10 }] }}>
            <LottieView
                style={{ width: 18!, height: 18 }}
                autoPlay={true}
                loop={true}
                source={require('../../assets/typing.json')}
            />
        </View>
    )
});