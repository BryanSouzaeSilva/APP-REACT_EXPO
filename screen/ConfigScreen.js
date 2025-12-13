import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BotaoPersonalizado from "../components/botaoPersonalizado";
import HeaderPersonalizado from "../components/headerPersonalizado";

import { ThemeContext } from '../context/ThemeContext';


export default function ConfigScreen({ navigation }){

  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const styles = getStyles(theme);

  return(
    <SafeAreaView style={styles.container}>
      <HeaderPersonalizado title="Configurações" />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.text}>O tema atual é: {theme === 'light' ? 'Claro' : 'Escuro'}</Text>
          <BotaoPersonalizado
            texto="Alterar Tema"
            onPress={toggleTheme}
          />
        </View>
          <BotaoPersonalizado
          texto="Armazenamento Usado"
          onPress={() => navigation.navigate('StorageInfo')}
        />
        <BotaoPersonalizado
          texto="Histórico de Logs"
          onPress={() => navigation.navigate('LogHistory')}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Desenvolvido por Bryan Souza</Text>
          <Text style={styles.footerText}>Version: 1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#f0f0f0' : '#1C1C1E'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
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
    paddingBottom: 20,
    alignItems: 'center',
    marginBottom: 10
  },
  footerText: {
    fontSize: 12,
    color: theme === 'light' ? '#000' : '#fff',
  }
})