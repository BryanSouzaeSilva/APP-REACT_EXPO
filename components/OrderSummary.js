import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { CartContext } from '../context/CartContext';
import BotaoPersonalizado from '../components/botaoPersonalizado';

export default function OrderSummary({ items, total, onConfirm }) {
    const { theme, handleAddOrder, showNotification} = useContext(ThemeContext);
    const { clearCart } = useContext(CartContext);
    const styles = getStyles(theme);

    const formatadorDeMoeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    const handleConfirm = () => {
        if (!items || items.length === 0){
            Alert.alert("Erro", "Não há itens para confirmar.");
            return;
        }
        handleAddOrder(items, total);
        clearCart();
        showNotification("Compra confirmada com sucesso!");
        onConfirm();
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Resumo da Compra</Text>
            <FlatList
                data={items}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemName}>{item.nome} (x{item.quantity})</Text>
                        <Text style={styles.itemPrice}>{formatadorDeMoeda.format(item.valor * item.quantity)}</Text>
                    </View>
                )}
            />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total: </Text>
                <Text style={styles.totalValue}>{formatadorDeMoeda.format(total)}</Text>
            </View>
            <BotaoPersonalizado
                texto="Confirmar Compra"
                onPress={handleConfirm}
                style={{ flex: 0, width: '100%'}}
            />
        </View>
    )

}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme === 'light' ? '#000' : '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    itemName: {
        fontSize: 16,
        color: theme === 'light' ? '#333' : '#ccc',
    },
    itemPrice: {
        fontSize: 16,
        color: theme === 'light' ? '#333' : '#ccc',
        fontWeight: '500',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: theme === 'light' ? '#eee' : '#444',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme === 'light' ? '#000' : '#fff',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme === 'light' ? '#000' : '#fff',
    },
});