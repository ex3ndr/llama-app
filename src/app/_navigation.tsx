import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Welcome } from './Welcome';
import { Theme } from '../styles/Theme';
const Stack = createNativeStackNavigator();

export const Navigation = React.memo((props: { initial: 'welcome' | 'app' }) => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={props.initial === 'welcome' ? 'Welcome' : 'App'} screenOptions={{ contentStyle: { backgroundColor: Theme.background } }}>
                <Stack.Screen
                    name="Welcome"
                    component={Welcome}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
});