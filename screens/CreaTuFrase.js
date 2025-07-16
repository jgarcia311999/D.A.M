import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
// Si usas haptics:
import * as Haptics from 'expo-haptics';

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
  const [enviando, setEnviando] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerText, setBannerText] = useState('');
  const insets = useSafeAreaInsets();
  const [mostrarBoton, setMostrarBoton] = useState(false);

  useEffect(() => {
    let timer;
    if (bannerVisible) {
      timer = setTimeout(() => {
        setBannerVisible(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [bannerVisible]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.toString().includes('230566')) {
        setMostrarBoton(true);
      }
    }
  }, []);

  const guardarFraseLocal = async (nuevaFrase) => {
    try {
      const key = 'frases_usuario';
      const guardadas = await AsyncStorage.getItem(key);
      let frases = guardadas ? JSON.parse(guardadas) : [];
      frases.unshift(nuevaFrase);
      await AsyncStorage.setItem(key, JSON.stringify(frases));
    } catch (e) {
      console.error('No se pudo guardar en local', e);
    }
  };

  const enviarFrase = async () => {
    if (!frase.trim()) return;
    // Si el castigo está vacío, ponerlo a "1"
    let castigoFinal = castigo;
    if (!castigoFinal.trim()) {
      castigoFinal = "1";
      setCastigo("1");
    }
    setEnviando(true);
    const payload = {
      tipo,
      frase,
      castigo: castigoFinal,
      visible: false,
      timestamp: serverTimestamp(),
    };
    try {
      const docRef = await addDoc(collection(db, 'frases'), payload);
      await guardarFraseLocal({
        ...payload,
        timestamp: Date.now(),
        ok: '0',
      });
      setBannerText('¡Frase creada!');
      setBannerVisible(true);
      setFrase(''); // Limpiar input de frase tras enviar
    } catch (err) {
      alert('Error de conexión: ' + err.message);
    }
    setEnviando(false);
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {bannerVisible && (
        <TouchableOpacity 
          style={[styles.banner, {top: insets.top}]} 
          onPress={() => setBannerVisible(false)}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle-outline" size={24} color="#fff" style={{marginRight: 8}} />
          <Text style={styles.bannerText}>{bannerText}</Text>
        </TouchableOpacity>
      )}
      <View style={{
        position: 'absolute',
        top: insets.top + 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10
      }}>
        <TouchableOpacity onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Juego 4');
          }
        }}>
          <Ionicons name="arrow-back" size={28} color="#5E1DE6" />
        </TouchableOpacity>
        {(Platform.OS !== 'web' || mostrarBoton) && (
          <TouchableOpacity
            style={styles.tuFraseBtn}
            onPress={() => navigation.navigate('TodasFrases')}
          >
            <Text style={styles.tuFraseBtnText}>Todas las frases</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 80 }}>
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
          style={[styles.enviarBtn, { backgroundColor: frase.trim() ? '#5E1DE6' : '#E2D6FF' }]}
          onPress={enviarFrase}
          disabled={!frase.trim() || enviando}
        >
          <Text style={styles.enviarBtnTxt}>{enviando ? 'Enviando...' : 'Añadir frase'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Puedes añadir estos estilos para el botón derecho:
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
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 14,
    alignItems: 'center'
  },
  enviarBtnTxt: {
    color: '#fff',
    fontFamily: 'Panchang-Bold',
    fontSize: 18
  },
  tuFraseBtn: {
    backgroundColor: '#5E1DE6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8
  },
  tuFraseBtnText: {
    color: '#fff',
    fontFamily: 'Panchang-Bold',
    fontSize: 16
  },
  banner: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CD964',
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 20,
  },
  bannerText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Panchang-Bold',
  },
});