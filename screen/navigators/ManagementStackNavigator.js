import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ManagementScreen from '../ManagementScreen';

import ProductListScreen from '../Products/ProductListScreen';
import ProductFormScreen from '../Products/ProductFormScreen';
import ClientListScreen from '../Clients/ClientListScreen';
import ClientFormScreen from '../Clients/ClientFormScreen';
import SupplierListScreen from '../Suppliers/SupplierListScreen';
import SupplierFormScreen from '../Suppliers/SupplierFormScreen';
import ConfigScreen from '../ConfigScreen';
import StorageInfoScreen from '../StorageInfoScreen';
import LogScreen from '../LogsScreen';

const Stack = createNativeStackNavigator();

export default function ManagementStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ManagementMenu" component={ManagementScreen} />

            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="ProductForm" component={ProductFormScreen} />

            <Stack.Screen name="ClientList" component={ClientListScreen} />
            <Stack.Screen name="ClientForm" component={ClientFormScreen} />

            <Stack.Screen name="SupplierList" component={SupplierListScreen} />
            <Stack.Screen name="SupplierForm" component={SupplierFormScreen} />

            <Stack.Screen name="ConfigDefault" component={ConfigScreen} />
            <Stack.Screen name="StorageInfo" component={StorageInfoScreen} />
            <Stack.Screen name="LogHistory" component={LogScreen} />
        </Stack.Navigator>
    );
}