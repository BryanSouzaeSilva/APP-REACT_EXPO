import React, { useState, useContext, useEffect } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../context/ThemeContext';
import MaskInput, { Masks } from 'react-native-mask-input';
import HeaderPersonalizado from '../../components/headerPersonalizado';

export default function ProductFormScreen({ route, navigation }) {
  const { theme, handleCadastrarProduto, handleEditarProduto, produtos, showNotification, addLog } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [nomeProduto, setNomeProduto] = useState('');
  const [valor, setValor] = useState('');
  const [estoque, setEstoque] = useState('');
  const [descricao, setDescricao] = useState('');

  const produtoId = route.params?.produtoId;
  const isEditing = !!produtoId;

  useEffect(() => {
    if (isEditing) {
      const produto = produtos.find(p => p.id === produtoId);
      if (produto) {
        setNomeProduto(produto.nome);
        setValor((produto.valor * 100).toString());
        setEstoque(produto.estoque);
        setDescricao(produto.descricao);
      }
    }
  }, [produtoId, produtos]);

  function handleSubmit() {
    if (!nomeProduto || !valor || !estoque || !descricao) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    const valorNumerico = parseFloat(valor) / 100;
    const dadosProduto = {
      id: produtoId || Date.now().toString(),
      nome: nomeProduto,
      valor: valorNumerico,
      estoque: estoque,
      descricao: descricao,
      dataCadastro: isEditing ? produtos.find(p => p.id === produtoId).dataCadastro : new Date().toLocaleDateString(),
    };

    if (isEditing) {
      addLog('EDICAO_PRODUTO', dadosProduto);
      handleEditarProduto(dadosProduto);
      showNotification(`Produto "${dadosProduto.nome}" foi atualizado!`);
    } else {
      addLog('CADASTRO_PRODUTO', dadosProduto);
      handleCadastrarProduto(dadosProduto);
      showNotification(`Produto "${dadosProduto.nome}" foi cadastrado!`);
    }
    
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <HeaderPersonalizado title={isEditing ? 'Editar Produto' : 'Cadastrar Produto'} />        
        <Text style={styles.labels}>Nome:</Text>
        <TextInput
          style={styles.inputs}
          value={nomeProduto}
          onChangeText={setNomeProduto}
          placeholder="Manga Espada"
          placeholderTextColor={theme === 'light' ? '#aaa' : '#8e8e93'}
        />

        <Text style={styles.labels}>Valor:</Text>
        <MaskInput
          style={styles.inputs}
          keyboardType="number-pad"
          value={valor}
          onChangeText={(masked, unmasked) => setValor(unmasked)}
          mask={Masks.BRL_CURRENCY}
        />

        <Text style={styles.labels}>Estoque:</Text>
        <TextInput
          style={styles.inputs}
          keyboardType="number-pad"
          value={estoque}
          onChangeText={setEstoque}
          placeholder="Ex: 10"
          placeholderTextColor={theme === 'light' ? '#aaa' : '#8e8e93'}
        />

        <Text style={styles.labels}>Descrição:</Text>
        <TextInput
          style={styles.areaTexto}
          onChangeText={setDescricao}
          value={descricao}
          multiline={true}
        />

        <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmit}>
          <Text style={{ color: '#fff', fontSize: 16 }}>{isEditing ? 'Salvar Alterações' : 'Cadastrar Item'}</Text>
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
  areaTexto: {
    borderWidth: 1,
    borderColor: theme === 'light' ? '#ccc' : '#555',
    borderRadius: 4,
    color: theme === 'light' ? '#000' : '#fff',
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#3A3A3C',
    padding: 8,
    textAlignVertical: 'top',
    height: 100,
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