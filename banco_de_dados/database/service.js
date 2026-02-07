import db from "./db";

// ------------PRODUTOS------------
export const addProdutos = async (nome, estoque, valor) => {
    const result = await db.runAsync(
        'INSERT INTO produtos (nome, estoque, valor) VALUES (?, ?, ?)',
        [nome, estoque, valor]
    );
    return result.lastInsertRowId;
}

export const getProdutos = async () => {
    return await db.getAllAsync('SELECT * FROM produtos');
}

export const updateProduto = async (id, nome, estoque, valor) => {
    await db.runAsync(
        'UPDATE produtos SET nome = ?, estoque = ?, valor = ? WHERE id = ?',
        [nome, estoque, valor, id]
    );
};

export const deleteProduto = async (id) => {
    await db.runAsync('DELETE FROM produtos WHERE id = ?', [id]);
};

// ------------CLIENTES------------
export const addClientes = async (cliente) => {
    const {nome, cpf, telefone, endereco } = cliente;
    const result = await db.runAsync(
        'INSERT INTO clientes (nome, cpf, telefone, endereco) VALUES (?, ?, ?, ?)',
        [nome, cpf, telefone, endereco]
    );
    return result.lastInsertRowId;
};

export const getClients = async () => {
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
    await db.runAsync('DELETE FROM clientes WHERE = ?', [id]);
};

// ------------VENDAS------------
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
    return result.map(venda => ({
        ...venda,
        itens: JSON.parse(venda.itens)
    }));
};

// ------------LOGS------------
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