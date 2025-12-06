import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SalesScreen from '../SalesScreen';

const Stack = createNativeStackNavigator();

export default function SalesStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Sales" component={SalesScreen} />
        </Stack.Navigator>
    );
}