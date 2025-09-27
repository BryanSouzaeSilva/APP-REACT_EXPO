import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ConfigScreen from '../ConfigScreen';
import StorageInfoScreen from '../StorageInfoScreen';
import LogScreen from '../LogsScreen';

const Stack = createNativeStackNavigator();

export default function ConfigStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="ConfigDefault"
                component={ConfigScreen}
            />
            <Stack.Screen
                name="StorageInfo"
                component={StorageInfoScreen}
            />
            <Stack.Screen
                name="LogHistory"
                component={LogScreen}
            />
        </Stack.Navigator>
    );
}