import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from './Text';
import { useModal } from './showModal';
import { Ionicons } from '@expo/vector-icons';

export const ModalHeader = React.memo((props: { title: string }) => {
    const modal = useModal();
    return (
        <View style={{ height: 48, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
            <View style={{ width: 48 }} />
            <Text style={{ fontSize: 20, fontWeight: '600' }}>{props.title}</Text>
            <Pressable style={{ width: 48, justifyContent: 'center', alignItems: 'center' }} onPress={() => modal.close()}>
                <Ionicons name="close" size={24} color="black" />
            </Pressable>
        </View>
    )
});