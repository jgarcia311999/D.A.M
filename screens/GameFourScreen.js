import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Dimensions, Easing } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Svg, Path } from 'react-native-svg';

export default function GameFourScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const [showOrientationPrompt, setShowOrientationPrompt] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    // Frases para el juego
    const frases = [
        'Di el nombre de 3 canciones de fiesta.',
        'Haz una imitación de alguien del grupo.',
        'Di una palabra que rime con “noche”.',
        'Nombra un animal y pasa la bomba.',
        'Haz una pregunta absurda a otro jugador.',
        'Di un color y toca algo de ese color.',
        'Grita un número aleatorio entre 1 y 50.',
        'Haz un sonido raro y pasa la bomba.',
        'Cuenta un secreto (o invéntalo).',
        'Nombra una ciudad y di si has estado o no.',
        'Haz una pose de modelo.',
        'Cambia de sitio con otro jugador.',
        'Di algo que nunca harías en una fiesta.',
        'Ladra como un perro.',
        'Haz una pregunta de sí o no al siguiente jugador.',
        'Nombra un famoso con la letra M.',
        'Di lo primero que te venga a la cabeza.',
        'Mira a alguien a los ojos sin reírte.',
        'Canta una línea de cualquier canción.',
        'Pásale la bomba a quien tenga más estilo.',
        // Frases adicionales:
        '¿Quién es más probable que se quede dormido en una fiesta?',
        '¿Quién es más probable que mande un mensaje a su ex?',
        '¿Quién es más probable que pierda el móvil en una noche de fiesta?',
        '¿Quién es más probable que termine bailando en la barra?',
        '¿Quién es más probable que se haga famoso sin razón?',
        '¿Quién es más probable que empiece una pelea en una discoteca?',
        '¿Quién es más probable que no recuerde nada mañana?',
        '¿Quién es más probable que cante en un karaoke sin que se lo pidan?',
        '¿Quién es más probable que se enamore en una sola noche?',
        '¿Quién es más probable que desaparezca sin avisar?',
        '¿Quién es más probable que se quede sin batería en mitad de la noche?',
        '¿Quién es más probable que pierda una apuesta y no lo cumpla?',
        '¿Quién es más probable que grabe stories de TODO?',
        '¿Quién es más probable que se lleve algo de la fiesta “por error”?',
        '¿Quién es más probable que diga “ya no bebo más” y beba igual?',
        '¿Quién es más probable que organice la próxima fiesta?',
        '¿Quién es más probable que tenga una cuenta secreta en redes?',
        '¿Quién es más probable que se enamore de un bartender?',
        '¿Quién es más probable que empiece a llorar de la nada?',
        '¿Quién es más probable que acabe cantando con un desconocido?',
        'Di 3 canciones de reggaetón.',
        'Haz 5 sentadillas.',
        'Nombra 4 países que empiecen con “C”.',
        'Tócate la nariz con la lengua.',
        'Haz un sonido de animal y que el grupo lo adivine.',
        'Envía un emoji random al grupo.',
        'Imita a otro jugador hasta que alguien adivine quién.',
        'Nombra 3 bebidas alcohólicas.',
        'Cuenta hasta 10 al revés.',
        'Haz una mini coreo de TikTok.',
        'Di el abecedario desde la Z.',
        'Haz 3 ruidos diferentes con la boca.',
        'Inventa una frase con 3 palabras raras.',
        'Haz una pose sexy y mantenla.',
        'Di 3 cosas que nunca harías en una cita.',
        'Pide un brindis con voz de personaje.',
        'Di 5 palabras en inglés.',
        'Dibuja un corazón con el dedo en el aire.',
        'Ponte un zapato en la cabeza.',
        'Baila como si estuvieras en una boda.',
        'Todos los que han viajado este año.',
        'Todos los que han tenido una cita fallida.',
        'Todos los que están solteros.',
        'Todos los que han llorado viendo una peli.',
        'Todos los que han mentido esta semana.',
        'Todos los que llevan ropa negra ahora mismo.',
        'Todos los que han enviado un mensaje borrachos.',
        'Todos los que han hecho ghosting alguna vez.',
        'Todos los que tienen una mascota.',
        'Todos los que alguna vez se han colado en una fiesta.',
        'Todos los que han salido de fiesta entre semana.',
        'Todos los que han usado Tinder.',
        'Todos los que han llegado tarde hoy.',
        'Todos los que han hecho el ridículo en público.',
        'Todos los que han tenido una pelea por WhatsApp.',
        'Todos los que han dicho “nunca más bebo” y han vuelto a beber.',
        'Todos los que han cantado en un karaoke.',
        'Todos los que han mandado una nota de voz de más de 1 minuto.',
        'Todos los que han ido a clase/curro sin dormir.',
        'Todos los que han perdido algo importante en una fiesta.',
        '¡El primero que toque algo rojo!',
        '¡El primero que diga una marca de cerveza!',
        '¡El primero que le dé un abrazo al otro!',
        '¡El primero que saque una moneda!',
        '¡El primero que diga “DAM” en voz alta!',
        '¡El primero que muestre una foto en su móvil!',
        '¡El primero que toque la puerta más cercana!',
        '¡El primero que cante una canción de reggaetón!',
        '¡El primero que diga el nombre de otro jugador!',
        '¡El primero que se ponga de pie!',
        '¡El primero que diga un color en inglés!',
        '¡El primero que toque su nariz y luego su oreja!',
        '¡El primero que envíe un emoji en el grupo!',
        '¡El primero que toque su pie con las dos manos!',
        '¡El primero que se haga un selfie!',
        '¡El primero que mencione una capital europea!',
        '¡El primero que diga el nombre del host de la fiesta!',
        '¡El primero que haga una pose ridícula!',
        '¡El primero que diga “yo nunca nunca…”!',
        '¡El primero que toque el suelo con la frente!',
    ];
    const [fraseActual, setFraseActual] = useState('');

    useEffect(() => {
        /* if (!route.params?.jugadores || route.params.jugadores.length === 0) {
            Alert.alert(
                'Sin jugadores',
                'Debes añadir jugadores antes de jugar.',
                [{ text: 'Volver al inicio', onPress: () => navigation.navigate('Inicio') }]
            );
        } */

        const initialIndex = Math.floor(Math.random() * frases.length);
        setFraseActual(frases[initialIndex]);

        // Fade out prompt after 3 seconds
        const timeout = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => setShowOrientationPrompt(false));
        }, 3000);

        // Listen for orientation changes to fade out early
        const handleOrientationChange = () => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => setShowOrientationPrompt(false));
        };
        const subscription = Dimensions.addEventListener
            ? Dimensions.addEventListener('change', handleOrientationChange)
            : Dimensions.addEventListener && Dimensions.addEventListener('change', handleOrientationChange);

        return () => {
            clearTimeout(timeout);
            if (subscription && subscription.remove) {
                subscription.remove();
            } else if (Dimensions.removeEventListener) {
                Dimensions.removeEventListener('change', handleOrientationChange);
            }
        };
    }, []);

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    // Manejar el toque para mostrar una frase aleatoria
    const handlePress = () => {
        const randomIndex = Math.floor(Math.random() * frases.length);
        setFraseActual(frases[randomIndex]);
    };

    return (
        <View style={styles.container} onTouchEnd={handlePress}>
            {showOrientationPrompt && (
                <Animated.View style={[styles.orientationPrompt, { opacity: fadeAnim }]}>
                    <Animated.View style={{
                        transform: [{
                            rotate: rotateAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg'],
                            })
                        }]
                    }}>
                        <Svg width={50} height={50} viewBox="0 0 24 24" fill="none">
                            <Path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </Animated.View>
                    <Text style={styles.promptText}>Gira el móvil</Text>
                </Animated.View>
            )}
            {!showOrientationPrompt && (
                <>
                    <Text style={styles.frase}>{fraseActual}</Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orientationPrompt: {
        position: 'absolute',
        left: 100,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
        borderRadius: 10,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        transform: [{ rotate: '90deg' }],
    },
    promptText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginLeft: 10,
    },
    startPrompt: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        transform: [{ rotate: '90deg' }],
    },
    frase: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        transform: [{ rotate: '90deg' }, { translateY: -12 }],
    },
});