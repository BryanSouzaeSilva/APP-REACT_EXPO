import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';

import { ThemeContext } from '../context/ThemeContext';

function AceitarTermos({ isChecked, setChecked }) {

    const { theme } = useContext(ThemeContext);

    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? '#28A745' : undefined}
                style={styles.checkbox}
            />
            <TouchableOpacity onPress={() => setChecked(!isChecked)}>
                <Text style={styles.label}>
                    Concordo com os <Text style={styles.link}>Termos de Uso</Text> e a Política de Privacidade
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkbox: {
        marginRight: 8,
    },
    label: {
        fontSize: 14,
        color: theme === 'light' ? '#000' : '#fff',
    },
    link: {
        color: '#28A745',
        textDecorationLine: 'underline',
    },
});

export default AceitarTermos;