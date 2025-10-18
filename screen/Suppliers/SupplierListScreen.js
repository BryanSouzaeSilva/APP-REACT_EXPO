import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../context/ThemeContext';
import BotaoPersonalizado from '../../components/botaoPersonalizado';
import BotaoDeAcao from '../../components/botaoAcao';

export default function SupplierListScreen({ navigation }) {
    const { theme, fornecedores, handleDeletarFornecedor } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const handleDelete = (id, nome) => {
        Alert.alert(
            "Confirmar Exclusão",
            `Você tem certeza que deseja excluir o fornecedor "${nome}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", onPress: () => handleDeletarFornecedor(id), style: 'destructive' }
            ]
        );
    };

    const handleEdit = (fornecedorId) => {
        navigation.navigate('SupplierForm', { fornecedorId });
    };

    const renderItemFornecedor = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.infoContainer}>
                <Text style={styles.itemNome}>{item.nomeFantasia}</Text>
                <Text style={styles.itemTexto}>Razão Social: {item.razaoSocial}</Text>
                <Text style={styles.itemTexto}>CNPJ: {item.cnpj}</Text>
                <Text style={styles.itemTexto}>Endereço: {item.endereco}</Text>
                <Text style={styles.itemTexto}>Contato: {item.contato}</Text>
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
                    onPress={() => handleDelete(item.id, item.nomeFantasia)}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
            <View style={styles.header}>
                <Text style={styles.title}>Fornecedores Cadastrados</Text>
            </View>
            <FlatList
                style={styles.list}
                data={fornecedores}
                renderItem={renderItemFornecedor}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum fornecedor cadastrado ainda.</Text>}
            />
            <View style={styles.buttonBottomContainer}>
                <BotaoPersonalizado
                    texto="Adicionar novo fornecedor"
                    onPress={() => navigation.navigate('SupplierForm')}
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