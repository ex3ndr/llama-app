import * as React from 'react';
import { useAppState } from '../storage/State';
import { RoundButton } from '../components/RoundButton';
import { Image, View } from 'react-native';
import { Input } from '../components/Input';
import { KeyboarAvoidingContent } from '../components/KeyboardAvoidingContent';
import { useNavigation } from '../utils/useNavigation';
import { FlashList } from "@shopify/flash-list";
import { Text } from '../components/Text';

const MessageComponent = React.memo((props: { text: string, sender: 'user' | 'assistant' }) => {
    return (
        <View style={{ paddingHorizontal: 16, flexDirection: 'row', paddingVertical: 4 }}>
            <Image
                style={{ width: 24, height: 24 }}
                source={props.sender === 'user' ? require('../../assets/avatar_user.png') : require('../../assets/avatar_assistant.png')}
            />
            <View style={{ flexDirection: 'column', marginLeft: 8, flexGrow: 1, flexBasis: 0 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', height: 24 }}>{props.sender == 'user' ? 'You' : 'Assistant'}</Text>
                <Text style={{ fontSize: 16 }}>{props.text}</Text>
            </View>
        </View>
    )
});

export const App = React.memo(() => {
    const state = useAppState();
    const navigation = useNavigation();
    const [message, setMessage] = React.useState('');
    const doSend = () => {
        let m = message.trim();
        if (m.length > 0 && state.lastModel) {
            state.sendMessage(m);
            setMessage('');
        }
    }

    return (
        <KeyboarAvoidingContent>
            <View style={{ paddingHorizontal: 16 }}>
                <RoundButton
                    title={state.lastModel ? state.lastModel : 'Pick model'}
                    display='default'
                    size='normal'
                    loading={state.models === null} disabled={!!state.chat || state.models === null || state.models.length === 0}
                    onPress={() => navigation.navigate('PickModel', { models: state.models! })}
                />
            </View>
            <FlashList
                data={state.chat ? [...state.chat.messages].reverse() : []}
                renderItem={(item) => (<MessageComponent text={item.item.content.value} sender={item.item.sender} />)}
                style={{ flexGrow: 1, flexBasis: 0 }}
                contentContainerStyle={{ paddingBottom: 16 }}
                inverted={true}
            />
            <View style={{ marginBottom: 8, marginHorizontal: 16, flexDirection: 'row' }}>
                <Input placeholder='Message' style={{ flexGrow: 1, marginRight: 16 }} value={message} onValueChange={setMessage} />
                <RoundButton title='Send' onPress={doSend} />
            </View>
        </KeyboarAvoidingContent>
    );
});