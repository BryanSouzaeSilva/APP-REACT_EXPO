import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import BotaoPersonalizado from '../components/botaoPersonalizado';
import HeaderPersonalizado from '../components/headerPersonalizado';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function StorageInfoScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [storageSize, setStorageSize] = useState(0);
  const [loading, setLoading] = useState(true);

  const calcularEspacoUsado = useCallback(() => {
    const calcular = async () => {
      setLoading(true);
      try {
        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);
        
        let totalBytes = 0;
        items.forEach(item => {
          totalBytes += new Blob([item[0]]).size;
          totalBytes += new Blob([item[1]]).size;
        });

        setStorageSize(totalBytes);
      } catch (e) {
        console.error("Erro ao calcular o espaço do AsyncStorage", e);
      } finally {
        setLoading(false);
      }
    };
    
    calcular();
  }, []);

  useFocusEffect(calcularEspacoUsado);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPersonalizado title="Uso do Armazenamento" />
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Espaço total utilizado pelo app:</Text>
          {loading ? (
            <ActivityIndicator size="large" color={theme === 'light' ? '#007AFF' : '#039BE5'} />
          ) : (
            <Text style={styles.sizeText}>{formatBytes(storageSize)}</Text>
          )}
          <Text style={styles.infoText}>
            Este valor representa o espaço ocupado pelas listas de produtos e clientes salvas localmente no seu dispositivo.
          </Text>
        </View>
        <BotaoPersonalizado texto="Atualizar" onPress={calcularEspacoUsado} />
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#f0f0f0' : '#1C1C1E',
  },
  content: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    paddingTop: 40,
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 8,
    backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: 'gray',
  },
  sizeText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: theme === 'light' ? '#007AFF' : '#039BE5',
    marginVertical: 15,
  },
  infoText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
});