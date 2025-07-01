import AsyncStorage from '@react-native-async-storage/async-storage';
const SHEET_API_URL = "https://api.sheetbest.com/sheets/e618ed34-13c6-4113-ac4e-5c4278ee1fcc"; // tu URL real

function agruparFrases(data) {
  const agrupadas = {};

  for (const entry of data) {
    const tipo = entry["¿Para que tipo de minijuego va?"]?.trim();
    const frase = entry["Escribe tu frase"]?.trim();
    const castigo = entry["Castigo"]?.trim();
    if (!tipo || !frase) continue;

    if (!agrupadas[tipo]) agrupadas[tipo] = [];
    agrupadas[tipo].push({ tipo, frase, castigo });
  }

  return agrupadas;
}

export async function getFrases() {
  try {
    const res = await fetch(SHEET_API_URL);
    const data = await res.json();

    // Guarda una copia en caché local
    await AsyncStorage.setItem('frasesCache', JSON.stringify(data));

    return agruparFrases(data);
  } catch (error) {
    console.warn('⚠️ No se pudo cargar desde internet. Intentando usar caché local...');

    const fallback = await AsyncStorage.getItem('frasesCache');
    if (fallback) {
      return agruparFrases(JSON.parse(fallback));
    } else {
      console.error('❌ No hay datos en caché disponibles');
      return {};
    }
  }
}

export async function getTodasLasFrases() {
  const frasesPorTipo = await getFrases();
  return Object.values(frasesPorTipo).flat();
}