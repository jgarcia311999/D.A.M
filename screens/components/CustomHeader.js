import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const CustomHeader = ({
  navigation,
  showBack = false,
  backTo = null,
  showInfo = false,
  onInfoPress = null,
  customRight = null
}) => {
  const handleGoBack = () => {
    Haptics.selectionAsync();
    if (backTo) {
      navigation.navigate(backTo);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Inicio');
    }
  };

  return (
    <View style={styles.header}>
      <View>
        {showBack && (
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
        )}
      </View>
      <View>
        {customRight ? (
          customRight
        ) : showInfo ? (
          <TouchableOpacity onPress={onInfoPress}>
            <Ionicons name="help-circle-outline" size={45} color="#000" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    position: 'absolute',
    top: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default CustomHeader;