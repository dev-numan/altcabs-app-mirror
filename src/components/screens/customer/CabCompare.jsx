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
  KeyboardAvoidingView,
} from 'react-native';
import colors from '../../../constants/colors';
import BookingWidget from '../../booking-widget/BookingWidget';
import Header from '../../common/Header';
const CabCompare = () => {
  return (
    <View style={{flex: 1, backgroundColor: colors.PRIMARY}}>
      <KeyboardAvoidingView>
        <ScrollView
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps={'always'}>
          <Header title="COMPARE" />
          <Text style={styles.description}>Compare the cab fares online</Text>
          <BookingWidget booking_type="normal" />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
const getTitleTextByBookingType = booking_type => {
  switch (booking_type) {
    case 'client_bidding':
      return {
        title: 'Request Bids For Your Journey',
        header: 'Bid',
        bgColor: colors.PURPLE,
      };
    case 'cabmatch':
      return {
        title: 'Find out and book the cabs heading your way',
        header: 'Match',
        bgColor: colors.BLUE,
      };
    default:
      return {
        title: 'Compare the cab fares online',
        header: 'COMPARE',
        bgColor: colors.YELLOW,
      };
  }
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
