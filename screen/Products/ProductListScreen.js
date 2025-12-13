import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { ThemeContext } from '../../context/ThemeContext';
import { View, Text, StyleSheet, FlatList, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BotaoPersonalizado from '../../components/botaoPersonalizado';
import BotaoDeAcao from '../../components/botaoAcao';
import HeaderPersonalizado from '../../components/headerPersonalizado';
import { Ionicons } from '@expo/vector-icons';

export default function ProductListScreen({ navigation }) {
    const { theme, produtos, handleDeletarProduto, showNotification } = useContext(ThemeContext);
    const { addToCart } = useContext(CartContext);
    const styles = getStyles(theme);

    const [searchQuery, setSearchQuery] = useState('');

    const formatadorDeMoeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    const produtosFiltrados = produtos.filter(item => {
        const itemNome = item.nome ? item.nome.toUpperCase() : '';
        const textoBusca = searchQuery.toUpperCase();

        return itemNome.includes(textoBusca);
    })

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

    const handleAddToCart = (produto) => {
        addToCart(produto);
        showNotification(`Produto "${produto.nome}" adicionado ao carrinho.`, 'success');
    }

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
        <SafeAreaView style={styles.container}>
            <HeaderPersonalizado 
                title="Produtos"
                onPressBack={() => navigation.navigate('ManagementMenu')}
            />

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={theme === 'light' ? '#666' : '#aaa'} style={{marginRight: 8}} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar produtos..."
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
                data={produtosFiltrados}
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
        marginTop: 10,
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