const SHEET_API_URL = "https://api.sheetbest.com/sheets/e618ed34-13c6-4113-ac4e-5c4278ee1fcc"; // tu URL real

export async function getFrases() {
  const res = await fetch(SHEET_API_URL);
  const data = await res.json();
  console.log("Respuesta completa desde SheetBest:", data);

  const agrupadas = {};

  for (const entry of data) {
    const tipo = entry["¿Para que tipo de minijuego va?"]?.trim();
    const frase = entry["Escribe tu frase"]?.trim();
    if (!tipo || !frase) {
      console.log("Descartada por falta de tipo o frase:", entry);
      continue;
    }

    if (!agrupadas[tipo]) agrupadas[tipo] = [];
    agrupadas[tipo].push(frase);
  }

  console.log("Títulos agrupados:", Object.keys(agrupadas));
  console.log("Contenido completo de getFrases:", agrupadas);
  return agrupadas;
}

export async function getTodasLasFrases() {
  const frasesPorTipo = await getFrases();
  return Object.values(frasesPorTipo).flat();
}