import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
      <View style={{ flex: 1, backgroundColor: '#191716' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 24, paddingTop: insets.top + 64 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 18, color: '#fff' }}>
            {minijuego.titulo}
          </Text>
          <Text style={{ fontSize: 20, marginBottom: 26, textAlign: 'center', color: '#d5c385' }}>
            {minijuego.descripcionDetallada}
          </Text>
        </ScrollView>
      </View>
    </>
  );
}
