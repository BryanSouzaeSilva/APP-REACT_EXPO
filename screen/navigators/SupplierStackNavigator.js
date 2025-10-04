import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SupplierListScreen from '../Suppliers/SupplierListScreen';
import SupplierFormScreen from '../Suppliers/SupplierFormScreen';

const Stack = createNativeStackNavigator();

export default function SupplierStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            
            <Stack.Screen
                name="SupplierList"
                component={SupplierListScreen}
            />

            <Stack.Screen
                name="SupplierForm"
                component={SupplierFormScreen}
            />

        </Stack.Navigator>
    );
}
