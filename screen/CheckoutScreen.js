import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../context/ThemeContext';
import { CartContext } from '../context/CartContext';
import BotaoPersonalizado from '../components/botaoPersonalizado';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function CheckoutScreen({ navigation }) {
    const { theme, clientes, handleRegistrarVenda } = useContext(ThemeContext);
    const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
    
    const styles = getStyles(theme);
    const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [formaPagamento, setFormaPagamento] = useState('Dinheiro');
    const [searchQuery, setSearchQuery] = useState('');

    const clientesFiltrados = clientes.filter(item => {
        const texto = searchQuery.toUpperCase();
        return item.nome.toUpperCase().includes(texto) || item.cpf.includes(texto);
    })

    const handleFinalizar = () => {
        if (!clienteSelecionado) {
            Alert.alert("Atenção", "Por favor, selecione um cliente.");
            return;
        }
        if (cartItems.length === 0) {
            Alert.alert("Erro", "Seu carrinho está vazio.");
            return;
        }

        const novaVenda = {
            id: Date.now().toString(),
            data: new Date().toISOString(),
            clienteId: clienteSelecionado.id,
            clienteNome: clienteSelecionado.nome,
            itens: cartItems,
            total: getTotalPrice(),
            pagamento: formaPagamento,
        };

        handleRegistrarVenda(novaVenda);
        clearCart();

        Alert.alert(
            "Venda Concluída!",
            "Deseja gerar um comprovante PDF?",
            [
                {
                    text: "Não",
                    onPress: () => navigation.navigate('HomeTab'),
                    style: "cancel"
                },
                {
                    text: "Sim",
                    onPress: () => gerarPDF(novaVenda)
                }
            ]
        )

        navigation.goBack();
    };

    const handleCriarCliente = () => {
        setModalVisible(false);
        navigation.navigate('GestaoTab', {
            screen: 'ClientForm',
            params: { origem: 'Checkout' }
        })
    }

    const gerarHtmlRecibo = (venda) => {
        const itensHtml = venda.itens.map(item => `
            <tr>
                <td style="padding: 5px 0;">${item.quantity}x</td>
                <td style="padding: 5px 0;">${item.nome}</td>
                <td style="text-align: right; padding: 5px 0;">R$ ${(item.valor * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        return `
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .title { font-size: 24px; font-weight: bold; }
                    .subtitle { font-size: 14px; color: #555; }
                    .divider { border-bottom: 1px dashed #ccc; margin: 10px 0; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    
                    th { text-align: left; border-bottom: 2px solid #333; padding-bottom: 5px; font-size: 14px; text-transform: uppercase; }
                    
                    td { font-size: 14px; border-bottom: 1px solid #eee; }
                    
                    .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">Seu App de Vendas</div>
                    <div class="subtitle">Comprovante de Venda</div>
                </div>
                
                <div class="divider"></div>
                
                <p><strong>Cliente:</strong> ${venda.clienteNome}</p>
                <p><strong>Data:</strong> ${new Date(venda.data).toLocaleString('pt-BR')}</p>
                <p><strong>Pagamento:</strong> ${venda.pagamento}</p>

                <div class="divider"></div>

                <table>
                    <tr>
                        <th style="width: 15%;">Qtd</th>
                        <th style="width: 60%;">Produto</th>
                        <th style="text-align: right; width: 25%;">Valor</th>
                    </tr>
                    
                    ${itensHtml}
                </table>

                <div class="divider"></div>

                <div class="total">
                    Total: R$ ${venda.total.toFixed(2)}
                </div>

                <div class="footer">
                    Obrigado pela preferência!
                </div>
            </body>
            </html>
        `;
    };

    const gerarPDF = async (venda) => {
        try {
        const html = gerarHtmlRecibo(venda);

        const { uri } = await Print.printToFileAsync({
            html: html,
            base64: false
        });

        await Sharing.shareAsync(uri);

        navigation.navigate('HomeTab')
        } catch (error) {
        Alert.alert("Erro", "Não foi possível gerar o PDF.")
        console.error(error);
        navigation.navigate('HomeTab')
        }
    }

    const renderClienteItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.clientItem} 
            onPress={() => {
                setClienteSelecionado(item);
                setModalVisible(false);
            }}
        >
            <Text style={styles.clientItemText}>{item.nome}</Text>
            <Text style={styles.clientItemSub}>{item.cpf}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Finalizar Pedido</Text>

                <Text style={styles.sectionTitle}>1. Cliente</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
                    <Text style={styles.selectorText}>
                        {clienteSelecionado ? clienteSelecionado.nome : "Toque para selecionar um cliente"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={theme === 'light' ? '#000' : '#fff'} />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>2. Resumo</Text>
                <View style={styles.card}>
                    {cartItems.map(item => (
                        <View key={item.id} style={styles.row}>
                        <Text style={styles.rowText}>{item.quantity}x {item.nome}</Text>
                        <Text style={styles.rowText}>{formatador.format(item.valor * item.quantity)}</Text>
                        </View>
                    ))}
                    <View style={[styles.row, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalValue}>{formatador.format(getTotalPrice())}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>3. Pagamento</Text>
                <View style={styles.paymentContainer}>
                    {['Dinheiro', 'Pix', 'Cartão'].map((tipo) => (
                        <TouchableOpacity 
                        key={tipo} 
                        style={[
                            styles.paymentOption, 
                            formaPagamento === tipo && styles.paymentOptionSelected
                        ]}
                        onPress={() => setFormaPagamento(tipo)}
                        >
                        <Text style={[
                            styles.paymentText,
                            formaPagamento === tipo && styles.paymentTextSelected
                        ]}>{tipo}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footerBtn}>
                    <BotaoPersonalizado texto="Confirmar Compra" onPress={handleFinalizar} />
                </View>
            </ScrollView>

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione o Cliente</Text>

                        <View style={styles.searchBox}>
                            <Ionicons name="search" size={20} color="#888" style={{marginRight: 8}} />
                            <TextInput 
                                style={styles.searchInput}
                                placeholder="Buscar cliente..."
                                placeholderTextColor="#aaa"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        <FlatList 
                            data={clientesFiltrados}
                            keyExtractor={item => item.id}
                            renderItem={renderClienteItem}
                            style={{ width: '100%' }}
                            ListEmptyComponent={
                                <Text style={{textAlign: 'center', color: '#888', marginTop: 20}}>
                                    Nenhum cliente encontrado
                                </Text>
                            }
                        />

                        <View style={{flexDirection: 'row'}}>
                            <BotaoPersonalizado 
                                texto="Novo Cliente"
                                onPress={handleCriarCliente}
                                style={{ backgroundColor: '#28A745', marginRight: 20}}
                            />

                            <BotaoPersonalizado
                                texto="Cancelar"
                                onPress={() => setModalVisible(false)}
                            />
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
        backgroundColor: theme === 'light' ? '#f0f0f0' : '#1C1C1E',
    },
    content: { 
        padding: 20 
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: theme === 'light' ? '#000' : '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 10,
        color: theme === 'light' ? '#333' : '#ccc',
    },
    selector: {
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme === 'light' ? '#ddd' : '#444',
        backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
    },
    selectorText: {
        fontSize: 16,
        color: theme === 'light' ? '#000' : '#fff',
    },
    card: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    rowText: {
        color: theme === 'light' ? '#555' : '#aaa',
    },
    totalRow: {
        marginTop: 10,
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
        color: '#28A745',
    },
    paymentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paymentOption: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme === 'light' ? '#ccc' : '#555',
        backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
    },
    paymentOptionSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    paymentText: {
        color: theme === 'light' ? '#000' : '#fff',
    },
    paymentTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    footerBtn: {
        marginTop: 30,
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        height: '70%',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        backgroundColor: theme === 'light' ? '#fff' : '#1C1C1E',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: theme === 'light' ? '#000' : '#fff',
    },
    clientItem: {
        padding: 15,
        borderBottomWidth: 1,
        width: '100%',
        borderBottomColor: theme === 'light' ? '#eee' : '#333',
    },
    clientItemText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme === 'light' ? '#000' : '#fff',
    },
    clientItemSub: {
        fontSize: 14,
        color: 'gray',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme === 'light' ? '#f0f0f0' : '#333',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
        marginBottom: 10,
        width: '100%',
    },
    searchInput: {
        flex: 1,
        color: theme === 'light' ? '#000' : '#fff',
    },
});