import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import colors from '../../../constants/colors';
const QuotationLoaderSkeleton = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.YELLOW} />
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
