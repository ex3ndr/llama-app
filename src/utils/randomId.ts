import 'react-native-get-random-values';
import * as uuid from 'uuid';

export function randomId() {
    return uuid.v4();
}