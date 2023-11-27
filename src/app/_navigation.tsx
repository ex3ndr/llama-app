import * as React from 'react';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Welcome } from './Welcome';
import { Theme } from '../styles/Theme';
import { Connect } from './Connect';
import { useNavigation as useNavigationDefault } from '@react-navigation/native';

type RootStackParamList = {
    Welcome: undefined;
    App: undefined;
    Connect: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();


export const Navigation = React.memo((props: { initial: 'welcome' | 'app' }) => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={props.initial === 'welcome' ? 'Welcome' : 'App'} screenOptions={{ contentStyle: { backgroundColor: Theme.background } }}>
                <Stack.Screen
                    name="Welcome"
                    component={Welcome}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Connect"
                    component={Connect}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
});

export function useNavigation() {
    return useNavigationDefault<NavigationProp<RootStackParamList>>();
}