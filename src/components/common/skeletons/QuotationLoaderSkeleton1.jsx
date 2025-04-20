import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import colors from '../../../constants/colors';
const QuotationLoaderSkeleton = () => {
  return (
    <View style={styles.container}>
      <Text>Loader skeleton</Text>
      <ActivityIndicator size="large" color={colors.PRIMARY} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27323D', // You can customize this background
  },
});

export default QuotationLoaderSkeleton;
