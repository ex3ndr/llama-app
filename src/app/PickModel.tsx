import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { useAppState } from '../storage/State';
import { RoundButton } from '../components/RoundButton';
import { useNavigation } from '../utils/useNavigation';

export const PickModel = React.memo(() => {
    const state = useAppState();
    const models = [...state.models!].sort();
    const navigation = useNavigation();

    return (
        <ScrollView>
            {models.map((model) => (
                <View style={{ marginHorizontal: 16, marginVertical: 8 }} key={model}>
                    <RoundButton
                        title={model}
                        size='normal'
                        onPress={() => {
                            state.setLastModel(model);
                            navigation.goBack();
                        }}
                    />
                </View>
            ))}
        </ScrollView>
    );
});