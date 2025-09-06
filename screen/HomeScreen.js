import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import BotaoPersonalizado from '../components/botaoPersonalizado';

export default function HomeScreen({ navigation, route }) {
  const { theme, produtos, clientes } = useContext(ThemeContext);
  const styles = getStyles(theme);
  // const { produtos, clientes } = route.params;

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
            texto="Cadastrar Novo Produto"
            onPress={() => navigation.navigate('ProdutosTab', {screen: 'ProductForm'})}
            style={styles.actionButton}
          />

          <BotaoPersonalizado
            texto="Cadastrar Novo Cliente"
            onPress={() => navigation.navigate('ClientesTab', {screen: 'ClientForm'})}
            style={styles.actionButton}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

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
    justifyContent: 'space-around', // Espaço entre os botões
  },
  actionButton: {
    flex: 1, // Faz os botões ocuparem o mesmo espaço
    marginHorizontal: 5,
  },
});