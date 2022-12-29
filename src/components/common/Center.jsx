import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Center = ({style = {}, children}) => {
  return <View style={[styles.center, style]}>{children}</View>;
};

export default Center;

const styles = StyleSheet.create({
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 12,
  },
});
