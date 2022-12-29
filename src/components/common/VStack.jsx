import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const VStack = props => {
  return <View style={[styles.col, props.style]}>{props.children}</View>;
};

export default VStack;

const styles = StyleSheet.create({
  col: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
});
