import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { useAppState } from '../storage/State';
import { RoundButton } from '../components/RoundButton';
import { useModal } from '../components/showModal';
import { ModalHeader } from '../components/ModalHeader';
import { Text } from '../components/Text';

export const PickModel = React.memo(() => {
    const state = useAppState();
    const modal = useModal();
    const models = React.useMemo(() => {
        let res = new Map<string, { versions: string[] }>();
        for (let m of state.models!) {
            let [name, version] = m.split(':');
            let e = res.get(name);
            if (e) {
                e.versions.push(version);
            } else {
                res.set(name, { versions: [version] });
            }
        }
        return res;
    }, [state.models!]);

    return (
        <>
            <ModalHeader title='Pick Model' />
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                {Array.from(models.keys()).map((name) => (
                    <View style={{ marginHorizontal: 16, marginVertical: 8 }} key={name}>
                        <Text style={{ fontSize: 16, paddingBottom: 8, paddingLeft: 4 }}>{name}</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            {models.get(name)!.versions.map((v) => (
                                <RoundButton
                                    title={v}
                                    size='normal'
                                    onPress={() => {
                                        state.setLastModel(name + ':' + v);
                                        modal.close();
                                    }}
                                />
                            ))}
                        </View>

                    </View>
                ))}
            </ScrollView>
        </>
    );
});