import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, SafeAreaView } from 'react-native';

const frases = [
  'Nunca he...',
  'Bebe quien haya mentido hoy',
  'Quien se haya enamorado este año, bebe',
  'Bebe el más fiestero del grupo',
  'Quien tenga el móvil con menos batería, bebe',
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

