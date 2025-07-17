import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';

const AvisoLegalScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            if (navigation?.canGoBack?.()) {
              navigation.goBack();
            } else {
              navigation.navigate('Perfil');
            }
          }}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Aviso Legal</Text>

      <Text style={styles.sectionTitle}>1. Uso exclusivo para mayores de edad</Text>
      <Text style={styles.text}>
        Este sitio web y su contenido están destinados exclusivamente a personas mayores de 18 años. 
        Al acceder o utilizar esta plataforma, confirmas que eres mayor de edad según las leyes de tu país.
      </Text>

      <Text style={styles.sectionTitle}>2. No fomentamos el consumo de alcohol</Text>
      <Text style={styles.text}>
        Esta web no promueve, incentiva ni glorifica el consumo de bebidas alcohólicas. 
        Los juegos presentados son con fines lúdicos y deben ser interpretados con responsabilidad.
      </Text>

      <Text style={styles.sectionTitle}>3. Uso responsable</Text>
      <Text style={styles.text}>
        Se recomienda encarecidamente un consumo consciente y moderado. 
        Si decides beber, hazlo con responsabilidad y dentro de tus propios límites.
      </Text>

      <Text style={styles.sectionTitle}>4. No combines alcohol con la conducción</Text>
      <Text style={styles.text}>
        Nunca conduzcas bajo los efectos del alcohol. 
        Si has bebido, utiliza transporte público, servicios de movilidad o designa a un conductor sobrio.
      </Text>

      <Text style={styles.sectionTitle}>5. Exención de responsabilidad</Text>
      <Text style={styles.text}>
        El uso de esta página es bajo tu propia responsabilidad. 
        El desarrollador no se hace responsable de las decisiones o consecuencias derivadas del uso indebido de esta web o de sus contenidos.
      </Text>

      <Text style={styles.sectionTitle}>6. Contenido informativo y recreativo</Text>
      <Text style={styles.text}>
        Todo el contenido ofrecido tiene fines recreativos. 
        No constituye una recomendación o incitación al consumo de sustancias de ningún tipo.
      </Text>

      <Text style={styles.sectionTitle}>7. Legislación vigente</Text>
      <Text style={styles.text}>
        Es tu responsabilidad cumplir con la legislación local relacionada con el consumo de alcohol. 
        Este sitio no sustituye la información ni la normativa legal vigente en tu país.
      </Text>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#d3d3d3',
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

export default AvisoLegalScreen;