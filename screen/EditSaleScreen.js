import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../context/ThemeContext';
import { CartContext } from '../context/CartContext';
import BotaoPersonalizado from '../components/botaoPersonalizado';
import { gerarPDF } from '../utils/pdfUtils'; //

export default function EditSaleScreen({ route, navigation }) {
    const { venda } = route.params;

    const { theme, clientes, produtos, handleAtualizarVenda } = useContext(ThemeContext);
    const { cartItems, setCartItems, getTotalPrice, clearCart } = useContext(CartContext);
    
    const styles = getStyles(theme);
    const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('Dinheiro');

    const [modalProdutosVisible, setModalProdutosVisible] = useState(false);
    const [buscaProduto, setBuscaProduto] = useState('');

    const [modalQuantidadeVisible, setModalQuantidadeVisible] = useState(false);
    const [produtoParaAdicionar, setProdutoParaAdicionar] = useState(null);
    const [quantidadeInput, setQuantidadeInput] = useState('1');

    useEffect(() => {
        if (venda) {
            const clienteDaVenda = clientes.find(c => c.id === venda.clienteId) || 
                                    { id: venda.clienteId, nome: venda.clienteNome };
            setClienteSelecionado(clienteDaVenda);
            setFormaPagamento(venda.pagamento || 'Dinheiro');
            
            if (venda.itens) {
                setCartItems(venda.itens);
            }
        }
        
        return () => clearCart();
    }, [venda]); // Mantendo a dependência corrigida para não repetir dados de outras vendas

    const produtosFiltrados = produtos.filter(p => 
        p.nome.toUpperCase().includes(buscaProduto.toUpperCase())
    );

    const handleSelecionarProdutoParaAdicionar = (produto) => {
        setProdutoParaAdicionar(produto);
        setQuantidadeInput('1');
        setModalProdutosVisible(false);
        setModalQuantidadeVisible(true);
    };

    const handleConfirmarQuantidade = () => {
        const qtd = parseInt(quantidadeInput, 10);
        
        if (isNaN(qtd) || qtd <= 0) {
            Alert.alert("Atenção", "Por favor, insira uma quantidade válida.");
            return;
        }

        if (produtoParaAdicionar && qtd > produtoParaAdicionar.estoque) {
            Alert.alert("Estoque Insuficiente", `Restam apenas ${produtoParaAdicionar.estoque} unidades.`);
            return;
        }

        const itemExistente = cartItems.find(item => item.id === produtoParaAdicionar?.id);
        
        if (itemExistente) {
            setCartItems(cartItems.map(item =>
                item.id === produtoParaAdicionar.id ? { ...item, quantity: item.quantity + qtd } : item
            ));
        } else {
            setCartItems([...cartItems, { ...produtoParaAdicionar, quantity: qtd }]);
        }

        setModalQuantidadeVisible(false);
        setProdutoParaAdicionar(null);
    };
    
    const handleRemoverProduto = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const clientesFiltrados = clientes.filter(item => {
        const texto = searchQuery.toUpperCase();
        return item.nome.toUpperCase().includes(texto) || (item.cpf && item.cpf.includes(texto));
    });

    const handleSalvar = () => {
        if (!clienteSelecionado) {
            Alert.alert("Atenção", "Por favor, selecione um cliente.");
            return;
        }
        if (cartItems.length === 0) {
            Alert.alert("Erro", "O pedido não pode ficar vazio.");
            return;
        }

        const vendaEditada = {
            ...venda,
            clienteId: clienteSelecionado.id,
            clienteNome: clienteSelecionado.nome,
            itens: cartItems,
            total: getTotalPrice(),
            pagamento: formaPagamento,
        };

        if(handleAtualizarVenda) {
            handleAtualizarVenda(vendaEditada);
            clearCart();

            // ADICIONADO NOVAMENTE: Pergunta se deseja gerar o PDF após salvar
            Alert.alert(
                "Venda Atualizada!",
                "Deseja gerar o comprovante PDF atualizado?",
                [
                    { 
                        text: "Não", 
                        onPress: () => navigation.goBack(), 
                        style: "cancel" 
                    },
                    { 
                        text: "Sim", 
                        onPress: async () => { 
                            await gerarPDF(vendaEditada); //
                            navigation.goBack();
                        }
                    }
                ]
            );
        } else {
            Alert.alert("Aviso", "Lembre-se de configurar a função handleAtualizarVenda!");
        }
    };

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
                <Text style={styles.title}>Editar Venda</Text>

                <Text style={styles.sectionTitle}>1. Cliente</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
                    <Text style={styles.selectorText}>
                        {clienteSelecionado ? clienteSelecionado.nome : "Selecione um cliente"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={theme === 'light' ? '#000' : '#fff'} />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>2. Itens do Pedido</Text>
                <View style={styles.card}>
                    {cartItems.map((item, index) => (
                        <View key={`${item.id}-${index}`} style={[styles.row, { alignItems: 'center', marginBottom: 15 }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowText}>{item.quantity}x {item.nome}</Text>
                                <Text style={{ fontSize: 12, color: 'gray' }}>{formatador.format(item.valor)} un.</Text>
                            </View>
                            <Text style={[styles.rowText, { fontWeight: 'bold', marginRight: 15 }]}>
                                {formatador.format(item.valor * item.quantity)}
                            </Text>
                            <TouchableOpacity onPress={() => handleRemoverProduto(item.id)}>
                                <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    
                    <TouchableOpacity 
                        style={{ marginTop: 10, padding: 12, backgroundColor: theme === 'light' ? '#E5F1FF' : '#1A293D', borderRadius: 8, alignItems: 'center' }}
                        onPress={() => setModalProdutosVisible(true)}
                    >
                        <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>+ Adicionar Produto</Text>
                    </TouchableOpacity>

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
                            style={[styles.paymentOption, formaPagamento === tipo && styles.paymentOptionSelected]}
                            onPress={() => setFormaPagamento(tipo)}
                        >
                            <Text style={[styles.paymentText, formaPagamento === tipo && styles.paymentTextSelected]}>{tipo}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footerBtn}>
                    <BotaoPersonalizado texto="Salvar Alterações" onPress={handleSalvar} style={{backgroundColor: '#007AFF'}} />
                </View>
            </ScrollView>

            {/* Modal de Clientes */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecionar Cliente</Text>
                        <View style={styles.searchBox}>
                            <Ionicons name="search" size={20} color="#888" style={{marginRight: 8}} />
                            <TextInput 
                                style={styles.searchInput}
                                placeholder="Buscar por nome ou CPF..."
                                placeholderTextColor="#aaa"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                        <FlatList 
                            data={clientesFiltrados}
                            keyExtractor={item => item.id.toString()}
                            renderItem={renderClienteItem}
                            style={{width: '100%'}}
                        />
                        <BotaoPersonalizado texto="Fechar" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>

            {/* Modal de Produtos e Quantidade (Mantidos da versão anterior) */}
            <Modal visible={modalProdutosVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Adicionar Produto</Text>
                        <View style={styles.searchBox}>
                            <Ionicons name="search" size={20} color="#888" style={{marginRight: 8}} />
                            <TextInput 
                                style={styles.searchInput}
                                placeholder="Buscar produto..."
                                placeholderTextColor="#aaa"
                                value={buscaProduto}
                                onChangeText={setBuscaProduto}
                            />
                        </View>
                        <FlatList 
                            data={produtosFiltrados}
                            keyExtractor={item => item.id.toString()}
                            style={{ width: '100%' }}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.clientItem}
                                    onPress={() => handleSelecionarProdutoParaAdicionar(item)}
                                >
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={styles.clientItemText}>{item.nome}</Text>
                                        <Text style={styles.clientItemText}>{formatador.format(item.valor)}</Text>
                                    </View>
                                    <Text style={styles.clientItemSub}>Em estoque: {item.estoque}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <BotaoPersonalizado texto="Fechar" onPress={() => setModalProdutosVisible(false)} />
                    </View>
                </View>
            </Modal>

            <Modal visible={modalQuantidadeVisible} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { height: 'auto', paddingBottom: 30 }]}>
                        <Text style={styles.modalTitle}>Quantidade</Text>
                        {produtoParaAdicionar && (
                            <Text style={{ marginBottom: 15, fontSize: 16, color: theme === 'light' ? '#333' : '#ccc', textAlign: 'center' }}>
                                Quantos itens de <Text style={{fontWeight: 'bold'}}>{produtoParaAdicionar.nome}</Text>?
                            </Text>
                        )}
                        <TextInput 
                            style={styles.quantityInput}
                            keyboardType="numeric"
                            value={quantidadeInput}
                            onChangeText={setQuantidadeInput}
                            autoFocus={true}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                            <View style={{flex: 1, marginRight: 10}}>
                                <BotaoPersonalizado texto="Cancelar" onPress={() => setModalQuantidadeVisible(false)} />
                            </View>
                            <View style={{flex: 1, marginLeft: 10}}>
                                <BotaoPersonalizado texto="Confirmar" onPress={handleConfirmarQuantidade} style={{backgroundColor: '#28A745'}} />
                            </View>
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
    searchInput: {
        flex: 1,
        color: theme === 'light' ? '#000' : '#fff',
    },
    quantityInput: {
        width: '100%',
        height: 60,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme === 'light' ? '#000' : '#fff',
        backgroundColor: theme === 'light' ? '#f9f9f9' : '#2C2C2E',
        borderWidth: 1,
        borderColor: theme === 'light' ? '#ccc' : '#444',
        borderRadius: 8,
        marginBottom: 20,
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