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

  console.log("Todas las frases (array) - mezcladas:", JSON.stringify(result, null, 2));
  return result;
}