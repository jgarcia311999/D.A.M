import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';

const { height, width } = Dimensions.get('window');

export default function TittleWeb({ navigation }) {

  const handleScrollDown = () => {
    navigation.navigate('Inicio'); 
  };

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Inicio')}>
      <View style={{ height, width, backgroundColor: '#121212' }}>
        <TouchableOpacity onPress={handleScrollDown} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10, position: 'relative' }}>
          <View style={styles.damTextWrapper}>
            <Text style={styles.damLineTop}>la</Text>
            <Text style={styles.damLineBottom}>prv.</Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  damTextWrapper: {
    position: 'absolute',
    bottom: height * 0.1,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  damLineTop: {
    fontSize: height * 0.12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Panchang-Bold',
    textAlign: 'left',
    marginLeft: 0,
    paddingLeft: 20,
  },
  damLineBottom: {
    fontSize: height * 0.15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Panchang-Bold',
    textAlign: 'left',
    width: '100%',
    letterSpacing: -2,
    lineHeight: height * 0.16,
    marginLeft: 0,
    paddingLeft: 20,
  },
  slogan: {
    fontSize: height * 0.025,
    color: '#5C3227',
    textAlign: 'center',
    fontFamily: 'Panchang-Regular',
    zIndex: 5,
  },
});