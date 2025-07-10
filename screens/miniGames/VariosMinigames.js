import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
        <Ionicons name="arrow-back" size={28} color="#fff" />
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
            borderColor: '#fff',
          },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate('Jugadores');
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontFamily: 'Panchang-Bold' }}>Borrachos</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#191716' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 18, color: '#fff' }}>
          {minijuego.titulo}
        </Text>
        <Text style={{ fontSize: 20, marginBottom: 26, textAlign: 'center', color: '#d5c385' }}>
          {minijuego.descripcion}
        </Text>
      </View>
    </>
  );
}
