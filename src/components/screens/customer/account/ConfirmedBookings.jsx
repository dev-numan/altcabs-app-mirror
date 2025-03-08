import React, {useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, ScrollView, Dimensions} from 'react-native';
import {Text, View} from 'native-base';
import bookingService from '../../../../api/BookingService';
import colors from '../../../../constants/colors';

import CustomerBookingViewSkeleton from '../../../common/skeletons/CustomerBookingViewSkeleton';
import BookingSummaryView from './BookingSummaryView';

const {height} = Dimensions.get('screen');

const ConfirmedBookings = () => {
  const [state, setState] = useState({bookings: [], fetched: false});

  // Fetch confirmed bookings on mount
  useEffect(() => {
    bookingService
      .confirmedBookings()
      .then(data => {
        console.log('Confirmed bookings count:', data.length);
        setState({bookings: data, fetched: true});
      })
      .catch(() => {})
      .finally(() => {});

    // Cleanup
    return () => {
      setState({bookings: [], fetched: false});
    };
  }, []);

  if (!state.fetched) {
    // Still loading; show skeleton placeholders
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading ...</Text>
        {/* Show multiple skeleton placeholders */}
        {/* {[0, 1, 2, 3, 4].map(key => (
          <CustomerBookingViewSkeleton key={key} />
        ))} */}
      </SafeAreaView>
    );
  }

  // Fetched. Check if there are bookings
  if (state.bookings?.length > 0) {
    // We have confirmed bookings
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={{paddingVertical: 8}}>
          {state.bookings.map(booking => (
            <BookingSummaryView
              key={booking?._id}
              booking={booking}
              showContactDriver={true}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    // Fetched but no bookings
    return (
      <SafeAreaView style={styles.noBookingContainer}>
        <Text style={styles.noBookingText}>No Confirmed Booking</Text>
      </SafeAreaView>
    );
  }
};

export default ConfirmedBookings;

const styles = StyleSheet.create({
  // When still loading
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.BACKGROUND, // Light blue, matching your new style
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '20%',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },

  // When we have bookings
  mainContainer: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  },

  // When no bookings found
  noBookingContainer: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noBookingText: {
    fontSize: 18,
    color: '#333',
  },
});