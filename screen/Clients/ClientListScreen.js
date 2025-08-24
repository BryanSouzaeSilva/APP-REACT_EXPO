import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import BotaoPersonalizado from '../../components/botaoPersonalizado';

export default function ClientListScreen({ route, navigation }) {
    const { theme, clientes } = useContext(ThemeContext);
    const styles = getStyles(theme);

    // const { clientes } = route.params;

    const renderItemCliente = ({ item }) => (
        <View style={styles.itemContainer}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemTexto}>CPF: {item.cpf}</Text>
        <Text style={styles.itemTexto}>Email: {item.email}</Text>
        <Text style={styles.itemTexto}>Telefone: {item.telefone}</Text>
        <Text style={styles.itemTexto}>Endereço: {item.endereco}</Text>
        <Text style={styles.itemTexto}>Data de Cadastro: {item.dataCadastro}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Clientes Cadastrados</Text>
            </View>
            <FlatList
                style={styles.list}
                data={clientes}
                renderItem={renderItemCliente}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum cliente cadastrado ainda.</Text>}
            />
            <View style={styles.buttonBottomContainer}>
              <BotaoPersonalizado
                texto="Adicionar novo produto"
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === 'light' ? '#000' : '#fff',
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
    borderWidth: 1,
    borderColor: theme === 'light' ? '#eee' : '#444',
  },
  itemNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme === 'light' ? '#000' : '#fff',
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
  }
});