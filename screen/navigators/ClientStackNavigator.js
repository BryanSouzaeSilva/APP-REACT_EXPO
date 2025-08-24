import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClientListScreen from '../Clients/ClientListScreen';
import ClientFormScreen from '../Clients/ClientFormScreen';

const Stack = createNativeStackNavigator();

export default function ClientStackNavigator({ clientes, onCadastrarCliente }) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            
            <Stack.Screen
                name="ClientList"
                component={ClientListScreen}
                initialParams={{ clientes: clientes }}
            />

            <Stack.Screen
                name="ClientForm"
                component={ClientFormScreen}
                initialParams={{ onCadastrarCliente: onCadastrarCliente }}
            />

        </Stack.Navigator>
    );
}