import { useNavigation as useNavigationDefault, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../app/_navigation';
export function useNavigation() {
    return useNavigationDefault<NavigationProp<RootStackParamList>>();
}