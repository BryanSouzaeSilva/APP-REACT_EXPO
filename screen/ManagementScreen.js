import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';

export default function ManagementScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const MenuButton = ({ title, icon, route, color }) => (
        <TouchableOpacity 
            style={[styles.card, { borderLeftColor: color }]} 
            onPress={() => navigation.navigate(route)}
        >
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
                <MaterialCommunityIcons name={icon} size={30} color="#fff" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardSubtitle}>Toque para acessar</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={theme === 'light' ? '#ccc' : '#555'} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.headerTitle}>Menu de Gestão</Text>
            
                <MenuButton 
                    title="Nova Venda (PDV)" 
                    icon="point-of-sale" 
                    route="Sales" 
                    color="#AF52DE" 
                />

                <MenuButton 
                    title="Produtos" 
                    icon="package-variant-closed" 
                    route="ProductList" 
                    color="#007AFF" 
                />
                
                <MenuButton 
                    title="Clientes" 
                    icon="account-group" 
                    route="ClientList" 
                    color="#28A745" 
                />
                
                <MenuButton 
                    title="Fornecedores" 
                    icon="truck-delivery" 
                    route="SupplierList" 
                    color="#FF9500" 
                />

                <View style={styles.divider} />

                <MenuButton 
                    title="Configurações" 
                    icon="cog" 
                    route="ConfigDefault" 
                    color="#8E8E93" 
                />

            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === 'light' ? '#f0f0f0' : '#1C1C1E',
    },
    content: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme === 'light' ? '#000' : '#fff',
        marginBottom: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme === 'light' ? '#000' : '#fff',
    },
    cardSubtitle: {
        fontSize: 12,
        color: 'gray',
    },
    divider: {
        height: 1,
        backgroundColor: theme === 'light' ? '#ddd' : '#444',
        marginVertical: 10,
    }
});