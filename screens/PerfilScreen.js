import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PerfilScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => {
          Haptics.selectionAsync();
          navigation.goBack();
        }}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{ flex: 0, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <View style={styles.damTextWrapper}>
          <Text style={styles.damLineTop}>la</Text>
          <Text style={styles.damLineBottom}>prv.</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.list}>
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Privacidad')}>
            <Text style={styles.link}>Política de privacidad</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => handleLinkPress('https://tusitio.com/sugerencias')}>
            <Text style={styles.link}>Sugerencias</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Contenido +18</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    backgroundColor: '#a3c8ff',
    alignItems: 'flex-start',
  },
  // header style removed as it's no longer used
  damTextWrapper: {
    paddingTop: 20,
    alignSelf: 'flex-start',
    marginBottom: 60,
  },
  damLineTop: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Panchang-Bold',
    textAlign: 'left',
    marginLeft: 0,
    paddingLeft: 12,
  },
  damLineBottom: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Panchang-Bold',
    textAlign: 'left',
    width: '100%',
    letterSpacing: -2,
    lineHeight: 70,
    marginLeft: 0,
    paddingLeft: 12,
  },
  list: {
    marginTop: Platform.OS === 'web' ? '50vh' : 20,
    gap: 20,
    width: '100%',
    alignItems: 'flex-start',
  },
  linkContainer: {
    backgroundColor: '#79AFFF',
    borderWidth: 2,
    borderColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  link: {
    fontSize: 18,
    fontFamily: 'Panchang-Regular',
    color: '#000',
  },
  footerText: {
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
  footerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
