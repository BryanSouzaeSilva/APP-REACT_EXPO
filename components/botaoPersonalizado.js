import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BotaoPersonalizado({ texto, onPress }){
  return(
    <TouchableOpacity style={styles.botao} onPress={onPress}>
      <Text style={styles.texto}>{texto}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: '#228B22',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    width: 150,
    alignItems: 'center',
  },
  texto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})