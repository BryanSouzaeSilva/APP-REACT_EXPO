import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import BotaoPersonalizado from '../components/botaoPersonalizado';

export default function LogScreen({ navigation }) {
    const { theme, logs } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const renderLogItem = ({ item }) => (
        <View style={styles.logItemContainer}>
            <Text style={styles.logTimestamp}>{new Date(item.timestamp).toLocaleString('pt-BR')}</Text>
            <Text style={styles.logType}>Tipo: {item.tipo}</Text>
            <Text style={styles.logData}>{JSON.stringify(item.dados, null, 2)}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Histórico de Logs</Text>
            </View>
            <FlatList
                data={[...logs].reverse()}
                renderItem={renderLogItem}
                keyExtractor={(item, index) => `${item.timestamp}-${index}`}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum log registrado ainda.</Text>}
                contentContainerStyle={styles.listContainer}
            />
            <BotaoPersonalizado
                texto="Voltar"
                onPress={() => navigation.goBack()}
            />
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === 'light' ? '#f0f0f0' : '#1C1C1E',
        alignItems: 'center',
    },
    header: {
        width: '90%',
        marginVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme === 'light' ? '#000' : '#fff',
        textAlign: 'center',
    },
    listContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    logItemContainer: {
        backgroundColor: theme === 'light' ? '#fff' : '#2C2C2E',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderColor: theme === 'light' ? '#ddd' : '#444',
        borderWidth: 1,
    },
    logTimestamp: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 5,
    },
    logType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme === 'light' ? '#007AFF' : '#039BE5',
        marginBottom: 5,
    },
    logData: {
        fontSize: 14,
        color: theme === 'light' ? '#333' : '#ccc',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#888',
    },
});