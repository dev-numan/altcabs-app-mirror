import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const HStack = ({style = {}, children}) => {
  return <View style={[styles.row, style]}>{children}</View>;
};

export default HStack;

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
});
