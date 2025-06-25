import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TittleScreen from './screens/TittleScreen';
import HomeScreen from './screens/HomeScreen';
import PruebaHomeScreen from './screens/PruebaHomeScreen';
import PreGameOneScreen from './screens/PreGameOneScreen';
import GameOneScreen from './screens/GameOneScreen';
import PruebaGameOneScreen from './screens/PruebaGameOneScreen';
import GameTwoScreen from './screens/GameTwoScreen';
import GameThreeScreen from './screens/GameThreeScreen';
import GameFourScreen from './screens/GameFourScreen';
import PruebaGameFourScreen from './screens/PruebaGameFourScreen';

import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

const Stack = createNativeStackNavigator();

export default function App() {
  /* const [fontsLoaded] = Font.useFonts({
    'PlayfairDisplaySC-Regular': require('./assets/fonts/PlayfairDisplaySC-Regular.ttf'),
    'PlayfairDisplaySC-Bold': require('./assets/fonts/PlayfairDisplaySC-Bold.ttf'),
    'PlayfairDisplaySC-Italic': require('./assets/fonts/PlayfairDisplaySC-Italic.ttf'),
    'PlayfairDisplaySC-BoldItalic': require('./assets/fonts/PlayfairDisplaySC-BoldItalic.ttf'),
    'PlayfairDisplaySC-Black': require('./assets/fonts/PlayfairDisplaySC-Black.ttf'),
    'PlayfairDisplaySC-BlackItalic': require('./assets/fonts/PlayfairDisplaySC-BlackItalic.ttf'),
  }); */

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
          <Stack.Screen name="Inicio2" component={PruebaHomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Pre juego 1" component={PreGameOneScreen} />
          <Stack.Screen name="Juego 1" component={GameOneScreen} />
          <Stack.Screen name="Prueba 1" component={PruebaGameOneScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Juego 2" component={GameTwoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Juego 3" component={GameThreeScreen} />
          <Stack.Screen name="Juego 4" component={GameFourScreen} />
          <Stack.Screen name="Prueba 4" component={PruebaGameFourScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}