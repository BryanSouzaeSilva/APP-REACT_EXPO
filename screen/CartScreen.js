import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartContext } from '../../context/CartContext';
import { ThemeContext } from '../../context/ThemeContext';
import BotaoPersonalizado from '../../components/botaoPersonalizado';
import BotaoDeAcao from '../../components/botaoAcao';

export default function CartScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);
    const { cartItems, removeFromCart, clearCart, getTotalPrice } = useContext(CartContext);
    const styles = getStyles(theme);

    const formatadorDeMoeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    const handleRemove = (id) => {
        removeFromCart(id);
    };

    const handleClear = () => {
        Alert.alert(
            "Limpar Carrinho",
            "Você tem certeza que deseja remover todos os itens do carrinho?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Limpar", onPress: () => clearCart(), style: 'destructive' }
            ]
        );
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            Alert.alert("Carrinho Vazio", "Adicione itens ao carrinho antes de continuar.");
            return;
        }
        Alert.alert("Finalizar Compra", "Função de checkout ainda não implementada.");
    };

    const renderItemCarrinho = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.infoContainer}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.itemTexto}>Quantidade: {item.quantity}</Text>
                <Text style={styles.itemTexto}>Valor Unitário: {formatadorDeMoeda.format(item.valor)}</Text>
                <Text style={styles.itemTexto}>Subtotal: {formatadorDeMoeda.format(item.valor * item.quantity)}</Text>
            </View>
            <View style={styles.actionsContainer}>
                <BotaoDeAcao
                    iconName="minus-circle-outline"
                    color={theme === 'light' ? '#DC3545' : '#FF453A'}
                    onPress={() => handleRemove(item.id)}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
            <View style={styles.header}>
                <Text style={styles.title}>Carrinho de Compras</Text>
            </View>
            <FlatList
                style={styles.list}
                data={cartItems}
                renderItem={renderItemCarrinho}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>Seu carrinho está vazio</Text>}
            />
            <View style={styles.footer}>
                <Text style={styles.totalText}>Total: {formatadorDeMoeda.format(getTotalPrice())}</Text>
                <BotaoPersonalizado
                    texto="Finalizar Compra"
                    onPress={handleCheckout}
                />
                {cartItems.length > 0 && (
                    <BotaoPersonalizado
                        texto="Limpar Carrinho"
                        onPress={handleClear}
                        style={{ backgroundColor: theme === 'light' ? '#DC3545' : '#FF453A', marginTop: 10 }}
                    />
                )}
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
    actionsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#888',
    },
    footer: {
        width: '90%',
        alignSelf: 'center',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: theme === 'light' ? '#ccc' : '#3A3A3C',
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: theme === 'light' ? '#000' : '#fff',
    }
});
