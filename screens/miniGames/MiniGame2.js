import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, SafeAreaView } from 'react-native';

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

export default function MiniGame2() {
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
    <TouchableWithoutFeedback onPress={cambiarFrase}>
      <SafeAreaView style={[styles.container, { paddingTop: 50 }]}>
        <Text style={styles.text}>{fraseActual}</Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191716',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
});
