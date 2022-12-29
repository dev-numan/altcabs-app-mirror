import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../constants/colors';
import BookingWidget from '../../booking-widget/BookingWidget';
import Header from '../../common/Header';
const CabCompare = () => {
  return (
    <View style={{flex: 1, backgroundColor: colors.CAB_COMPARE}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header title="COMPARE" />
        <Text style={styles.description}>Compare the cab fares online</Text>
      </ScrollView>
      <Text>Cab Compare</Text>
      <BookingWidget />
    </View>
  );
};

export default CabCompare;
const styles = StyleSheet.create({
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    fontWeight: 'bold',
    color: colors.WHITE,
    marginVertical: 7,
  },
  form: {
    borderRadius: 12,
    margin: 12,
    padding: 18,
    backgroundColor: colors.SECONDARY,
  },
  heading: {fontSize: 18, fontWeight: 'bold', color: 'white'},
  chip: {
    backgroundColor: colors.PRIMARY,
    padding: 4,
    borderRadius: 7,
    flexWrap: 'wrap',
    alignItems: 'center',
    margin: 7,
  },
});
