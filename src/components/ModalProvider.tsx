import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ModalContext, ModalController, registerModalController } from './showModal';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const ModalComponent = React.memo(() => {
    const navigation = useNavigation<NavigationProp<any>>();
    return (
        <ModalContext.Provider value={{ close: () => navigation.goBack() }}>
            {(useRoute().params as any).element}
        </ModalContext.Provider>
    );
});

export const ModalProvider = React.memo((props: { children: React.ReactElement }) => {
    const appComponent = React.useMemo(() => () => props.children, []);

    // Create controller
    const navigation = useNavigation<NavigationProp<any>>();
    const controller: ModalController = React.useMemo(() => {
        return ({
            show(element) {
                navigation.navigate('ModalModal', { element });
            },
        });
    }, []);
    React.useEffect(() => { registerModalController(controller); }, []);

    return (
        <Stack.Navigator
            initialRouteName={'ModalApp'}
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen
                name="ModalApp"
                component={appComponent}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ModalModal"
                component={ModalComponent}
                options={{ headerShown: false, presentation: 'formSheet' }}
            />
        </Stack.Navigator>
    );
});