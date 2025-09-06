import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductListScreen from '../Products/ProductListScreen';
import ProductFormScreen from '../Products/ProductFormScreen';

const Stack = createNativeStackNavigator();

export default function ProductStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen
                name="ProductList"
                component={ProductListScreen}
            />

            <Stack.Screen
                name="ProductForm"
                component={ProductFormScreen}
            />
            
        </Stack.Navigator>
    );
}