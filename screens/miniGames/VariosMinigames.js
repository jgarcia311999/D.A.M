import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function VariosMinigames({ route }) {
  const { minijuego } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <>
      <TouchableOpacity
        style={[{ position: 'absolute', top: insets.top + 10, left: 20, zIndex: 10 }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.goBack();
        }}
      >
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>
      <View style={{ flex: 1, backgroundColor: '#70B77C' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 24, paddingTop: insets.top + 64 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 18, color: '#000' }}>
            {minijuego.titulo}
          </Text>
          <View style={styles.card}>
            <Text style={styles.text}>
              {minijuego.descripcionDetallada}
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    width: width * 0.85,
    aspectRatio: 0.625,
    borderRadius: 20,
    backgroundColor: '#9ED2A7',
    borderWidth: 2,
    borderColor: '#ffffff22',
    shadowColor: '#fff',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Panchang-Regular',
    color: '#000',
    textAlign: 'center',
    lineHeight: 28,
  },
});
