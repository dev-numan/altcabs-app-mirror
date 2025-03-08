import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, Divider, HStack, Text, View} from 'native-base';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

import colors from '../../../../constants/colors';

const BookingSummaryView = ({booking, showContactDriver}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.cardContainer}>
      {/* Ref # */}
      <HStack style={styles.lineContainer}>
        <Text style={styles.labelText}>Ref # : </Text>
        <Text style={styles.valueText}>{booking.reference}</Text>
      </HStack>

      {/* Pick Up */}
      <HStack style={styles.lineContainer}>
        <Text style={styles.labelText}>Pick Up: </Text>
        <Text style={styles.valueText} numberOfLines={0}>
          {booking.from_desc}
        </Text>
      </HStack>

      {/* DropOff */}
      <HStack style={styles.lineContainer}>
        <Text style={styles.labelText}>DropOff: </Text>
        <Text style={styles.valueText} numberOfLines={0}>
          {booking.to_desc}
        </Text>
      </HStack>

      {/* Return (if not oneWay) */}
      {!booking.oneWay && (
        <>
          <HStack style={styles.lineContainer}>
            <Text style={styles.labelText}>Return Pick Up: </Text>
            <Text style={styles.valueText} numberOfLines={0}>
              {booking.to_desc}
            </Text>
          </HStack>
          <HStack style={styles.lineContainer}>
            <Text style={styles.labelText}>Return DropOff: </Text>
            <Text style={styles.valueText} numberOfLines={0}>
              {booking.from_desc}
            </Text>
          </HStack>
        </>
      )}

      {/* Pickup Time */}
      <HStack style={[styles.lineContainer, {marginBottom: 6}]}>
        <Text style={styles.labelText}>Pickup Time: </Text>
        <Text style={styles.valueText}>
          {moment(booking.startTime).format('LLL')}
        </Text>
      </HStack>

      {/* Action buttons */}
      <HStack space={2}>
        {showContactDriver && booking.isConfirmed && (
          <Button
            size="sm"
            bg={colors.DARK_COLOR}
            _text={{color: '#fff', fontWeight: '600'}}
            _pressed={{bg: colors.DARK_COLOR}}
            onPress={() => {
              navigation.navigate('BookingChat', {bookingId: booking?._id});
            }}
          >
            Contact Driver
          </Button>
        )}

        {moment(booking.cancellationTime).diff(moment(), 'minutes') > 0 && (
          <Button
            size="sm"
            bg="#F44336"
            _text={{color: '#fff', fontWeight: '600'}}
            _pressed={{bg: '#D32F2F'}}
            onPress={() => {
              navigation.navigate('Booking Cancellation Confirmation', {
                booking,
              });
            }}
          >
            Cancel
          </Button>
        )}

        {!booking.isConfirmed && booking.booking_type === 'client_bidding' && (
          <Button
            size="sm"
            bg="#FFC107"
            _text={{color: '#333', fontWeight: '600'}}
            _pressed={{bg: '#FFB300'}}
            onPress={() => {
              navigation.navigate('ProcessBooking', {bookingId: booking._id});
            }}
          >
            View Bids
          </Button>
        )}
      </HStack>

      {/* Divider at the bottom */}
      <Divider mt={4} />
    </View>
  );
};

export default BookingSummaryView;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    // Optional subtle shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  // For each line row
  lineContainer: {
    marginBottom: 4,
    flexWrap: 'wrap',
    alignItems: 'flex-start', // Let text wrap to new lines
  },
  labelText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  valueText: {
    // Let text wrap
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 14,
    color: '#555',
  },
});