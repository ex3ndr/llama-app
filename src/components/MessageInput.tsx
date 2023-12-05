import * as React from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const MessageInput = React.memo((props: {
    value: string,
    onChangeText: (value: string) => void,
    enabled: boolean,
    generating: boolean,
    onSend: () => void,
    onStop: () => void
}) => {

    // Action
    let actionEnabled = props.enabled && (props.generating || props.value.trim().length > 0);
    const doAction = React.useCallback(() => {
        if (actionEnabled) {
            if (props.generating) {
                props.onStop();
            } else {
                props.onSend();
            }
        }
    }, [props.enabled, props.generating, actionEnabled, props.onStop, props.onSend]);

    return (
        <View
            style={{
                flexGrow: 1, flexBasis: 0,
                backgroundColor: '#F2F2F2',
                borderRadius: 22,
                flexDirection: 'row'
            }}
        >
            <TextInput
                style={{
                    paddingTop: 12,
                    paddingBottom: 14,
                    flexGrow: 1,
                    flexBasis: 0,
                    fontSize: 17,
                    lineHeight: 22,
                    fontWeight: '400',
                    textAlignVertical: 'top',
                    paddingHorizontal: 22
                }}
                placeholder='Message'
                placeholderTextColor="#9D9FA3"
                multiline={true}
                numberOfLines={Platform.OS === 'web' ? Math.min(props.value.split('\n').length, 4) : undefined}
                value={props.value}
                onChangeText={props.onChangeText}
                onSubmitEditing={(Platform.OS === 'web' && actionEnabled && !props.generating) ? props.onSend : undefined}
                blurOnSubmit={Platform.OS === 'web'}
            />
            <Pressable
                style={{
                    width: 44,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 2,
                    marginRight: 2,
                    opacity: props.enabled || props.generating ? 1 : 0.3,
                    alignSelf: 'flex-end'
                }}
                disabled={!actionEnabled}
                onPress={doAction}
            >
                <View style={{ backgroundColor: 'black', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                    {props.generating ? (<Ionicons name="stop" size={18} color="white" style={{ width: 24, height: 24, textAlign: 'center', transform: [{ translateX: 0.5 }, { translateY: 2.5 }] }} />) : (<Ionicons name="arrow-up" size={24} color="white" style={{ width: 24, height: 24, textAlign: 'center' }} />)}
                </View>
            </Pressable>
        </View>
    )
});