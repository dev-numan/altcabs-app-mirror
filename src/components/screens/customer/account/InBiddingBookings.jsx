import {Text, View} from 'native-base';

import React, {useEffect, useState} from 'react';
import bookingService from '../../../../api/BookingService';
import colors from '../../../../constants/colors';
import CustomerBookingViewSkeleton from '../../../common/skeletons/CustomerBookingViewSkeleton';
import BookingSummaryView from './BookingSummaryView';
import {Dimensions, ScrollView} from 'react-native';
let height = Dimensions.get('screen').height;
const InBiddingBookings = () => {
  const [state, setState] = useState({bookings: [], fetched: false});
  useEffect(() => {
    bookingService
      .biddingBookings()
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
    <View style={{flex: 1, backgroundColor: colors.PRIMARY}}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1, backgroundColor: colors.PRIMARY}}>
        {!state.fetched ? (
          <View
            style={{
              paddingTop: 20,
            }}>
            <Text style={{color: 'white', textAlign: 'center', marginBottom: 20}}>
              Loading ...
            </Text>
            {[0, 1, 2, 3, 4, 5].map(key => (
              <CustomerBookingViewSkeleton key={key} />
            ))}
          </View>
        ) : (
          <>
            {state.bookings?.length > 0 ? (
              <View style={{backgroundColor: colors.PRIMARY, paddingBottom: 20}}>
                {state.bookings.map((booking, index) => (
                  <BookingSummaryView
                    key={booking?._id}
                    booking={booking}
                    index={index}
                  />
                ))}
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.PRIMARY,
                }}>
                <Text style={{color: 'white', paddingBottom: '40%'}}>
                  No Bidding Found
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default InBiddingBookings;
