import * as React from 'react';
import { Alert, View } from 'react-native';
import { Input } from '../components/Input';
import { Text } from '../components/Text';
import { RoundButton } from '../components/RoundButton';
import { KeyboarAvoidingContent } from '../components/KeyboardAvoidingContent';
import { ShakeInstance, Shaker } from '../components/Shaker';
import * as Haptics from 'expo-haptics';
import { run } from '../utils/run';
import { ollamaVerify } from '../api/ollamaVerify';
import { writeEndpoint } from '../storage/storage';
import { loadState } from '../storage/State';
import { useNavigation } from '../utils/useNavigation';
import { StackActions } from '@react-navigation/native';
import { Box } from '../components/Box';

export const Connect = React.memo(() => {
    const [url, setUrl] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const linkShakerRef = React.useRef<ShakeInstance>(null);
    const navigation = useNavigation();
    const doConnect = () => {
        if (loading) {
            return;
        }

        // Normalize url
        let normalized = url.trim();
        if (normalized.endsWith('/')) {
            normalized = normalized.substring(0, normalized.length - 1);
        }

        // Check if not empty
        if (normalized.length === 0) {
            linkShakerRef.current?.shake();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        // Check server
        run(async () => {
            setLoading(true);
            try {
                // Check endpoint
                if (!await ollamaVerify(normalized)) {
                    Alert.alert('Invalid server', 'Unable to connect or server is not Ollama instance');
                }

                // Persist endpoint
                writeEndpoint(normalized);

                // Load state
                await loadState();

                // Navigate
                navigation.dispatch(StackActions.popToTop());
                navigation.dispatch(StackActions.replace('App'));
            } finally {
                setLoading(false);
            }
        });
    };

    return (
        <KeyboarAvoidingContent>
            <Box style={{ flexGrow: 1, flexBasis: 0, flexDirection: 'column', justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 8, alignItems: 'stretch' }} maxWidth={500}>
                <View style={{ flexGrow: 1 }} />
                <View>
                    <Text style={{ fontSize: 24, marginBottom: 24 }}>Endpoint of Ollama server</Text>
                    <Shaker ref={linkShakerRef}>
                        <Input
                            placeholder='Ollama link'
                            textContentType='URL'
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={url}
                            onValueChange={setUrl}
                            editable={!loading}
                        />
                    </Shaker>
                </View>
                <View style={{ flexGrow: 1 }} />
                <RoundButton title='Connect' loading={loading} onPress={doConnect} />
            </Box>
        </KeyboarAvoidingContent>
    );
});