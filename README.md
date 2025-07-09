
# D.A.M

Aplicación de juegos y retos sociales, perfecta para reuniones entre amigos.

## Descripción General

D.A.M es una app que reúne una colección de minijuegos y dinámicas para grupos, pensada para romper el hielo, divertirse y compartir retos únicos en cualquier ocasión social. Incluye juegos de cartas, retos aleatorios, creación y visualización de frases, y mucho más.

## Tecnologías Utilizadas

- React Native (con Expo)
- Firebase
- AsyncStorage
- Navegación: React Navigation
- Librerías de UI: React Native Vector Icons, Expo Haptics, etc.

## Instalación y Ejecución

1. **Clona el repositorio:**  
   ```bash
   git clone [REPO_URL]
   cd D.A.M
   ```

2. **Instala las dependencias:**  
   ```bash
   npm install
   ```

3. **Configura Firebase:**  
   Agrega tus credenciales de Firebase en los archivos correspondientes (`firebase.json` o la configuración en el proyecto).

4. **Ejecuta la app:**  
   ```bash
   npm start
   ```
   o
   ```bash
   expo start
   ```

5. **Abre en tu emulador o con la app Expo Go en tu dispositivo.**

## Uso General de la App

Al iniciar D.A.M, el usuario puede navegar entre diferentes modos de juego, retos y minijuegos. La navegación es intuitiva y cada pantalla tiene una función bien definida.

---

# Funcionamiento de Cada Pantalla

## TittleScreen

**Propósito:**  
Pantalla de bienvenida de la app.

**Funcionamiento:**  
Muestra el título del juego, animaciones atractivas y un botón para continuar al menú principal. Es la primera pantalla que ve el usuario.

---

## HomeScreen

**Propósito:**  
Menú principal de la aplicación.

**Funcionamiento:**  
Permite navegar a los distintos modos de juego, minijuegos y opciones. Suele tener animaciones, botones grandes y accesibles para cada modo de juego.

---

## PruebaHomeScreen

**Propósito:**  
Versión de pruebas del menú principal.

**Funcionamiento:**  
Permite testear nuevas funciones o elementos del HomeScreen sin afectar la versión principal. Puede mostrar nuevos diseños o funciones en desarrollo.

---

## GamesScreen

**Propósito:**  
Menú para acceder a los juegos principales.

**Funcionamiento:**  
Lista y organiza los diferentes juegos disponibles. Permite al usuario seleccionar a cuál jugar, mostrando a veces opciones o configuraciones adicionales.

---

## GamerScreen

**Propósito:**  
Gestión y visualización de jugadores.

**Funcionamiento:**  
Permite agregar, editar y mostrar los nombres o avatares de los jugadores que participan en los juegos. Almacena esta información localmente y la muestra en los juegos.

---

## MiniGamesScreen

**Propósito:**  
Selector de minijuegos adicionales.

**Funcionamiento:**  
Permite explorar y acceder a diferentes minijuegos cortos. Muestra una lista visual con imágenes, títulos y botones para empezar cada uno.

---

## GameOneScreen / PruebaGameOneScreen

**Propósito:**  
Juego principal tipo cartas.

**Funcionamiento:**  
Muestra una baraja de cartas y asigna retos aleatorios según la carta que se saque. Incluye lógica para mostrar imágenes de cartas, reglas asociadas, y pasar turno entre jugadores. La versión “Prueba” es para testeo de nuevas reglas o diseños.

---

## GameTwoScreen / PruebaGameTwoScreen

**Propósito:**  
Segundo juego de cartas o dinámicas.

**Funcionamiento:**  
Mecánica similar al anterior pero con otras reglas, barajas o retos. Incluye lógica de barajado, interacción visual, y turnos. La versión “Prueba” sirve para testear cambios o nuevos retos.

---

## GameThreeScreen

**Propósito:**  
Juego de retos aleatorios tipo ruleta.

**Funcionamiento:**  
Muestra una ruleta animada que, al girar, selecciona un reto o castigo aleatorio para el jugador. Usa animaciones, vibraciones y efectos visuales.

---

## GameFourScreen / PruebaGameFourScreen

**Propósito:**  
Juego de retos usando “Swiper” de cartas o frases.

**Funcionamiento:**  
Permite al usuario deslizar tarjetas con retos o frases (tipo Tinder). Cada swipe ejecuta un reto o acción. La versión “Prueba” es para validar nuevos retos o cambios en la dinámica.

---

## CreaTuFrase

**Propósito:**  
Pantalla para crear frases personalizadas.

**Funcionamiento:**  
Permite al usuario escribir una frase y guardarla en Firebase. Luego puede aparecer en los retos o dinámicas de la app.

---

## TodasLasFrasesScreen

**Propósito:**  
Ver y gestionar todas las frases creadas.

**Funcionamiento:**  
Muestra una lista de todas las frases (personalizadas y predeterminadas). Permite buscar, filtrar, borrar o editar frases.

---

## MiniGames (MiniGame1, MiniGame2, MiniGame4)

**Propósito:**  
Colección de minijuegos cortos.

**Funcionamiento:**  
Cada mini-juego tiene una dinámica única, independiente de los juegos principales. Ejemplos comunes: preguntas rápidas, retos exprés, memoria, reacción, etc.

---

# Créditos

- Autor: [Tu Nombre o Equipo]
- Contacto: [Tu Email o enlace de redes]

# Licencia

MIT

---
