import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';

export default function HeaderPersonalizado({ title, showBack = true, onPressBack }) {
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const handleBack = () => {
        if (onPressBack) {
            onPressBack();
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.header}>
            {showBack && (
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={theme === 'light' ? '#000' : '#fff'} />
                </TouchableOpacity>
            )}
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: theme === 'light' ? '#f0f0f0' : '#1C1C1E',
        borderBottomWidth: 1,
        borderBottomColor: theme === 'light' ? '#e0e0e0' : '#333',
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme === 'light' ? '#000' : '#fff',
        flex: 1,
    },
});