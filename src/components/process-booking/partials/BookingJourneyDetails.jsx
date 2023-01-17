import {Text, View} from 'native-base';
import React from 'react';
import Surface from '../../common/Surface';
import moment from 'moment';
import {Button, HStack} from 'native-base';

import {Image, ScrollView, StyleSheet} from 'react-native';
const BookingJourneyDetails = ({booking, title}) => {
  if (!booking)
    return (
      <View>
        <Text style={{color: 'white'}}>No Booking</Text>
      </View>
    );
  return (
    <View>
      <Surface style={styles.DetailsView}>
        <Text style={styles.title}>{title ? title : 'Journey Details'}</Text>
        <Text style={styles.heading}>Ref# {booking.reference}</Text>
        <HStack style={styles.HStack}>
          <Text style={styles.leftText}>Price</Text>
          <Text style={styles.rightText}>£ {booking.priceToCharge}</Text>
        </HStack>
        <HStack style={styles.HStack}>
          <Text style={styles.leftText}>Departure</Text>
          <Text style={styles.rightText}>
            {moment(booking.startTime).format('LLL')}
          </Text>
        </HStack>
        <HStack style={styles.HStack}>
          <Text style={styles.leftText}>Drop Off</Text>
          <Text style={styles.rightText}>{booking.to_desc}</Text>
        </HStack>
        <HStack style={styles.HStack}>
          <Text style={styles.leftText}>Pick Up</Text>
          <Text style={styles.rightText}> {booking.from_desc}</Text>
        </HStack>
        <HStack style={styles.HStack}>
          <Text style={styles.leftText}>Duration</Text>
          <Text style={styles.rightText}>{booking.durationText}</Text>
        </HStack>

        <Text style={styles.title}>Vehicle Details</Text>
        <Text style={styles.heading}>{booking?.vehicle_type_name}</Text>
        <HStack style={styles.HStack}>
          <Text style={styles.leftText}>Company</Text>
          <Text style={styles.rightText}>{booking?.company_name}</Text>
        </HStack>
        <HStack style={styles.HStack}>
          <Text style={styles.leftText}>Vehicle Type</Text>
          <Text style={styles.rightText}>{booking?.fleet_type_name}</Text>
        </HStack>
      </Surface>
    </View>
  );
};

export default BookingJourneyDetails;
const styles = StyleSheet.create({
  DetailsView: {
    backgroundColor: '#405263',
    padding: 7,
    marginVertical: 8,
  },
  HStack: {
    alignItems: 'center',
    margin: 4,
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  heading: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
  },
  leftText: {
    color: 'white',
    fontSize: 12,
    flexGrow: 1,
  },
  rightText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    width: '52%',
    textAlign: 'right',
  },
});
