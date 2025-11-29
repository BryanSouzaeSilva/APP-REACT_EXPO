import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

import BotaoPersonalizado from '../../components/botaoPersonalizado';
import BotaoDeAcao from '../../components/botaoAcao';

export default function ClientListScreen({ navigation }) {
    const { theme, clientes, handleDeletarCliente } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const [searchQuery, setSearchQuery] = useState('');

    const clientesFiltrados = clientes.filter(item => {
      const textoBusca = searchQuery.toUpperCase();
      const nome = item.nome ? item.nome.toUpperCase() : '';
      const cpf = item.cpf ? item.cpf.replace(/\D/g, '') : '';

      return nome.includes(textoBusca) || cpf.includes(textoBusca) || item.cpf.includes(textoBusca);
    });

    const handleDelete = (id, nome) => {
      Alert.alert(
        "Confirmar Exclusão",
        `Você tem certeza que deseja excluir o cliente "${nome}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", onPress: () => handleDeletarCliente(id), style: 'destructive' }
        ]
      );
    }

    const handleEdit = (clienteId) => {
      navigation.navigate('ClientForm', { clienteId });
    };

    const renderItemCliente = ({ item }) => (
        <View style={styles.itemContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.itemNome}>{item.nome}</Text>
            <Text style={styles.itemTexto}>CPF: {item.cpf}</Text>
            <Text style={styles.itemTexto}>Email: {item.email}</Text>
            <Text style={styles.itemTexto}>Telefone: {item.telefone}</Text>
            <Text style={styles.itemTexto}>Endereço: {item.endereco}</Text>
            <Text style={styles.itemTexto}>Data de Cadastro: {item.dataCadastro}</Text>
          </View>

            <View style={styles.actionsContainer}>
                <BotaoDeAcao
                    iconName="pencil"
                    color={theme === 'light' ? '#007AFF' : '#0A84FF'}
                    onPress={() => handleEdit(item.id)}
                />
                <BotaoDeAcao
                    iconName="trash-can-outline"
                    color={theme === 'light' ? '#DC3545' : '#FF453A'}
                    onPress={() => handleDelete(item.id, item.nome)}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
            <View style={styles.header}>
                <Text style={styles.title}>Clientes Cadastrados</Text>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={theme === 'light' ? '#666' : '#aaa'} style={{marginRight: 8}} />
              <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar clientes por nome ou CPF..."
                  placeholderTextColor={theme === 'light' ? '#888' : '#aaa'}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                    <Ionicons 
                        name="close-circle" 
                        size={20} 
                        color={theme === 'light' ? '#666' : '#aaa'} 
                        onPress={() => setSearchQuery('')}
                    />
                )}
            </View>

            <FlatList
                style={styles.list}
                data={clientesFiltrados}
                renderItem={renderItemCliente}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum cliente cadastrado ainda.</Text>}
            />
            <View style={styles.buttonBottomContainer}>
              <BotaoPersonalizado
                texto="Adicionar novo cliente"
                onPress={() => navigation.navigate('ClientForm')}
              />
            </View>
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#f0f0f0' : '#1C1C1E',
  },
  header: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === 'light' ? '#000' : '#fff',
  },
  searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      alignSelf: 'center',
      backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
      borderRadius: 8,
      paddingHorizontal: 10,
      height: 45,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme === 'light' ? '#ddd' : '#444',
  },
  searchInput: {
      flex: 1,
      color: theme === 'light' ? '#000' : '#fff',
      fontSize: 16,
  },
  list: {
    width: '90%',
    alignSelf: 'center',
  },
  itemContainer: {
    backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme === 'light' ? '#000' : '#fff',
  },
  infoContainer: {
    flex: 1,
  },
  itemTexto: {
    fontSize: 14,
    color: theme === 'light' ? '#333' : '#ccc',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
  buttonBottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});