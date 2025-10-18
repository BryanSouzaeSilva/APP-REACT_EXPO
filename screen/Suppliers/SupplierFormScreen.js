import { useContext, useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../context/ThemeContext';
import MaskInput, { Masks } from 'react-native-mask-input';

export default function SupplierFormScreen({ route, navigation }) {

    const { theme, handleCadastrarFornecedor, handleEditarFornecedor, fornecedores, showNotification, addLog } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const [nomeFantasia, setNomeFantasia] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');
    const [contato, setContato] = useState('');

    const fornecedorId = route.params?.fornecedorId;
    const isEditing = !!fornecedorId;

    useEffect(() => {
        if (isEditing) {
            const fornecedor = fornecedores.find(f => f.id === fornecedorId);
            if (fornecedor) {
                setNomeFantasia(fornecedor.nomeFantasia);
                setRazaoSocial(fornecedor.razaoSocial);
                setCnpj(fornecedor.cnpj);
                setEndereco(fornecedor.endereco);
                setContato(fornecedor.contato);
            }
        }
    }, [fornecedorId, fornecedores]);

    function handleSubmit() {
        if (!nomeFantasia || !razaoSocial || !cnpj || !endereco || !contato) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos!');
            return;
        }

        const dadosFornecedor = {
            id: fornecedorId || Date.now().toString(),
            nomeFantasia,
            razaoSocial,
            cnpj,
            endereco,
            contato,
            dataCadastro: isEditing ? fornecedores.find(f => f.id === fornecedorId).dataCadastro : new Date().toLocaleDateString(),
        };

        if (isEditing) {
            addLog('EDICAO_FORNECEDOR', dadosFornecedor);
            handleEditarFornecedor(dadosFornecedor);
            showNotification(`Fornecedor "${dadosFornecedor.nomeFantasia}" foi atualizado!`);
        } else {
            addLog('CADASTRO_FORNECEDOR', dadosFornecedor);
            handleCadastrarFornecedor(dadosFornecedor);
            showNotification(`Fornecedor "${dadosFornecedor.nomeFantasia}" foi cadastrado!`);
        }
        
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.formContainer}>
                <Text style={styles.title}>{isEditing ? 'Editar Fornecedor' : 'Cadastrar Fornecedor'}</Text>

                <Text style={styles.labels}>Nome Fantasia:</Text>
                <TextInput
                    style={styles.inputs}
                    value={nomeFantasia}
                    onChangeText={setNomeFantasia}
                    placeholder="Empresa Exemplo LTDA"
                    placeholderTextColor={theme === 'light' ? '#aaa' : '#8e8e93'}
                />

                <Text style={styles.labels}>Razão Social:</Text>
                <TextInput
                    style={styles.inputs}
                    value={razaoSocial}
                    onChangeText={setRazaoSocial}
                    placeholder="Empresa Exemplo de Fato S.A."
                    placeholderTextColor={theme === 'light' ? '#aaa' : '#8e8e93'}
                />

                <Text style={styles.labels}>CNPJ:</Text>
                <MaskInput
                    style={styles.inputs}
                    keyboardType="number-pad"
                    value={cnpj}
                    onChangeText={(masked, unmasked) => setCnpj(masked)}
                    mask={Masks.BRL_CNPJ}
                    placeholderTextColor={theme === 'light' ? '#aaa' : '#8e8e93'}
                />

                <Text style={styles.labels}>Endereço:</Text>
                <TextInput
                    style={styles.inputs}
                    value={endereco}
                    onChangeText={setEndereco}
                    placeholder="Av. Principal, 456"
                    placeholderTextColor={theme === 'light' ? '#aaa' : '#8e8e93'}
                />

                <Text style={styles.labels}>Contato (Telefone):</Text>
                <MaskInput
                    style={styles.inputs}
                    keyboardType="number-pad"
                    value={contato}
                    onChangeText={(masked, unmasked) => setContato(masked)}
                    mask={Masks.BRL_PHONE}
                    placeholderTextColor={theme === 'light' ? '#aaa' : '#8e8e93'}
                />

                <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmit}>
                    <Text style={{ color: '#fff', fontSize: 16 }}>{isEditing ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === 'light' ? '#f0f0f0' : '#1C1C1E',
    },
    formContainer: {
        width: '90%',
        alignSelf: 'center',
        paddingTop: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: theme === 'light' ? '#000' : '#fff',
    },
    labels: {
        fontWeight: 'bold',
        marginBottom: 4,
        color: theme === 'light' ? '#000' : '#fff',
    },
    inputs: {
        borderWidth: 1,
        borderColor: theme === 'light' ? '#ccc' : '#555',
        borderRadius: 4,
        color: theme === 'light' ? '#000' : '#fff',
        backgroundColor: theme === 'light' ? '#FFFFFF' : '#3A3A3C',
        paddingHorizontal: 8,
        height: 40,
        marginBottom: 10,
    },
    buttonSubmit: {
        backgroundColor: '#007AFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 10,
    },
});