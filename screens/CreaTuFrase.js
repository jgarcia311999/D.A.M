import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const tiposMinijuego = [
  "N/A",
  "Castigos",
  "Vota a...",
  "Reglas locas",
];

export default function CreaTuFrase({ navigation }) {
  const [frase, setFrase] = useState('');
  const [tipo, setTipo] = useState('N/A');
  const [castigo, setCastigo] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 48,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ececec'
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 4, paddingRight: 16}}>
          <Ionicons name="arrow-back" size={28} color="#5E1DE6" />
        </TouchableOpacity>
        <View style={{flex: 1}} />
      </View>
      <Text style={styles.titulo}>Crea tu frase</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu frase..."
        placeholderTextColor="#888"
        value={frase}
        onChangeText={setFrase}
        multiline
      />
      <Text style={styles.label}>Tipo de minijuego:</Text>
      <View style={styles.tiposContainer}>
        {tiposMinijuego.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tipoBtn, tipo === t && styles.tipoBtnSel]}
            onPress={() => setTipo(t)}
          >
            <Text style={styles.tipoTxt}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Castigo (opcional)"
        placeholderTextColor="#888"
        value={castigo}
        onChangeText={setCastigo}
      />
      <TouchableOpacity
        style={styles.enviarBtn}
        onPress={() => {
          // La lógica la añades más adelante
          alert('¡Frase enviada!\n\n' + frase);
          navigation.goBack();
        }}
        disabled={!frase.trim()}
      >
        <Text style={styles.enviarBtnTxt}>Añadir frase</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding:24, paddingTop:40 },
  titulo: {
    fontFamily: 'Panchang-Bold',
    fontSize: 26,
    marginBottom: 18,
    color: '#5E1DE6',
    textAlign:'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2D6FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#F6F0FF',
    color: '#222',
    fontFamily: 'Panchang-Bold',
    fontSize: 16
  },
  label: { fontSize: 16, marginBottom: 6, marginTop: 8, fontWeight:'600', color:'#5E1DE6' },
  tiposContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  tipoBtn: {
    backgroundColor: '#F6F0FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth:1,
    borderColor:'#E2D6FF',
    marginRight: 8,
    marginBottom: 8,
  },
  tipoBtnSel: {
    backgroundColor: '#E2D6FF',
    borderColor: '#5E1DE6',
  },
  tipoTxt: { color:'#5E1DE6', fontFamily: 'Panchang-Bold' },
  enviarBtn: {
    backgroundColor: '#E2D6FF',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 14,
    alignItems: 'center'
  },
  enviarBtnTxt: {
    color: '#fff',
    fontFamily: 'Panchang-Bold',
    fontSize: 18
  }
});