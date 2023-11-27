import { Text as DefaultText } from 'react-native';
import { Theme } from '../styles/Theme';

export function Text(props: DefaultText['props']) {
    const { style, ...otherProps } = props;
    return <DefaultText style={[{ color: Theme.text }, style]} {...otherProps} />;
}