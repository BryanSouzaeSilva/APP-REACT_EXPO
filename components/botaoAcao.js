import react from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function BotaoDeAcao({ iconName, color, onPress }){
    return(
        <TouchableOpacity
            style={[styles.container, { backgroundColor: color}]}
            onPress={onPress}
        >
            <Ionicons name={iconName} size={20} color="#ffff" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderRadius: 50, 
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40
    }
})