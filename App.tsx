import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TittleScreen from './screens/TittleScreen';
import HomeScreen from './screens/HomeScreen';
import PreGameOneScreen from './screens/PreGameOneScreen';
import GameOneScreen from './screens/GameOneScreen';
import GameTwoScreen from './screens/GameTwoScreen';
import GameThreeScreen from './screens/GameThreeScreen';
import GameFourScreen from './screens/GameFourScreen';

import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    'PlayfairDisplaySC-Regular': require('./assets/fonts/PlayfairDisplaySC-Regular.ttf'),
    'PlayfairDisplaySC-Bold': require('./assets/fonts/PlayfairDisplaySC-Bold.ttf'),
    'PlayfairDisplaySC-Italic': require('./assets/fonts/PlayfairDisplaySC-Italic.ttf'),
    'PlayfairDisplaySC-BoldItalic': require('./assets/fonts/PlayfairDisplaySC-BoldItalic.ttf'),
    'PlayfairDisplaySC-Black': require('./assets/fonts/PlayfairDisplaySC-Black.ttf'),
    'PlayfairDisplaySC-BlackItalic': require('./assets/fonts/PlayfairDisplaySC-BlackItalic.ttf'),
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
          <Stack.Screen name="Pre juego 1" component={PreGameOneScreen} />
          <Stack.Screen name="Juego 1" component={GameOneScreen} />
          <Stack.Screen name="Juego 2" component={GameTwoScreen} />
          <Stack.Screen name="Juego 3" component={GameThreeScreen} />
          <Stack.Screen name="Juego 4" component={GameFourScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}