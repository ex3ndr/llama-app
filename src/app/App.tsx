import * as React from 'react';
import { useAppState } from '../storage/State';
import { RoundButton } from '../components/RoundButton';
import { FlatList, Image, Platform, View, useWindowDimensions } from 'react-native';
import { KeyboarAvoidingContent } from '../components/KeyboardAvoidingContent';
import { useNavigation } from '../utils/useNavigation';
import { Text } from '../components/Text';
import LottieView from 'lottie-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Drawer } from 'react-native-drawer-layout';
import { Theme } from '../styles/Theme';
import { MessageInput } from '../components/MessageInput';


const MessageComponent = React.memo((props: { text: string, sender: 'user' | 'assistant', generating: boolean }) => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', alignItems: 'stretch', flexGrow: 1, flexBasis: 0, maxWidth: 900 }}>
                <View style={{ paddingLeft: 24, paddingRight: 24, flexDirection: 'row', paddingVertical: 4 }}>
                    <Image
                        style={{ width: 24, height: 24 }}
                        source={props.sender === 'user' ? require('../../assets/avatar_user.png') : require('../../assets/avatar_assistant.png')}
                    />
                    <View style={{ flexDirection: 'column', marginLeft: 8, flexGrow: 1, flexBasis: 0 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', height: 24 }}>{props.sender == 'user' ? 'You' : 'Assistant'}</Text>
                        <Text style={{ fontSize: 16 }}>
                            {props.text.trim()}
                            {'\u00A0'}
                            <View style={{ width: 24, height: 13!, justifyContent: 'center', alignItems: 'center' }}>
                                {props.generating && (
                                    <LottieView
                                        style={{ width: 32!, height: 34 }}
                                        autoPlay={true}
                                        loop={true}
                                        source={require('../../assets/typing.json')}
                                    />
                                )}
                            </View>
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
});

const EmptyComponent = React.memo(() => {
    const navigation = useNavigation();
    const state = useAppState();
    return (
        <View style={{ flexGrow: 1, flexBasis: 0, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>
                <Image source={require('../../assets/logo.png')} style={{ width: 48, height: 48 }} />
                <Text style={{ fontSize: 18, fontWeight: '500', opacity: 0.4, marginBottom: 16 }}>Who would help you today?</Text>
            </View>
            <RoundButton
                title={state.lastModel ? state.lastModel : 'Pick model'}
                display='default'
                size='normal'
                loading={state.models === null} disabled={!!state.chat || state.models === null || state.models.length === 0}
                onPress={() => navigation.navigate('PickModel', { models: state.models! })}
            />
        </View>
    );
});

const Sidebar = React.memo(() => {
    const state = useAppState();
    return (
        <View style={{ flexGrow: 1, backgroundColor: '#dfdfdf' }}>

        </View>
    );
});

export const App = React.memo(() => {
    const state = useAppState();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const area = useWindowDimensions();
    const [message, setMessage] = React.useState('');
    const doSend = () => {
        let m = message.trim();
        if (m.length > 0 && state.lastModel) {
            state.sendMessage(m);
            setMessage('');
        }
    }
    const isWide = area.width > 800;
    const [open, setOpen] = React.useState(false);

    return (
        <Drawer
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            drawerType={isWide ? 'permanent' : 'back'}
            drawerStyle={{ backgroundColor: '#dfdfdf' }}
            renderDrawerContent={() => {
                return (
                    <Sidebar />
                );
            }}
        >
            <View style={{ backgroundColor: Theme.background, flexGrow: 1, flexBasis: 0 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'column', alignItems: 'stretch', flexGrow: 1, flexBasis: 0, maxWidth: 900, height: 48, backgroundColor: 'white' }}>

                    </View>
                </View>
                <KeyboarAvoidingContent>

                    {!!state.chat && (
                        <FlatList
                            data={state.chat ? [...state.chat.messages].reverse() : []}
                            renderItem={(item) => (<MessageComponent text={item.item.content.value} sender={item.item.sender} generating={item.item.content.generating ? true : false} />)}
                            style={{ flexGrow: 1, flexBasis: 0 }}
                            contentContainerStyle={{ paddingTop: 32, paddingBottom: 64 }}
                            inverted={true}
                        />
                    )}
                    {!state.chat && <EmptyComponent />}

                    {!!state.lastModel && (
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column', alignItems: 'stretch', flexGrow: 1, flexBasis: 0, maxWidth: 900 }}>
                                <View style={{ marginBottom: 8, marginHorizontal: 16, flexGrow: 0, flexDirection: 'row', gap: 16 }}>
                                    <MessageInput value={message} onChangeText={setMessage} onSend={doSend} enabled={message.trim().length > 0 && !!state.lastModel} />
                                </View>
                                {Platform.OS === 'web' && (
                                    <View style={{ height: 32 }} />
                                )}
                            </View>
                        </View>
                    )}
                </KeyboarAvoidingContent>
            </View>
        </Drawer>
    );
});