  // 1. IMPORTE O ASYNCSTORAGE
  import AsyncStorage from '@react-native-async-storage/async-storage';

  // --- LÓGICA DE PERSISTÊNCIA DE DADOS ---

  // 2. EFEITO PARA CARREGAR OS DADOS QUANDO O APP ABRE
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carrega produtos
        const produtosSalvos = await AsyncStorage.getItem('@app_produtos');
        if (produtosSalvos !== null) {
          setProdutos(JSON.parse(produtosSalvos));
        }
        // Carrega clientes
        const clientesSalvos = await AsyncStorage.getItem('@app_clientes');
        if (clientesSalvos !== null) {
          setClientes(JSON.parse(clientesSalvos));
        }
      } catch (e) {
        console.error("Erro ao carregar dados do AsyncStorage", e);
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    };
    carregarDados();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // 3. EFEITO PARA SALVAR OS PRODUTOS QUANDO A LISTA MUDA
  useEffect(() => {
    // Não salva nada durante o carregamento inicial para evitar sobrescrever com uma lista vazia
    if (!isLoading) {
      const salvarProdutos = async () => {
        try {
          const jsonValue = JSON.stringify(produtos);
          await AsyncStorage.setItem('@app_produtos', jsonValue);
        } catch (e) {
          console.error("Erro ao salvar produtos", e);
        }
      };
      salvarProdutos();
    }
  }, [produtos, isLoading]); // Roda toda vez que 'produtos' ou 'isLoading' muda

  // 4. EFEITO PARA SALVAR OS CLIENTES QUANDO A LISTA MUDA
  useEffect(() => {
    if (!isLoading) {
      const salvarClientes = async () => {
        try {
          const jsonValue = JSON.stringify(clientes);
          await AsyncStorage.setItem('@app_clientes', jsonValue);
        } catch (e) {
          console.error("Erro ao salvar clientes", e);
        }
      };
      salvarClientes();
    }
  }, [clientes, isLoading]); // Roda toda vez que 'clientes' ou 'isLoading' muda
