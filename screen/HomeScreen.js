import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import BotaoPersonalizado from '../components/botaoPersonalizado';

export default function HomeScreen({ navigation, route }) {
  const { theme, produtos, clientes, vendas } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const totalProdutos = produtos.length;
  const totalClientes = clientes.length;
  
  const valorTotalEstoque = produtos.reduce((soma, produto) => {
    return soma + (produto.valor * produto.estoque);
  }, 0);

  if (!produtos || !clientes) {
    return (
      <Text>Carregando...</Text>)
  }

  const dataDeHoje = new Date().toLocaleDateString('pt-BR',
    { day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const formatadorDeMoeda = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.welcomeTitle}>Bem-vindo de volta!</Text>

        <Text style={styles.dateText}>{dataDeHoje}</Text>

        <View style={styles.statsContainer}>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalClientes}</Text>
            <Text style={styles.statLabel}>Clientes Cadastrados</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalProdutos}</Text>
            <Text style={styles.statLabel}>Produtos Diferentes</Text>
          </View>

        </View>

        <View style={styles.fullWidthCard}>
          <Text style={styles.statNumber}>
            {formatadorDeMoeda.format(valorTotalEstoque)}
          </Text>
          <Text style={styles.statLabel}>Valor Total em Estoque</Text>
        </View>

        <Text style={styles.sectionTitle}>Ações Rápidas</Text>

        <View style={styles.actionsContainer}>
          <BotaoPersonalizado
            texto="Cadastrar Produto"
            onPress={() => navigation.navigate('GestaoTab', {screen: 'ProductForm'})}
            style={styles.actionButton}
          />

          <BotaoPersonalizado
            texto="Cadastrar Cliente"
            onPress={() => navigation.navigate('GestaoTab', {screen: 'ClientForm'})}
            style={styles.actionButton}
          />
        </View>

        <View style={styles.actionsContainer}>
          <BotaoPersonalizado
            texto="Lista de Produtos"
            onPress={() => navigation.navigate('GestaoTab', {screen: 'ProductList'})}
            style={styles.actionButton}
          />
          <BotaoPersonalizado
            texto="Lista de Clientes"
            onPress={() => navigation.navigate('GestaoTab', {screen: 'ClientList'})}
            style={styles.actionButton}
          />
        </View>

        <BotaoPersonalizado
            texto="Efetuar Pedido"
            onPress={() => navigation.navigate('GestaoTab', { screen: 'Sales' })}
            style={styles.actionButton}
          />

        <View style={{marginTop: 20}}>
          <Text style={styles.sectionTitle}>Últimas Vendas</Text>

          {vendas.slice(-3).reverse().map((venda) => ( 
              <View key={venda.id} style={styles.historyCard}>
                  <View>
                      <Text style={styles.historyClient}>{venda.clienteNome}</Text>
                      <Text style={styles.historyDate}>{new Date(venda.data).toLocaleDateString()}</Text>
                  </View>
                  <Text style={styles.historyValue}>
                      {formatadorDeMoeda.format(venda.total)}
                  </Text>
              </View>
          ))}

          {vendas.length === 0 && <Text style={{color: 'gray', fontStyle: 'italic'}}>Nenhuma venda registrada.</Text>}

          <View style={{height: 20}} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

{/* <BotaoDeAcao
                    iconName="cart-outline"
                    color={theme === 'light' ? '#28A745' : '#34C759'}
                    onPress={() => handleAddToCart(item)}
                /> */}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#f0f0f0' : '#1C1C1E',
  },
  content: {
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme === 'light' ? '#000' : '#fff',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
    borderRadius: 8,
    padding: 20,
    width: '48%',
    alignItems: 'center',
  },
  fullWidthCard: {
    backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === 'light' ? '#007AFF' : '#039BE5',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme === 'light' ? '#000' : '#fff',
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  historyCard: {
    backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#28A745'
  },
  historyClient: {
    fontWeight: 'bold',
    fontSize: 16,
    color: theme === 'light' ? '#000' : '#fff',
  },
  historyDate: {
    fontSize: 12,
    color: 'gray',
  },
  historyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28A745',
  },
});