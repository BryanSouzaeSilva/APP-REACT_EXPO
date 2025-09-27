import { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../context/ThemeContext';
import MaskInput, { Masks } from 'react-native-mask-input';
import AceitarTermos from '../../components/aceitarTermos';

export default function ClientFormScreen({ navigation }) {

  const { theme, handleCadastrarCliente, showNotification} = useContext(ThemeContext);
  const styles = getStyles(theme);

  // const { onCadastrarCliente } = route.params;
  
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCPF] = useState('');
  const [isChecked, setChecked] = useState(false);

  function handleSubmit() {
    if (!nome || !telefone || !endereco || !email || !cpf) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }
    if (!isChecked) {
      Alert.alert('Erro', 'Você deve aceitar os termos para continuar');
      return;
    }

    const novoCliente = {
      id: Date.now().toString(),
      nome: nome,
      telefone: telefone,
      endereco: endereco,
      email: email,
      cpf: cpf,
      dataCadastro: new Date().toLocaleDateString(),
    };

    handleCadastrarCliente(novoCliente);

    showNotification(`Cliente "${novoCliente.nome}" foi cadastrado!`);
    
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.title}>Cadastrar Cliente</Text>

        <Text style={styles.labels}>Nome:</Text>
        <TextInput
          style={styles.inputs}
          value={nome}
          onChangeText={setNome}
          placeholder="José da Silva"
          placeholderTextColor={theme === 'light' ? '#aaa' : '#8e8e93'}
        />

        <Text style={styles.labels}>Telefone:</Text>
        <MaskInput
          style={styles.inputs}
          keyboardType="number-pad"
          value={telefone}
          onChangeText={(masked, unmasked) => setTelefone(unmasked)}
          mask={Masks.BRL_PHONE}
          placeholderTextColor={theme === 'light' ? '#aaa' : '#8e8e93'}
        />

        <Text style={styles.labels}>Endereço:</Text>
        <TextInput
          style={styles.inputs}
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Av. Brasil, 123"
          placeholderTextColor={theme === 'light' ? '#aaa' : '#8e8e93'}
        />

        <Text style={styles.labels}>E-mail:</Text>
        <TextInput
          style={styles.inputs}
          keyboardType="email-address"
          value={email} onChangeText={setEmail}
          placeholder="jose.silva@email.com"
          placeholderTextColor={theme === 'light' ? '#aaa' : '#8e8e93'}
        />

        <Text style={styles.labels}>CPF:</Text>
        <MaskInput
          style={styles.inputs}
          keyboardType="number-pad"
          value={cpf}
          onChangeText={(masked, unmasked) => setCPF(unmasked)}
          mask={Masks.BRL_CPF}
          placeholderTextColor={theme === 'light' ? '#aaa' : '#8e8e93'}
        />
        
        <AceitarTermos isChecked={isChecked} setChecked={setChecked} />

        <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmit}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Cadastrar Cliente</Text>
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