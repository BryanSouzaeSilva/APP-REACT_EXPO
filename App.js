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
import SupplierStackNavigator from './screen/navigators/SupplierStackNavigator';

import HomeScreen from './screen/HomeScreen';
import Notificacao from './components/Notificacao';
import ConfigStackNavigator from './screen/navigators/ConfigStackNavigator';

const Tab = createBottomTabNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme || 'light');
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const notificationTimer = useRef(null);

  const showNotification = (message, type = 'success') => {
    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
    }
    setNotification({ message, type });
    notificationTimer.current = setTimeout(() => {
      setNotification({ message: '', type: 'success' });
    }, 3000);
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const produtosSalvos = await AsyncStorage.getItem('@app_produtos');
        if (produtosSalvos !== null) setProdutos(JSON.parse(produtosSalvos));
        
        const clientesSalvos = await AsyncStorage.getItem('@app_clientes');
        if (clientesSalvos !== null) setClientes(JSON.parse(clientesSalvos));
        
        const fornecedoresSalvos = await AsyncStorage.getItem('@app_fornecedores');
        if (fornecedoresSalvos !== null) setFornecedores(JSON.parse(fornecedoresSalvos));
      } catch (e) {
        console.error("Erro ao carregar dados do AsyncStorage", e);
      } finally {
        setIsLoading(false);
      }
    };
    carregarDados();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const salvarDados = async (key, data) => {
        try {
          const jsonValue = JSON.stringify(data);
          await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
          console.error(`Erro ao salvar ${key}`, e);
        }
      };
      salvarDados('@app_produtos', produtos);
      salvarDados('@app_clientes', clientes);
      salvarDados('@app_fornecedores', fornecedores);
    }
  }, [produtos, clientes, fornecedores, isLoading]);

  useEffect(() => {
    setTheme(colorScheme || 'light');
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const handleCadastrarProduto = (novoProduto) => {
    setProdutos(listaAntiga => [...listaAntiga, novoProduto]);
  };

  const handleEditarProduto = (produtoEditado) => {
    setProdutos(produtosAtuais => produtosAtuais.map(produto =>
      produto.id === produtoEditado.id ? produtoEditado : produto
    ));
  };

  const handleDeletarProduto = (id) => {
    const produto = produtos.find(p => p.id === id);
    if(produto) {
        setProdutos(produtosAtuais => produtosAtuais.filter(p => p.id !== id));
        showNotification(`Produto "${produto.nome}" foi excluído!`, 'delete');
    }
  };

  const handleCadastrarCliente = (novoCliente) => {
    setClientes(listaAntiga => [...listaAntiga, novoCliente]);
  };

  const handleEditarCliente = (clienteEditado) => {
    setClientes(clientesAtuais => clientesAtuais.map(cliente =>
      cliente.id === clienteEditado.id ? clienteEditado : cliente
    ));
  };

  const handleDeletarCliente = (id) => {
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
        setClientes(clientesAtuais => clientesAtuais.filter(c => c.id !== id));
        showNotification(`Cliente "${cliente.nome}" foi excluído!`, 'delete');
    }
  };

  const handleCadastrarFornecedor = (novoFornecedor) => {
    setFornecedores(listaAntiga => [...listaAntiga, novoFornecedor]);
  };
  const handleEditarFornecedor = (fornecedorEditado) => {
    setFornecedores(fornecedoresAtuais => fornecedoresAtuais.map(fornecedor => 
      fornecedor.id === fornecedorEditado.id ? fornecedorEditado : fornecedor
    ));
  };

  const handleDeletarFornecedor = (id) => {
    const fornecedor = fornecedores.find(f => f.id === id);
    if (fornecedor) {
        setFornecedores(fornecedoresAtuais => fornecedoresAtuais.filter(f => f.id !== id));
        showNotification(`Fornecedor "${fornecedor.nomeFantasia}" foi excluído!`, 'delete');
    }
  };

  const addLog = (tipo, dados) => {
    const novoLog = {
      timestamp: new Date().toISOString(),
      tipo: tipo,
      dados: dados,
    };
    setLogs(logsAtuais => [...logsAtuais, novoLog]);
  };

  useEffect(() => {
    if(logs.length > 0) {
      console.log("--- HISTÓRICO DE LOGS ATUALIZADO ---");
      console.log(JSON.stringify(logs[logs.length - 1], null, 2));
      console.log('------------------------------------');
    }
  }, [logs]);

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={{
        theme,
        toggleTheme,
        produtos,
        clientes,
        fornecedores,
        handleCadastrarProduto,
        handleEditarProduto,
        handleDeletarProduto,
        handleCadastrarCliente,
        handleEditarCliente,
        handleDeletarCliente,
        handleCadastrarFornecedor,
        handleEditarFornecedor,
        handleDeletarFornecedor,
        showNotification,
        addLog,
        logs,
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
                } else if (route.name === 'FornecedoresTab') {
                  iconName = focused ? 'business' : 'business-outline';
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
              options={{ title: 'Produtos', unmountOnBlur: true }}
            />

            <Tab.Screen
              name="ClientesTab"
              component={ClientStackNavigator}
              options={{ title: 'Clientes', unmountOnBlur: true }}
            />

            <Tab.Screen
              name="FornecedoresTab"
              component={SupplierStackNavigator}
              options={{ title: 'Fornecedores', unmountOnBlur: true }}
            />

            <Tab.Screen
              name="ConfiguracaoTab"
              component={ConfigStackNavigator}
              options={{ title: 'Configurações' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <Notificacao message={notification.message} type={notification.type} />
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}
