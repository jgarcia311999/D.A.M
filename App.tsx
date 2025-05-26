import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import GameOneScreen from './screens/GameOneScreen';
import GameTwoScreen from './screens/GameTwoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Juego 1" component={GameOneScreen} />
        <Stack.Screen name="Juego 2" component={GameTwoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}