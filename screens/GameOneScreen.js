import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

const palos = ['oros', 'copas', 'espadas', 'bastos'];
const colores = {
    oros: 'rojo',
    copas: 'rojo',
    espadas: 'negro',
    bastos: 'negro',
};

const generarCarta = () => {
    const palo = palos[Math.floor(Math.random() * palos.length)];
    const numero = Math.floor(Math.random() * 12) + 1;
    return { palo, numero, color: colores[palo] };
};

export default function GameOneScreen({ route }) {
    const [fase, setFase] = useState(0);
    const [cartas, setCartas] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [resultado, setResultado] = useState(null);
    const [jugadorActual, setJugadorActual] = useState('');
    const jugadores = route?.params?.jugadores || [];

    const seleccionarJugadorAleatorio = useCallback(() => {
      if (jugadores.length > 0) {
        const nombre = jugadores[Math.floor(Math.random() * jugadores.length)];
        setJugadorActual(nombre);
      }
    }, []);

    const iniciarJuego = () => {
        seleccionarJugadorAleatorio();
        setFase(1);
        setCartas([]);
        setMensaje('');
        setResultado(null);
    };

    const reiniciar = () => {
        setFase(0);
        setCartas([]);
        setMensaje('');
        setResultado(null);
    };

    const elegirColor = (colorElegido) => {
        const carta = generarCarta();
        setCartas([carta]);
        if (carta.color === colorElegido) {
            setMensaje(`✅ Correcto, era ${carta.color} de ${carta.palo} (${carta.numero})`);
            setFase(2);
        } else {
            setMensaje(`❌ Fallaste. Era ${carta.color} de ${carta.palo} (${carta.numero})`);
            setResultado('perdiste');
            setFase(0);
        }
    };

    const elegirMayorMenor = (opcion) => {
        const cartaAnterior = cartas[0];
        const nuevaCarta = generarCarta();
        setCartas([...cartas, nuevaCarta]);

        const comparacion = nuevaCarta.numero > cartaAnterior.numero ? 'mayor' : (nuevaCarta.numero < cartaAnterior.numero ? 'menor' : 'igual');

        if (comparacion === opcion) {
            setMensaje(`✅ Correcto, la nueva carta es ${nuevaCarta.palo} (${nuevaCarta.numero})`);
            setFase(3);
        } else {
            setMensaje(`❌ Fallaste. La nueva carta era ${nuevaCarta.palo} (${nuevaCarta.numero})`);
            setResultado('perdiste');
            setFase(0);
        }
    };

    const elegirEntre = (opcion) => {
        const [c1, c2] = cartas;
        const nuevaCarta = generarCarta();
        setCartas([...cartas, nuevaCarta]);

        const min = Math.min(c1.numero, c2.numero);
        const max = Math.max(c1.numero, c2.numero);
        const estaEntre = nuevaCarta.numero > min && nuevaCarta.numero < max;

        if ((estaEntre && opcion === 'sí') || (!estaEntre && opcion === 'no')) {
            setMensaje(`✅ Correcto. Era ${nuevaCarta.palo} (${nuevaCarta.numero})`);
            setFase(4);
        } else {
            setMensaje(`❌ Fallaste. Era ${nuevaCarta.palo} (${nuevaCarta.numero})`);
            setResultado('perdiste');
            setFase(0);
        }
    };

    const elegirPalo = (paloElegido) => {
        const nuevaCarta = generarCarta();
        setCartas([...cartas, nuevaCarta]);

        if (nuevaCarta.palo === paloElegido) {
            setMensaje(`🎉 ¡Ganaste! Era ${nuevaCarta.palo} (${nuevaCarta.numero})`);
            setResultado('ganaste');
        } else {
            setMensaje(`❌ Fallaste. Era ${nuevaCarta.palo} (${nuevaCarta.numero})`);
            setResultado('perdiste');
            setFase(0);
        }
    };


    return (
        <View style={styles.container}>
            {jugadorActual !== '' && (
              <Text style={styles.turno}>🎮 {jugadorActual}, te toca jugar!</Text>
            )}
            {cartas.length > 0 && (
                <View style={styles.historial}>
                    <Text style={styles.historialTitulo}>Cartas jugadas:</Text>
                    {[...cartas].reverse().map((carta, index) => (
                        <Text key={index} style={styles.historialItem}>
                            {carta.numero} de {carta.palo} ({carta.color})
                        </Text>
                    ))}
                </View>
            )}
            <Text style={styles.title}>🎴 Juego de Cartas</Text>

            {fase === 0 && <Button title="Iniciar partida" onPress={iniciarJuego} />}

            {fase === 1 && (
                <>
                    <Text style={styles.question}>¿Rojo o Negro?</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.choiceButton, { backgroundColor: '#c0392b' }]} onPress={() => elegirColor('rojo')}>
                            <Text style={styles.buttonText}>Rojo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.choiceButton, { backgroundColor: '#2c3e50' }]} onPress={() => elegirColor('negro')}>
                            <Text style={styles.buttonText}>Negro</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {fase === 2 && (
                <>
                    <Text style={styles.question}>¿La siguiente carta será mayor o menor que la anterior?</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.choiceButton} onPress={() => elegirMayorMenor('mayor')}>
                            <Text style={styles.buttonText}>Mayor</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.choiceButton} onPress={() => elegirMayorMenor('menor')}>
                            <Text style={styles.buttonText}>Menor</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {fase === 3 && (
                <>
                    <Text style={styles.question}>¿La siguiente carta estará entre las dos anteriores?</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.choiceButton} onPress={() => elegirEntre('sí')}>
                            <Text style={styles.buttonText}>Sí</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.choiceButton} onPress={() => elegirEntre('no')}>
                            <Text style={styles.buttonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {fase === 4 && (
                <>
                    <Text style={styles.question}>¿Qué palo será la siguiente carta?</Text>
                    <View style={styles.palosGrid}>
                        {palos.map((palo) => (
                            <TouchableOpacity key={palo} style={styles.choiceButton} onPress={() => elegirPalo(palo)}>
                                <Text style={styles.buttonText}>{palo}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}

            {mensaje !== '' && <Text style={styles.message}>{mensaje}</Text>}

            {resultado && (
                <View style={{ marginTop: 20 }}>
                    <Button title="🔁 Reiniciar partida" onPress={reiniciar} />
                </View>
            )}

            {resultado === null && fase > 0 && (
                <View style={{ marginTop: 10 }}>
                    <Button title="✋ Plantarse" onPress={() => {
                        setResultado('plantado');
                        setMensaje(`Te plantaste con ${cartas.length} carta(s).`);
                    }} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
    question: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
    message: { fontSize: 16, marginTop: 20, marginBottom: 10, textAlign: 'center' },
    buttonRow: { flexDirection: 'row', gap: 16, marginVertical: 10 },
    palosGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginVertical: 10 },
    choiceButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        margin: 5,
    },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    historial: {
        marginBottom: 20,
        width: '100%',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
    },
    historialTitulo: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 16,
    },
    historialItem: {
        fontSize: 14,
        color: '#555',
    },
    turno: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10,
      color: '#2d3436',
    },
});