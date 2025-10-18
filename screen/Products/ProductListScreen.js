import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BotaoPersonalizado from '../../components/botaoPersonalizado';
import BotaoDeAcao from '../../components/botaoAcao';

export default function ProductListScreen({ navigation }) {
    const { theme, produtos, handleDeletarProduto } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const formatadorDeMoeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    const handleDelete = (id, nome) => {
        Alert.alert(
            "Confirmar Exclusão",
            `Você tem certeza que deseja excluir o produto "${nome}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", onPress: () => handleDeletarProduto(id), style: 'destructive' }
            ]
        );
    };

    const handleEdit = (produtoId) => {
        navigation.navigate('ProductForm', { produtoId });
    };

    const renderItemProduto = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.infoContainer}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.itemTexto}>Data de Cadastro: {item.dataCadastro}</Text>
                <Text style={styles.itemTexto}>Valor: {formatadorDeMoeda.format(item.valor)}</Text>
                <Text style={styles.itemTexto}>Estoque: {item.estoque}</Text>
                <Text style={styles.itemTexto}>Descrição: {item.descricao}</Text>
            </View>

            <View style={styles.actionsContainer}>
                {/* 4. Conectar as funções aos botões */}
                <BotaoDeAcao 
                    iconName="pencil-outline"
                    color={theme === 'light' ? '#007AFF' : '#0A84FF'}
                    onPress={() => handleEdit(item.id)}
                />
                <BotaoDeAcao 
                    iconName="trash-outline"
                    color={theme === 'light' ? '#DC3545' : '#FF453A'}
                    onPress={() => handleDelete(item.id, item.nome)}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
            <View style={styles.header}>
                <Text style={styles.title}>Produtos</Text>
            </View>
            <FlatList
                style={styles.list}
                data={produtos}
                renderItem={renderItemProduto}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto cadastrado ainda</Text>}
            />
            <View style={styles.buttonBottomContainer}>
                <BotaoPersonalizado
                    texto="Adicionar novo produto"
                    onPress={() => navigation.navigate('ProductForm')}
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
        flex: 1,
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
    infoContainer: {
        flex: 1,
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
        paddingVertical: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
});