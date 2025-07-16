import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PoliticaPrivacidadScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => {
          Haptics.selectionAsync();
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Perfil');
          }
        }}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Política de Privacidad</Text>

      <Text style={styles.sectionTitle}>1. ¿Quiénes somos?</Text>
      <Text style={styles.text}>
        Esta aplicación es desarrollada por un equipo independiente con fines de entretenimiento. Puedes contactarnos a través de sugerencias o redes sociales disponibles en la sección de perfil.
      </Text>

      <Text style={styles.sectionTitle}>2. ¿Qué datos recogemos?</Text>
      <Text style={styles.text}>
        No recopilamos datos personales identificables. Las frases que introduces pueden almacenarse localmente o en la base de datos de la app para mejorar tu experiencia. No recogemos correos electrónicos ni datos sensibles.
      </Text>

      <Text style={styles.sectionTitle}>3. Uso de los datos</Text>
      <Text style={styles.text}>
        Utilizamos los datos introducidos (como frases o configuraciones) únicamente para personalizar y mejorar el funcionamiento de la aplicación.
      </Text>

      <Text style={styles.sectionTitle}>4. Servicios de terceros</Text>
      <Text style={styles.text}>
        Esta app puede utilizar Firebase para almacenar información del juego. No compartimos tus datos con otros servicios sin tu consentimiento.
      </Text>

      <Text style={styles.sectionTitle}>5. Cookies</Text>
      <Text style={styles.text}>
        Solo la versión web podría emplear cookies si integramos servicios como Google AdSense o herramientas analíticas. Se notificará si esto ocurre.
      </Text>

      <Text style={styles.sectionTitle}>6. Derechos del usuario</Text>
      <Text style={styles.text}>
        Puedes solicitar la eliminación de tus datos almacenados. Contáctanos para ejercer tus derechos conforme al RGPD y otras normativas de privacidad.
      </Text>

      <Text style={styles.sectionTitle}>7. Edad mínima</Text>
      <Text style={styles.text}>
        Esta aplicación está dirigida exclusivamente a personas mayores de 18 años. Al utilizarla, declaras que tienes al menos 18 años o la mayoría de edad legal en tu país. Si eres menor de edad, debes abandonar la aplicación inmediatamente. Esta app no está diseñada para, ni pretende ser utilizada por, menores. Promovemos un uso responsable y consciente del contenido relacionado con el consumo de alcohol.
      </Text>

      <Text style={styles.sectionTitle}>8. Cambios en la política</Text>
      <Text style={styles.text}>
        Podemos actualizar esta política en el futuro. Te recomendamos revisarla periódicamente.
      </Text>

      <Text style={styles.sectionTitle}>9. Uso responsable del alcohol</Text>
      <Text style={styles.text}>
        Esta aplicación está pensada únicamente para el entretenimiento responsable de adultos. No fomentamos ni promovemos el consumo excesivo ni irresponsable de bebidas alcohólicas. Recuerda beber con moderación y conforme a la normativa vigente en tu país. Si el consumo de alcohol es ilegal en tu lugar de residencia o si padeces alguna condición que lo desaconseje, no debes utilizar esta aplicación para tales fines.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#a3c8ff',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Panchang-Bold',
    marginBottom: 20,
    marginTop: 60,
    color: '#000',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Panchang-Semibold',
    marginTop: 20,
    marginBottom: 8,
    color: '#000',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Panchang-Regular',
    color: '#000',
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
});
