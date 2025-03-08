import React, {useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, ScrollView, Dimensions} from 'react-native';
import {Text, View} from 'native-base';

import bookingService from '../../../../api/BookingService';
import colors from '../../../../constants/colors';

import CustomerBookingViewSkeleton from '../../../common/skeletons/CustomerBookingViewSkeleton';
import BookingSummaryView from './BookingSummaryView';

const {height} = Dimensions.get('screen');

const InBiddingBookings = () => {
  const [state, setState] = useState({bookings: [], fetched: false});

  useEffect(() => {
    bookingService
      .biddingBookings()
      .then(data => {
        console.log('Bidding bookings count:', data.length);
        setState({bookings: data, fetched: true});
      })
      .catch(() => {})
      .finally(() => {});

    // Cleanup
    return () => {
      setState({bookings: [], fetched: false});
    };
  }, []);

  // If still fetching, show skeleton placeholders
  if (!state.fetched) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading ...</Text>
        {/* {[0, 1, 2, 3, 4, 5].map(key => (
          <CustomerBookingViewSkeleton key={key} />
        ))} */}
      </SafeAreaView>
    );
  }

  // Once fetched, check if we have any bidding bookings
  if (state.bookings?.length > 0) {
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
    // Fetched but no bidding bookings
    return (
      <SafeAreaView style={styles.noBookingContainer}>
        <Text style={styles.noBookingText}>No Bidding Found</Text>
      </SafeAreaView>
    );
  }
};

export default InBiddingBookings;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.BACKGROUND, // Light blue background for loading
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '20%',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: colors.BACKGROUND, // Light blue background for loaded state
  },

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