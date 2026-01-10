import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import BotaoPersonalizado from '../components/botaoPersonalizado';

export default function HomeScreen({ navigation, route }) {
  const { theme, produtos, clientes, vendas } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [modalvisible, setModalVisible] = useState(false);
  const [vendaSelecionada, setVendaSelecionada] = useState(null);

  const totalProdutos = produtos.length;
  const totalClientes = clientes.length;
  
  const valorTotalEstoque = produtos.reduce((soma, produto) => {
    return soma + (produto.valor * produto.estoque);
  }, 0);

  const handleAbrirDetalhes = (venda) => {
    setVendaSelecionada(venda);
    setModalVisible(true);
  }

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
              <TouchableOpacity
                key={venda.id}
                style={styles.historyCard}
                onPress={() => handleAbrirDetalhes(venda)}
              >
                  <View>
                      <Text style={styles.historyClient}>{venda.clienteNome}</Text>
                      <Text style={styles.historyDate}>{new Date(venda.data).toLocaleDateString()}</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.historyValue}>
                        {formatadorDeMoeda.format(venda.total)}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color="gray" style={{marginLeft: 10}} />
                  </View>
              </TouchableOpacity>
          ))}

          {vendas.length === 0 && <Text style={{color: 'gray', fontStyle: 'italic'}}>Nenhuma venda registrada.</Text>}

          <View style={{height: 20}} />
        </View>

      </ScrollView>

          <Modal visible={modalvisible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {vendaSelecionada && (
                  <>

                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Detalhes da Venda</Text>
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Ionicons name="close-circle" size={28} color={theme === 'light' ? '#000' : '#fff'}/>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Cliente:</Text>
                      <Text style={styles.value}>{vendaSelecionada.clienteNome}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Data:</Text>
                      <Text style={styles.value}>{new Date(vendaSelecionada.data).toLocaleString()}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Forma de Pagamento:</Text>
                      <Text style={styles.value}>{vendaSelecionada.pagamento || 'Não Informado'}</Text>
                    </View>

                    <Text style={[styles.sectionTitle, {marginTop: 15, fontSize: 16}]}>Itens Comprados:</Text>
                    
                    <FlatList 
                      data={vendaSelecionada.itens}
                      keyExtractor={(item, index) => index.toString()}
                      style={{maxWeight: 200, marginVertical: 10}}
                      renderItem={({item}) => (
                        <View style={styles.infoRow}>
                          <Text style={styles.itemText}>
                            <Text style={{fontWeight: 'bold'}}>{item.quantity}x </Text>
                            {item.nome}
                          </Text>
                          <Text style={styles.itemPrice}>
                            {formatadorDeMoeda.format(item.valor * item.quantity)}
                          </Text>
                        </View>
                      )}
                    />

                    <View style={styles.totalContainer}>
                      <Text style={styles.totalLabel}>Total da Venda:</Text>
                      <Text style={styles.totalValue}>{formatadorDeMoeda.format(vendaSelecionada.total)}</Text>
                    </View>

                    <BotaoPersonalizado 
                      texto="Fechar"
                      onPress={() => setModalVisible(false)}
                      style={{marginTop: 15, width: '100%'}}
                    />

                  </>
                )}
              </View>

            </View>
          </Modal>

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
  modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
      width: '90%',
      backgroundColor: theme === 'light' ? '#fff' : '#1C1C1E',
      borderRadius: 12,
      padding: 20,
      maxHeight: '80%', // Limita altura para não estourar a tela
  },
  modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'light' ? '#eee' : '#333',
      paddingBottom: 10,
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme === 'light' ? '#000' : '#fff',
  },
  infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
  },
  label: {
      fontWeight: 'bold',
      color: theme === 'light' ? '#555' : '#aaa',
  },
  value: {
      color: theme === 'light' ? '#000' : '#fff',
      maxWidth: '70%',
      textAlign: 'right',
  },
  itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'light' ? '#f0f0f0' : '#333',
  },
  itemText: {
      color: theme === 'light' ? '#333' : '#ccc',
      flex: 1,
  },
  itemPrice: {
      color: theme === 'light' ? '#000' : '#fff',
      fontWeight: '600',
  },
  totalContainer: {
      marginTop: 15,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme === 'light' ? '#eee' : '#333',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  totalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme === 'light' ? '#000' : '#fff',
  },
  totalValue: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#28A745',
  },
});