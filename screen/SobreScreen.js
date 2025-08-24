import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import { ThemeContext } from '../context/ThemeContext';
import BotaoPersonalizado from '../components/botaoPersonalizado';

export default function SobreScreen({navigation}){

  const { theme } = useContext(ThemeContext);

  const styles = getStyles(theme);

  
  return(
    <View style={styles.container}>
      <Text style={styles.titulo}> Sobre o App</Text>
      <Text style={styles.texto}>Este é um exemplo básico de aplicativo React Native com Expo</Text>
      <BotaoPersonalizado texto="Voltar" onPress={() => navigation.goBack()}/>
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme == 'light' ? '#e0e0e0' : '#1C1C1E',
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme === 'light' ? '#000' : '#fff',
  },
  texto: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: theme === 'light' ? '#000' : '#fff',
  },
  
})