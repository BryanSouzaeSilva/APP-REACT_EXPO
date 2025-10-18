import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from '../CartScreen';

const Stack = createStackNavigator();

export default function CartStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}
