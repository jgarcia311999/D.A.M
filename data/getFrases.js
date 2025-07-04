import AsyncStorage from '@react-native-async-storage/async-storage';
const SHEET_API_URL = "https://api.sheetbest.com/sheets/e618ed34-13c6-4113-ac4e-5c4278ee1fcc"; // tu URL real

function agruparFrases(data) {
  const agrupadas = {};

  for (const entry of data) {
    const ok = entry["¿OK?"]?.trim();
    if (ok !== "1") continue;

    let tipo = entry["¿Para que tipo de minijuego va?"]?.trim();
    const frase = entry["Escribe tu frase"]?.trim();
    const castigo = entry["Castigo"]?.trim();

    if (!frase) continue;
    if (!tipo) tipo = "N/A";

    if (!agrupadas[tipo]) agrupadas[tipo] = [];
    agrupadas[tipo].push({ tipo, frase, castigo });
  }

  return agrupadas;
}

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
    const res = await fetch(SHEET_API_URL);
    const data = await res.json();

    // Guarda una copia en caché local
    await AsyncStorage.setItem('frasesCache', JSON.stringify(data));

    const frasesGlobales = agruparFrases(data);
    const frasesPersonalizadas = await getFrasesPersonalizadas();

    // Unir frases globales y personalizadas
    const frasesCombinadas = { ...frasesGlobales };
    for (const tipo in frasesPersonalizadas) {
      if (!frasesCombinadas[tipo]) frasesCombinadas[tipo] = [];
      frasesCombinadas[tipo] = frasesCombinadas[tipo].concat(frasesPersonalizadas[tipo]);
    }

    console.log("Frases combinadas:", JSON.stringify(frasesCombinadas, null, 2));
    return frasesCombinadas;
  } catch (error) {
    console.warn('⚠️ No se pudo cargar desde internet. Intentando usar caché local...');

    const fallback = await AsyncStorage.getItem('frasesCache');
    if (fallback) {
      const frasesGlobales = agruparFrases(JSON.parse(fallback));
      const frasesPersonalizadas = await getFrasesPersonalizadas();

      const frasesCombinadas = { ...frasesGlobales };
      for (const tipo in frasesPersonalizadas) {
        if (!frasesCombinadas[tipo]) frasesCombinadas[tipo] = [];
        frasesCombinadas[tipo] = frasesCombinadas[tipo].concat(frasesPersonalizadas[tipo]);
      }

      console.log("Frases combinadas:", JSON.stringify(frasesCombinadas, null, 2));
      return frasesCombinadas;
    } else {
      console.error('❌ No hay datos en caché disponibles');
      return {};
    }
  }
}

export async function getTodasLasFrases() {
  const frasesPorTipo = await getFrases();
  console.log("Todas las frases (array):", JSON.stringify(Object.values(frasesPorTipo).flat(), null, 2));
  return Object.values(frasesPorTipo).flat();
}