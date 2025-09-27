import react, { useEffect, useRef, useContext } from "react";
import { Text, StyleSheet, Animated} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeContext } from "../context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';

export default function Notificacao({ message }) {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(-150)).current;

    useEffect(() => {
        if(message) {
            Animated.timing(translateY, {
                toValue: insets.top,
                duration: 300,
                useNativeDriver: true
            }).start();

            const timer = setTimeout(() => {
                Animated.timing(translateY, {
                    toValue: -150,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [message, translateY, insets.top]);

    if(!message){
        return null;
    }

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
            <Ionicons name="checkmark-circle" size={24} color="white"/>
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});