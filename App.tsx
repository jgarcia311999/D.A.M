import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TittleScreen from './screens/TittleScreen';
import HomeScreen from './screens/HomeScreen';
import PerfilScreen from './screens/PerfilScreen';
import GameOneScreen from './screens/GameOneScreen';
import GameTwoScreen from './screens/GameTwoScreen';
import GameThreeScreen from './screens/GameThreeScreen';
import GameFourScreen from './screens/GameFourScreen';
import GamerScreen from './screens/GamerScreen';
import MiniGamesScreen from './screens/MiniGamesScreen';
import MiniGame1 from './screens/miniGames/MiniGame1';
import MiniGame2 from './screens/miniGames/MiniGame2';
import MiniGame4 from './screens/miniGames/MiniGame4';
import VariosMinigames from './screens/miniGames/VariosMinigames';
import CreaTuFrase from './screens/CreaTuFrase';
import TodasLasFrasesScreen from './screens/TodasLasFrasesScreen';
import PoliticaPrivacidadScreen from './screens/PoliticaPrivacidadScreen';

import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = Font.useFonts({
  'Panchang-Bold': require('./assets/fonts/Panchang-Bold.otf'),
  'Panchang-Extrabold': require('./assets/fonts/Panchang-Extrabold.otf'),
  'Panchang-Extralight': require('./assets/fonts/Panchang-Extralight.otf'),
  'Panchang-Light': require('./assets/fonts/Panchang-Light.otf'),
  'Panchang-Medium': require('./assets/fonts/Panchang-Medium.otf'),
  'Panchang-Regular': require('./assets/fonts/Panchang-Regular.otf'),
  'Panchang-Semibold': require('./assets/fonts/Panchang-Semibold.otf'),
});

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="TittleScreen">
          <Stack.Screen name="TittleScreen" component={TittleScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Gamer" component={GamerScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Juego 1" component={GameOneScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Juego 2" component={GameTwoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Juego 3" component={GameThreeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Juego 4" component={GameFourScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CreaFrase" component={CreaTuFrase} options={{ headerShown: false }} />
          <Stack.Screen name="TodasFrases" component={TodasLasFrasesScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MiniGames" component={MiniGamesScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MiniGame1" component={MiniGame1} options={{ headerShown: false }} />
          <Stack.Screen name="MiniGame2" component={MiniGame2} options={{ headerShown: false }} />
          <Stack.Screen name="MiniGame4" component={MiniGame4} options={{ headerShown: false }} />
          <Stack.Screen name="VariosMinigames" component={VariosMinigames} options={{ headerShown: false }} />
          <Stack.Screen name="Privacidad" component={PoliticaPrivacidadScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}