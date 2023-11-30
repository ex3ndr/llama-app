import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Welcome } from './Welcome';
import { Theme } from '../styles/Theme';
import { Connect } from './Connect';
import { App } from './App';
import { PickModel } from './PickModel';

export type RootStackParamList = {
    Welcome: undefined;
    App: undefined;
    Connect: undefined;
    PickModel: { models: string[] }
};

const Stack = createNativeStackNavigator<RootStackParamList>();


export const Navigation = React.memo((props: { initial: 'welcome' | 'app' }) => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={props.initial === 'welcome' ? 'Welcome' : 'App'}
                screenOptions={{
                    headerTintColor: Theme.accent,
                    navigationBarColor: Theme.background,
                    headerShadowVisible: false,
                    contentStyle: { backgroundColor: Theme.background },
                    title: 'Worklet'
                }}
            >
                <Stack.Screen
                    name="App"
                    component={App}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Welcome"
                    component={Welcome}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Connect"
                    component={Connect}
                    options={{ title: 'Connect to Ollama' }}
                />
                <Stack.Screen
                    name="PickModel"
                    component={PickModel}
                    options={{ title: 'Pick Model', presentation: 'formSheet' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
});