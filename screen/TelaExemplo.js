import React, { useState, useEffect, use } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons/Ionicons';

import { ThemeContext } from './context/ThemeContext';

import ProductStackNavigator from './screen/navigators/ProductStackNavgator';
import ClientStackNavigator from './screen/navigators/ClientStackNavigator';
import ConfigScreen from './screen/ConfigScreen';

import HomeScreen from './screen/HomeScreen';
import SobreScreen from './screen/SobreScreen';

const Tab = createBottomTabNavigator

export default function App(){

  const colorScheme = useColorScheme();

  const [theme, setTheme] = useState(colorScheme || 'light');

  useEffect(() => {
    setTheme(colorScheme || 'light');
  }, [colorScheme]);
  
  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };


  return(
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'ProdutosTab') {
                iconName = focused ? 'cube' : 'cube-outline';
              } else if (route.name === 'ClientesTab') {
                iconName = focused ? 'people' : 'people-outline';
              } else if (route.name === 'ConfiguracaoTab') {
                iconName = focused ? 'settings' : 'settings-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme === 'light' ? '#007AFF' : '#fff',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: theme === 'light' ? '#fff' : '#1C1C1E',
            },
            headerStyle: {
              backgroundColor: theme === 'light' ? '#fff' : '#1C1C1E',
            },
            headerTintColor: theme === 'light' ? '#000' : '#fff',
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Home'}}
          />

          <Tab.Screen
            name="Sobre"
            component={SobreScreen}
            options={{title: 'Sobre'}}
          />

          <Tab.Screen
            name="ProdutosTab"
            component={ProductStackNavigator}
            options={{title: 'Produtos'}}
          />

          <Tab.Screen
            name="ClientesTab"
            component={ClientStackNavigator}
            options={{title: 'Clientes'}}
          />

          <Tab.Screen
            name="ConfiguracaoTab"
            component={ConfigScreen}
            options={{title: 'Configurações'}}
          />

        </Tab.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}