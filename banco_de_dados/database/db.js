import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('loja.db');

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

            CREATE TEABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cpf TEXT,
                telefone TEXT,
                endereco TEXT
            );

            CREATE TEABLE IF NOT EXISTS vendas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                data TEXT NOT NULL,
                clienteId INTEGER,
                clienteNome TEXT,
                total REAL NOT NULL,
                pagamento TEXT,
                itens TEXT NOT NULL
            );

            CREATE TEABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                tipo TEXT,
                dados TEXT
            );
            `);
            console.log('Banco de Dados Inicializado Com Sucesso!')
    } catch (error) {
        console.error('Erro ao inicializar banco de dados: ', error)
    }
};

export default db;