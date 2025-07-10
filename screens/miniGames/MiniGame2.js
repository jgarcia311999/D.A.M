import React from 'react';
import * as Haptics from 'expo-haptics';
import { View, Text, StyleSheet, TouchableWithoutFeedback, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const frases = [
  'No estaria con una gorda',
  'No estaria con un calvo',
  'No estaria con alguien sin un minimo de estudios',
  'No estaria con alguien que fume',
  "No estaría con alguien que se depile las cejas más que yo",
  "No estaría con alguien que no folle bien",
  "No estaría con alguien que no me lo coma bien",
  "No estaría con alguien que no chupe en el primer polvo",
  "No estaría con alguien que no beba",
  "No estaría con alguien que diga bro cada dos palabras, bro",
  "F*llar con calcetines debería ser delito.",
  "Si no me haces reír, ni te me acerques.",
  "Si no tiene habilidades sociales, fuera.",
  "Si no me vas a sudar la camiseta, ni me la quites.",
  "Decir ‘soy intenso’ no te hace especial, te hace pesado.",
  "El que dice ‘no estoy buscando nada’ está buscando sexo.",
  "Los polvos improvisados siempre ganan a los planeados.",
  "Un beso con pique vale más que mil mensajes.",
  "Las primeras citas deberían ser con test psicológico incluido.",
  "Si no sabe lo que quiere, que no moleste.",
  "El horóscopo es excusa para no madurar.",
  "Decir ‘soy un cabrón’ no te hace interesante.",
  "Prefiero sinceridad cruel que ghosting sutil.",
  "Decir que ‘no crees en etiquetas’ es la nueva forma de no comprometerse.",
  "El ‘rapidito’ no siempre es sexy, a veces es decepcionante.",
  "Tu ex no era tóxico, tú eras adicto al drama.",
  "No eres directa, eres gilipollas.",
];

export default function MiniGame2({ navigation }) {
  const insets = useSafeAreaInsets();
  const [fraseActual, setFraseActual] = React.useState(() => {
    return frases[Math.floor(Math.random() * frases.length)];
  });

  const cambiarFrase = () => {
    let nueva;
    do {
      nueva = frases[Math.floor(Math.random() * frases.length)];
    } while (nueva === fraseActual);
    setFraseActual(nueva);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => {
          Haptics.selectionAsync();
          navigation.goBack();
        }}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { /* vacío de momento */ }}>
          <Ionicons name="ellipsis-vertical" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback onPress={cambiarFrase}>
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.text}>{fraseActual}</Text>
          </View>
          <View style={{ marginTop: 32, alignItems: 'center' }}>
            <Ionicons name="hand-left-outline" size={32} color="#d5c385" />
            <Text style={{ color: '#d5c385', marginTop: 4, fontSize: 16 }}>Toca para cambiar</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191716',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#a3c8ff',
    borderRadius: 18,
    padding: 28,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#191716',
    textAlign: 'center',
    fontFamily: 'Panchang-Regular',
    paddingHorizontal: 28,
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
});
