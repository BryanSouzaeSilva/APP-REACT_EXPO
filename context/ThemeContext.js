import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { initDB } from '../banco_de_dados/database/db'; 

import { 
    getProdutos,
    addProduto,
    updateProduto,
    deleteProduto,

    getClientes,
    addCliente,
    updateCliente,
    deleteCliente,

    getVendas,
    addVenda,
    getLogs,
    addLogDB
} from '../banco_de_dados/database/service'; 

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const colorScheme = useColorScheme();
    const [theme, setTheme] = useState(colorScheme || 'light');
    
    const [produtos, setProdutos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [vendas, setVendas] = useState([]);
    const [logs, setLogs] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: 'success' });

    useEffect(() => {
        const carregarDados = async () => {
            try {
                await initDB(); 
                
                const p = await getProdutos();
                const c = await getClientes();
                const v = await getVendas();
                const l = await getLogs();

                setProdutos(p);
                setClientes(c);
                setVendas(v);
                setLogs(l);

            } catch (error) {
                console.error("Erro ao carregar banco de dados:", error);
            } finally {
                setIsLoading(false);
            }
        };
        carregarDados();
    }, []);


    const handleCadastrarProduto = async (novoProduto) => {
        try {
            const idGerado = await addProduto(novoProduto.nome, novoProduto.estoque, novoProduto.valor);
            
            const produtoComId = { ...novoProduto, id: idGerado };
            setProdutos(prev => [...prev, produtoComId]); 
            
            showNotification('Produto cadastrado!');
        } catch (e) { console.error("Erro ao cadastrar produto:", e); }
    };

    const handleEditarProduto = async (produtoEditado) => {
        try {
            await updateProduto(
                produtoEditado.id,
                produtoEditado.nome,
                produtoEditado.estoque,
                produtoEditado.valor
            );
            
            setProdutos(prev => prev.map(p => p.id === produtoEditado.id ? produtoEditado : p));
            
            showNotification('Produto editado!');
        } catch (e) { console.error("Erro ao editar produto:", e); }
    };


    const handleDeletarProduto = async (id) => {
        try {
            await deleteProduto(id);
            setProdutos(prev => prev.filter(p => p.id !== id));
            showNotification('Produto excluído!', 'delete');
        } catch (e) { console.error("Erro ao deletar produto:", e); }
    };


    const handleCadastrarCliente = async (novoCliente) => {
        try {
            const idGerado = await addCliente(novoCliente);
            const clienteComId = { ...novoCliente, id: idGerado };
            
            setClientes(prev => [...prev, clienteComId]);
            showNotification('Cliente cadastrado!');
        } catch (e) { console.error("Erro ao cadastrar cliente:", e); }
    };
    
    const handleEditarCliente = async (clienteEditado) => {
        try {
            await updateCliente(clienteEditado.id, clienteEditado);
            setClientes(prev => prev.map(c => c.id === clienteEditado.id ? clienteEditado : c));
            showNotification('Cliente atualizado!');
        } catch (e) { console.error("Erro ao editar cliente:", e); }
    };

    const handleDeletarCliente = async (id) => {
        try {
            await deleteCliente(id);
            setClientes(prev => prev.filter(c => c.id !== id));
            showNotification('Cliente excluído!', 'delete');
        } catch (e) { console.error("Erro ao deletar cliente:", e); }
    };


    const handleRegistrarVenda = async (venda) => {
        try {
            const idVenda = await addVenda(venda);
            
            for (const item of venda.itens) {
                const produtoAtual = produtos.find(p => p.id === item.id);
                
                if (produtoAtual) {
                    const novoEstoque = produtoAtual.estoque - item.quantity;
                    await updateProduto(produtoAtual.id, produtoAtual.nome, novoEstoque, produtoAtual.valor);
                }
            }

            
            setVendas(prev => [...prev, { ...venda, id: idVenda }]);
            
            const produtosAtualizados = await getProdutos();
            setProdutos(produtosAtualizados);

            showNotification('Venda Realizada!');
            addLog('VENDA', { id: idVenda, total: venda.total, cliente: venda.clienteNome });

        } catch (e) { console.error("Erro ao registrar venda:", e); }
    };


    const addLog = async (tipo, dados) => {
        try {
            await addLogDB(tipo, dados);
            const logsAtualizados = await getLogs();
            setLogs(logsAtualizados);
        } catch (e) { console.error("Erro ao salvar log:", e); }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification({ message: '', type: 'success' });
        }, 3000);
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{
            theme, 
            toggleTheme,
            isLoading,
            
            produtos, 
            handleCadastrarProduto, 
            handleEditarProduto, 
            handleDeletarProduto,
            
            clientes, 
            handleCadastrarCliente, 
            handleEditarCliente,
            handleDeletarCliente,
            
            vendas, 
            handleRegistrarVenda,
            logs, 
            addLog,
            
            notification, 
            showNotification
        }}>
            {children}
        </ThemeContext.Provider>
    );
};