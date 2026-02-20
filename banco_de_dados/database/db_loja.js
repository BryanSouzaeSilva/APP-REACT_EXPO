import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('bando_loja.db');

export const initDB = async () => {
    try {
        await db.execAsync(`
            PRAGMA journal_mode = WAL;

            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                estoque INTEGER NOT NULL,
                valor REAL NOT NULL
            );

            CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cpf TEXT,
                telefone TEXT,
                endereco TEXT
            );

            CREATE TABLE IF NOT EXISTS vendas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                data TEXT NOT NULL,
                clienteId INTEGER,
                clienteNome TEXT,
                total REAL NOT NULL,
                pagamento TEXT,
                itens TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                tipo TEXT,
                dados TEXT
            );

            CREATE TABLE IF NOT EXISTS carrinho (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                produtoId INTEGER NOT NULL,
                nome TEXT NOT NULL,
                valor REAL NOT NULL,
                quantity INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS fornecedores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nomeFantasia TEXT NOT NULL,
                razaoSocial TEXT NOT NULL,
                cnpj TEXT NOT NULL,
                endereco TEXT,
                contato TEXT,
                dataCadastro TEXT
            );
            `);
            console.log('Banco de Dados Inicializado Com Sucesso!')
    } catch (error) {
        console.error('Erro ao inicializar banco de dados: ', error)
    }
};

export default db;