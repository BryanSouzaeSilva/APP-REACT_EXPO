import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';

import HomeScreen from './screen/HomeScreen';
import CartStackNavigator from './screen/navigators/CartStackNavigator';
import ManagementStackNavigator from './screen/navigators/ManagementStackNavigator';
import Notificacao from './components/Notificacao';

const Tab = createBottomTabNavigator();

function MainApp() {
  const { theme, notification } = useContext(ThemeContext);

  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="HomeTab"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'HomeTab') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'GestaoTab') {
                iconName = focused ? 'grid' : 'grid-outline';
              } else if (route.name === 'CartTab') {
                iconName = focused ? 'cart' : 'cart-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme === 'light' ? '#007AFF' : '#039BE5',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { backgroundColor: theme === 'light' ? '#fff' : '#1C1C1E' },
            headerStyle: { backgroundColor: theme === 'light' ? '#fff' : '#1C1C1E' },
            headerTintColor: theme === 'light' ? '#000' : '#fff',
          })}
        >
          <Tab.Screen 
            name="HomeTab" 
            component={HomeScreen} 
            options={{ headerShown: false, title: 'Início' }} 
          />
          
          <Tab.Screen 
            name="GestaoTab" 
            component={ManagementStackNavigator} 
            options={{ headerShown: false, title: 'Gestão' }} 
          />
          
          <Tab.Screen 
            name="CartTab" 
            component={CartStackNavigator} 
            options={{ headerShown: false, title: 'Carrinho', unmountOnBlur: true }} 
          />
        </Tab.Navigator>
      </NavigationContainer>

      <Notificacao message={notification.message} type={notification.type} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <CartProvider>
            <MainApp />
        </CartProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}