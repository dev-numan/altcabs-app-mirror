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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default QuotationLoaderSkeleton;
