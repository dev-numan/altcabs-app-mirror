import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Surface = props => {
  return <View style={[styles.surface, props.style]}>{props.children}</View>;
};

export default Surface;

const styles = StyleSheet.create({
  surface: {
    backgroundColor: 'white',
    elevation: 8,
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
