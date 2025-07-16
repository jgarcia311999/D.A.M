  const frasesPorJuego = {
    mimica: [
      'Titanic', 'El Rey León', 'Harry Potter', 'Jurassic Park', 'Mi pobre angelito',
      'Spiderman', 'Rápidos y Furiosos', 'Avatar', 'Frozen', 'Toy Story',
      'El diario de una pasión', 'El conjuro', 'Piratas del Caribe', 'Intensamente', '300',
      'El código Da Vinci', 'Up: una aventura de altura', 'Star Wars', 'El origen', 'El club de la pelea',
      'La La Land', 'Slumdog Millionaire', 'El pianista', 'Parásito', 'Eterno resplandor de una mente sin recuerdos',
      'Amélie', 'El gran hotel Budapest', 'Birdman', 'Donnie Darko', 'El laberinto del fauno',
      'Friends', 'Los Simpsons', 'Stranger Things', 'Breaking Bad', 'La Casa de Papel',
      'Game of Thrones', 'The Office', 'Cobra Kai', 'Merlina', 'El juego del calamar',
      'Despacito', 'La bicicleta', 'Ojos así', 'Livin’ on a Prayer', 'Shape of You',
      'Bailando', 'Thriller', 'Barbie Girl', 'Rolling in the Deep', 'La flaca',
      'Cien años de soledad', 'Don Quijote de la Mancha', 'El principito', 'Harry Potter y la piedra filosofal',
      'Los juegos del hambre', 'El señor de los anillos', 'Orgullo y prejuicio',
      'Crónica de una muerte anunciada', 'It', 'El alquimista'
    ],
    telefono: [
      'El loro ladra mejor cuando llueve queso rallado.',
      'Mi abuela baila reggaetón los martes con una escoba mágica.',
      'Tres tristes tigres tragaban trigo en un trigal.',
      'A caballo regalado no se le miran los dientes postizos.',
      'Los unicornios azules no usan paraguas en primavera.',
      'Pancha plancha con cuatro planchas, ¿con cuántas planchas plancha Pancha?',
      'El sol sale solo si los sapos silban salsa en silencio.',
      'Mi gato juega ajedrez con un pez vestido de payaso.',
      'Más vale pájaro en mano que ciento bailando flamenco.',
      'Cuando cuentes cuentos, cuenta cuántos cuentos cuentas.',
      'El pingüino peludo pidió una pizza por paloma mensajera.',
      'El perro de Rita corre detrás de un carrito que grita.',
      'Los lunes los limones lloran lagrimones largos.',
      'Mi tía tiene una tienda de tiaras para tigres tímidos.',
      'Las cebras cantan cumbia cuando cae el crepúsculo.',
      'Pedro Pérez pintor pinta preciosos paisajes portugueses.',
      'No por mucho madrugar amanece más temprano en Marte.',
      'Hay un dragón dormido debajo de mi cama que ronca en francés.',
      'Siete serpientes se suben sin sonido sobre siete sillas suaves.',
      'Mezclé mayonesa con magia y me salió un monstruo bailarín.',
      'Mi vecino vendía ventanas voladoras vestidas de violeta.',
      'Los elefantes elegantemente eligen elevadores eléctricos.',
      'Una ardilla armada armó una alarma al alba.',
      'Las cucharas cantan cuando comen conejos crujientes.',
      'El camello camina con camisas color caramelo los viernes.',
      'Tu tortuga toca timbales mientras toma té con tacos.',
      'La rana rumbera raspa radiocasetes rojos en la rambla.',
      'Mi primo Pedro puso pegamento en el pastel por error.',
      'Si Simón simula ser un salmón, será salmón simulado.',
      'La galleta gigante gritó groserías al gran globo gris.',
      'Un unicornio uruguayo usó un ukulele en un universo utópico.',
      'Doña Dolores dobla dobladillos de dragones dormidos.',
      'El pez payaso perdió su peluca en el parque polar.',
      'Las alpacas hablan alemán al amanecer en Alemania.',
      'Carmen cocina caramelos con calamares cada cuatro cuaresmas.',
      'El tambor tembló tanto que tiró todo el té tibio.',
      'Mauro mordió media manzana mientras murmuraba mentiras.',
      'Los cactus cantan cumbia cuando cruzan la cordillera.',
      'El búho barítono baila ballet bajo la bruma azul.',
      'Tres trenzas tristes tropezaron tras trotar tras truenos.',
      'Los plátanos parlantes prefieren poesía polinesia.',
      'Las gaviotas gritan goles cuando ganan en la galería.',
      'Julia juega jenga mientras junta jazmines japoneses.',
      'Los koalas cantan karaoke con kimonos coloridos.',
      'Mi robot roncaba raro rodeado de ruiseñores rubios.',
      'Los globos verdes vuelan violín en víspera de verano.',
      'La jirafa juega judo junto al jaguar jardinero.',
      'Hoy llueve lentejas largas en la laguna lunar.',
      'Un tomate tímido tropezó con una taza turquesa.',
      'Los marcianos maquillan mariposas mientras murmuran melodías.',
      'El helado habló húngaro hasta hacerse humo.',
      'Las focas filosofaban frente a focos fluorescentes.',
      'Una galleta gallega gira en un globo galáctico.',
      'Pablo pintó patos parlanchines en pantalones púrpura.',
      'Un caracol con casco corre carreras con canguros.',
      'El tren trotón trajo trufas traídas de Trujillo.',
      'La nube navegante no necesita notas ni noticias.',
      'Alicia abrió una alcancía llena de albahaca alegre.',
      'El mono montañés mira mapas mientras mastica mango.',
      'Las peras perdidas pedían permiso para pescar perritos.',
      'El tambor tribal tocaba tango tras tres tragos.',
      'Los búfalos bailaban bajo burbujas brillantes.',
      'Un erizo elegante escribe en esperanto en el Everest.',
      'Los caracoles cantan karaoke con canciones coreanas.',
      'La silla saltarina salta sobre sapos soñadores.',
      'Los fantasmas fingen fiestas falsas en febrero.',
      'La lámpara ladra letras latinas los lunes.',
      'Una hormiga húngara hurta hojas de higos horribles.',
      'La princesa prefiere panqueques por primavera.',
      'La cebolla celebra su cumpleaños con cebras celosas.',
      'Un dragón distraído dibuja dados de dulce.',
      'La bruja bucea buscando burbujas de batido.',
      'El dinosaurio dormilón desayuna donas con dulce de leche.',
      'Una tortuga turista toma té en Tokio todos los martes.',
      'Los leones leen letras lentas en la librería lunar.',
      'Un tiburón tímido tiene tintes turquesa en la terraza.',
      'Las galletas gigantes giran graciosas en gimnasios galácticos.',
      'Mi sombrero susurra secretos sobre sirenas soñadoras.',
      'Un mosquito músico monta murales mientras murmura Mozart.',
      'Los globos glotones golpean guitarras góticas en grupo.',
      'El ajolote alegre aplaude al amanecer junto al armadillo azul.',
      'Las zanahorias zapatean zarzuela cerca del zoológico.',
      'El pastel parlante pide permiso para pasar por París.',
      'Una nube nocturna navega notas de nostalgia.',
      'El pato poeta practica poesía persa por placer.',
      'La vaca viajera va volando en velero verde.',
      'Los dados danzantes dan discursos en diciembre.',
      'Un lápiz loco lanza luces lilas los lunes.',
      'La caja cantarina cuenta cuentos con caracoles.',
      'El espejo especial explica enigmas en Esperanto.',
      'Las ovejas olvidaron organizar óperas otoñales.',
      'La calabaza canta canciones con cucharones curiosos.',
      'El árbol astronauta aterrizó alegremente en agosto.',
      'Una estrella estornuda estrofas extrañas en Estonia.',
      'Las sombras sonríen siempre si suenan saxofones suaves.',
      'Mi almohada habla alemán al amanecer.',
      'Los pingüinos patinan por palacios poblados de papas.',
      'El marciano mezcla miel mientras mira murciélagos mágicos.',
      'Las gafas griegas giran grandes galaxias.',
      'Los zapatos zumbones zambullen zanahorias en zumo.',
      'El globo gritón guarda golosinas gigantes.',
      'Las tortas tropicales tocan trompetas mientras trotan.',
      'Los robots románticos recitan rimas ridículas rápidamente.',
      'La luna ladra lejos los lamentos luminosos del lunes.'
    ],
    palabras: [
      'Fiesta', 'Gato', 'Montaña', 'Caracol', 'Zapato', 'Nube', 'Cuchara', 'Río', 'Sol', 'Manzana',
      'Tigre', 'Casa', 'Bosque', 'Luna', 'Chocolate', 'Piedra', 'Sombrero', 'Papel', 'Café', 'Tijera',
      'Dado', 'Flor', 'Camión', 'Nariz', 'Perro', 'Rana', 'Silla', 'Libro', 'Tren', 'Pelota',
      'Avión', 'Cielo', 'Barco', 'Azúcar', 'Reloj', 'Zanahoria', 'Rey', 'Pan', 'Juguete', 'Teléfono',
      'Puerta', 'Helado', 'Taza', 'Cama', 'Refrigerador', 'Globo', 'Pescado', 'Rueda', 'Baño', 'Fruta',
      'Escalera', 'Sombrilla', 'Naranja', 'Ventana', 'Cuadro', 'Botella', 'Estrella', 'Motor', 'Arena', 'Papelera',
      'Caballo', 'Mariposa', 'Computadora', 'Tortuga', 'Lápiz', 'Camisa', 'Elefante', 'Ratón', 'Cuchillo', 'Cepillo',
      'Zorro', 'Hamburguesa', 'Carpeta', 'Ojo', 'León', 'Dinero', 'Llave', 'Tenedor', 'Espejo', 'Hielo',
      'Cepillo', 'Bicicleta', 'Escoba', 'Guitarra', 'Jirafa', 'Lenteja', 'Queso', 'Anillo', 'Mochila', 'Globo',
      'Ventilador', 'Cuerda', 'Cebra', 'Tobillo', 'Huevo', 'Campeón', 'Nudo', 'Clima', 'Ratón', 'Telaraña'
    ],
    canta_palabras: [
      'Amor', 'Noche', 'Sol', 'Bailar', 'Corazón', 'Luz', 'Mar', 'Cielo', 'Vida', 'Besos',
      'Fiesta', 'Locura', 'Lluvia', 'Soledad', 'Dolor', 'Pasión', 'Tiempo', 'Mujer', 'Tequila', 'Sueño',
      'Amigos', 'Risa', 'Sombra', 'Fuego', 'Viento', 'Silencio', 'Triste', 'Alegría', 'Camino', 'Destino',
      'Esperanza', 'Tierra', 'Libre', 'Cantar', 'Mágico', 'Perder', 'Llorar', 'Felicidad', 'Canción', 'Ojos',
      'Mirada', 'Lento', 'Rápido', 'Oscura', 'Estrella', 'Lejos', 'Cerca', 'Volar', 'Sueños', 'Verdad',
      'Mentira', 'Duele', 'Reír', 'Corazones', 'Latido', 'Encender', 'Baile', 'Soltar', 'Esperar', 'Perdón',
      'Navidad', 'Verano', 'Invierno', 'Arena', 'Playa', 'Brillar', 'Saltar', 'Correr', 'Abrazo', 'Cerveza',
      'Trago', 'Luna', 'Eterno', 'Momentos', 'Historias', 'Final', 'Comienzo', 'Libre', 'Confesar', 'Olvidar',
      'Lento', 'Beso', 'Copa', 'Piel', 'Pasos', 'Tentación', 'Llamar', 'Temblor', 'Nube', 'Cantar',
      'Distancia', 'Locos', 'Danza', 'Azul', 'Rojo', 'Flor', 'Rosa', 'Nieve', 'Sabor', 'Amar'
    ],
    tabu: [
      {
        "palabra": "Hospital",
        "prohibidas": ["médico", "enfermera", "paciente", "enfermo", "urgencias", "camilla", "inyección", "operación", "sala", "salud"]
      },
      {
        "palabra": "Amor",
        "prohibidas": ["corazón", "pareja", "sentimiento", "te quiero", "romántico", "beso", "pasión", "relación", "novio", "cariño"]
      },
      {
        "palabra": "Volcán",
        "prohibidas": ["lava", "erupción", "magma", "montaña", "fuego", "explosión", "cráter", "temblor"]
      },
      {
        "palabra": "Astronauta",
        "prohibidas": ["espacio", "nave", "planeta", "cohete", "gravedad", "traje", "NASA", "luna"]
      },
      {
        "palabra": "Desierto",
        "prohibidas": ["arena", "calor", "camello", "oasis", "dunas", "sequía", "sol"]
      },
      {
        "palabra": "Computadora",
        "prohibidas": ["teclado", "pantalla", "ratón", "programa", "internet", "archivo", "software", "hardware", "windows", "procesador"]
      },
      {
        "palabra": "Bruja",
        "prohibidas": ["escoba", "hechizo", "magia", "caldero", "volar", "sombrero", "pócima", "noche", "malvada"]
      },
      {
        "palabra": "Biblioteca",
        "prohibidas": ["libro", "leer", "silencio", "estantería", "préstamo", "librería", "estudio", "papel"]
      },
      {
        "palabra": "Fantasía",
        "prohibidas": ["imaginación", "cuento", "mágico", "hada", "dragón", "irreal", "ficción", "fantasma"]
      },
      {
        "palabra": "Fútbol",
        "prohibidas": ["pelota", "gol", "jugador", "portero", "equipo", "cancha", "partido", "arco", "mundial", "pase"]
      },
      {
        "palabra": "Chocolate",
        "prohibidas": ["dulce", "cacao", "tableta", "leche", "azúcar", "amargo", "negro", "blanco", "bombón", "derretido"]
      },
      {
        "palabra": "Cementerio",
        "prohibidas": ["tumba", "muerto", "lápida", "fantasma", "espíritu", "cruz", "flores", "panteón", "noche"]
      },
      {
        "palabra": "Museo",
        "prohibidas": ["arte", "pintura", "exposición", "historia", "cuadro", "galería", "visita", "antiguo"]
      },
      {
        "palabra": "Espejo",
        "prohibidas": ["reflejo", "vidrio", "baño", "imagen", "cristal", "ver", "mismo", "rostro"]
      },
      {
        "palabra": "Dinosaurio",
        "prohibidas": ["prehistoria", "jurásico", "fósil", "gigante", "extinto", "tiranosaurio", "animal", "huesos"]
      },
      {
        "palabra": "Playa",
        "prohibidas": ["arena", "mar", "vacaciones", "sol", "sombrilla", "olas", "bronceado", "palmera", "toalla", "agua"]
      },
      {
        "palabra": "Helado",
        "prohibidas": ["frío", "verano", "cono", "crema", "chocolate", "vainilla", "cucharita", "sabores", "postre"]
      },
      {
        "palabra": "Montaña",
        "prohibidas": ["altura", "nieve", "escalar", "pico", "caminar", "trepar", "cordillera", "aventura"]
      },
      {
        "palabra": "Rey",
        "prohibidas": ["trono", "reina", "castillo", "corona", "monarquía", "nobleza", "gobierno", "real", "reinado"]
      },
      {
        "palabra": "Cine",
        "prohibidas": ["película", "pantalla", "butaca", "palomitas", "ver", "actores", "cineasta", "tráiler", "estreno"]
      },
      {
        "palabra": "Batería",
        "prohibidas": ["energía", "cargar", "móvil", "teléfono", "duración", "conectar", "eléctrico"]
      },
      {
        "palabra": "Lluvia",
        "prohibidas": ["agua", "nube", "paraguas", "tormenta", "mojar", "gota", "cielo", "charco"]
      },
      {
        "palabra": "Ladrón",
        "prohibidas": ["robar", "policía", "delito", "asalto", "cartera", "dinero", "escapar", "cárcel", "crimen"]
      },
      {
        "palabra": "Planeta",
        "prohibidas": ["Tierra", "Marte", "órbita", "universo", "sol", "galaxia", "astronomía", "espacio"]
      },
      {
        "palabra": "Cocodrilo",
        "prohibidas": ["reptil", "animal", "verde", "dientes", "agua", "pantano", "afilar", "peligroso"]
      },
      {
        "palabra": "Zapato",
        "prohibidas": ["pie", "andar", "cordones", "calcetín", "tacón", "pisar", "botas", "caminar"]
      },
      {
        "palabra": "Nube",
        "prohibidas": ["cielo", "lluvia", "blanca", "algodón", "flotar", "tormenta", "clima"]
      },
      {
        "palabra": "Pintor",
        "prohibidas": ["arte", "cuadro", "óleo", "color", "brocha", "mural", "artista", "galería"]
      },
      {
        "palabra": "Robot",
        "prohibidas": ["inteligencia", "mecánico", "metal", "programa", "tecnología", "humanoide", "máquina"]
      },
      {
        "palabra": "Barco",
        "prohibidas": ["agua", "navegar", "mar", "puerto", "capitán", "vela", "crucero", "ola", "ancla"]
      },
      {
        "palabra": "Escalera",
        "prohibidas": ["subir", "bajar", "peldaño", "escalón", "pisos", "baranda", "edificio"]
      },
      {
        "palabra": "Vampiro",
        "prohibidas": ["sangre", "colmillos", "noche", "murciélago", "oscuro", "terror", "Drácula", "luz", "inmortal"]
      },
      {
        "palabra": "Internet",
        "prohibidas": ["navegar", "web", "página", "red", "mundo", "datos", "conexión", "wifi", "digital"]
      },
      {
        "palabra": "Abeja",
        "prohibidas": ["miel", "panal", "picar", "insecto", "zumbido", "volar", "flores", "avispa"]
      },
      {
        "palabra": "Basura",
        "prohibidas": ["residuos", "tirar", "contenedor", "orgánico", "reciclar", "sucio", "bolsa"]
      },
      {
        "palabra": "Reloj",
        "prohibidas": ["hora", "tiempo", "segundos", "manecillas", "despertador", "digital", "puntual"]
      },
      {
        "palabra": "Guitarra",
        "prohibidas": ["cuerda", "música", "instrumento", "tocar", "mano", "melodía", "acústica"]
      },
      {
        "palabra": "Fantasma",
        "prohibidas": ["espíritu", "miedo", "casa", "blanco", "transparente", "susto", "aparecer"]
      },
      {
        "palabra": "Avión",
        "prohibidas": ["volar", "piloto", "aeropuerto", "viajar", "alas", "pasajero", "cabina", "maleta"]
      },
      {
        "palabra": "Cueva",
        "prohibidas": ["oscuro", "roca", "montaña", "entrar", "subterráneo", "frío", "murciélago"]
      },
      {
        "palabra": "Camaleón",
        "prohibidas": ["color", "cambiar", "animal", "reptil", "lengua", "verde", "insecto"]
      },
      {
        "palabra": "Jardín",
        "prohibidas": ["plantas", "flores", "césped", "regar", "maceta", "árbol", "verde", "tierra"]
      },
      {
        "palabra": "Beso",
        "prohibidas": ["labios", "amor", "romántico", "boca", "pareja", "te quiero", "pasión"]
      },
      {
        "palabra": "Cebra",
        "prohibidas": ["blanco", "negro", "rayas", "animal", "sabana", "africa", "pasto"]
      },
      {
        "palabra": "Mapa",
        "prohibidas": ["país", "ciudad", "ubicación", "dirección", "calle", "territorio", "ver"]
      },
      {
        "palabra": "Cineasta",
        "prohibidas": ["película", "director", "cámara", "film", "guion", "rodaje", "actores"]
      },
      {
        "palabra": "Tornado",
        "prohibidas": ["viento", "tormenta", "rápido", "girar", "cielo", "desastre", "aire", "huracán"]
      },
      {
        "palabra": "Profesor",
        "prohibidas": ["escuela", "enseñar", "alumno", "clase", "maestro", "examen", "tarea"]
      }
    ],
  };


  export default frasesPorJuego;