import {View, Text} from 'native-base';
import React from 'react';
import colors from '../../../constants/colors';
import CustomerBookingViewSkeleton from '../../common/skeletons/CustomerBookingViewSkeleton';

const MyBookings = ({}) => {
  return (
    <View style={{backgroundColor: colors.PRIMARY}}>
      <CustomerBookingViewSkeleton />
    </View>
  );
};

export default MyBookings;
