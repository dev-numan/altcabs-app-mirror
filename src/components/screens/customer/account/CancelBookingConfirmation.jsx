import {useNavigation, useRoute} from '@react-navigation/native';
import {Button, Text, View} from 'native-base';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import bookingService from '../../../../api/BookingService';
import colors from '../../../../constants/colors';
import {ERROR, SUCCESS} from '../../../../store/slices/message.slice';
const CancelBookingConfirmation = ({}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {params} = useRoute();
  const [fetching, setFetching] = useState(false);
  const cancelBooking = () => {
    bookingService
      .cancelBooking(booking?._id)
      .then(data => {
        setFetching(false);
        navigation.goBack();
        dispatch(SUCCESS('Booking Cancelled'));
        navigation.goBack();
      })
      .catch(err => {
        dispatch(ERROR('Sorry We are unable to cancel at this time'));
      });
  };
  const booking = params.booking;
  return (
    <View style={{padding: 10}}>
      <Text>
        Are You Sure You want to cancel booking ref # {booking.reference}
      </Text>
      <View style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button.Group
          isAttached
          colorScheme={colors.YELLOW}
          isDisabled={fetching}>
          <Button onPress={cancelBooking}>Yes</Button>
          <Button
            onPress={() => {
              navigation.goBack();
            }}>
            No
          </Button>
        </Button.Group>
      </View>
    </View>
  );
};

export default CancelBookingConfirmation;
