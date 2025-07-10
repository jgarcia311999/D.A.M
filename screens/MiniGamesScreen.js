import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions, TouchableOpacity, Image, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const minijuegos = [
  {
  id: 'mimica',
  titulo: 'Mímica',
  descripcion: 'Actúa películas sin hablar, ¡adivina rápido!',
  descripcionDetallada: 'Un juego universal y sencillo de actuar y adivinar. Se forman dos equipos; un miembro de un equipo recibe en secreto el título de una película (o canción, libro, personaje famoso, etc.) y debe representarla con mímica sin hablar, para que su propio equipo la adivine en un tiempo limitado (30 segundos o 1 minuto). Si aciertan antes de que se acabe el tiempo, ganan un punto; luego le toca al otro equipo. Las risas están aseguradas con las interpretaciones exageradas. (Sin alcohol; ideal en equipos con al menos 4 personas en total, aunque se disfruta con grupos grandes.)',
},
{
  id: 'telefono',
  titulo: 'Teléfono escacharrado',
  descripcion: 'Pasa un mensaje susurrando, ¡y ríete del resultado!',
  descripcionDetallada: 'Un juego clásico para reírse de cómo un mensaje se distorsiona. Todos se sientan en círculo. Una persona piensa una frase corta y se la susurra al oído al jugador de su derecha. Este, a su vez, la susurra al siguiente, y así sucesivamente. Al llegar al último jugador, este dice en voz alta lo que entendió. Por lo general, el mensaje acaba siendo muy diferente y disparatado comparado con la frase original, lo que provoca carcajadas. (Sin alcohol; ideal 5-10 personas o más.)',
},
{
  id: 'sillas',
  titulo: 'Sillas musicales',
  descripcion: 'Corre y siéntate cuando pare la música.',
  descripcionDetallada: 'Un juego físico y divertido que todos conocen desde niños, ¡pero sigue funcionando con adultos! Se colocan sillas en círculo (siempre una silla menos que el número de jugadores, por ejemplo 9 sillas para 10 personas). Con la música sonando, todos bailan o caminan alrededor; cuando la música se detiene de repente, cada quien intenta sentarse rápidamente. Quien se quede sin silla queda eliminado y se retira una silla antes de la siguiente ronda. Gana el último que consiga asiento. (Sin alcohol; ideal a partir de ~5 personas hasta grupos grandes, dependiendo del espacio.)',
},
{
  id: 'limbo',
  titulo: 'Limbo',
  descripcion: 'Pasa bajo la barra sin caer ni tocar.',
  descripcionDetallada: 'Perfecto para animar la fiesta con música y movimiento. Dos voluntarios sostienen una escoba, cuerda o barra a cierta altura, y los participantes deben pasar por debajo al ritmo de la música inclinándose hacia atrás sin tocarla. Tras cada ronda se baja más la barra, haciendo el paso más difícil. Quien la toque o se caiga queda eliminado, y así hasta que solo uno logre pasar a la altura más baja sin caer – ¡ese será el ganador o ganadora del limbo! (Sin alcohol; apto para cualquier número de personas, turnándose, ideal en fiestas con música.)',
},
{
  id: 'quien_soy',
  titulo: '¿Quién soy?',
  descripcion: 'Adivina el personaje peguntando sí o no.',
  descripcionDetallada: 'Un juego de adivinanzas de identidad que siempre triunfa. Se reparten lápiz y papel para escribir nombres de personajes conocidos (celebridades, personajes históricos, dibujos animados, etc.). Cada jugador recibe un papel con un nombre pegado en la frente o espalda, sin verlo él mismo. Por turnos, cada quien hace preguntas de sí o no a los demás para intentar descubrir quién es (“¿Soy un hombre?”, “¿Soy cantante?”…). Si la respuesta es sí, puede preguntar de nuevo; si es no, pasa el turno. El primero en adivinar correctamente su personaje gana (se puede seguir jugando para que todos lo descubran). (Sin alcohol; ideal ~4-10 personas.)',
},
{
  id: 'asesino',
  titulo: 'Pueblo duerme',
  descripcion: 'Descubre quién es el asesino guiñando ojos.',
  descripcionDetallada: 'Juego de misterio e intriga donde uno del grupo es el “asesino” secreto. Todos se sientan en círculo y cierran los ojos excepto el asesino (asignado al azar al repartir cartas o papelitos, o elegido por el moderador). En silencio, el asesino “mata” a sus víctimas guiñando un ojo furtivamente. Cada vez que alguien recibe el guiño, debe anunciar dramatúrgicamente “he muerto” y sale del juego. Los demás deben estar atentos para pillar quién está guiñando. En algunas versiones hay un policía que intenta descubrir al culpable. Si el grupo identifica al asesino, ganan; si el asesino elimina a casi todos sin ser descubierto, gana él. (Sin alcohol; ideal grupos más grandes, 6-15 personas.)',
},
{
  id: 'verdades_mentira',
  titulo: 'Dos verdades y una mentira',
  descripcion: 'Adivina la mentira entre tres historias.',
  descripcionDetallada: 'Un excelente rompehielos para cualquier reunión. Cada jugador, por turno, dice tres afirmaciones sobre sí mismo: dos cosas verdaderas y una mentira (en orden aleatorio). El resto del grupo debe discutir y adivinar cuál de las tres es la mentira. Cuando todos hayan dado su opinión, se revela la respuesta. Es sorprendente lo que puedes aprender de tus amigos con este juego lleno de anécdotas personales. (Sin alcohol; ideal 3-8 personas.)',
},
{
  id: '20_preguntas',
  titulo: '20 Preguntas',
  descripcion: 'Adivina cualquier cosa en veinte preguntas.',
  descripcionDetallada: 'Un clásico juego de adivinar cualquier cosa imaginada. Un jugador piensa en un objeto, personaje, lugar o concepto (sin decirlo). Los demás, en total, pueden hacer hasta 20 preguntas de sí o no para intentar averiguar de qué se trata. Las preguntas deben ser generales al inicio (por ejemplo: “¿Es un animal?”, “¿Es algo que se puede comprar?”). Si logran adivinar antes de la vigésima pregunta, ganan; si no, se revela la respuesta. Se puede jugar en equipo o todos contra el que piensa la palabra. (Sin alcohol; ideal 2-8 participantes.)',
},
{
  id: 'palabras_encadenadas',
  titulo: 'Palabras encadenadas',
  descripcion: 'Di palabras siguiendo la última sílaba.',
  descripcionDetallada: 'Juego sencillo para poner a prueba vocabulario y agilidad mental. El primer jugador dice una palabra cualquiera. El siguiente debe decir otra que comience con la última sílaba o letra de la palabra anterior. Por ejemplo, si el primero dice “fiesta”, el siguiente podría decir “tarta” (“ta” continúa “fies-ta”). Se continúa encadenando palabras así sucesivamente. No se pueden repetir palabras ya dichas; quien se quede bloqueado, diga una palabra inválida o tarde más de 5 segundos, pierde la ronda. Es ideal para jugar en cualquier lugar sin necesidad de objetos. (Sin alcohol; número de jugadores indefinido, mínimo 2, mejor en grupo.)',
},
{
  id: 'no_te_rias',
  titulo: 'No te rías (guerra de caras serias)',
  descripcion: 'Mantén la cara seria y haz reír a otros.',
  descripcionDetallada: 'Un desafío divertidísimo para ver quién tiene más autocontrol. Todos los participantes se miran unos a otros con la expresión más seria posible. Pueden contarse chistes malos, hacer muecas o decir tonterías para intentar que los demás se rían – pero ¡no puedes reírte tú! El primero que se ría o no pueda aguantar la cara seria pierde. Se puede jugar por rondas cortas y el que aguante sin reír hasta el final es el ganador. (Sin alcohol, aunque se puede establecer que quien se ríe beba como penitencia; sin límite de personas.)',
},
{
  id: 'canta_palabra',
  titulo: 'Canta la palabra',
  descripcion: 'Canta una canción que contenga la palabra.',
  descripcionDetallada: 'Ideal para amantes de la música. Un jugador actúa como presentador y dice una palabra al azar (por ejemplo, “corazón”). El resto, ya sea individualmente o por equipos, debe pensar rápidamente y cantar una canción que incluya esa palabra en la letra. El primero que consiga recordar y cantar un fragmento válido gana la ronda para su equipo o para sí mismo. Luego se elige otra palabra y se repite. Este juego pone a prueba la memoria musical y suele acabar en mini karaoke improvisado. (Sin alcohol; ideal 3 o más personas.)',
},
{
  id: 'beer_pong',
  titulo: 'Beer Pong',
  descripcion: 'Encesta la pelota y haz beber al rival.',
  descripcionDetallada: 'Un popular juego de fiesta con competición y bebida. Se necesitan unos vasos de plástico (tradicionalmente 10 por equipo, formando un triángulo) colocados en extremos opuestos de una mesa, llenos con un poco de cerveza o bebida. Los equipos (normalmente de 1 o 2 jugadores por lado) se turnan para lanzar una pelota de ping-pong intentando que caiga dentro de un vaso del equipo contrario. Si encesta, el oponente debe beberse el contenido de ese vaso y retirarlo. Gana el equipo que logra eliminar todos los vasos del rival. (Con alcohol típicamente; 2 a 4 jugadores, aunque el resto puede animar y turnarse en próximos partidos.)',
},
{
  id: 'juego_rey',
  titulo: 'El juego del rey',
  descripcion: 'Cumple las órdenes del rey o bebe.',
  descripcionDetallada: 'Versión fiestera de “Simon dice” con castigos para adultos. En cada ronda alguien se proclama Rey/Reina y da órdenes al grupo que deben cumplirse al momento. Pueden ser órdenes graciosas o atrevidas pero viables en el lugar de la fiesta (ej.: “¡Todos bajo la mesa!” o “Baila con la persona a tu derecha”). Quien se niegue o tarde demasiado en cumplir la orden, bebe como castigo. Después de unas cuantas órdenes, se pasa la corona a otro para que todos tengan turno de mandar. (Con alcohol, aunque se puede jugar sin beber usando retos; ideal 4-8 personas.)',
},
{
  id: 'bufalo',
  titulo: '¡Búfalo!',
  descripcion: 'Bebe si usas la mano incorrecta.',
  descripcionDetallada: 'Juego de bebida simple y global, perfecto para reuniones relajadas. Regla básica: todos los jugadores deben sostener su bebida siempre con la mano izquierda (o la derecha, si alguno es zurdo se invierten los roles). En cualquier momento, si ves a alguien bebiendo o sujetando el vaso con la mano equivocada, grita “¡Búfalo!”. Quien haya cometido el despiste debe beberse su trago de un solo golpe como penalización. A partir de entonces el juego continúa. Es una regla que puede durar toda la fiesta y provocar muchos descuidos divertidos. (Con alcohol principalmente; número de jugadores ilimitado.)',
},
{
  id: 'como_es_el_tuyo',
  titulo: '¿Cómo es el tuyo?',
  descripcion: 'Adivina el objeto común con pistas.',
  descripcionDetallada: 'Un juego ingenioso para grupos observadores. Un jugador sale de la habitación o tapa sus oídos. El resto del grupo se pone de acuerdo en un objeto o característica que todos tengan en común (por ejemplo, todos llevan calcetines, todos tienen carnet de conducir, o algo más específico como “todos tienen Facebook”). Cuando el jugador vuelve, debe preguntar a cualquiera: “¿Cómo es el tuyo?” refiriéndose a ese algo. Cada persona, sin revelar directamente lo que es, responde con una pista sincera pero no obvia (ej.: si el objeto secreto es “cepillo de dientes”, podría decir “el mío es azul” sin decir que es un cepillo). El interrogador puede seguir preguntando a diferentes personas hasta intentar adivinar de qué se trata aquello que todos tienen. Si acierta, gana; si no, paga una prenda o se la juega otra ronda. (Sin alcohol; ideal 4-8 personas.)',
},
{
  id: 'infiltrado',
  titulo: 'El infiltrado',
  descripcion: 'Descubre quién finge conocer la temática.',
  descripcionDetallada: 'Juego de deducción y engaño que pondrá a prueba la creatividad del grupo. Antes de empezar, una persona es elegida secretamente como “el infiltrado” y no recibirá la información que los demás sí tienen. El resto de jugadores acuerda una temática común (por ejemplo, “cosas de la playa”) y cada uno, por turnos, dice una palabra relacionada con ese tema. El infiltrado, que desconoce la temática real, debe improvisar una palabra que crea que encaja con las demás para no levantar sospechas. Al finalizar la ronda, todos votan quién sospechan que era el infiltrado. Si aciertan, se elimina a esa persona; si no, continúa el juego con otra ronda de palabras. El juego termina cuando se descubre al infiltrado (ganan los demás) o si el infiltrado logra pasar varias rondas sin ser identificado. (Sin alcohol; ideal grupos de 5-10 personas.)',
},
{
  id: 'tabu',
  titulo: 'Tabú',
  descripcion: 'Da pistas sin decir palabras prohibidas.',
  descripcionDetallada: 'Un divertido juego de palabras que puedes preparar en el momento sin comprar nada. Se juega por equipos. El objetivo es que tu equipo adivine una palabra secreta que tú debes describirles sin mencionar la palabra en sí ni ciertos términos “tabú” relacionados. Por ejemplo, si la palabra prohibida es “hospital”, no podrías usar palabras evidentes como “médico” o “enfermo” al dar pistas. Puedes usar un generador de palabras aleatorias o pensar las palabras clave previamente y escribirlas en papel. Se turnan los equipos: mientras un miembro de un equipo da las pistas, el otro equipo vigila que no use ninguna palabra prohibida. Se puede usar un reloj para limitar el tiempo de cada turno y aumentar la emoción. Gana el equipo que adivine más palabras. (Sin alcohol; ideal jugar en equipos de 2-5 personas cada uno.)',
},
];

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation, route }) {
    const { jugadores } = route.params || {};
    const [mostrarOpciones, setMostrarOpciones] = React.useState(false);
    const insets = useSafeAreaInsets();

    const juegos = [
      {
        nombre: 'Ranking Salvaje',
        descripcion: 'Ordena elementos inusuales según tu criterio personal.',
        screen: 'MiniGame1',
      },
      {
        nombre: 'Asociación rápida',
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
