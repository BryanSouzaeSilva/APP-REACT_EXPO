import React, {useContext, useState} from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemeContext } from '../context/ThemeContext'
import { CartContext } from '../context/CartContext'
import { Ionicons } from '@expo/vector-icons'
import BotaoPersonalizado from '../components/botaoPersonalizado'

export default function SalesScreen({ navigation }) {
    const { theme, produtos, showNotification } = useContext(ThemeContext);
    const { addToCart } = useContext(CartContext);
    const styles = getStyles(theme);

    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('1');

    const produtosFiltrados = produtos.filter(item => 
        item.nome.toUpperCase().includes(searchQuery.toUpperCase())
    );

    const handleOpenModal = (produto) => {
        setSelectedProduct(produto);
        setQuantity('1');
        setModalVisible(true);
    }

    const handleConfirmAdd = () => {
        const qtd = parseInt(quantity);
        if (!qtd || qtd <= 0) {
            Alert.alert("Erro", "Quantidade inválida");
            return;
        }
        if (qtd > selectedProduct.estoque) {
            Alert.alert("Estoque insulficiente", `Só temos ${selectedProduct.estoque} unidades`)
            return;
        }

        for (let i = 0; i < qtd; i++) {
            addToCart(selectedProduct);
        }

        showNotification(`${qtd}x ${selectedProduct.nome} adicionado(s)!`);
        setModalVisible(false);
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handleOpenModal(item)}>
            <View style={{flex: 1}}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.itemInfo}>Estoque: {item.estoque} | R$ {item.valor.toFixed(2)}</Text>
            </View>
            <Ionicons name="add-circle" size={32} color="#28A745" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Nova Venda</Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" style={{marginRight: 10}}/>
                <TextInput 
                    style={styles.input} 
                    placeholder="Buscar produto..." 
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={produtosFiltrados}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />

            <View style={styles.footer}>
                <BotaoPersonalizado 
                    texto="Ver Carrinho" 
                    onPress={() => navigation.navigate('CartTab', { screen: 'Cart' })} 
                />
            </View>

            {/* Modal de Quantidade */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Quantas unidades?</Text>
                        <Text style={styles.productName}>{selectedProduct?.nome}</Text>
                        
                        <View style={styles.qtyContainer}>
                            <TouchableOpacity onPress={() => setQuantity((prev) => Math.max(1, parseInt(prev || 0) - 1).toString())}>
                                <Ionicons name="remove-circle-outline" size={40} color={theme === 'light' ? '#000' : '#fff'} />
                            </TouchableOpacity>
                            <TextInput 
                                style={styles.qtyInput}
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity onPress={() => setQuantity((prev) => (parseInt(prev || 0) + 1).toString())}>
                                <Ionicons name="add-circle-outline" size={40} color={theme === 'light' ? '#000' : '#fff'} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.btn, {backgroundColor: '#ccc'}]}>
                                <Text>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirmAdd} style={[styles.btn, {backgroundColor: '#28A745'}]}>
                                <Text style={{color: '#fff'}}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === 'light' ? '#f0f0f0' : '#1C1C1E'
    },
    header: {
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme === 'light' ? '#000' : '#fff'
    },
    searchContainer: { 
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
        marginHorizontal: 20,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 45,
        marginBottom: 10
    },
    input: {
        flex: 1, color: theme === 'light' ? '#000' : '#fff'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
        marginHorizontal: 20,
        marginBottom: 10,
        padding: 15,
        borderRadius: 8
    },
    itemNome: {
        fontSize: 18, fontWeight: 'bold', color: theme === 'light' ? '#000' : '#fff'
    },
    itemInfo: {
        color: 'gray'
    },
    footer: {
        padding: 20, alignItems: 'center'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        width: '80%',
        backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: theme === 'light' ? '#000' : '#fff'
    },
    productName: {
        fontSize: 16,
        marginBottom: 20,
        color: '#007AFF'
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    qtyInput: { 
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 20,
        textAlign: 'center',
        minWidth: 50,
        color: theme === 'light' ? '#000' : '#fff',
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 10
    },
    btn: {
        padding: 10,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center'
    }
});