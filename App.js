import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeContext } from './context/ThemeContext';

import ProductStackNavigator from './screen/navigators/ProductStackNavigator';
import ClientStackNavigator from './screen/navigators/ClientStackNavigator';
import HomeScreen from './screen/HomeScreen';
import Notificacao from './components/Notificacao';

import ConfigStackNavigator from './screen/navigators/ConfigStackNavigator'; 

const Tab = createBottomTabNavigator();

export default function App() {

  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme || 'light');
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificaion, setNotification] = useState('');
  const notificationTimer = useRef(null);

  const showNotification = (message) => {
    if (notificationTimer.current){
      clearTimeout(notificationTimer.current);
    }
    setNotification(message);
    notificationTimer.current = setTimeout(() => {
      setNotification('');
    }, 3000);
  }

  useEffect(() => {
    const carregarDados = async () => {
      try{
        const produtosSalvos = await AsyncStorage.getItem('@app_produtos');
        if(produtosSalvos !== null){
          setProdutos(JSON.parse(produtosSalvos));
        }
        const clientesSalvos = await AsyncStorage.getItem('@app_clientes');
        if(clientesSalvos !== null){
          setClientes(JSON.parse(clientesSalvos));
        }
      } catch (e) {
        console.error("Erro ao carregar dados do AsyncStorage", e)
      } finally {
        setIsLoading(false)
      }
    };
    carregarDados();
  }, []);

  useEffect(() => {
    if(!isLoading) {
      const salvarProdutos = async () => {
        try {
          const jsonValue = JSON.stringify(produtos);
          await AsyncStorage.setItem('@app_produtos', jsonValue);
        } catch (e) {
          console.error("Erro ao salvar produtos", e);
        }
      }
      salvarProdutos();
    };
  }, [produtos, isLoading]);

  useEffect(() => {
    if(!isLoading) {
      const salvarClientes = async () => {
        try {
          const jsonValue = JSON.stringify(clientes);
          await AsyncStorage.setItem('@app_clientes', jsonValue);
        } catch (e) {
          console.error("Erro ao salvar clientes", e);
        }
      };
      salvarClientes();
    }
  }, [clientes, isLoading]);

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
    <SafeAreaProvider>

      <ThemeContext.Provider value={{
        theme,
        toggleTheme,
        produtos,
        clientes,
        handleCadastrarProduto,
        handleCadastrarCliente,
        showNotification,
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
              component={ConfigStackNavigator} 
              options={{ title: 'Configurações' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <Notificacao message={notificaion}/>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}