import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../context/ThemeContext';
import BotaoPersonalizado from '../../components/botaoPersonalizado';

import BotaoDeAcao from '../../components/botaoAcao';

export default function ClientListScreen({ route, navigation }) {
    const { theme, clientes } = useContext(ThemeContext);
    const styles = getStyles(theme);

    // const { clientes } = route.params;

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
                    onPress={() => console.log('Editar cliente:', item.id)}
                />
                <BotaoDeAcao
                    iconName="trash-outline"
                    color={theme === 'light' ? '#DC3545' : '#FF453A'}
                    onPress={() => console.log('Deletar cliente:', item.id)}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
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
