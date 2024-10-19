import {Text, View} from 'native-base';

import React, {useEffect, useState} from 'react';
import bookingService from '../../../../api/BookingService';
import colors from '../../../../constants/colors';
import CustomerBookingViewSkeleton from '../../../common/skeletons/CustomerBookingViewSkeleton';
import BookingSummaryView from './BookingSummaryView';
import {Dimensions} from 'react-native';
let height = Dimensions.get('screen').height;
const ConfirmedBookings = () => {
  const [state, setState] = useState({bookings: [], fetched: false});
  useEffect(() => {
    bookingService
      .confirmedBookings()
      .then(data => {
        console.log(data.length);
        setState({bookings: data, fetched: true});
      })
      .catch(() => {})
      .finally(() => {});
    return () => {
      setState({bookings: [], fetched: false});
    };
  }, []);
  return (
    <View style={{backgroundColor: colors.PRIMARY, color: 'white'}}>
      {!state.fetched ? (
        <View
          style={{
            height: height,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'white', paddingBottom: '40%'}}>
            Loading ...
          </Text>
          {[0, 1, 2, 3, 4, 5].map(key => {
            <CustomerBookingViewSkeleton key={key} />;
          })}
        </View>
      ) : (
        <>
          {state.bookings?.length > 0 ? (
            state.bookings.map(booking => (
              <BookingSummaryView
                key={booking?._id}
                booking={booking}
                showContactDriver={true}
              />
            ))
          ) : (
            <View
              style={{
                height: height,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: 'white', paddingBottom: '40%'}}>
                No Confirmed Booking
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default ConfirmedBookings;
