import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export default function TittleScreen({ navigation }) {
  const handleScrollDown = () => {
      navigation.navigate('Inicio');
  };

  return (
    <View style={{ height, backgroundColor: '#fdfcf7' }}>
      <TouchableOpacity onPress={handleScrollDown}>
        <View style={[styles.section, { marginTop: height * 0.1, paddingHorizontal: 20 }]}>
          <Text style={styles.damText}>D.A.M</Text>
          <Text style={styles.slogan}>Drink and More</Text>
                  <Image source={require('../assets/logo_cerveza_red.png')} style={styles.logo} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    
    justifyContent: 'center',
    alignItems: 'center',
  },
  damText: {
    marginTop: 30,
    fontSize: height * 0.1,
    fontWeight: 'bold',
    textAlign: 'center',
      color: '#780000',
      fontFamily: 'PlayfairDisplaySC-Bold',
  },
  slogan: {
    fontSize: height * 0.025,
    color: '#555',
    textAlign: 'center',
      color: '#780000',
    fontFamily: 'PlayfairDisplaySC-Regular',
  },
  logo: {
    width: width * 1,
    height: height * 0.65,
    resizeMode: 'contain',
    marginTop: 0,
  },
});