import React, { useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import BotaoPersonalizado from "../components/botaoPersonalizado";

import { ThemeContext } from '../context/ThemeContext';


export default function ConfigScreen({ navigation }){

  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const styles = getStyles(theme);

  return(
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <View style={styles.card}>
        <Text style={styles.text}>O tema atual é: {theme === 'light' ? 'Claro' : 'Escuro'}</Text>
        <BotaoPersonalizado
          texto="Alterar Tema"
          onPress={toggleTheme}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Desenvolvido por Bryan Souza</Text>
        <Text style={styles.footerText}>Version: 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme === 'light' ? '#f0f0f0' : '#1C1C1E'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme === 'light' ? '#000' : '#fff',
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    color: theme === 'light' ? '#000' : '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: theme === 'light' ? '#000' : '#fff',
  }
})