import * as React from 'react';
import { useAppState } from '../storage/State';
import { RoundButton } from '../components/RoundButton';
import { View } from 'react-native';
import { Input } from '../components/Input';
import { KeyboarAvoidingContent } from '../components/KeyboardAvoidingContent';
import { useNavigation } from '../utils/useNavigation';

export const App = React.memo(() => {
    const state = useAppState();
    const navigation = useNavigation();

    return (
        <KeyboarAvoidingContent>
            <View style={{ paddingHorizontal: 16 }}>
                <RoundButton
                    title={state.lastModel ? state.lastModel : 'Pick model'}
                    display='default'
                    size='normal'
                    loading={state.models === null} disabled={state.models === null || state.models.length === 0}
                    onPress={() => navigation.navigate('PickModel', { models: state.models! })}
                />
            </View>
            <View style={{ flexGrow: 1, flexBasis: 0 }}>

            </View>
            <View style={{ marginBottom: 8, marginHorizontal: 16 }}>
                <Input placeholder='Message' />
            </View>
        </KeyboarAvoidingContent>
    );
});