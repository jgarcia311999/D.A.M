import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';

const PoliticaCookiesScreen = ({ navigation: propNavigation }) => {
  const insets = useSafeAreaInsets();
  const navigation = propNavigation || useNavigation();

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
        <Text style={styles.title}>Política de Cookies</Text>
        <Text style={styles.text}>
          Esta página web utiliza cookies para mejorar la experiencia del usuario, personalizar contenido y anuncios,
          proporcionar funciones de redes sociales y analizar el tráfico. Compartimos información sobre el uso que haga
          del sitio web con nuestros partners de redes sociales, publicidad y análisis web, quienes pueden combinarla
          con otra información que les haya proporcionado o que hayan recopilado a partir del uso que haya hecho de sus servicios.
        </Text>
        <Text style={styles.text}>
          Las cookies son pequeños archivos de texto que los sitios web pueden utilizar para hacer más eficiente la experiencia del usuario.
        </Text>
        <Text style={styles.text}>
          La ley establece que podemos almacenar cookies en su dispositivo si son estrictamente necesarias para el funcionamiento de este sitio.
          Para todos los demás tipos de cookies necesitamos su permiso.
        </Text>
        <Text style={styles.text}>
          Este sitio web utiliza diferentes tipos de cookies. Algunas cookies son colocadas por servicios de terceros que aparecen en nuestras páginas.
        </Text>
        <Text style={styles.text}>
          Usamos Google AdSense como proveedor de publicidad. Google puede utilizar cookies para personalizar los anuncios que ve el usuario.
          Puede obtener más información sobre cómo Google utiliza la información de los sitios que usan sus servicios en:{' '}
          https://policies.google.com/technologies/partner-sites
        </Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#d3d3d3',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Panchang-Bold',
    marginBottom: 30,
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
    lineHeight: 24,
    textAlign: 'justify',
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

export default PoliticaCookiesScreen;