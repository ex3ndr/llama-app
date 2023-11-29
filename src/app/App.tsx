import * as React from 'react';
import { useAppState } from '../storage/State';
import { RoundButton } from '../components/RoundButton';
import { Image, View, useWindowDimensions } from 'react-native';
import { Input } from '../components/Input';
import { KeyboarAvoidingContent } from '../components/KeyboardAvoidingContent';
import { useNavigation } from '../utils/useNavigation';
import { FlashList } from "@shopify/flash-list";
import { Text } from '../components/Text';
import LottieView from 'lottie-react-native';
import { Box } from '../components/Box';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Drawer } from 'react-native-drawer-layout';
import { Theme } from '../styles/Theme';

const MessageComponent = React.memo((props: { text: string, sender: 'user' | 'assistant', generating: boolean }) => {
    return (
        <View style={{ paddingHorizontal: 16, flexDirection: 'row', paddingVertical: 4 }}>
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
    )
});

const EmptyComponent = React.memo(() => {
    return (
        <View style={{ flexGrow: 1, flexBasis: 0, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '500', opacity: 0.4 }}>No messages</Text>
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
                <KeyboarAvoidingContent>
                    <Box maxWidth={900} style={{ alignItems: 'stretch', paddingBottom: 8, paddingTop: insets.top, flexGrow: 1, flexBasis: 0 }}>
                        <View style={{ paddingHorizontal: 16, height: 48, justifyContent: 'center', alignItems: 'center' }}>
                            <RoundButton
                                title={state.lastModel ? state.lastModel : 'Pick model'}
                                display='default'
                                size='normal'
                                loading={state.models === null} disabled={!!state.chat || state.models === null || state.models.length === 0}
                                onPress={() => navigation.navigate('PickModel', { models: state.models! })}
                            />
                        </View>

                        {!!state.chat && (
                            <FlashList
                                data={state.chat ? [...state.chat.messages].reverse() : []}
                                renderItem={(item) => (<MessageComponent text={item.item.content.value} sender={item.item.sender} generating={item.item.content.generating ? true : false} />)}
                                style={{ flexGrow: 1, flexBasis: 0 }}
                                contentContainerStyle={{ paddingTop: 16 }}
                                inverted={true}
                            />
                        )}
                        {!state.chat && <EmptyComponent />}

                        <View style={{ marginBottom: 8, marginHorizontal: 16, flexDirection: 'row' }}>
                            <Input
                                placeholder='Message'
                                style={{ flexGrow: 1, flexBasis: 0, marginRight: 16, maxHeight: 128 }}
                                multiline={true}
                                value={message}
                                onValueChange={setMessage}
                            />
                            <View style={{ justifyContent: 'flex-end' }}>
                                <RoundButton title='Send' onPress={doSend} />
                            </View>
                        </View>
                    </Box>
                </KeyboarAvoidingContent>
            </View>
        </Drawer>
    );
});