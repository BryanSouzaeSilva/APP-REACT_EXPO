import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemeContext } from './context/ThemeContext';

import ProductStackNavigator from './screen/navigators/ProductStackNavigator';
import ClientStackNavigator from './screen/navigators/ClientStackNavigator';
import ConfigScreen from './screen/ConfigScreen';
import HomeScreen from './screen/HomeScreen';

const Tab = createBottomTabNavigator();

export default function App() {

  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme || 'light');
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    setTheme(colorScheme || 'light');
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const handleCadastrarProduto = (novoProduto) => {
    setProdutos(listaAntiga => [...listaAntiga, novoProduto]);
  };

  const handleCadastrarCliente = (novoCliente) => {
    setClientes(listaAntiga => [...listaAntiga, novoCliente]);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      produtos,
      clientes,
      handleCadastrarProduto,
      handleCadastrarCliente,
    }}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="HomeTab"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'HomeTab') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'ProdutosTab') {
                iconName = focused ? 'cube' : 'cube-outline';
              } else if (route.name === 'ClientesTab') {
                iconName = focused ? 'people' : 'people-outline';
              } else if (route.name === 'ConfiguracaoTab') {
                iconName = focused ? 'settings' : 'settings-outline';
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
            options={{ title: 'Início' }}
          />

          <Tab.Screen 
            name="ProdutosTab"
            component={ProductStackNavigator}
            options={{
              title: 'Produtos',
              unmountOnBlur: true
            }}
          />

          <Tab.Screen 
            name="ClientesTab"
            component={ClientStackNavigator}
            options={{
              title: 'Clientes',
              unmountOnBlur: true
            }}
          />

          <Tab.Screen
            name="ConfiguracaoTab"
            component={ConfigScreen}
            options={{ title: 'Configurações' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}