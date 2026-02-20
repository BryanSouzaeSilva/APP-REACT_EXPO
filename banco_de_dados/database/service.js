import db from './db_loja';

// ==========================================
// 📦 PRODUTOS
// ==========================================

export const addProduto = async (nome, estoque, valor) => {
    const result = await db.runAsync(
        'INSERT INTO produtos (nome, estoque, valor) VALUES (?, ?, ?)', 
        [nome, estoque, valor]
    );
    return result.lastInsertRowId;
};

export const getProdutos = async () => {
    return await db.getAllAsync('SELECT * FROM produtos');
};

export const updateProduto = async (id, nome, estoque, valor) => {
    await db.runAsync(
        'UPDATE produtos SET nome = ?, estoque = ?, valor = ? WHERE id = ?', 
        [nome, estoque, valor, id]
    );
};

export const deleteProduto = async (id) => {
    await db.runAsync('DELETE FROM produtos WHERE id = ?', [id]);
};

// ==========================================
// 👥 CLIENTES
// ==========================================

export const addCliente = async (cliente) => {
    const { nome, cpf, telefone, endereco } = cliente;
    const result = await db.runAsync(
        'INSERT INTO clientes (nome, cpf, telefone, endereco) VALUES (?, ?, ?, ?)', 
        [nome, cpf, telefone, endereco]
    );
    return result.lastInsertRowId;
};

export const getClientes = async () => {
    return await db.getAllAsync('SELECT * FROM clientes');
};

export const updateCliente = async (id, cliente) => {
    const { nome, cpf, telefone, endereco } = cliente;
    await db.runAsync(
        'UPDATE clientes SET nome = ?, cpf = ?, telefone = ?, endereco = ? WHERE id = ?', 
        [nome, cpf, telefone, endereco, id]
    );
};

export const deleteCliente = async (id) => {
    await db.runAsync('DELETE FROM clientes WHERE id = ?', [id]);
};

// ==========================================
// 💰 VENDAS (Com proteção de erro JSON)
// ==========================================

export const addVenda = async (venda) => {
    const { data, clienteId, clienteNome, total, pagamento, itens } = venda;
    const itensJson = JSON.stringify(itens);
    
    const result = await db.runAsync(
        'INSERT INTO vendas (data, clienteId, clienteNome, total, pagamento, itens) VALUES (?, ?, ?, ?, ?, ?)',
        [data, clienteId, clienteNome, total, pagamento, itensJson]
    );
    return result.lastInsertRowId;
};

export const getVendas = async () => {
    const result = await db.getAllAsync('SELECT * FROM vendas');
    
    return result.map(venda => {
        try {
            return {
                ...venda,
                itens: venda.itens ? JSON.parse(venda.itens) : []
            };
        } catch (error) {
            console.log(`⚠️ Erro ao ler itens da venda ID ${venda.id}. Retornando itens vazios.`);
            return {
                ...venda,
                itens: []
            };
        }
    });
};

// ==========================================
// 🛒 CARRINHO
// ==========================================

export const getCarrinho = async () => {
    return await db.getAllAsync('SELECT * FROM carrinho');
};

export const addItemCarrinho = async (produto) => {
    const existe = await db.getFirstAsync('SELECT * FROM carrinho WHERE produtoId = ?', [produto.id]);

    if (existe) {
        const novaQtd = existe.quantity + 1;
        await db.runAsync('UPDATE carrinho SET quantity = ? WHERE id = ?', [novaQtd, existe.id]);
        return existe.id;
    } else {
        const result = await db.runAsync(
            'INSERT INTO carrinho (produtoId, nome, valor, quantity) VALUES (?, ?, ?, ?)',
            [produto.id, produto.nome, produto.valor, 1]
        );
        return result.lastInsertRowId;
    }
};

export const removeItemCarrinho = async (produtoId) => {
    const item = await db.getFirstAsync('SELECT * FROM carrinho WHERE produtoId = ?', [produtoId]);
    
    if (item) {
        if (item.quantity > 1) {
            await db.runAsync('UPDATE carrinho SET quantity = ? WHERE id = ?', [item.quantity - 1, item.id]);
        } else {
            await db.runAsync('DELETE FROM carrinho WHERE id = ?', [item.id]);
        }
    }
};

export const clearCarrinhoDB = async () => {
    await db.runAsync('DELETE FROM carrinho');
};

// ==========================================
// 📜 LOGS
// ==========================================

export const addLogDB = async (tipo, dados) => {
    const timestamp = new Date().toISOString();
    await db.runAsync(
        'INSERT INTO logs (timestamp, tipo, dados) VALUES (?, ?, ?)', 
        [timestamp, tipo, JSON.stringify(dados)]
    );
};

export const getLogs = async () => {
    return await db.getAllAsync('SELECT * FROM logs ORDER BY id DESC');
};

// ==========================================
// 🚚 FORNECEDORES (NOVO)
// ==========================================

export const addFornecedor = async (fornecedor) => {
    const { nomeFantasia, razaoSocial, cnpj, endereco, contato, dataCadastro } = fornecedor;
    const result = await db.runAsync(
        'INSERT INTO fornecedores (nomeFantasia, razaoSocial, cnpj, endereco, contato, dataCadastro) VALUES (?, ?, ?, ?, ?, ?)', 
        [nomeFantasia, razaoSocial, cnpj, endereco, contato, dataCadastro]
    );
    return result.lastInsertRowId;
};

export const getFornecedores = async () => {
    return await db.getAllAsync('SELECT * FROM fornecedores');
};

export const updateFornecedor = async (id, fornecedor) => {
    const { nomeFantasia, razaoSocial, cnpj, endereco, contato, dataCadastro } = fornecedor;
    await db.runAsync(
        'UPDATE fornecedores SET nomeFantasia = ?, razaoSocial = ?, cnpj = ?, endereco = ?, contato = ?, dataCadastro = ? WHERE id = ?', 
        [nomeFantasia, razaoSocial, cnpj, endereco, contato, dataCadastro, id]
    );
};

export const deleteFornecedor = async (id) => {
    await db.runAsync('DELETE FROM fornecedores WHERE id = ?', [id]);
};