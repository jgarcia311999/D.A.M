import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions, TouchableOpacity, Image, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const minijuegos = [
  {
    id: 'tabu',
    titulo: 'Tabú',
    descripcion: 'Da pistas sin decir palabras prohibidas.',
    descripcionDetallada: {
      jugadores: '4 o más (en equipos de 2–5 personas)',
      objetivo: 'Hacer que tu equipo adivine una palabra secreta sin usar ciertas palabras prohibidas asociadas a ella.',
      comoSeJuega: `1. Divide a los jugadores en dos equipos.

2. Pulsa el boton inferior y saldra:
- Una palabra principal (la que deben adivinar).
- Y 8 palabras “tabú” que no se pueden usar al dar pistas.

3. En cada ronda, un jugador del equipo es el describidor y tiene un tiempo limitado (por ejemplo, 1 minuto) para hacer que su equipo adivine tantas palabras como pueda.

4. El describidor no puede decir:
- La palabra en sí,
- Las palabras tabú,
- Ni usar mímica, sonidos ni partes de la palabra como pistas.

5. Cada vez que el equipo adivina correctamente, gana 1 punto.

6. Si el describidor dice una palabra prohibida, el turno se detiene o se pierde ese punto, según la regla acordada.

7. Se turnan los equipos hasta que todos hayan participado. Gana el equipo con más puntos al final de las rondas.`,
      consejos: `- Puedes jugar sin app: basta con preparar una lista de palabras con sus prohibidas.
- Si no tienes palabras prohibidas preparadas, el otro equipo puede inventarlas al momento.
- Para más dificultad, limita el tiempo a 30 segundos o añade un “penalizador” por errores.
- Es excelente para estimular la creatividad, reírse y ver quién se pone nervioso más rápido.`,
    },
    tieneLogica: true
  },
  {
    id: 'mimica',
    titulo: 'Mímica',
    descripcion: 'Actúa películas sin hablar, ¡adivina rápido!',
    descripcionDetallada: {
      jugadores: 'De 4 personas en adelante, ideal en equipos. Cuantos más, mejor.',
      objetivo: 'Que tu equipo adivine el concepto, película, persona o cosa que representas solo con gestos.',
      comoSeJuega: `1. Divide a los participantes en dos equipos.
2. Un miembro de un equipo recibe (en secreto) el nombre de una película, personaje, objeto, etc.
3. Debe representarlo con gestos, sin hablar ni emitir sonidos, para que su equipo lo adivine en un tiempo límite (ej: 1 minuto).
4. Si aciertan, ganan un punto y pasa el turno al otro equipo.
5. Se repite cambiando el representante en cada ronda.
6. Gana el equipo con más aciertos tras varias rondas.`,
      consejos: `- Prohibido hablar, escribir o emitir sonidos.
- Puedes usar una app, cartas o papelitos para elegir los conceptos.
- Los temas pueden ser: películas, canciones, profesiones, acciones, etc.
- ¡Las interpretaciones absurdas son lo mejor!`
    },
    tieneLogica: true
  },
  {
    id: 'canta_palabra',
    titulo: 'Canta la palabra',
    descripcion: 'Canta una canción que contenga la palabra.',
    descripcionDetallada: {
      jugadores: 'De 3 en adelante, sin máximo.',
      objetivo: 'Ser el primero en cantar una canción real que contenga la palabra dada.',
      comoSeJuega: `1. Un jugador (o juez) dice una palabra al azar.
2. El resto debe pensar y cantar lo más rápido posible una canción conocida que contenga esa palabra en la letra.
3. El primero en cantar correctamente gana la ronda.
4. Se repite con diferentes palabras y jugadores.`,
      consejos: `- Puedes jugar por equipos o todos contra todos.
- Si nadie canta en 10 segundos, la ronda queda desierta.
- ¡Ideal para amantes de la música y para animar la fiesta!`
    },
    tieneLogica: true
  },
  {
    id: 'telefono',
    titulo: 'Teléfono escacharrado',
    descripcion: 'Pasa un mensaje susurrando, ¡y ríete del resultado!',
    descripcionDetallada: {
      jugadores: 'Ideal de 5 a 12 personas o más.',
      objetivo: 'Comprobar cuánto se distorsiona un mensaje al transmitirse de persona en persona.',
      comoSeJuega: `1. Todos se sientan formando un círculo.
2. Una persona inventa una frase corta y se la susurra al oído al jugador de su derecha.
3. Ese jugador la transmite de la misma forma al siguiente, y así sucesivamente.
4. El último jugador dice en voz alta lo que ha entendido.
5. Se compara con la frase original y se repite con otra persona inventando la frase.`,
      consejos: `- Las frases largas o con trabalenguas suelen acabar en resultados más divertidos.
- No vale repetir la frase si no se ha entendido: ¡hay que decir lo que se ha escuchado!
- Es ideal para romper el hielo y reírse mucho.`
    },
    tieneLogica: true
  },
  {
    id: 'palabras_encadenadas',
    titulo: 'Palabras encadenadas',
    descripcion: 'Di palabras siguiendo la última sílaba.',
    descripcionDetallada: {
      jugadores: 'De 2 personas en adelante, sin límite superior.',
      objetivo: 'Encadenar palabras usando la última sílaba o letra de la anterior, sin repetir.',
      comoSeJuega: `1. El primer jugador dice una palabra cualquiera.
2. El siguiente debe decir una palabra que empiece por la última sílaba o letra de la anterior.
   Ejemplo: “fiesta” → “tarta” → “taza” → “zapato”…
3. No se pueden repetir palabras ya usadas.
4. Si alguien no responde en 5 segundos, repite palabra o falla, queda eliminado o pierde la ronda.
5. Se puede jugar por rondas o hasta que quede un solo ganador.`,
      consejos: `- Puedes complicarlo usando solo nombres de animales, ciudades, etc.
- Ideal para mejorar vocabulario y agilidad mental.
- Perfecto para viajes, esperas o cualquier reunión.`
    },
    tieneLogica: true
  },
  {
    id: 'sillas',
    titulo: 'Sillas musicales',
    descripcion: 'Corre y siéntate cuando pare la música.',
    descripcionDetallada: {
      jugadores: 'Desde 5 personas hasta grupos grandes (según espacio y sillas disponibles).',
      objetivo: 'Ser el último en conseguir sentarse cuando pare la música.',
      comoSeJuega: `1. Coloca las sillas en círculo, siempre una menos que el número de jugadores.
2. Pon música y todos deben caminar o bailar alrededor de las sillas.
3. En cualquier momento, alguien para la música sin avisar.
4. Todos deben sentarse rápidamente. Quien se quede sin silla queda eliminado.
5. Se retira una silla y se repite hasta que quede un solo ganador.`,
      consejos: `- Puedes variar la música para hacerlo más divertido.
- Si no hay sillas, se pueden usar cojines, hojas de papel, etc.
- ¡Cuidado con empujones!`
    },
  },
  {
    id: 'limbo',
    titulo: 'Limbo',
    descripcion: 'Pasa bajo la barra sin caer ni tocar.',
    descripcionDetallada: {
      jugadores: 'Para cualquier grupo, ideal de 5 en adelante.',
      objetivo: 'Pasar por debajo de la barra sin tocarla ni caerse. Gana quien llegue más lejos.',
      comoSeJuega: `1. Dos personas sujetan una barra, palo o cuerda a cierta altura.
2. Los jugadores, uno a uno, deben pasar por debajo inclinándose hacia atrás, sin tocar la barra ni caerse.
3. Tras cada ronda, se baja la barra un poco más.
4. Quien toque la barra o caiga queda eliminado.
5. Gana quien logre pasar cuando ya nadie más puede.`,
      consejos: `- Pon música animada para motivar a los participantes.
- Usa una escoba, cuerda o similar si no tienes barra.
- ¡Cuidado con la espalda!`
    },
  },
  {
    id: 'quien_soy',
    titulo: '¿Quién soy?',
    descripcion: 'Adivina el personaje peguntando sí o no.',
    descripcionDetallada: {
      jugadores: 'De 4 a 10 personas o más.',
      objetivo: 'Adivinar qué personaje o identidad tienes asignada, haciendo preguntas de sí/no.',
      comoSeJuega: `1. Escribe nombres de personajes famosos, dibujos, objetos, etc., en papelitos.
2. Cada jugador recibe uno pegado en la frente o espalda, sin verlo.
3. Por turnos, cada persona hace preguntas de sí/no para descubrir quién es (“¿Soy real?”, “¿Soy un animal?”, etc.).
4. Si la respuesta es sí, puede preguntar de nuevo; si es no, pasa el turno.
5. Gana quien adivine su personaje primero (o se puede seguir hasta que todos lo logren).`,
      consejos: `- Puedes usar apps para asignar personajes aleatorios.
- Elige personajes conocidos por todos para que sea divertido.
- Prohibido mirar reflejos o preguntar directamente el nombre.`
    },
  },
  {
    id: 'asesino',
    titulo: 'Pueblo duerme',
    descripcion: 'Descubre quién es el asesino guiñando ojos.',
    descripcionDetallada: {
      jugadores: 'De 6 a 15 personas, ideal para grupos grandes.',
      objetivo: 'Descubrir quién es el asesino antes de que elimine a todos los demás.',
      comoSeJuega: `1. Todos se sientan en círculo. Se elige (al azar) un asesino y, si se desea, un policía.
2. El moderador pide a todos cerrar los ojos. Solo el asesino abre los ojos para identificarse.
3. Todos abren los ojos y comienza el juego: el asesino elimina a otros guiñando un ojo sin que los demás lo noten.
4. Si alguien recibe un guiño, espera unos segundos y dice “he muerto” de forma teatral, saliendo del juego.
5. Los demás deben debatir y tratar de descubrir quién es el asesino.
6. Si acusan correctamente, ganan los inocentes; si el asesino elimina a casi todos, gana él.`,
      consejos: `- Puedes añadir un “policía” que tenga una oportunidad para adivinar quién es el asesino.
- El asesino debe ser discreto y no levantar sospechas.
- Cuantos más jugadores, más divertido y difícil.`
    },
  },
  {
    id: 'verdades_mentira',
    titulo: 'Dos verdades y una mentira',
    descripcion: 'Adivina la mentira entre tres historias.',
    descripcionDetallada: {
      jugadores: 'Ideal 3-8 personas.',
      objetivo: 'Adivinar cuál de las tres afirmaciones de un jugador es la mentira.',
      comoSeJuega: 'Cada jugador, por turno, dice tres afirmaciones sobre sí mismo: dos cosas verdaderas y una mentira (en orden aleatorio). El resto del grupo debe discutir y adivinar cuál de las tres es la mentira. Cuando todos hayan dado su opinión, se revela la respuesta.',
      consejos: 'Un excelente rompehielos para cualquier reunión. Es sorprendente lo que puedes aprender de tus amigos con este juego lleno de anécdotas personales. Sin alcohol.',
    },
  },
  {
    id: '20_preguntas',
    titulo: '20 Preguntas',
    descripcion: 'Adivina cualquier cosa en veinte preguntas.',
    descripcionDetallada: {
      jugadores: 'De 2 a 8 personas, aunque puede jugarse en grupos grandes.',
      objetivo: 'Adivinar lo que una persona está pensando haciendo hasta 20 preguntas de sí/no.',
      comoSeJuega: `1. Una persona piensa en un objeto, personaje, lugar, etc., sin decirlo.
2. El resto, por turnos, hace preguntas que solo se puedan responder con sí o no.
3. El objetivo es adivinar lo que pensó antes de llegar a 20 preguntas.
4. Si se adivina antes de la pregunta 20, ganan los que preguntan; si no, gana quien pensó la palabra.
5. Se puede jugar individualmente o por equipos.`,
      consejos: `- Empieza preguntando cosas generales (“¿Es un ser vivo?”, “¿Es algo que se puede tocar?”).
- Ideal para viajes, sobremesas o esperar en grupo.
- Puedes variar el número de preguntas según la dificultad.`
    },
  },
  {
    id: 'no_te_rias',
    titulo: 'No te rías (guerra de caras serias)',
    descripcion: 'Mantén la cara seria y haz reír a otros.',
    descripcionDetallada: {
      jugadores: 'Sin límite de personas.',
      objetivo: 'Mantener la cara seria mientras intentas que los demás se rían.',
      comoSeJuega: 'Todos los participantes se miran unos a otros con la expresión más seria posible. Pueden contarse chistes malos, hacer muecas o decir tonterías para intentar que los demás se rían – pero ¡no puedes reírte tú! El primero que se ría o no pueda aguantar la cara seria pierde. Se puede jugar por rondas cortas y el que aguante sin reír hasta el final es el ganador.',
      consejos: 'Un desafío divertidísimo para ver quién tiene más autocontrol. Sin alcohol, aunque se puede establecer que quien se ríe beba como penitencia.',
    },
  },
  {
    id: 'beer_pong',
    titulo: 'Beer Pong',
    descripcion: 'Encesta la pelota y haz beber al rival.',
    descripcionDetallada: {
      jugadores: '2 a 4 jugadores (1 o 2 por equipo), aunque pueden rotar y animar los demás.',
      objetivo: 'Encestar la pelota en los vasos del rival y lograr que beban todos sus vasos.',
      comoSeJuega: `1. Coloca 10 vasos (por equipo) en forma de triángulo en cada extremo de una mesa, con bebida dentro.
2. Los equipos se turnan para lanzar una pelota de ping-pong intentando encestar en los vasos del rival.
3. Si encestan, el rival debe beber el vaso y retirarlo de la mesa.
4. Gana el equipo que elimina primero todos los vasos del contrario.
5. Se pueden establecer reglas extra, como rebotes, “reagrupaciones”, etc.`,
      consejos: `- Usa agua si no quieres consumir alcohol.
- Puedes variar el número de vasos o la bebida.
- No hace falta mesa oficial: cualquier superficie sirve.`
    },
  },
  {
    id: 'juego_rey',
    titulo: 'El juego del rey',
    descripcion: 'Cumple las órdenes del rey o bebe.',
    descripcionDetallada: {
      jugadores: 'De 4 a 8 personas, aunque sirve para grupos más grandes.',
      objetivo: 'Cumplir las órdenes del rey o recibir un castigo (generalmente beber).',
      comoSeJuega: `1. En cada ronda se sortea quién será el Rey/Reina.
2. El Rey da una orden al grupo (“Todos de pie”, “Haz una imitación”, etc.).
3. Quien no cumpla la orden o tarde demasiado, recibe un castigo (normalmente beber, pero puede ser otra prenda).
4. Después de varias órdenes, se elige un nuevo Rey y se repite.
5. El juego continúa mientras haya ganas de seguir.`,
      consejos: `- Las órdenes deben ser posibles y seguras en el contexto de la fiesta.
- Si no se quiere beber, se pueden poner penitencias divertidas.
- Ideal para romper el hielo y perder la vergüenza.`
    },
  },
  {
    id: 'bufalo',
    titulo: '¡Búfalo!',
    descripcion: 'Bebe si usas la mano incorrecta.',
    descripcionDetallada: {
      jugadores: 'Número de jugadores ilimitado.',
      objetivo: 'Evitar beber con la mano equivocada y pillar a los demás haciéndolo.',
      comoSeJuega: 'Todos los jugadores deben sostener su bebida siempre con la mano izquierda (o la derecha, si alguno es zurdo se invierten los roles). En cualquier momento, si ves a alguien bebiendo o sujetando el vaso con la mano equivocada, grita “¡Búfalo!”. Quien haya cometido el despiste debe beberse su trago de un solo golpe como penalización. A partir de entonces el juego continúa.',
      consejos: 'Juego de bebida simple y global, perfecto para reuniones relajadas. Es una regla que puede durar toda la fiesta y provocar muchos descuidos divertidos. Con alcohol principalmente.',
    },
  },
  {
    id: 'como_es_el_tuyo',
    titulo: '¿Cómo es el tuyo?',
    descripcion: 'Adivina el objeto común con pistas.',
    descripcionDetallada: {
      jugadores: 'De 4 a 8 personas, aunque sirve para más.',
      objetivo: 'Adivinar el objeto, prenda o característica común del grupo a base de pistas.',
      comoSeJuega: `1. Elige a un jugador para que salga de la sala o se tape los oídos.
2. El resto acuerda en secreto un objeto o característica que todos tengan (ej: “todos tenemos calcetines”).
3. El jugador vuelve y pregunta a quien quiera: “¿Cómo es el tuyo?”.
4. Cada persona responde con una pista sincera pero no obvia (“el mío es blanco”, “lo uso cada día”…).
5. El interrogador puede preguntar varias veces hasta intentar adivinar.
6. Si acierta, gana; si no, paga una prenda o se repite con otro objeto.`,
      consejos: `- Las pistas deben ser verdaderas pero no demasiado evidentes.
- Puedes complicarlo usando características menos visibles.
- Ideal para grupos observadores y creativos.`
    },
  },
  {
    id: 'infiltrado',
    titulo: 'El infiltrado',
    descripcion: 'Descubre quién finge conocer la temática.',
    descripcionDetallada: {
      jugadores: 'De 5 a 10 personas es lo ideal.',
      objetivo: 'Descubrir quién es el infiltrado (el único que no conoce la temática secreta).',
      comoSeJuega: `1. Se elige en secreto a un jugador como infiltrado. El resto acuerda una temática (ej: “cosas de la playa”).
2. Por turnos, cada jugador dice en voz alta una palabra relacionada con la temática (el infiltrado improvisa para no ser descubierto).
3. Tras una ronda, todos discuten y votan quién creen que es el infiltrado.
4. Si aciertan, el infiltrado pierde; si fallan, sigue otra ronda con nueva temática o se repite.
5. El infiltrado gana si logra pasar desapercibido varias rondas.`,
      consejos: `- El infiltrado debe ser convincente y creativo.
- Elige temáticas ni muy fáciles ni muy difíciles.
- Puedes dar un punto al infiltrado si no lo descubren.`
    },
  },
];

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation, route }) {
  const { jugadores } = route.params || {};
  const [mostrarOpciones, setMostrarOpciones] = React.useState(false);
  const insets = useSafeAreaInsets();

  const juegos = [
    {
      nombre: 'The best',
      descripcion: 'Relaciona palabras lo más rápido posible en rondas cronometradas.',
      screen: 'MiniGame4',
    },
    ...minijuegos.map(j => ({
      nombre: j.titulo,
      descripcion: j.descripcion,
      screen: null,
      minijuego: j
    })),
  ];

  const handleMinijuegoPress = (minijuego) => {
    // Pasa todo el objeto minijuego, incluyendo descripcionDetallada
    navigation.navigate('VariosMinigames', { minijuego });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.gridBackground}>
        <TouchableOpacity
          style={[{ position: 'absolute', top: insets.top + 10, left: 20, zIndex: 10 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            {
              position: 'absolute',
              top: insets.top + 10,
              right: 20,
              zIndex: 10,
              backgroundColor: 'transparent',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#000',
            },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('Jugadores');
          }}
        >
          <Text style={{ color: '#000', fontWeight: 'bold', fontFamily: 'Panchang-Bold' }}>Borrachos</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            <View style={[styles.cardsContainer, { paddingTop: insets.top + 60 }]}>
              {juegos.map((juego, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.gameCard}
                  onPress={() =>
                    juego.minijuego
                      ? handleMinijuegoPress(juego.minijuego)
                      : navigation.navigate(juego.screen, { jugadores })
                  }
                >
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.gameText}>{juego.nombre}</Text>
                    <Text style={styles.gameDescription}>{juego.descripcion}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gridBackground: {
    flex: 1,
    backgroundColor: '#70B77E',
  },
  imageBackground: {
    position: 'absolute',
    top: -height * 0.06,
    left: -width * 0.12,
    width: width * 0.7,
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    zIndex: 2,
  },
  cardsContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  gameCard: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: '#459853',
    borderWidth: 2,
    borderColor: '#0A5617',
  },
  cardImage: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  cardTextContainer: {
    gap: 2,
    alignItems: 'center',
  },
  gameText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Panchang-Bold',
    color: '#000',
    marginBottom: 10,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  gameDescription: {
    fontSize: 14,
    fontFamily: 'Panchang-Regular',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
});
