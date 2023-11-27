import * as React from 'react';
import { Image, View } from 'react-native';
import { Text } from '../components/Text';

export const Welcome = React.memo(() => {
    return (
        <View style={{ flexDirection: 'column', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', flexGrow: 1, flexBasis: 0 }}>
            <Image source={require('../../assets/logo.png')} style={{ width: 128, height: 128 }} />
            <Text style={{ fontSize: 36 }}>Llama</Text>
            <Text style={{ fontSize: 18, marginBottom: 64 }}>Research AI app</Text>
            {/* <Button
                title="Open Workspace"
                size="large"
                loading={opening}
                onClick={openTaks}
            /> */}
        </View>
    );
});