import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

async function getFrasesPersonalizadas() {
  try {
    const stored = await AsyncStorage.getItem('frasesPersonalizadas');
    if (!stored) return {};

    const data = JSON.parse(stored);
    const agrupadas = {};

    for (const entry of data) {
      const tipo = entry.tipo?.trim();
      const frase = entry.frase?.trim();
      const castigo = entry.castigo?.trim();
      if (!tipo || !frase) continue;

      if (!agrupadas[tipo]) agrupadas[tipo] = [];
      agrupadas[tipo].push({ tipo, frase, castigo });
    }

    return agrupadas;
  } catch (e) {
    console.error('❌ Error al cargar frases personalizadas', e);
    return {};
  }
}

export async function getFrases() {
  try {
    const frasesSnapshot = await getDocs(collection(db, 'frases'));
    const visibles = [];

    frasesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.visible) {
        visibles.push({
          id: doc.id,
          ...data
        });
      }
    });

    // Agrupar por tipo
    const agrupadas = {};
    visibles.forEach(({ tipo = 'N/A', frase, castigo }) => {
      if (!agrupadas[tipo]) agrupadas[tipo] = [];
      agrupadas[tipo].push({ tipo, frase, castigo });
    });


    const frasesPersonalizadas = await getFrasesPersonalizadas();

    for (const tipo in frasesPersonalizadas) {
      if (!agrupadas[tipo]) agrupadas[tipo] = [];
      agrupadas[tipo] = agrupadas[tipo].concat(frasesPersonalizadas[tipo]);
    }

    return agrupadas;
  } catch (error) {
    console.error('❌ Error al cargar frases desde Firestore', error);
    return {};
  }
}

export async function getTodasLasFrases() {
  // 1. Obtener frases agrupadas por tipo (globales y personalizadas)
  const frasesPorTipo = await getFrases();

  // 2. Pasar a array plano todas las frases aprobadas del Sheet (OK=1)
  const globalesFlat = Object.values(frasesPorTipo).flat().filter(f => f.frase);

  // 3. Leer frases personalizadas locales (sin filtrar, aún pueden estar duplicadas)
  const stored = await AsyncStorage.getItem('frasesPersonalizadas');
  let frasesLocales = stored ? JSON.parse(stored) : [];

  // 4. Identificar frases aprobadas (ya existen en Sheet OK=1)
  const setAprobadas = new Set(globalesFlat.map(f => f.frase.trim().toLowerCase()));

  // 5. Filtrar frases locales para quitar las que ya están aprobadas
  const soloLocales = frasesLocales.filter(
    f => f.frase && !setAprobadas.has(f.frase.trim().toLowerCase())
  );

  // 6. Si se han eliminado frases locales aprobadas, actualiza el almacenamiento
  if (soloLocales.length !== frasesLocales.length) {
    await AsyncStorage.setItem('frasesPersonalizadas', JSON.stringify(soloLocales));
  }

  // 7. Insertar frases locales entre la 7 y la 15 (si hay suficientes globales)
  let result = [...globalesFlat];
  soloLocales.forEach(fraseLocal => {
    // Escoge una posición aleatoria entre 7 y 15, o al final si hay menos
    const min = 7;
    const max = Math.min(result.length, 15);
    const pos = Math.floor(Math.random() * (max - min + 1)) + min;
    result.splice(pos, 0, fraseLocal);
  });
  return result;
}