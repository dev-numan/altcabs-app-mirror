import {Button, Divider, HStack, Text, View} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import moment from 'moment';
import colors from '../../../../constants/colors';
import {useNavigation} from '@react-navigation/native';
const BookingSummaryView = ({booking, showContactDriver}) => {
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.container}>
        <HStack>
          <Text style={styles.boldText}>Ref # : </Text>
          <Text style={styles.normalText}>{booking.reference}</Text>
        </HStack>
        <HStack>
          <Text style={styles.boldText}>Pick Up: </Text>
          <Text style={styles.normalText}>{booking.from_desc}</Text>
        </HStack>
        <HStack>
          <Text style={styles.boldText}>DropOff: </Text>
          <Text style={styles.normalText}>{booking.to_desc}</Text>
        </HStack>
        {!booking.oneWay && (
          <>
            <HStack>
              <Text style={styles.boldText}>Return Pick Up: </Text>
              <Text style={styles.normalText}>{booking.to_desc}</Text>
            </HStack>
            <HStack>
              <Text style={styles.boldText}>Return DropOff: </Text>
              <Text style={styles.normalText}>{booking.from_desc}</Text>
            </HStack>
          </>
        )}
        <HStack>
          <Text style={styles.boldText}>Pickup Time: </Text>
          <Text style={styles.normalText}>
            {moment(booking.startTime).format('LLL')}
          </Text>
        </HStack>
        <Button.Group>
          {showContactDriver && booking.isConfirmed && (
            <Button
              colorScheme={colors.YELLOW}
              size="xs"
              onPress={() => {
                navigation.navigate('BookingChat', {
                  bookingId: booking?._id,
                });
              }}>
              Contact Driver
            </Button>
          )}
          {moment(booking.cancellationTime).diff(moment(), 'minutes') > 0 && (
            <Button
              size="xs"
              colorScheme={colors.YELLOW}
              onPress={() => {
                navigation.navigate('Booking Cancellation Confirmation', {
                  booking,
                });
              }}>
              Cancel
            </Button>
          )}
          {!booking.isConfirmed && booking.booking_type == 'client_bidding' && (
            <Button
              size="xs"
              colorScheme={colors.YELLOW}
              onPress={() => {
                navigation.navigate('ProcessBooking', {
                  bookingId: booking._id,
                });
              }}>
              View Bids
            </Button>
          )}
        </Button.Group>
        <Divider colorScheme={colors.YELLOW} mx="1" mt={5} />
      </View>
    </View>
  );
};

export default BookingSummaryView;
const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
    color: 'white',
  },
  normalText: {
    color: 'white',
  },
  container: {
    padding: 15,
    marginBottom: 5,
  },
});
