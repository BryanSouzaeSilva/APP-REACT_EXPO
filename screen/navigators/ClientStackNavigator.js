import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClientListScreen from '../Clients/ClientListScreen';
import ClientFormScreen from '../Clients/ClientFormScreen';

const Stack = createNativeStackNavigator();

export default function ClientStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            
            <Stack.Screen
                name="ClientList"
                component={ClientListScreen}
            />

            <Stack.Screen
                name="ClientForm"
                component={ClientFormScreen}
            />

        </Stack.Navigator>
    );
}