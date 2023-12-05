import * as React from 'react';
import { useAppState } from '../storage/State';
import { RoundButton } from '../components/RoundButton';
import { FlatList, Image, Platform, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { KeyboarAvoidingContent } from '../components/KeyboardAvoidingContent';
import { Text } from '../components/Text';
import { Theme } from '../styles/Theme';
import { MessageInput } from '../components/MessageInput';
import { Unicorn, UnicornInstance } from '../components/Unicorn';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { showModal } from '../components/showModal';
import { PickModel } from './PickModel';
import { ModalHeader } from '../components/ModalHeader';
import { FlashList } from '@shopify/flash-list';
import { Typing } from '../components/Typing';
import { AIAvatar } from '../components/AIAvatar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MessageComponent = React.memo((props: { text: string, sender: 'user' | 'assistant', generating: boolean, model: string }) => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', alignItems: 'stretch', flexGrow: 1, flexBasis: 0, maxWidth: 900 }}>
                <View style={{ paddingLeft: 24, paddingRight: 24, flexDirection: 'row', paddingVertical: 4 }}>
                    {props.sender === 'user' ? (
                        <Image
                            style={{ width: 24, height: 24 }}
                            source={require('../../assets/avatar_user.png')}
                        />
                    ) : (
                        <AIAvatar size={24} model={props.model} />
                    )}
                    <View style={{ flexDirection: 'column', marginLeft: 8, flexGrow: 1, flexBasis: 0 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', height: 24 }}>{props.sender == 'user' ? 'You' : 'Assistant'}</Text>
                        <Text style={{ fontSize: 16, lineHeight: 22 }} selectable={true}>
                            {props.text.trim()}
                            {!!props.generating && <Typing />}
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

const Sidebar = React.memo((props: { unicorn: React.RefObject<UnicornInstance> }) => {
    const state = useAppState();
    const safeArea = useSafeAreaInsets();
    const doOpenSettings = () => {
        showModal(<ChatModal />);
    }
    const doOpenRight = () => {
        props.unicorn.current?.openRight();
    }
    const doOpenChat = (id: string) => {
        state.openChat(id);
        props.unicorn.current?.openRight();
    }
    const doOpenNew = () => {
        state.newChat();
        props.unicorn.current?.openRight();
    }
    return (
        <View style={{ flexGrow: 1, backgroundColor: Theme.background }}>
            <Header
                left={<Pressable style={{ height: 48, width: 48, justifyContent: 'center', alignItems: 'center' }} onPress={doOpenSettings}>
                    <Ionicons name="cog" size={24} color={Theme.text} />
                </Pressable>}
                right={<Pressable style={{ height: 48, width: 48, justifyContent: 'center', alignItems: 'center' }} onPress={doOpenRight}>
                    <Ionicons name="caret-forward" size={24} color={Theme.text} />
                </Pressable>}
            >
                <Text style={{ color: Theme.text, fontSize: 16, fontWeight: '600', alignSelf: 'center' }}>Chats</Text>
            </Header>
            <ScrollView style={{ flexGrow: 1, flexBasis: 0 }} contentContainerStyle={{ paddingBottom: safeArea.bottom + 128 }}>
                {state.dialogs.map((v) => (
                    <Pressable key={v.id} style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }} onPress={() => doOpenChat(v.id)}>
                        <View style={{ width: 48, height: 48, marginRight: 16 }}>
                            <AIAvatar size={48} model={v.model} />
                        </View>
                        <View style={{ flexGrow: 1, flexBasis: 0 }}>
                            <Text style={{ fontSize: 18, fontWeight: '500' }} numberOfLines={1}>{v.title}</Text>
                            <Text style={{ fontSize: 14, opacity: 0.6 }} numberOfLines={1}>{v.model}</Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
            <View style={{ position: 'absolute', bottom: safeArea.bottom, left: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Pressable style={[Theme.shadows[4], { width: 64, height: 64, backgroundColor: 'white', borderRadius: 32, marginBottom: 32, justifyContent: 'center', alignItems: 'center' }]} onPress={doOpenNew}>
                    <Ionicons name="add" size={48} color={Theme.text} style={{ transform: [{ translateX: 2.5 }, { translateY: 0.5 }] }} />
                </Pressable>
            </View>
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
    const doStop = () => {
        state.stopInference();
    }

    // Chat list
    const left = <Sidebar unicorn={ref} />;

    let avatar: React.ReactNode | undefined = undefined;
    if (state.chat || state.lastModel) {
        avatar = (
            <View style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }}>
                <AIAvatar size={24} model={state.chat ? state.chat.model : state.lastModel!} />
            </View>
        );
    }

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
                right={avatar}
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
                {!!state.chat && (Platform.OS === 'web' ? (
                    <FlatList
                        key={state.chat.id}
                        data={[...state.chat.messages].reverse()}
                        renderItem={(item) => (<MessageComponent text={item.item.content.value} sender={item.item.sender} generating={item.item.content.generating ? true : false} model={state.chat!.model} />)}
                        contentContainerStyle={{ paddingTop: 64, paddingBottom: 32, flexDirection: 'column-reverse' }}
                        style={{ flexDirection: 'column-reverse' }}
                    />
                ) : (
                    <FlashList
                        key={state.chat.id}
                        data={[...state.chat.messages].reverse()}
                        renderItem={(item) => (<MessageComponent text={item.item.content.value} sender={item.item.sender} generating={item.item.content.generating ? true : false} model={state.chat!.model} />)}
                        contentContainerStyle={{ paddingTop: 32, paddingBottom: 64 }}
                        inverted={true}
                        estimatedItemSize={74}
                    />
                ))}
                {!state.chat && <EmptyComponent />}

                {!!state.lastModel && (
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column', alignItems: 'stretch', flexGrow: 1, flexBasis: 0, maxWidth: 900 }}>
                            <View style={{ marginBottom: 8, marginHorizontal: 16, flexGrow: 0, flexDirection: 'row', gap: 16 }}>
                                <MessageInput
                                    value={message}
                                    onChangeText={setMessage}
                                    onSend={doSend}
                                    onStop={doStop}
                                    generating={state.chat && state.chat.state === 'inference' ? true : false}
                                    enabled={!!state.lastModel}
                                />
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