import {Text, View} from 'native-base';
import React from 'react';

import {Button, HStack} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {Image, ScrollView, StyleSheet} from 'react-native';
import BookingJourneyDetails from './partials/BookingJourneyDetails';
import colors from '../../constants/colors';
const QuotationSuccess = ({booking}) => {
  const navigation = useNavigation();
  const color = 'rgba(118,75,162,1.0)';
  const darkShadeColor = '#472d61';
  const onNext = () => {
    navigation.navigate('Customer Landing');
  };
  return (
    <View style={{margin: 14}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {booking.hasReturnBooking ? (
          <>
            <BookingJourneyDetails booking={booking} title="Outbound Journey" />
            <BookingJourneyDetails
              booking={booking.returnBooking}
              title="Inbound Journey"
            />
          </>
        ) : (
          <>
            <BookingJourneyDetails booking={booking} />
          </>
        )}

        <Image
          source={{uri: booking.staticmap}}
          style={{height: 250, borderRadius: 14, marginVertical: 14}}
        />
        <Button
          my="4"
          rounded="full"
          colorScheme={colors.YELLOW}
          _text={{color: colors.PRIMARY}}
          onPress={onNext}
          _pressed={{bg: darkShadeColor}}>
          Book Again ?
        </Button>
      </ScrollView>
    </View>
  );
};

export default QuotationSuccess;
const styles = StyleSheet.create({
  DetailsView: {
    backgroundColor: '#405263',
    padding: 7,
    marginVertical: 12,
  },
  HStack: {
    alignItems: 'center',
    margin: 12,
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heading: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  leftText: {
    color: 'white',
    fontSize: 14,
    flexGrow: 1,
  },
  rightText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    width: '52%',
    textAlign: 'right',
  },
});
