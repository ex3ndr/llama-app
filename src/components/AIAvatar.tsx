import * as React from 'react';
import { Image, View } from 'react-native';
import { BoringAvatar } from './avatar/BoringAvatar';

const knownAvatars: { [key: string]: any } = {

    // Mistral
    'mistral': require('../../assets/logo_mistral.png'),
    'openhermes2.5-mistral': require('../../assets/logo_openhermes.png'),

    // Deepseek
    'deepseek-coder': require('../../assets/logo_deepseek.png'),
    'deepseek-llm': require('../../assets/logo_deepseek.png'),

    // Meta
    'llama2': require('../../assets/logo_meta.png'),
    'codellama': require('../../assets/logo_meta.png')
};

export const AIAvatar = React.memo((props: { size: number, model: string }) => {
    let key = props.model.split(':')[0].toLowerCase();
    let known = knownAvatars[key];
    return (
        <View style={{ width: props.size, height: props.size, borderRadius: props.size / 2, backgroundColor: '#e1e1e1' }}>
            {known ? (
                <Image source={known} style={{ width: props.size, height: props.size, borderRadius: props.size / 2 }} />
            ) : (
                <BoringAvatar size={props.size} name={props.model} colors={['#11644D', '#A0B046', '#F2C94E', '#F78145', '#F24E4E']} />
            )}
        </View>
    )
});