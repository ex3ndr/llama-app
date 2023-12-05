import * as React from 'react';
import { useAppState } from '../storage/State';
import { RoundButton } from '../components/RoundButton';
import { FlatList, Image, Platform, Pressable, View, useWindowDimensions } from 'react-native';
import { KeyboarAvoidingContent } from '../components/KeyboardAvoidingContent';
import { Text } from '../components/Text';
import LottieView from 'lottie-react-native';
import { Theme } from '../styles/Theme';
import { MessageInput } from '../components/MessageInput';
import { Unicorn, UnicornInstance } from '../components/Unicorn';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { showModal } from '../components/showModal';
import { PickModel } from './PickModel';
import { ModalHeader } from '../components/ModalHeader';

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
                            <Text selectable={true}>
                                {props.text.trim()}
                            </Text>
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
                onPress={() => showModal(<PickModel />)}
            />
        </View>
    );
});

const Sidebar = React.memo(() => {
    const state = useAppState();
    return (
        <View style={{ flexGrow: 1, backgroundColor: Theme.background }}>
            <Header>
                <Text style={{ color: Theme.text, fontSize: 16, fontWeight: '600', alignSelf: 'center' }}>Chats</Text>
            </Header>
        </View>
    );
});

const ChatModal = React.memo(() => {
    return (
        <>
            <ModalHeader title='Settings' />
        </>
    );
});

export const App = React.memo(() => {
    const state = useAppState();
    const [message, setMessage] = React.useState('');
    const ref = React.useRef<UnicornInstance>(null);
    const area = useWindowDimensions();
    const isWide = area.width > Theme.breakpoints.wide;
    const doSend = () => {
        let m = message.trim();
        if (m.length > 0 && state.lastModel) {
            state.sendMessage(m);
            setMessage('');
        }
    }

    // Chat list
    const left = <Sidebar />;

    // Chat
    const center = (
        <View style={{ backgroundColor: Theme.background, flexGrow: 1, flexBasis: 0 }}>
            <Header
                left={
                    !isWide ? (
                        <Pressable style={{ height: 48, width: 48, justifyContent: 'center', alignItems: 'center' }} onPress={() => ref.current?.openLeft()}>
                            <Ionicons name="caret-back" size={24} color={Theme.text} />
                        </Pressable>) : undefined
                }
                right={
                    !!state.chat ?
                        (<Pressable style={{ height: 48, width: 48, justifyContent: 'center', alignItems: 'center' }} onPress={() => showModal(<ChatModal />)}>
                            <Ionicons name="cog" size={24} color={Theme.text} />
                        </Pressable>) : undefined
                }
            >
                {!!state.chat && (
                    <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={{ color: Theme.text, fontSize: 16, fontWeight: '600', alignSelf: 'center' }}>
                            {state.chat.model.split(':')[0]}
                        </Text>
                        <Text style={{ color: Theme.text, fontSize: 14, fontWeight: '400', alignSelf: 'center', opacity: 0.6 }}>
                            {state.chat.model.split(':')[1]}
                        </Text>
                    </View>
                )}
            </Header>
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
        </View >
    );

    return (
        <Unicorn ref={ref} left={left} right={center} />
    );
});