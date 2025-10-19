import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function BotaoPersonalizado({ texto, onPress, style }){

  const {theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  return(
    <TouchableOpacity style={[styles.botao, style]} onPress={onPress}>
      <Text style={styles.texto}>{texto}</Text>
    </TouchableOpacity>
  );
}

const getStyles = (theme) => StyleSheet.create({
  botao: {
    backgroundColor: '#228B22',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    width: 150,
    alignItems: 'center',
    // flex: 1,
  },
  texto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})