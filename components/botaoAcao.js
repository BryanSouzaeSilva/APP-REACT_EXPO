import react from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BotaoDeAcao({ iconName, color, onPress, style }){
    return(
        <TouchableOpacity
            style={[styles.container, { backgroundColor: color}, style]}
            onPress={onPress}
        >
            <MaterialCommunityIcons name={iconName} size={20} color="#ffff" />
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